"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DiaGrafica } from "@/lib/graficas";
import { AZUL, GRIS_EJE, GRIS_LINEA, pesos, pesosCorto } from "./formato";
import TooltipGrafica from "./TooltipGrafica";

export default function GraficaVentasSemana({ datos }: { datos: DiaGrafica[] }) {
  return (
    <div className="h-64 w-full" role="img" aria-label={datos.map((d) => `${d.dia}: ${pesos(d.total)}`).join("; ")}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={datos} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="relleno-semana" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={AZUL} stopOpacity={0.25} />
              <stop offset="100%" stopColor={AZUL} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={GRIS_LINEA} />
          <XAxis
            dataKey="dia"
            tick={{ fill: GRIS_EJE, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            // Si no caben los 7 días (celular), recharts oculta algunos en vez de encimarlos.
            interval="preserveStartEnd"
            minTickGap={8}
            // Espacio a los lados para que "lun 23" del primer y último día no se corte.
            padding={{ left: 16, right: 16 }}
          />
          <YAxis
            tickFormatter={pesosCorto}
            tick={{ fill: GRIS_EJE, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={64}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ stroke: "#CBD5E1" }}
            content={({ active, payload }) => {
              const d = payload?.[0]?.payload as DiaGrafica | undefined;
              return (
                <TooltipGrafica
                  activo={active}
                  titulo={d?.fecha}
                  lineas={d ? [{ etiqueta: "Vendido", valor: pesos(d.total) }] : []}
                />
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke={AZUL}
            strokeWidth={2.5}
            fill="url(#relleno-semana)"
            dot={{ r: 3, fill: AZUL, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
