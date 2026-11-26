import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/productos → productos de la tienda del usuario conectado, por nombre.
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const productos = await prisma.producto.findMany({
    where: { tiendaId: session.user.tiendaId },
    orderBy: { nombre: "asc" },
  });
  return Response.json(productos);
}

// POST /api/productos → crea un producto. Solo para administradores.
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  if (session.user.rol !== "ADMIN") {
    return Response.json({ error: "Solo el administrador crea productos" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "El cuerpo debe ser JSON válido" }, { status: 400 });
  }

  const nombre = String(body.nombre ?? "").trim();
  const codigo = body.codigo ? String(body.codigo).trim() : null;
  const precioCompra = Number(body.precioCompra);
  const precioVenta = Number(body.precioVenta);
  const stock = Number(body.stock ?? 0);
  const stockMinimo = Number(body.stockMinimo ?? 5);

  if (
    !nombre ||
    !(precioCompra > 0) ||
    !(precioVenta > 0) ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    !Number.isInteger(stockMinimo) ||
    stockMinimo < 0
  ) {
    return Response.json({ error: "Datos inválidos" }, { status: 400 });
  }

  if (codigo) {
    const repetido = await prisma.producto.findFirst({
      where: { tiendaId: session.user.tiendaId, codigo },
    });
    if (repetido) {
      return Response.json({ error: "Ya existe un producto con ese código" }, { status: 409 });
    }
  }

  const producto = await prisma.producto.create({
    data: {
      tiendaId: session.user.tiendaId,
      nombre,
      codigo,
      precioCompra,
      precioVenta,
      stock,
      stockMinimo,
    },
  });
  return Response.json(producto, { status: 201 });
}
