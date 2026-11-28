"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MensajeResultado, estilos } from "@/components/ui";

// Usa la API que ya existe: POST /api/productos (valida datos, rol ADMIN y código repetido).
export default function FormularioProducto() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ ok: boolean; mensaje: string } | null>(null);

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    setEnviando(true);
    setResultado(null);
    try {
      const respuesta = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: datos.get("nombre"),
          codigo: datos.get("codigo"),
          precioCompra: datos.get("precioCompra"),
          precioVenta: datos.get("precioVenta"),
          stock: datos.get("stock"),
          stockMinimo: datos.get("stockMinimo"),
        }),
      });
      if (respuesta.ok) {
        const producto = await respuesta.json();
        setResultado({ ok: true, mensaje: `“${producto.nombre}” se agregó al inventario.` });
        formRef.current?.reset();
        router.refresh(); // vuelve a pedir la lista al servidor
      } else {
        const { error } = await respuesta.json().catch(() => ({ error: null }));
        setResultado({ ok: false, mensaje: error ?? "No se pudo guardar el producto." });
      }
    } catch {
      setResultado({ ok: false, mensaje: "No hay conexión. Intenta de nuevo." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={guardar} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-2">
          <label htmlFor="nombre" className={estilos.etiqueta}>
            Nombre *
          </label>
          <input id="nombre" name="nombre" required placeholder="Ej: Arroz 500 g" className={estilos.campo} />
        </div>
        <div>
          <label htmlFor="codigo" className={estilos.etiqueta}>
            Código
          </label>
          <input id="codigo" name="codigo" placeholder="Opcional" className={estilos.campo} />
        </div>
        <div>
          <label htmlFor="precioCompra" className={estilos.etiqueta}>
            Precio de compra *
          </label>
          <input
            id="precioCompra"
            name="precioCompra"
            type="number"
            inputMode="decimal"
            min={0.01}
            step="any"
            required
            placeholder="$"
            className={estilos.campo}
          />
        </div>
        <div>
          <label htmlFor="precioVenta" className={estilos.etiqueta}>
            Precio de venta *
          </label>
          <input
            id="precioVenta"
            name="precioVenta"
            type="number"
            inputMode="decimal"
            min={0.01}
            step="any"
            required
            placeholder="$"
            className={estilos.campo}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="stock" className={estilos.etiqueta}>
              Stock *
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              defaultValue={0}
              required
              className={estilos.campo}
            />
          </div>
          <div>
            <label htmlFor="stockMinimo" className={estilos.etiqueta}>
              Mínimo *
            </label>
            <input
              id="stockMinimo"
              name="stockMinimo"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              defaultValue={5}
              required
              className={estilos.campo}
            />
          </div>
        </div>
      </div>

      {resultado && <MensajeResultado ok={resultado.ok}>{resultado.mensaje}</MensajeResultado>}

      <div className="flex justify-end">
        <button type="submit" disabled={enviando} className={`${estilos.btnPrimario} w-full sm:w-auto`}>
          {enviando ? "Guardando..." : "Guardar producto"}
        </button>
      </div>
    </form>
  );
}
