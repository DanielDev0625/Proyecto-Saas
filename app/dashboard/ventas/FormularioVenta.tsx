"use client";

import { useActionState } from "react";
import { registrarVenta, type EstadoVenta } from "./actions";
import { MensajeResultado, estilos, pesos } from "@/components/ui";

export type ProductoVendible = {
  id: string;
  nombre: string;
  precioVenta: number;
  stock: number;
};

export default function FormularioVenta({ productos }: { productos: ProductoVendible[] }) {
  const [estado, accion, enviando] = useActionState<EstadoVenta, FormData>(registrarVenta, null);

  if (productos.length === 0) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-700">
        No hay productos con stock para vender. Revisa el inventario.
      </p>
    );
  }

  return (
    <form action={accion} className="space-y-4">
      <div>
        <label htmlFor="productoId" className={estilos.etiqueta}>
          Producto
        </label>
        <select id="productoId" name="productoId" required defaultValue="" className={estilos.campo}>
          <option value="" disabled>
            Elige un producto
          </option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} · {pesos.format(p.precioVenta)} · quedan {p.stock}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cantidad" className={estilos.etiqueta}>
          Cantidad
        </label>
        <input
          id="cantidad"
          name="cantidad"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          defaultValue={1}
          required
          className={estilos.campo}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <input
          name="fiado"
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
        />
        <span>
          <span className="block text-sm font-medium text-slate-900">Es fiado</span>
          <span className="block text-xs text-slate-500">El cliente paga después; queda en Fiados.</span>
        </span>
      </label>

      <div>
        <label htmlFor="cliente" className={estilos.etiqueta}>
          Cliente <span className="font-normal text-slate-400">(obligatorio si es fiado)</span>
        </label>
        <input
          id="cliente"
          name="cliente"
          type="text"
          autoComplete="off"
          placeholder="Nombre del cliente"
          className={estilos.campo}
        />
      </div>

      {estado && <MensajeResultado ok={estado.ok}>{estado.mensaje}</MensajeResultado>}

      <button type="submit" disabled={enviando} className={`${estilos.btnPrimario} w-full`}>
        {enviando ? "Registrando..." : "Registrar venta"}
      </button>
    </form>
  );
}
