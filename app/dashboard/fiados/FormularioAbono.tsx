"use client";

import { useActionState } from "react";
import { registrarAbono, type EstadoAbono } from "./actions";
import { estilos } from "@/components/ui";

export default function FormularioAbono({
  clienteId,
  deuda,
}: {
  clienteId: string;
  deuda: number;
}) {
  const [estado, accion, enviando] = useActionState<EstadoAbono, FormData>(registrarAbono, null);

  return (
    <form action={accion} className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <input type="hidden" name="clienteId" value={clienteId} />
        <label className="sr-only" htmlFor={`valor-${clienteId}`}>
          Valor del abono
        </label>
        <input
          id={`valor-${clienteId}`}
          name="valor"
          type="number"
          inputMode="decimal"
          min={0.01}
          max={deuda}
          step={0.01}
          required
          placeholder="Valor"
          className={`${estilos.campo} w-32 py-2 text-right tabular-nums`}
        />
        <button type="submit" disabled={enviando} className={`${estilos.btnPrimario} py-2`}>
          {enviando ? "Abonando..." : "Abonar"}
        </button>
      </div>
      {estado && (
        <p
          role={estado.ok ? "status" : "alert"}
          className={`text-xs font-medium ${estado.ok ? "text-green-700" : "text-red-700"}`}
        >
          {estado.mensaje}
        </p>
      )}
    </form>
  );
}
