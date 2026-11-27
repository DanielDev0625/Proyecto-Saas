"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", texto: "Resumen" },
  { href: "/dashboard/inventario", texto: "Inventario" },
  { href: "/dashboard/ventas", texto: "Ventas" },
  { href: "/dashboard/fiados", texto: "Fiados" },
];

type SidebarProps = {
  nombre: string;
  rol: string;
};

export default function Sidebar({ nombre, rol }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <p className="text-lg font-semibold">{nombre}</p>
        <p className="text-sm text-gray-400 capitalize">{rol}</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {links.map((link) => {
          const activo = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activo ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {link.texto}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 