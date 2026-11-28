import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import FormularioAbono from "./FormularioAbono";

const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default async function FiadosPage() {
  const session = await auth();
  if (!session?.user?.tiendaId) redirect("/login");
  const tiendaId = session.user.tiendaId;

  // La base suma el saldo pendiente de las ventas de cada cliente.
  const deudas = await prisma.venta.groupBy({
    by: ["clienteId"],
    where: { tiendaId, fiado: true, clienteId: { not: null }, saldoPendiente: { gt: 0 } },
    _sum: { saldoPendiente: true },
  });
  const deudaPorCliente = new Map(
    deudas.map((d) => [d.clienteId as string, Number(d._sum.saldoPendiente ?? 0)]),
  );

  // Nombres de esos clientes, ordenados alfabéticamente.
  const clientes = await prisma.cliente.findMany({
    where: { tiendaId, id: { in: [...deudaPorCliente.keys()] } },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });
  const deudores = clientes
    .map((c) => ({ ...c, deuda: deudaPorCliente.get(c.id) ?? 0 }))
    .filter((c) => c.deuda > 0);

  return (
    <div className="min-h-screen bg-white p-6 text-slate-900">
      <h1 className="mb-6 text-2xl font-semibold">Fiados</h1>

      {deudores.length === 0 ? (
        <p className="rounded-lg border border-slate-200 p-8 text-center text-sm text-slate-500">
          No hay fiados pendientes.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Cliente</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Debe</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">Abono</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deudores.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{c.nombre}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-red-700">
                    {pesos.format(c.deuda)}
                  </td>
                  <td className="px-4 py-3">
                    <FormularioAbono clienteId={c.id} deuda={c.deuda} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
