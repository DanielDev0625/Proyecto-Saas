import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import Sidebar from "@/components/Sidebar";

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
    <div className="flex min-h-screen">
      <Sidebar
        nombre={session.user.name ?? "Usuario"}
        rol={session.user.rol}
        cerrarSesion={cerrarSesion}
      />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
