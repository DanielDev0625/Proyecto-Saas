// Formatos compartidos por las gráficas.

export const AZUL = "#1D4ED8"; // blue-700, color de la marca
export const AMBAR = "#F59E0B"; // amber-500, mismo tono que las insignias de "Fiado"
export const GRIS_EJE = "#64748B"; // slate-500
export const GRIS_LINEA = "#E2E8F0"; // slate-200

const formatoPesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const pesos = (valor: number) => formatoPesos.format(valor);

// Para los ejes: "$25 mil", "$1,3 M"
export function pesosCorto(valor: number) {
  if (Math.abs(valor) >= 1_000_000) {
    return `$${(valor / 1_000_000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} M`;
  }
  if (Math.abs(valor) >= 1_000) {
    return `$${Math.round(valor / 1_000).toLocaleString("es-CO")} mil`;
  }
  return `$${valor}`;
}

export const unidades = (valor: number) => (valor === 1 ? "1 unidad" : `${valor.toLocaleString("es-CO")} unidades`);

// Nombres largos en el eje: "Chocolatina Jet x 12 unid…"
export const recortar = (texto: string, max = 16) =>
  texto.length > max ? `${texto.slice(0, max - 1)}…` : texto;
