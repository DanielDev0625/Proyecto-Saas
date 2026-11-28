"use client";

// Tooltip con el estilo de MartGo (tarjeta blanca, borde slate-200, sombra suave).
export default function TooltipGrafica({
  activo,
  titulo,
  lineas,
}: {
  activo?: boolean;
  titulo?: string;
  lineas: { etiqueta: string; valor: string; color?: string }[];
}) {
  if (!activo || lineas.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
      {titulo && <p className="mb-1 font-semibold text-slate-900">{titulo}</p>}
      {lineas.map((l) => (
        <p key={l.etiqueta} className="flex items-center gap-2 text-slate-600">
          {l.color && <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />}
          {l.etiqueta}: <span className="font-semibold text-slate-900">{l.valor}</span>
        </p>
      ))}
    </div>
  );
}
