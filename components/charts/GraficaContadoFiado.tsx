"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TipoVentaGrafica } from "@/lib/graficas";
import { AMBAR, AZUL, pesos, pesosCorto } from "./formato";
import TooltipGrafica from "./TooltipGrafica";

const colores = { Contado: AZUL, Fiado: AMBAR };

export default function GraficaContadoFiado({ datos }: { datos: TipoVentaGrafica[] }) {
  const total = datos.reduce((suma, d) => suma + d.total, 0);
  const porcentaje = (valor: number) =>
    total === 0 ? "0 %" : `${Math.round((valor / total) * 100).toLocaleString("es-CO")} %`;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div
        className="relative h-52 w-52 flex-none"
        role="img"
        aria-label={datos.map((d) => `${d.tipo}: ${pesos(d.total)} (${porcentaje(d.total)})`).join("; ")}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={datos}
              dataKey="total"
              nameKey="tipo"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={datos.every((d) => d.total > 0) ? 2 : 0}
              stroke="none"
            >
              {datos.map((d) => (
                <Cell key={d.tipo} fill={colores[d.tipo]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                const d = payload?.[0]?.payload as TipoVentaGrafica | undefined;
                return (
                  <TooltipGrafica
                    activo={active}
                    titulo={d?.tipo}
                    lineas={
                      d
                        ? [
                            { etiqueta: "Total", valor: `${pesos(d.total)} (${porcentaje(d.total)})` },
                            { etiqueta: "Ventas", valor: String(d.ventas) },
                          ]
                        : []
                    }
                  />
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Total en el centro de la dona */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-slate-500">Total</span>
          <span className="text-lg font-bold text-slate-900">{pesosCorto(total)}</span>
        </div>
      </div>

      {/* Leyenda con porcentajes */}
      <ul className="w-full space-y-3">
        {datos.map((d) => (
          <li key={d.tipo} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2.5">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colores[d.tipo] }} />
              {d.tipo}
            </span>
            <span className="text-right">
              <span className="block text-sm font-semibold tabular-nums text-slate-900">{pesos(d.total)}</span>
              <span className="block text-xs text-slate-500">
                {porcentaje(d.total)} · {d.ventas === 1 ? "1 venta" : `${d.ventas} ventas`}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
