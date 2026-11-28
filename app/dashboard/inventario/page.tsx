import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { marcarReposicion, obtenerPromediosDiarios } from "@/lib/reposicion";
import VistaInventario from "./VistaInventario";

export default async function InventarioPage() {
  const session = await auth();
  if (!session?.user?.tiendaId) redirect("/login");
  const tiendaId = session.user.tiendaId;

  // Solo los productos de la tienda del usuario, ordenados por nombre,
  // y el ritmo de venta de cada uno (unidades por día en los últimos 7 días).
  const [productos, promedios] = await Promise.all([
    prisma.producto.findMany({
      where: { tiendaId },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true, codigo: true, precioVenta: true, stock: true, stockMinimo: true },
    }),
    obtenerPromediosDiarios(tiendaId),
  ]);

  return (
    <VistaInventario
      // Decimal no se puede pasar a un componente de cliente: se convierte a número.
      productos={marcarReposicion(
        productos.map((p) => ({ ...p, precioVenta: Number(p.precioVenta) })),
        promedios,
      )}
      // Solo el administrador puede crear productos (la API también lo exige).
      esAdmin={session.user.rol === "ADMIN"}
    />
  );
}
