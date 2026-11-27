
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({
      estado: "ok",
      baseDeDatos: "ok",
      fecha: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      {
        estado: "error",
        baseDeDatos: "sin conexión",
      },
      { status: 503 }
    );
  }
}
