import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import Sidebar from "@/components/Sidebar";
import EncabezadoDashboard from "@/components/EncabezadoDashboard";

// "viernes, 27 de noviembre de 2026" → "Viernes, 27 de noviembre de 2026" (hora de Colombia)
function fechaDeHoy() {
  const texto = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Bogota",
  }).format(new Date());
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Acción de servidor: el Sidebar es de cliente y no puede importar signOut,
  // así que se le pasa esta función ya lista.
  async function cerrarSesion() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar
        nombre={session.user.name ?? "Usuario"}
        rol={session.user.rol}
        cerrarSesion={cerrarSesion}
      />
      <div className="min-w-0 flex-1">
        <EncabezadoDashboard fecha={fechaDeHoy()} />
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
