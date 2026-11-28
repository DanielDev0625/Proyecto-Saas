import { prisma } from "@/lib/prisma";

// Datos para las gráficas del resumen. Todo se filtra por tiendaId y se devuelve
// como números simples (no Decimal) para poder pasarlo a componentes de cliente.

export type ProductoGrafica = { nombre: string; valor: number };
export type DiaGrafica = { dia: string; fecha: string; total: number };
export type TipoVentaGrafica = { tipo: "Contado" | "Fiado"; total: number; ventas: number };

export type DatosGraficas = {
  hayVentas: boolean;
  masVendidos: ProductoGrafica[]; // unidades
  ingresosPorProducto: ProductoGrafica[]; // pesos
  ultimos7Dias: DiaGrafica[];
  contadoVsFiado: TipoVentaGrafica[];
};

const ZONA = "America/Bogota";
// "2026-11-23" (formato en-CA = AAAA-MM-DD) en hora de Colombia
const claveDia = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA });
// "lun 23"
const etiquetaDia = new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric", timeZone: ZONA });
// "lunes, 23 de noviembre" (para el tooltip)
const fechaLarga = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: ZONA,
});

export async function obtenerDatosGraficas(tiendaId: string): Promise<DatosGraficas> {
  // Colombia es UTC-5 todo el año: medianoche de hace 6 días = inicio de la ventana de 7 días.
  const hoy = claveDia.format(new Date());
  const inicio7Dias = new Date(new Date(`${hoy}T00:00:00-05:00`).getTime() - 6 * 24 * 60 * 60 * 1000);

  const [porProducto, ventasSemana, porTipo] = await Promise.all([
    // Unidades e ingresos por producto. Prisma no puede sumar cantidad × precio en un groupBy,
    // por eso se usa SQL. $queryRaw con plantilla envía tiendaId como parámetro (sin inyección SQL).
    prisma.$queryRaw<{ nombre: string; unidades: number; ingresos: unknown }[]>`
      SELECT p."nombre",
             SUM(d."cantidad")::int                     AS unidades,
             SUM(d."cantidad" * d."precioUnitario")     AS ingresos
      FROM "DetalleVenta" d
      JOIN "Venta" v    ON v."id" = d."ventaId"
      JOIN "Producto" p ON p."id" = d."productoId"
      WHERE v."tiendaId" = ${tiendaId}
      GROUP BY p."id", p."nombre"
    `,
    prisma.venta.findMany({
      where: { tiendaId, fecha: { gte: inicio7Dias } },
      select: { fecha: true, total: true },
    }),
    prisma.venta.groupBy({
      by: ["fiado"],
      where: { tiendaId },
      _sum: { total: true },
      _count: true,
    }),
  ]);

  const productos = porProducto.map((p) => ({
    nombre: p.nombre,
    unidades: Number(p.unidades),
    ingresos: Number(p.ingresos),
  }));

  const masVendidos = [...productos]
    .sort((a, b) => b.unidades - a.unidades || a.nombre.localeCompare(b.nombre, "es"))
    .slice(0, 5)
    .map((p) => ({ nombre: p.nombre, valor: p.unidades }));

  const ingresosPorProducto = [...productos]
    .sort((a, b) => b.ingresos - a.ingresos || a.nombre.localeCompare(b.nombre, "es"))
    .slice(0, 5)
    .map((p) => ({ nombre: p.nombre, valor: p.ingresos }));

  // Los 7 días, aunque no haya ventas (quedan en 0).
  const totalesPorDia = new Map<string, number>();
  for (const v of ventasSemana) {
    const clave = claveDia.format(v.fecha);
    totalesPorDia.set(clave, (totalesPorDia.get(clave) ?? 0) + Number(v.total));
  }
  const ultimos7Dias: DiaGrafica[] = [];
  for (let i = 0; i < 7; i++) {
    // Mediodía de cada día: así el cambio de fecha nunca cae justo en el borde.
    const dia = new Date(inicio7Dias.getTime() + i * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000);
    ultimos7Dias.push({
      dia: etiquetaDia.format(dia),
      fecha: fechaLarga.format(dia),
      total: totalesPorDia.get(claveDia.format(dia)) ?? 0,
    });
  }

  const tipo = (fiado: boolean) => porTipo.find((t) => t.fiado === fiado);
  const contadoVsFiado: TipoVentaGrafica[] = [
    { tipo: "Contado", total: Number(tipo(false)?._sum.total ?? 0), ventas: tipo(false)?._count ?? 0 },
    { tipo: "Fiado", total: Number(tipo(true)?._sum.total ?? 0), ventas: tipo(true)?._count ?? 0 },
  ];

  return {
    hayVentas: contadoVsFiado.some((t) => t.ventas > 0),
    masVendidos,
    ingresosPorProducto,
    ultimos7Dias,
    contadoVsFiado,
  };
}
