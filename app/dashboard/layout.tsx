import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Temporal: cuando el login esté listo, estos datos se leen de la sesión o una cookie
  const nombre = "Usuario";
  const rol = "admin";

  return (
    <div className="flex min-h-screen">
      <Sidebar nombre={nombre} rol={rol} />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}