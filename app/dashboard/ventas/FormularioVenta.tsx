"use client";

import { useActionState } from "react";
import { registrarVenta, type EstadoVenta } from "./actions";

export type ProductoVendible = {
  id: string;
  nombre: string;
  precioVenta: number;
  stock: number;
};

const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const campo =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600";

export default function FormularioVenta({ productos }: { productos: ProductoVendible[] }) {
  const [estado, accion, enviando] = useActionState<EstadoVenta, FormData>(registrarVenta, null);

  if (productos.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500">
        No hay productos con stock para vender.
      </p>
    );
  }

  return (
    <form action={accion} className="space-y-4 rounded-lg border border-slate-200 p-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Producto</span>
          <select name="productoId" required defaultValue="" className={campo}>
            <option value="" disabled>
              Elige un producto
            </option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} · {pesos.format(p.precioVenta)} · quedan {p.stock}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">Cantidad</span>
          <input
            name="cantidad"
            type="number"
            min={1}
            step={1}
            defaultValue={1}
            required
            className={campo}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 sm:pb-2">
          <input name="fiado" type="checkbox" className="h-4 w-4 rounded border-slate-300" />
          Es fiado
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-600">
            Cliente <span className="font-normal text-slate-400">(obligatorio si es fiado)</span>
          </span>
          <input name="cliente" type="text" autoComplete="off" className={campo} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {enviando ? "Registrando..." : "Registrar venta"}
        </button>

        {estado && (
          <p
            role="status"
            className={`text-sm ${estado.ok ? "text-green-700" : "text-red-700"}`}
          >
            {estado.mensaje}
          </p>
        )}
      </div>
    </form>
  );
}
