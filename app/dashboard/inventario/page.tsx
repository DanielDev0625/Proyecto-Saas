import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Formatea un número como pesos colombianos sin decimales: $ 4.000
const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default async function InventarioPage() {
  const session = await auth();
  if (!session?.user?.tiendaId) redirect("/login");

  // Solo los productos de la tienda del usuario, ordenados por nombre.
  const productos = await prisma.producto.findMany({
    where: { tiendaId: session.user.tiendaId },
    orderBy: { nombre: "asc" },
  });

  return (
    <main className="min-h-screen bg-white p-6 text-slate-900">
      <h1 className="mb-6 text-2xl font-semibold">Inventario</h1>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Nombre</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Código</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Precio de venta</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Stock</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600">Stock mínimo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Aún no hay productos registrados.
                </td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{p.nombre}</td>
                  <td className="px-4 py-3 text-slate-600">{p.codigo ?? "—"}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {pesos.format(Number(p.precioVenta))}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{p.stock}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                    {p.stockMinimo}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
