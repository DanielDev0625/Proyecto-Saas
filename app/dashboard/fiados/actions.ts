"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export type EstadoAbono = { ok: boolean; mensaje: string } | null;

// Error "esperado": lanzarlo dentro de la transacción la deshace por completo.
class ErrorAbono extends Error {}

const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

// Firma compatible con useActionState: (estadoAnterior, formData).
export async function registrarAbono(
  _estadoAnterior: EstadoAbono,
  formData: FormData,
): Promise<EstadoAbono> {
  const session = await auth();
  if (!session?.user?.tiendaId) {
    return { ok: false, mensaje: "Debes iniciar sesión." };
  }
  const tiendaId = session.user.tiendaId;

  const clienteId = String(formData.get("clienteId") ?? "").trim();
  const valorTexto = String(formData.get("valor") ?? "").trim();

  if (!clienteId) return { ok: false, mensaje: "Elige un cliente." };
  // Solo números positivos con hasta 2 decimales (como la columna Decimal(12,2)).
  if (!/^\d+(\.\d{1,2})?$/.test(valorTexto) || Number(valorTexto) <= 0) {
    return { ok: false, mensaje: "El valor del abono debe ser mayor que 0." };
  }
  // Decimal en vez de number: las cuentas de dinero no deben tener errores de redondeo.
  const valor = new Prisma.Decimal(valorTexto);

  try {
    await prisma.$transaction(async (tx) => {
      // 1. El cliente debe ser de la tienda (Abono no tiene tiendaId, se protege aquí).
      const cliente = await tx.cliente.findFirst({ where: { id: clienteId, tiendaId } });
      if (!cliente) throw new ErrorAbono("El cliente no existe en tu tienda.");

      // 2. Sus fiados con saldo, del más antiguo al más nuevo.
      const pendientes = await tx.venta.findMany({
        where: { tiendaId, clienteId, fiado: true, saldoPendiente: { gt: 0 } },
        orderBy: { fecha: "asc" },
        select: { id: true, saldoPendiente: true },
      });

      // 3. No se acepta pagar más de lo que debe: el sobrante no quedaría registrado en ninguna venta.
      const deuda = pendientes.reduce((suma, v) => suma.plus(v.saldoPendiente), new Prisma.Decimal(0));
      if (deuda.isZero()) throw new ErrorAbono(`${cliente.nombre} no tiene saldo pendiente.`);
      if (valor.gt(deuda)) {
        throw new ErrorAbono(`El abono supera la deuda de ${cliente.nombre} (${pesos.format(deuda.toNumber())}).`);
      }

      // 4. Registrar el abono.
      await tx.abono.create({ data: { clienteId, valor } });

      // 5. Repartir el abono: se paga primero la venta más vieja, y así hasta gastarlo.
      let restante = valor;
      for (const venta of pendientes) {
        if (restante.isZero()) break;
        const aplicado = Prisma.Decimal.min(restante, venta.saldoPendiente);

        // Solo descuenta si el saldo todavía alcanza; si otro abono lo cambió al mismo tiempo, se deshace todo.
        const actualizada = await tx.venta.updateMany({
          where: { id: venta.id, saldoPendiente: { gte: aplicado } },
          data: { saldoPendiente: { decrement: aplicado } },
        });
        if (actualizada.count === 0) {
          throw new ErrorAbono("El saldo cambió mientras se registraba el abono. Intenta de nuevo.");
        }
        restante = restante.minus(aplicado);
      }
    });
  } catch (error) {
    if (error instanceof ErrorAbono) return { ok: false, mensaje: error.message };
    console.error("registrarAbono:", error);
    return { ok: false, mensaje: "No se pudo registrar el abono. Intenta de nuevo." };
  }

  revalidatePath("/dashboard/fiados");
  return { ok: true, mensaje: "Abono registrado." };
}
