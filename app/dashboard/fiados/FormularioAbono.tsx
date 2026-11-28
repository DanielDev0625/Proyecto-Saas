"use client";

import { useActionState } from "react";
import { registrarAbono, type EstadoAbono } from "./actions";

export default function FormularioAbono({
  clienteId,
  deuda,
}: {
  clienteId: string;
  deuda: number;
}) {
  const [estado, accion, enviando] = useActionState<EstadoAbono, FormData>(registrarAbono, null);

  return (
    <form action={accion} className="flex flex-wrap items-center justify-end gap-2">
      <input type="hidden" name="clienteId" value={clienteId} />
      <label className="sr-only" htmlFor={`valor-${clienteId}`}>
        Valor del abono
      </label>
      <input
        id={`valor-${clienteId}`}
        name="valor"
        type="number"
        min={0.01}
        max={deuda}
        step={0.01}
        required
        placeholder="Valor"
        className="w-32 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-right text-sm tabular-nums focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      />
      <button
        type="submit"
        disabled={enviando}
        className="rounded-md bg-blue-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {enviando ? "Abonando..." : "Abonar"}
      </button>
      {estado && (
        <p
          role="status"
          className={`basis-full text-right text-xs ${estado.ok ? "text-green-700" : "text-red-700"}`}
        >
          {estado.mensaje}
        </p>
      )}
    </form>
  );
}
