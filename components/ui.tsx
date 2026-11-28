// Piezas de interfaz compartidas por las páginas del panel (sirven en servidor y en cliente).
import { Icono } from "@/components/Iconos";

export const estilos = {
  btnPrimario:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
  btnSecundario:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
  campo:
    "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20",
  etiqueta: "mb-1.5 block text-sm font-medium text-slate-700",
  tarjeta: "rounded-xl border border-slate-200 bg-white shadow-sm",
  // Tablas
  th: "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500",
  thDerecha:
    "whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500",
  td: "whitespace-nowrap px-4 py-3.5",
  tdDerecha: "whitespace-nowrap px-4 py-3.5 text-right tabular-nums",
};

export const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function EncabezadoPagina({
  titulo,
  descripcion,
  accion,
}: {
  titulo: string;
  descripcion: string;
  accion?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{titulo}</h1>
        <p className="mt-1 text-slate-600">{descripcion}</p>
      </div>
      {accion && <div className="flex-none">{accion}</div>}
    </div>
  );
}

const tonos = {
  rojo: "bg-red-50 text-red-700 ring-red-600/20",
  verde: "bg-green-50 text-green-700 ring-green-600/20",
  ambar: "bg-amber-50 text-amber-700 ring-amber-600/20",
  gris: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export function Insignia({
  tono,
  children,
}: {
  tono: keyof typeof tonos;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tonos[tono]}`}
    >
      {children}
    </span>
  );
}

export function EstadoVacio({
  icono,
  titulo,
  texto,
  accion,
  tono = "gris",
}: {
  icono: string;
  titulo: string;
  texto: string;
  accion?: React.ReactNode;
  tono?: "gris" | "verde";
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          tono === "verde" ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400"
        }`}
      >
        <Icono d={icono} className="h-6 w-6" />
      </span>
      <p className="mt-4 font-semibold text-slate-900">{titulo}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{texto}</p>
      {accion && <div className="mt-5">{accion}</div>}
    </div>
  );
}

// Mensaje de resultado de un formulario (verde si salió bien, rojo si no).
export function MensajeResultado({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <p
      role={ok ? "status" : "alert"}
      className={`rounded-lg border px-3 py-2.5 text-sm ${
        ok ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {children}
    </p>
  );
}
