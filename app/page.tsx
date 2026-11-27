
import Image from "next/image";
import Link from "next/link";

const funciones = [
  {
    titulo: "Inventario al día",
    texto: "Controla existencias y precios de cada producto.",
  },
  {
    titulo: "Ventas rápidas",
    texto: "Registra cada venta desde el celular o el computador.",
  },
  {
    titulo: "Fiados en orden",
    texto: "Lleva la cuenta de cada cliente y registra sus abonos.",
  },
  {
    titulo: "Alertas de reposición",
    texto: "Recibe avisos cuando un producto está por agotarse.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Image
          src="/logo.svg"
          alt="MartGo"
          width={150}
          height={43}
          priority
        />

        <Link
          href="/login"
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Iniciar sesión
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">
          La tienda de barrio, organizada.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          MartGo reúne el inventario, las ventas y los fiados de tu negocio
          en una sola aplicación web.
        </p>

        <Link
          href="/login"
          className="mt-10 inline-block rounded-md bg-blue-700 px-6 py-3 font-medium text-white hover:bg-blue-800"
        >
          Entrar al panel
        </Link>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        {funciones.map((f) => (
          <article
            key={f.titulo}
            className="rounded-lg border border-slate-200 bg-white p-6"
          >
            <h2 className="font-semibold">{f.titulo}</h2>
            <p className="mt-2 text-sm text-slate-600">{f.texto}</p>
          </article>
        ))}
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        MartGo · Buenas Prácticas de Desarrollo de Software · Universidad de la Costa
      </footer>
    </main>
  );
}
