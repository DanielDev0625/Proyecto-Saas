import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";

const beneficios = [
  "Inventario y precios siempre al día",
  "Ventas registradas en segundos",
  "Fiados y abonos sin cuaderno",
];

function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex-none" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      {/* Panel azul (solo en pantallas grandes) */}
      <section className="relative hidden overflow-hidden bg-blue-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* Círculos decorativos */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5"
          aria-hidden="true"
        />

        <Link href="/" aria-label="MartGo, inicio" className="relative w-fit">
          <Image src="/logo-white.svg" alt="MartGo" width={154} height={44} priority />
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Tu tienda, en orden desde el primer día.
          </h2>
          <ul className="mt-8 space-y-4">
            {beneficios.map((b) => (
              <li key={b} className="flex items-center gap-3 text-blue-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                  <Check />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-blue-200">
          Proyecto académico · Universidad de la Costa · 2026
        </p>
      </section>

      {/* Formulario */}
      <section className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          {/* En celular el panel azul no se ve, así que el logo va aquí */}
          <Link href="/" aria-label="MartGo, inicio" className="mb-8 flex justify-center lg:hidden">
            <Image src="/logo.svg" alt="MartGo" width={140} height={40} priority />
          </Link>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-2xl font-bold tracking-tight">Inicia sesión</h1>
            <p className="mt-2 text-sm text-slate-500">
              Entra con tu correo y contraseña para administrar tu tienda.
            </p>

            <div className="mt-8">
              <LoginForm />
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link href="/" className="font-medium text-slate-600 hover:text-slate-900">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
