import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import VistaInventario from "./VistaInventario";

export default async function InventarioPage() {
  const session = await auth();
  if (!session?.user?.tiendaId) redirect("/login");

  // Solo los productos de la tienda del usuario, ordenados por nombre.
  const productos = await prisma.producto.findMany({
    where: { tiendaId: session.user.tiendaId },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true, codigo: true, precioVenta: true, stock: true, stockMinimo: true },
  });

  return (
    <VistaInventario
      // Decimal no se puede pasar a un componente de cliente: se convierte a número.
      productos={productos.map((p) => ({ ...p, precioVenta: Number(p.precioVenta) }))}
      // Solo el administrador puede crear productos (la API también lo exige).
      esAdmin={session.user.rol === "ADMIN"}
    />
  );
}
