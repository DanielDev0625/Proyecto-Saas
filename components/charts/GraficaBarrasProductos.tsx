"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProductoGrafica } from "@/lib/graficas";
import { AZUL, GRIS_EJE, GRIS_LINEA, pesos, pesosCorto, recortar, unidades } from "./formato";
import TooltipGrafica from "./TooltipGrafica";

// Barras horizontales del top 5. Sirve para "más vendidos" (unidades) e "ingresos" (pesos).
export default function GraficaBarrasProductos({
  datos,
  medida,
}: {
  datos: ProductoGrafica[];
  medida: "unidades" | "pesos";
}) {
  const formatoValor = medida === "pesos" ? pesos : unidades;
  const formatoEje = medida === "pesos" ? pesosCorto : (v: number) => v.toLocaleString("es-CO");

  return (
    <div className="h-64 w-full" role="img" aria-label={datos.map((d) => `${d.nombre}: ${formatoValor(d.valor)}`).join("; ")}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
          <CartesianGrid horizontal={false} stroke={GRIS_LINEA} />
          <XAxis
            type="number"
            allowDecimals={false}
            tickFormatter={formatoEje}
            tick={{ fill: GRIS_EJE, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="nombre"
            width={118}
            tickFormatter={(t: string) => recortar(t)}
            tick={{ fill: "#334155", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "#F1F5F9" }}
            content={({ active, payload }) => {
              const p = payload?.[0]?.payload as ProductoGrafica | undefined;
              return (
                <TooltipGrafica
                  activo={active}
                  titulo={p?.nombre}
                  lineas={p ? [{ etiqueta: medida === "pesos" ? "Ingresos" : "Vendidos", valor: formatoValor(p.valor) }] : []}
                />
              );
            }}
          />
          <Bar dataKey="valor" fill={AZUL} radius={[0, 6, 6, 0]} barSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
