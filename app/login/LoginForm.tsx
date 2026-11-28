"use client";

import { useActionState } from "react";
import { iniciarSesion } from "./actions";

const campo =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

export default function LoginForm() {
  // Misma lógica de antes: iniciarSesion devuelve el texto del error o nada.
  const [error, accion, enviando] = useActionState(iniciarSesion, undefined);

  return (
    <form action={accion} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
          required
          className={campo}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          className={campo}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM9 6a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V6Zm1 8.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {enviando && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        )}
        {enviando ? "Ingresando..." : "Iniciar sesión"}
      </button>

      <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-center text-xs text-slate-500">
        Usuario de prueba: <span className="font-medium text-slate-700">admin@martgo.test</span>{" "}
        / <span className="font-medium text-slate-700">MartGo2026*</span>
      </p>
    </form>
  );
}
