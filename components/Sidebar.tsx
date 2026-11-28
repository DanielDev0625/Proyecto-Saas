"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icono, iconos } from "@/components/Iconos";

const links = [
  { href: "/dashboard", texto: "Resumen", icono: iconos.resumen },
  { href: "/dashboard/inventario", texto: "Inventario", icono: iconos.inventario },
  { href: "/dashboard/ventas", texto: "Ventas", icono: iconos.ventas },
  { href: "/dashboard/fiados", texto: "Fiados", icono: iconos.fiados },
];

type SidebarProps = {
  nombre: string;
  rol: string;
  cerrarSesion: () => Promise<void>;
};

// "Administrador Demo" → "AD"
function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export default function Sidebar({ nombre, rol, cerrarSesion }: SidebarProps) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const nombreRol = rol === "ADMIN" ? "Administrador" : "Vendedor";

  // En celular: cerrar el menú al cambiar de página y con la tecla Escape.
  useEffect(() => setAbierto(false), [pathname]);
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", alPresionar);
    return () => window.removeEventListener("keydown", alPresionar);
  }, [abierto]);

  const esActivo = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Barra superior (solo celular) */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 lg:hidden">
        <Link href="/dashboard" aria-label="MartGo, resumen">
          <Image src="/logo-white.svg" alt="MartGo" width={112} height={32} priority />
        </Link>
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir menú"
          aria-expanded={abierto}
          aria-controls="menu-lateral"
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Icono d={iconos.menu} className="h-6 w-6" />
        </button>
      </div>

      {/* Fondo oscuro detrás del menú abierto (solo celular) */}
      {abierto && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setAbierto(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="menu-lateral"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:flex-none lg:translate-x-0 ${
          abierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link href="/dashboard" aria-label="MartGo, resumen">
            <Image src="/logo-white.svg" alt="MartGo" width={126} height={36} priority />
          </Link>
          <button
            type="button"
            onClick={() => setAbierto(false)}
            aria-label="Cerrar menú"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <Icono d={iconos.cerrar} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Menú principal">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Menú
          </p>
          {links.map((link) => {
            const activo = esActivo(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={activo ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activo
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icono d={link.icono} className={`h-5 w-5 ${activo ? "text-white" : "text-slate-400"}`} />
                {link.texto}
              </Link>
            );
          })}
        </nav>

        {/* Tarjeta del usuario */}
        <div className="border-t border-slate-800 p-3">
          <div className="flex items-center gap-3 rounded-lg bg-slate-800/60 p-3">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-700 text-sm font-semibold">
              {iniciales(nombre) || "U"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{nombre}</p>
              <p className="text-xs text-slate-400">{nombreRol}</p>
            </div>
          </div>
          <form action={cerrarSesion} className="mt-2">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Icono d={iconos.salir} className="h-5 w-5 text-slate-400" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
