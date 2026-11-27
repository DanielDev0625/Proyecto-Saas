
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const pesos = (valor: number) =>
  "$" + valor.toLocaleString("es-CO");

export default async function ResumenPage() {
  const session = await auth();

  if (!session?.user) return null;

  const tiendaId = session.user.tiendaId;

  const inicioDelDia = new Date();
  inicioDelDia.setHours(0, 0, 0, 0);

  const [productos, ventasHoy, fiados] = await Promise.all([
    prisma.producto.count({
      where: { tiendaId },
    }),

    prisma.venta.aggregate({
      where: {
        tiendaId,
        fecha: { gte: inicioDelDia },
      },
      _sum: { total: true },
      _count: true,
    }),

    prisma.venta.aggregate({
      where: {
        tiendaId,
        fiado: true,
      },
      _sum: { saldoPendiente: true },
    }),
  ]);

  const tarjetas = [
    {
      titulo: "Productos registrados",
      valor: String(productos),
    },
    {
      titulo: "Ventas de hoy",
      valor: `${ventasHoy._count} · ${pesos(
        Number(ventasHoy._sum.total ?? 0)
      )}`,
    },
    {
      titulo: "Fiados por cobrar",
      valor: pesos(Number(fiados._sum.saldoPendiente ?? 0)),
    },
  ];

  return (
    <section>
      <h1 className="text-2xl font-semibold">
        Hola, {session.user.name}
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {tarjetas.map((t) => (
          <article
            key={t.titulo}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">
              {t.titulo}
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {t.valor}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
