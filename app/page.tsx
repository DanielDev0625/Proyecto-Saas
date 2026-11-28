import Image from "next/image";
import Link from "next/link";

// ---------- Íconos (SVG simples, trazo de 24x24 como Heroicons) ----------

type IconoProps = { className?: string };

function Icono({ d, className = "h-6 w-6" }: IconoProps & { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const iconos = {
  // Caja
  inventario: "M21 8 12 3 3 8v8l9 5 9-5V8ZM3 8l9 5 9-5M12 13v8",
  // Rayo
  ventas: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  // Libreta
  fiados: "M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6V3ZM6 3v18M10 8h5M10 12h5",
  // Campana
  alertas: "M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0",
  // Gráfica de barras
  reportes: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  // Personas
  usuarios:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
};

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mt-0.5 h-5 w-5 flex-none text-green-600"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.58l7.3-7.3a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ---------- Contenido ----------

const funciones = [
  {
    icono: iconos.inventario,
    titulo: "Inventario al día",
    texto: "Controla existencias, códigos y precios de cada producto en un solo lugar.",
  },
  {
    icono: iconos.ventas,
    titulo: "Ventas rápidas",
    texto: "Registra cada venta en segundos y el stock se descuenta solo.",
  },
  {
    icono: iconos.fiados,
    titulo: "Fiados en orden",
    texto: "Sabe cuánto debe cada cliente y registra sus abonos sin cuaderno.",
  },
  {
    icono: iconos.alertas,
    titulo: "Alertas de reposición",
    texto: "Mira de un vistazo qué productos están por agotarse.",
  },
  {
    icono: iconos.reportes,
    titulo: "Reportes diarios",
    texto: "Conoce cuánto vendiste hoy y qué productos se mueven más.",
  },
  {
    icono: iconos.usuarios,
    titulo: "Varios usuarios",
    texto: "El dueño administra y los vendedores registran ventas con su propia cuenta.",
  },
];

const planes = [
  {
    nombre: "Básico",
    precio: "$29.900",
    descripcion: "Para empezar a ordenar tu tienda.",
    destacado: false,
    beneficios: [
      "1 usuario",
      "Hasta 200 productos",
      "Ventas y fiados",
      "Soporte por correo",
    ],
  },
  {
    nombre: "Profesional",
    precio: "$59.900",
    descripcion: "Para la tienda que ya tiene ayudantes.",
    destacado: true,
    beneficios: [
      "Hasta 3 usuarios",
      "Productos ilimitados",
      "Alertas de reposición",
      "Reportes diarios",
      "Soporte por WhatsApp",
    ],
  },
  {
    nombre: "Empresarial",
    precio: "$99.900",
    descripcion: "Para negocios con más de un local.",
    destacado: false,
    beneficios: [
      "Usuarios ilimitados",
      "Varias sedes",
      "Facturas en PDF",
      "Respaldo diario",
      "Soporte prioritario",
    ],
  },
];

// Clases compartidas de botones
const btnPrimario =
  "inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";
const btnSecundario =
  "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";

// ---------- Mockup del panel (solo Tailwind, datos de ejemplo) ----------

function MockupPanel() {
  const barras = [40, 65, 50, 80, 60, 95, 70];
  return (
    <div
      role="img"
      aria-label="Vista previa del panel de MartGo con ventas, productos y fiados del día"
      className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-blue-900/10 sm:p-6"
    >
      {/* Barra de ventana */}
      <div className="mb-5 flex items-center gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-xs font-medium text-slate-400">Resumen de hoy</span>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-[11px] text-slate-500 sm:text-xs">Ventas de hoy</p>
          <p className="mt-1 text-sm font-bold sm:text-lg">$482.500</p>
          <p className="mt-1 text-[11px] font-medium text-green-600">+12%</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-[11px] text-slate-500 sm:text-xs">Productos</p>
          <p className="mt-1 text-sm font-bold sm:text-lg">128</p>
          <p className="mt-1 text-[11px] font-medium text-amber-600">3 por reponer</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-[11px] text-slate-500 sm:text-xs">Fiados</p>
          <p className="mt-1 text-sm font-bold sm:text-lg">$96.000</p>
          <p className="mt-1 text-[11px] font-medium text-red-600">5 clientes</p>
        </div>
      </div>

      {/* Gráfica */}
      <div className="mt-4 rounded-xl border border-slate-200 p-3">
        <p className="text-xs font-medium text-slate-500">Ventas de la semana</p>
        <div className="mt-3 flex h-24 items-end gap-2">
          {barras.map((alto, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-md ${i === 5 ? "bg-blue-700" : "bg-blue-200"}`}
              style={{ height: `${alto}%` }}
            />
          ))}
        </div>
      </div>

      {/* Lista por reponer */}
      <div className="mt-4 space-y-2">
        {[
          { nombre: "Aceite 1L", stock: "6 de 8" },
          { nombre: "Huevos x30", stock: "3 de 5" },
        ].map((p) => (
          <div
            key={p.nombre}
            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"
          >
            <span className="font-medium">{p.nombre}</span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700">
              Quedan {p.stock}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Página ----------

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1. Header fijo */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="MartGo, inicio">
            <Image src="/logo.svg" alt="MartGo" width={126} height={36} priority />
          </Link>

          <nav className="flex items-center gap-2 sm:gap-6">
            <a
              href="#funciones"
              className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline"
            >
              Funciones
            </a>
            <a
              href="#planes"
              className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline"
            >
              Planes
            </a>
            <Link href="/login" className={`${btnPrimario} px-4 py-2`}>
              Iniciar sesión
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* 2. Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-blue-50 to-transparent"
            aria-hidden="true"
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-700">
                Hecho para tiendas de barrio
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                La tienda de barrio, <span className="text-blue-700">organizada.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                Maneja el inventario, las ventas y los fiados de tu negocio desde el
                celular o el computador. Sin cuadernos, sin cuentas perdidas.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/login" className={`${btnPrimario} px-6 py-3 text-base`}>
                  Empezar ahora
                </Link>
                <a href="#planes" className={`${btnSecundario} px-6 py-3 text-base`}>
                  Ver planes
                </a>
              </div>
            </div>

            <MockupPanel />
          </div>
        </section>

        {/* 3. Funciones */}
        <section id="funciones" className="scroll-mt-20 border-t border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-blue-700">Funciones</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Todo lo que tu tienda necesita
              </h2>
              <p className="mt-4 text-slate-600">
                Herramientas sencillas para el día a día, pensadas para quien atiende el
                mostrador.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {funciones.map((f) => (
                <article
                  key={f.titulo}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Icono d={f.icono} />
                  </div>
                  <h3 className="mt-4 font-semibold">{f.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Planes */}
        <section id="planes" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-blue-700">Planes</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Un plan para cada tienda
              </h2>
              <p className="mt-4 text-sm text-slate-500">
                Precios de referencia (simulados) en pesos colombianos.
              </p>
            </div>

            <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
              {planes.map((plan) => (
                <article
                  key={plan.nombre}
                  className={`relative flex h-full flex-col rounded-xl bg-white p-6 sm:p-8 ${
                    plan.destacado
                      ? "border-2 border-blue-700 shadow-lg shadow-blue-900/10"
                      : "border border-slate-200 shadow-sm"
                  }`}
                >
                  {plan.destacado && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold text-white">
                      Más popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold">{plan.nombre}</h3>
                  <p className="mt-1 text-sm text-slate-500">{plan.descripcion}</p>
                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">{plan.precio}</span>
                    <span className="text-sm text-slate-500">/mes</span>
                  </p>

                  <ul className="mt-6 flex-1 space-y-3 text-sm">
                    {plan.beneficios.map((b) => (
                      <li key={b} className="flex gap-3">
                        <Check />
                        <span className="text-slate-700">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/login"
                    className={`mt-8 w-full ${plan.destacado ? btnPrimario : btnSecundario}`}
                  >
                    Elegir plan
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Llamado final */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-2xl bg-blue-700 px-6 py-14 text-center shadow-sm sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Deja el cuaderno y organiza tu tienda hoy
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-blue-100">
              Empieza en minutos: registra tus productos y haz tu primera venta.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700"
            >
              Empezar ahora
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Image src="/logo.svg" alt="MartGo" width={112} height={32} />
          <p className="text-center text-sm text-slate-500">
            Proyecto académico · Universidad de la Costa · 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
