import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Icono, iconos } from "@/components/Iconos";
import { EncabezadoPagina, EstadoVacio, Insignia, estilos, pesos } from "@/components/ui";
import FormularioAbono from "./FormularioAbono";

// "Diego Pérez" → "DP"
const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

export default async function FiadosPage() {
  const session = await auth();
  if (!session?.user?.tiendaId) redirect("/login");
  const tiendaId = session.user.tiendaId;

  // La base suma el saldo pendiente de las ventas de cada cliente.
  const deudas = await prisma.venta.groupBy({
    by: ["clienteId"],
    where: { tiendaId, fiado: true, clienteId: { not: null }, saldoPendiente: { gt: 0 } },
    _sum: { saldoPendiente: true },
    _count: true,
  });
  const deudaPorCliente = new Map(
    deudas.map((d) => [
      d.clienteId as string,
      { deuda: Number(d._sum.saldoPendiente ?? 0), ventas: d._count },
    ]),
  );

  // Nombres de esos clientes, ordenados alfabéticamente.
  const clientes = await prisma.cliente.findMany({
    where: { tiendaId, id: { in: [...deudaPorCliente.keys()] } },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true },
  });
  const deudores = clientes
    .map((c) => ({ ...c, ...(deudaPorCliente.get(c.id) ?? { deuda: 0, ventas: 0 }) }))
    .filter((c) => c.deuda > 0);
  const totalPorCobrar = deudores.reduce((suma, c) => suma + c.deuda, 0);

  return (
    <div className="space-y-6">
      <EncabezadoPagina
        titulo="Fiados"
        descripcion="Clientes con saldo pendiente. Registra sus abonos aquí."
        accion={
          <Link href="/dashboard/ventas#nueva-venta" className={estilos.btnPrimario}>
            <Icono d="M12 5v14M5 12h14" className="h-4 w-4" />
            Registrar venta fiada
          </Link>
        }
      />

      {deudores.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={`${estilos.tarjeta} p-5`}>
            <p className="text-sm font-medium text-slate-500">Total por cobrar</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{pesos.format(totalPorCobrar)}</p>
          </div>
          <div className={`${estilos.tarjeta} p-5`}>
            <p className="text-sm font-medium text-slate-500">Clientes con deuda</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{deudores.length}</p>
          </div>
        </div>
      )}

      <section className={estilos.tarjeta}>
        {deudores.length === 0 ? (
          <EstadoVacio
            icono={iconos.check}
            tono="verde"
            titulo="No hay fiados pendientes."
            texto="Todos tus clientes están al día. Las ventas fiadas aparecerán aquí."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className={estilos.th}>Cliente</th>
                  <th scope="col" className={estilos.th}>Estado</th>
                  <th scope="col" className={estilos.thDerecha}>Debe</th>
                  <th scope="col" className={estilos.thDerecha}>Registrar abono</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deudores.map((c) => (
                  <tr key={c.id} className="align-top transition-colors hover:bg-slate-50">
                    <td className={estilos.td}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                          {iniciales(c.nombre) || "?"}
                        </span>
                        <span className="font-medium text-slate-900">{c.nombre}</span>
                      </div>
                    </td>
                    <td className={`${estilos.td} pt-5`}>
                      <Insignia tono="ambar">
                        Fiado · {c.ventas} {c.ventas === 1 ? "venta" : "ventas"}
                      </Insignia>
                    </td>
                    <td className={`${estilos.tdDerecha} pt-5 font-semibold text-slate-900`}>
                      {pesos.format(c.deuda)}
                    </td>
                    <td className={estilos.td}>
                      <FormularioAbono clienteId={c.id} deuda={c.deuda} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
