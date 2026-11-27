
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/auth";

const enlaces = [
  { href: "/dashboard", texto: "Resumen" },
  { href: "/dashboard/inventario", texto: "Inventario" },
  { href: "/dashboard/ventas", texto: "Ventas" },
  { href: "/dashboard/fiados", texto: "Fiados" },
];

export default function Sidebar({
  nombre,
  rol,
}: {
  nombre: string;
  rol: string;
}) {
  async function cerrarSesion() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <aside className="flex w-full flex-col bg-slate-900 p-6 text-slate-100 md:min-h-screen md:w-60">
      <Image
        src="/logo-white.svg"
        alt="MartGo"
        width={140}
        height={40}
      />

      <p className="mt-3 text-xs text-slate-400">
        {nombre} · {rol === "ADMIN" ? "Administrador" : "Vendedor"}
      </p>

      <nav className="mt-8 flex flex-col gap-1">
        {enlaces.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className="rounded px-3 py-2 text-sm hover:bg-slate-800"
          >
            {e.texto}
          </Link>
        ))}
      </nav>

      <form action={cerrarSesion} className="mt-auto pt-8">
        <button className="w-full rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
