import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Icono, iconos } from "@/components/Iconos";
import { obtenerDatosGraficas } from "@/lib/graficas";
import GraficaBarrasProductos from "@/components/charts/GraficaBarrasProductos";
import GraficaVentasSemana from "@/components/charts/GraficaVentasSemana";
import GraficaContadoFiado from "@/components/charts/GraficaContadoFiado";

const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const hora = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Bogota",
});

// Medianoche de hoy en Colombia (UTC-5, sin horario de verano).
// Con new Date().setHours(0) el servidor de AWS (UTC) empezaría el día a las 7 p. m.
function inicioDelDiaEnColombia() {
  const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
  return new Date(`${hoy}T00:00:00-05:00`);
}

export default async function ResumenPage() {
  const session = await auth();
  if (!session?.user?.tiendaId) redirect("/login");
  const tiendaId = session.user.tiendaId;

  // "Por reponer" compara dos columnas: stock <= stockMinimo (referencia de campo de Prisma).
  const filtroReponer = { tiendaId, stock: { lte: prisma.producto.fields.stockMinimo } };

  // Las consultas de las gráficas empiezan ya, en paralelo con las del resumen.
  const promesaGraficas = obtenerDatosGraficas(tiendaId);

  const [productos, ventasHoy, fiados, clientesConDeuda, porReponer, totalPorReponer, ultimasVentas] =
    await Promise.all([
      prisma.producto.count({ where: { tiendaId } }),
      prisma.venta.aggregate({
        where: { tiendaId, fecha: { gte: inicioDelDiaEnColombia() } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.venta.aggregate({
        where: { tiendaId, fiado: true, saldoPendiente: { gt: 0 } },
        _sum: { saldoPendiente: true },
      }),
      prisma.venta.groupBy({
        by: ["clienteId"],
        where: { tiendaId, fiado: true, saldoPendiente: { gt: 0 }, clienteId: { not: null } },
      }),
      prisma.producto.findMany({
        where: filtroReponer,
        orderBy: [{ stock: "asc" }, { nombre: "asc" }],
        take: 6,
        select: { id: true, nombre: true, stock: true, stockMinimo: true },
      }),
      prisma.producto.count({ where: filtroReponer }),
      prisma.venta.findMany({
        where: { tiendaId },
        orderBy: { fecha: "desc" },
        take: 5,
        include: {
          cliente: { select: { nombre: true } },
          detalles: { include: { producto: { select: { nombre: true } } } },
        },
      }),
    ]);

  const graficas = await promesaGraficas;
  const primerNombre = (session.user.name ?? "").split(" ")[0] || "de nuevo";

  const tarjetas = [
    {
      titulo: "Productos registrados",
      valor: String(productos),
      detalle: "En tu inventario",
      icono: iconos.inventario,
      color: "bg-blue-50 text-blue-700",
    },
    {
      titulo: "Ventas de hoy",
      valor: pesos.format(Number(ventasHoy._sum.total ?? 0)),
      detalle: ventasHoy._count === 1 ? "1 venta" : `${ventasHoy._count} ventas`,
      icono: iconos.dinero,
      color: "bg-green-50 text-green-700",
    },
    {
      titulo: "Fiados por cobrar",
      valor: pesos.format(Number(fiados._sum.saldoPendiente ?? 0)),
      detalle:
        clientesConDeuda.length === 1 ? "1 cliente" : `${clientesConDeuda.length} clientes`,
      icono: iconos.fiados,
      color: "bg-amber-50 text-amber-700",
    },
    {
      titulo: "Productos por reponer",
      valor: String(totalPorReponer),
      detalle: totalPorReponer === 0 ? "Todo en orden" : "En o bajo el mínimo",
      icono: iconos.alerta,
      color: totalPorReponer === 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Hola, {primerNombre}
        </h1>
        <p className="mt-1 text-slate-600">Esto es lo que pasa hoy en tu tienda.</p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tarjetas.map((t) => (
          <article key={t.titulo} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">{t.titulo}</p>
              <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${t.color}`}>
                <Icono d={t.icono} />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{t.valor}</p>
            <p className="mt-1 text-sm text-slate-500">{t.detalle}</p>
          </article>
        ))}
      </div>

      {/* Gráficas */}
      {graficas.hayVentas ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TarjetaGrafica titulo="Ventas de los últimos 7 días" subtitulo="Total vendido por día, en pesos.">
            <GraficaVentasSemana datos={graficas.ultimos7Dias} />
            {graficas.ultimos7Dias.every((d) => d.total === 0) && (
              <p className="mt-2 text-center text-sm text-slate-500">No hubo ventas en estos 7 días.</p>
            )}
          </TarjetaGrafica>
          <TarjetaGrafica titulo="Contado vs fiado" subtitulo="Cuánto se ha vendido de cada forma.">
            <GraficaContadoFiado datos={graficas.contadoVsFiado} />
          </TarjetaGrafica>
          <TarjetaGrafica titulo="Productos más vendidos" subtitulo="Top 5 por unidades vendidas.">
            <GraficaBarrasProductos datos={graficas.masVendidos} medida="unidades" />
          </TarjetaGrafica>
          <TarjetaGrafica titulo="Ingresos por producto" subtitulo="Top 5 por dinero recibido (cantidad × precio).">
            <GraficaBarrasProductos datos={graficas.ingresosPorProducto} medida="pesos" />
          </TarjetaGrafica>
        </div>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <EstadoVacio
            icono="M4 20V10M10 20V4M16 20v-7M22 20H2"
            titulo="Aquí verás las gráficas de tu tienda"
            texto="Cuando registres tus primeras ventas aparecerán los productos más vendidos, las ventas de la semana y más."
            enlace={{ href: "/dashboard/ventas", texto: "Registrar una venta" }}
          />
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Últimas ventas */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Últimas ventas</h2>
            <Link
              href="/dashboard/ventas"
              className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Ver todas <Icono d={iconos.flecha} className="h-4 w-4" />
            </Link>
          </div>

          {ultimasVentas.length === 0 ? (
            <EstadoVacio
              icono={iconos.ventas}
              titulo="Aún no hay ventas"
              texto="Cuando registres tu primera venta aparecerá aquí."
              enlace={{ href: "/dashboard/ventas", texto: "Registrar una venta" }}
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {ultimasVentas.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {v.detalles.map((d) => `${d.cantidad} x ${d.producto.nombre}`).join(", ")}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {hora.format(v.fecha)}
                      {v.fiado ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700">
                          Fiado · {v.cliente?.nombre ?? "—"}
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                          Contado
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-semibold tabular-nums text-slate-900">
                    {pesos.format(Number(v.total))}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Productos por reponer */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Productos por reponer</h2>
            <Link
              href="/dashboard/inventario"
              className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Ver inventario <Icono d={iconos.flecha} className="h-4 w-4" />
            </Link>
          </div>

          {porReponer.length === 0 ? (
            <EstadoVacio
              icono={iconos.check}
              tono="verde"
              titulo="Todo el inventario está en orden"
              texto="Ningún producto está en o por debajo de su stock mínimo."
            />
          ) : (
            <>
              <ul className="divide-y divide-slate-100">
                {porReponer.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{p.nombre}</p>
                      <p className="mt-0.5 text-xs text-slate-500">Mínimo: {p.stockMinimo}</p>
                    </div>
                    <span className="whitespace-nowrap rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                      {p.stock === 0 ? "Agotado" : `Quedan ${p.stock}`}
                    </span>
                  </li>
                ))}
              </ul>
              {totalPorReponer > porReponer.length && (
                <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                  y {totalPorReponer - porReponer.length} más en el inventario.
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function EstadoVacio({
  icono,
  titulo,
  texto,
  enlace,
  tono = "gris",
}: {
  icono: string;
  titulo: string;
  texto: string;
  enlace?: { href: string; texto: string };
  tono?: "gris" | "verde";
}) {
  return (
    <div className="flex flex-col items-center px-5 py-12 text-center">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          tono === "verde" ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400"
        }`}
      >
        <Icono d={icono} className="h-6 w-6" />
      </span>
      <p className="mt-3 font-medium text-slate-900">{titulo}</p>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{texto}</p>
      {enlace && (
        <Link
          href={enlace.href}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
        >
          {enlace.texto}
        </Link>
      )}
    </div>
  );
}

function TarjetaGrafica({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string;
  subtitulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{titulo}</h2>
      <p className="mt-0.5 text-sm text-slate-500">{subtitulo}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}
