
"use client";

import { useActionState } from "react";
import { iniciarSesion } from "./actions";

export default function LoginForm() {
  const [error, accion, enviando] = useActionState(
    iniciarSesion,
    undefined
  );

  return (
    <form action={accion} className="space-y-4">
      <input
        name="email"
        type="email"
        placeholder="Correo"
        required
        className="w-full rounded border px-3 py-2"
      />

      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        required
        className="w-full rounded border px-3 py-2"
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        disabled={enviando}
        className="w-full rounded bg-blue-700 py-2 font-medium text-white disabled:opacity-60"
      >
        {enviando ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
