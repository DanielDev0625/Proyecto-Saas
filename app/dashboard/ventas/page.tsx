import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Icono, iconos } from "@/components/Iconos";
import { EncabezadoPagina, EstadoVacio, Insignia, estilos, pesos } from "@/components/ui";
import FormularioVenta from "./FormularioVenta";

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
    <div className="space-y-6">
      <EncabezadoPagina
        titulo="Ventas"
        descripcion="Registra ventas de contado o fiadas y revisa las más recientes."
        accion={
          <a href="#nueva-venta" className={estilos.btnPrimario}>
            <Icono d="M12 5v14M5 12h14" className="h-4 w-4" />
            Nueva venta
          </a>
        }
      />

      {/* grid-cols-1 = minmax(0,1fr): sin esto, en celular la tabla ensancha la columna */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <section id="nueva-venta" className={`${estilos.tarjeta} scroll-mt-24 p-5 sm:p-6`}>
          <h2 className="font-semibold text-slate-900">Nueva venta</h2>
          <p className="mt-1 text-sm text-slate-500">El stock se descuenta automáticamente.</p>
          <div className="mt-5">
            <FormularioVenta productos={vendibles} />
          </div>
        </section>

        <section className={`${estilos.tarjeta} lg:col-span-2`}>
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Últimas ventas</h2>
            <p className="mt-0.5 text-sm text-slate-500">Las 10 más recientes de tu tienda.</p>
          </div>

          {ventas.length === 0 ? (
            <EstadoVacio
              icono={iconos.ventas}
              titulo="Aún no hay ventas"
              texto="Registra la primera con el formulario y aparecerá aquí."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className={estilos.th}>Fecha</th>
                    <th scope="col" className={estilos.th}>Productos</th>
                    <th scope="col" className={estilos.th}>Tipo</th>
                    <th scope="col" className={estilos.thDerecha}>Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ventas.map((v) => (
                    <tr key={v.id} className="transition-colors hover:bg-slate-50">
                      <td className={`${estilos.td} tabular-nums text-slate-500`}>{fechaHora.format(v.fecha)}</td>
                      <td className={`${estilos.td} text-slate-900`}>
                        {v.detalles.map((d) => `${d.cantidad} x ${d.producto.nombre}`).join(", ")}
                      </td>
                      <td className={estilos.td}>
                        {v.fiado ? (
                          <Insignia tono="ambar">Fiado · {v.cliente?.nombre ?? "—"}</Insignia>
                        ) : (
                          <Insignia tono="gris">Contado</Insignia>
                        )}
                      </td>
                      <td className={`${estilos.tdDerecha} font-semibold text-slate-900`}>
                        {pesos.format(Number(v.total))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
