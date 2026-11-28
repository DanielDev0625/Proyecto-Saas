// Reglas de reposición de inventario. Funciones puras (sin base de datos), fáciles de probar.

/**
 * Promedio de unidades vendidas por día.
 * Ej: [4, 6, 2] → 4. Lista vacía → 0.
 */
export function promedioDiario(ventasPorDia: number[]): number {
  if (ventasPorDia.length === 0) return 0;
  const total = ventasPorDia.reduce((suma, unidades) => suma + unidades, 0);
  return total / ventasPorDia.length;
}

/**
 * ¿Hay que reponer el producto?
 * - Sí, si el stock está en el mínimo o por debajo.
 * - Sí, si al ritmo de venta promedio no alcanza para cubrir `diasCobertura` días.
 *   Ej: se venden 4 al día y se quieren cubrir 3 días → se necesitan 12; con 10 hay que reponer.
 * Sin promedio (0) solo cuenta el mínimo.
 */
export function necesitaReposicion(
  stock: number,
  stockMinimo: number,
  promedio = 0,
  diasCobertura = 3,
): boolean {
  if (stock <= stockMinimo) return true;
  const necesarioParaCobertura = promedio * diasCobertura;
  return stock < necesarioParaCobertura;
}
