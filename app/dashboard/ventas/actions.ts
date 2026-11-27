"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type EstadoVenta = { ok: boolean; mensaje: string } | null;

// Error "esperado" (stock insuficiente, producto de otra tienda...).
// Lanzarlo dentro de la transacción la deshace por completo.
class ErrorVenta extends Error {}

// Firma compatible con useActionState: (estadoAnterior, formData).
export async function registrarVenta(
  _estadoAnterior: EstadoVenta,
  formData: FormData,
): Promise<EstadoVenta> {
  const session = await auth();
  if (!session?.user?.tiendaId || !session.user.id) {
    return { ok: false, mensaje: "Debes iniciar sesión." };
  }
  const tiendaId = session.user.tiendaId;
  const usuarioId = session.user.id;

  const productoId = String(formData.get("productoId") ?? "").trim();
  const cantidad = Number(formData.get("cantidad"));
  const fiado = formData.get("fiado") === "on"; // un checkbox marcado envía "on"
  const nombreCliente = String(formData.get("cliente") ?? "").trim();

  if (!productoId) return { ok: false, mensaje: "Elige un producto." };
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    return { ok: false, mensaje: "La cantidad debe ser un número entero mayor que 0." };
  }
  if (fiado && !nombreCliente) {
    return { ok: false, mensaje: "Para un fiado escribe el nombre del cliente." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. El producto debe ser de la tienda del usuario.
      const producto = await tx.producto.findFirst({
        where: { id: productoId, tiendaId },
      });
      if (!producto) throw new ErrorVenta("El producto no existe en tu tienda.");

      // 2. Descontar stock solo si alcanza. Se hace en una sola operación
      //    (stock >= cantidad) para que dos ventas al mismo tiempo no dejen stock negativo.
      const descontado = await tx.producto.updateMany({
        where: { id: producto.id, tiendaId, stock: { gte: cantidad } },
        data: { stock: { decrement: cantidad } },
      });
      if (descontado.count === 0) {
        throw new ErrorVenta(`Stock insuficiente: quedan ${producto.stock} unidades.`);
      }

      // 3. Si es fiado, buscar el cliente por nombre (sin importar mayúsculas) o crearlo.
      let clienteId: string | null = null;
      if (fiado) {
        const existente = await tx.cliente.findFirst({
          where: { tiendaId, nombre: { equals: nombreCliente, mode: "insensitive" } },
        });
        const cliente =
          existente ?? (await tx.cliente.create({ data: { tiendaId, nombre: nombreCliente } }));
        clienteId = cliente.id;
      }

      // 4. Crear la venta con su detalle.
      const total = producto.precioVenta.mul(cantidad);
      await tx.venta.create({
        data: {
          tiendaId,
          usuarioId,
          clienteId,
          total,
          fiado,
          saldoPendiente: fiado ? total : 0,
          detalles: {
            create: {
              productoId: producto.id,
              cantidad,
              precioUnitario: producto.precioVenta,
            },
          },
        },
      });
    });
  } catch (error) {
    if (error instanceof ErrorVenta) return { ok: false, mensaje: error.message };
    console.error("registrarVenta:", error);
    return { ok: false, mensaje: "No se pudo registrar la venta. Intenta de nuevo." };
  }

  revalidatePath("/dashboard/ventas");
  return { ok: true, mensaje: "Venta registrada." };
}
