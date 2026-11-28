import { prisma } from "@/lib/prisma";
import { necesitaReposicion, promedioDiario } from "@/lib/stock";

// Días de ventas que se usan para calcular el ritmo de venta (igual que la gráfica semanal).
export const DIAS_RITMO = 7;

const ZONA = "America/Bogota";
const DIA_MS = 24 * 60 * 60 * 1000;
// "2026-11-23" (AAAA-MM-DD) en hora de Colombia
const claveDia = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA });

/**
 * Promedio de unidades vendidas por día de cada producto en los últimos DIAS_RITMO días
 * (hoy incluido, hora de Colombia). Los días sin ventas cuentan como 0.
 * Productos sin ventas en la ventana no aparecen (su promedio es 0).
 */
export async function obtenerPromediosDiarios(tiendaId: string): Promise<Map<string, number>> {
  // Colombia es UTC-5 todo el año: medianoche de hace DIAS_RITMO-1 días.
  const hoy = claveDia.format(new Date());
  const inicio = new Date(new Date(`${hoy}T00:00:00-05:00`).getTime() - (DIAS_RITMO - 1) * DIA_MS);

  const detalles = await prisma.detalleVenta.findMany({
    where: { venta: { tiendaId, fecha: { gte: inicio } } },
    select: { productoId: true, cantidad: true, venta: { select: { fecha: true } } },
  });

  // Claves de los días de la ventana, en orden: ["2026-11-21", …, "2026-11-27"]
  const dias = Array.from({ length: DIAS_RITMO }, (_, i) =>
    claveDia.format(new Date(inicio.getTime() + i * DIA_MS + 12 * 60 * 60 * 1000)),
  );

  // producto → (día → unidades)
  const porProducto = new Map<string, Map<string, number>>();
  for (const d of detalles) {
    const dia = claveDia.format(d.venta.fecha);
    const mapa = porProducto.get(d.productoId) ?? new Map<string, number>();
    mapa.set(dia, (mapa.get(dia) ?? 0) + d.cantidad);
    porProducto.set(d.productoId, mapa);
  }

  const promedios = new Map<string, number>();
  for (const [productoId, mapa] of porProducto) {
    promedios.set(productoId, promedioDiario(dias.map((dia) => mapa.get(dia) ?? 0)));
  }
  return promedios;
}

export type ProductoConRitmo<T> = T & { promedio: number; reponer: boolean };

/** Agrega a cada producto su promedio diario y si necesita reposición. */
export function marcarReposicion<T extends { id: string; stock: number; stockMinimo: number }>(
  productos: T[],
  promedios: Map<string, number>,
): ProductoConRitmo<T>[] {
  return productos.map((p) => {
    const promedio = promedios.get(p.id) ?? 0;
    return { ...p, promedio, reponer: necesitaReposicion(p.stock, p.stockMinimo, promedio) };
  });
}
