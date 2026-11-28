"use client";

import { useMemo, useState } from "react";
import { Icono, iconos } from "@/components/Iconos";
import { EncabezadoPagina, EstadoVacio, Insignia, estilos, pesos } from "@/components/ui";
import { necesitaReposicion } from "@/lib/stock";
import FormularioProducto from "./FormularioProducto";

export type ProductoInventario = {
  id: string;
  nombre: string;
  codigo: string | null;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  promedio: number; // unidades vendidas por día (últimos 7 días)
  reponer: boolean; // calculado en el servidor con necesitaReposicion (lib/stock.ts)
};

// 4 → "4"; 1.5714 → "1,6"
const unidadesDia = (n: number) => n.toLocaleString("es-CO", { maximumFractionDigits: 1 });

const iconoMas = "M12 5v14M5 12h14";
const iconoBuscar = "m21 21-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z";

// "Café" y "cafe" deben coincidir: minúsculas y sin tildes.
const normalizar = (texto: string) =>
  texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

export default function VistaInventario({
  productos,
  esAdmin,
}: {
  productos: ProductoInventario[];
  esAdmin: boolean;
}) {
  const [formAbierto, setFormAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda);
    if (!q) return productos;
    return productos.filter(
      (p) => normalizar(p.nombre).includes(q) || normalizar(p.codigo ?? "").includes(q),
    );
  }, [productos, busqueda]);

  const porReponer = productos.filter((p) => p.reponer).length;

  const botonNuevo = esAdmin && (
    <button
      type="button"
      onClick={() => setFormAbierto((v) => !v)}
      aria-expanded={formAbierto}
      aria-controls="nuevo-producto"
      className={formAbierto ? estilos.btnSecundario : estilos.btnPrimario}
    >
      <Icono d={formAbierto ? iconos.cerrar : iconoMas} className="h-4 w-4" />
      {formAbierto ? "Cerrar formulario" : "Nuevo producto"}
    </button>
  );

  return (
    <div className="space-y-6">
      <EncabezadoPagina
        titulo="Inventario"
        descripcion="Consulta tus productos, precios y existencias."
        accion={botonNuevo}
      />

      {/* Formulario plegable */}
      {esAdmin && formAbierto && (
        <section id="nuevo-producto" className={`${estilos.tarjeta} p-5 sm:p-6`}>
          <h2 className="font-semibold text-slate-900">Nuevo producto</h2>
          <p className="mt-1 text-sm text-slate-500">Los campos con * son obligatorios.</p>
          <div className="mt-5">
            <FormularioProducto />
          </div>
        </section>
      )}

      <section className={estilos.tarjeta}>
        {/* Barra de búsqueda */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <label htmlFor="buscar-producto" className="sr-only">
              Buscar producto
            </label>
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <Icono d={iconoBuscar} className="h-4 w-4" />
            </span>
            <input
              id="buscar-producto"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o código"
              className={`${estilos.campo} pl-9`}
            />
          </div>
          <p className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            {productos.length} {productos.length === 1 ? "producto" : "productos"}
            {porReponer > 0 && <Insignia tono="rojo">{porReponer} por reponer</Insignia>}
          </p>
        </div>

        {productos.length === 0 ? (
          <EstadoVacio
            icono={iconos.inventario}
            titulo="Aún no hay productos"
            texto={
              esAdmin
                ? "Agrega tu primer producto para empezar a vender."
                : "El administrador todavía no ha registrado productos."
            }
            accion={
              esAdmin && !formAbierto ? (
                <button type="button" onClick={() => setFormAbierto(true)} className={estilos.btnPrimario}>
                  <Icono d={iconoMas} className="h-4 w-4" /> Agregar producto
                </button>
              ) : undefined
            }
          />
        ) : filtrados.length === 0 ? (
          <EstadoVacio
            icono={iconoBuscar}
            titulo="Sin resultados"
            texto={`No encontramos productos que coincidan con “${busqueda.trim()}”.`}
            accion={
              <button type="button" onClick={() => setBusqueda("")} className={estilos.btnSecundario}>
                Limpiar búsqueda
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className={estilos.th}>Producto</th>
                  <th scope="col" className={estilos.th}>Código</th>
                  <th scope="col" className={estilos.thDerecha}>Precio de venta</th>
                  <th scope="col" className={estilos.thDerecha}>Stock</th>
                  <th scope="col" className={estilos.thDerecha}>Mínimo</th>
                  <th scope="col" className={estilos.thDerecha} title="Promedio de unidades vendidas por día en los últimos 7 días">
                    Venta/día
                  </th>
                  <th scope="col" className={estilos.th}>Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtrados.map((p) => {
                  const reponer = p.reponer;
                  // Días que alcanza el stock al ritmo actual (solo si se está vendiendo).
                  const diasRestantes = p.promedio > 0 ? Math.floor(p.stock / p.promedio) : null;
                  // Sin promedio, necesitaReposicion solo revisa el mínimo: así se sabe cuál regla se cumplió.
                  const motivo =
                    necesitaReposicion(p.stock, p.stockMinimo)
                      ? "En o bajo el mínimo"
                      : diasRestantes !== null
                        ? `Alcanza para ${diasRestantes === 1 ? "1 día" : `${diasRestantes} días`} al ritmo actual`
                        : undefined;
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-slate-50">
                      <td className={`${estilos.td} font-medium text-slate-900`}>{p.nombre}</td>
                      <td className={`${estilos.td} text-slate-500`}>{p.codigo ?? "—"}</td>
                      <td className={`${estilos.tdDerecha} text-slate-900`}>{pesos.format(p.precioVenta)}</td>
                      <td
                        className={`${estilos.tdDerecha} font-semibold ${reponer ? "text-red-700" : "text-slate-900"}`}
                      >
                        {p.stock}
                      </td>
                      <td className={`${estilos.tdDerecha} text-slate-500`}>{p.stockMinimo}</td>
                      <td className={`${estilos.tdDerecha} text-slate-500`}>
                        {p.promedio > 0 ? unidadesDia(p.promedio) : "—"}
                      </td>
                      <td className={estilos.td}>
                        {reponer ? (
                          <span className="flex flex-col items-start gap-0.5">
                            <Insignia tono="rojo">Reponer</Insignia>
                            {motivo && <span className="text-xs text-slate-500">{motivo}</span>}
                          </span>
                        ) : (
                          <Insignia tono="verde">Suficiente</Insignia>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
