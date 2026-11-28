"use client";

import { usePathname } from "next/navigation";
import { Icono, iconos } from "@/components/Iconos";

const titulos: Record<string, string> = {
  "/dashboard": "Resumen",
  "/dashboard/inventario": "Inventario",
  "/dashboard/ventas": "Ventas",
  "/dashboard/fiados": "Fiados",
};

// La fecha llega ya formateada desde el servidor (hora de Colombia),
// así no cambia según la zona horaria del navegador.
export default function EncabezadoDashboard({ fecha }: { fecha: string }) {
  const pathname = usePathname();
  const seccion = titulos[pathname] ?? "Panel";

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500">
          <span>Panel</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="font-semibold text-slate-900">{seccion}</span>
        </p>
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <Icono d={iconos.calendario} className="h-4 w-4" />
          {fecha}
        </p>
      </div>
    </header>
  );
}
