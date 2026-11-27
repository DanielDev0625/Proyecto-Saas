import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import FormularioVenta from "./FormularioVenta";

const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

// Hora de Colombia, aunque el servidor (AWS) esté en UTC.
const fechaHora = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Bogota",
});

export default async function VentasPage() {
  const session = await auth();
  if (!session?.user?.tiendaId) redirect("/login");
  const tiendaId = session.user.tiendaId;

  const [productos, ventas] = await Promise.all([
    // Solo productos con stock: no tiene sentido ofrecer lo que no hay.
    prisma.producto.findMany({
      where: { tiendaId, stock: { gt: 0 } },
      orderBy: { nombre: "asc" },
      select: { id: true, nombre: true, precioVenta: true, stock: true },
    }),
    prisma.venta.findMany({
      where: { tiendaId },
      orderBy: { fecha: "desc" },
      take: 10,
      include: {
        cliente: { select: { nombre: true } },
        detalles: { include: { producto: { select: { nombre: true } } } },
      },
    }),
  ]);

  // Decimal no se puede pasar a un componente de cliente: se convierte a número.
  const vendibles = productos.map((p) => ({ ...p, precioVenta: Number(p.precioVenta) }));

  return (
    <div className="min-h-screen bg-white p-6 text-slate-900">
      <h1 className="mb-6 text-2xl font-semibold">Ventas</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-medium">Nueva venta</h2>
        <FormularioVenta productos={vendibles} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Últimas ventas</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Fecha</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Productos</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Tipo</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    Aún no hay ventas registradas.
                  </td>
                </tr>
              ) : (
                ventas.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600 tabular-nums">
                      {fechaHora.format(v.fecha)}
                    </td>
                    <td className="px-4 py-3">
                      {v.detalles.map((d) => `${d.cantidad} x ${d.producto.nombre}`).join(", ")}
                    </td>
                    <td className="px-4 py-3">
                      {v.fiado ? `Fiado: ${v.cliente?.nombre ?? "—"}` : "Contado"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {pesos.format(Number(v.total))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
