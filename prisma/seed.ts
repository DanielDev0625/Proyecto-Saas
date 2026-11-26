import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const tienda = await prisma.tienda.upsert({
    where: { id: "tienda-demo" },
    update: {},
    create: { id: "tienda-demo", nombre: "Tienda Demo La Esquina" },
  });

  await prisma.usuario.upsert({
    where: { email: "admin@martgo.test" },
    update: {},
    create: {
      tiendaId: tienda.id,
      nombre: "Administrador Demo",
      email: "admin@martgo.test",
      passwordHash: await bcrypt.hash("MartGo2026*", 10),
      rol: "ADMIN",
    },
  });

  const productos = [
    { codigo: "7702001", nombre: "Arroz 500 g", precioCompra: 2200, precioVenta: 2800, stock: 40, stockMinimo: 10 },
    { codigo: "7702002", nombre: "Aceite 1 L", precioCompra: 8500, precioVenta: 10500, stock: 6, stockMinimo: 8 },
    { codigo: "7702003", nombre: "Leche 1 L", precioCompra: 3600, precioVenta: 4300, stock: 24, stockMinimo: 12 },
    { codigo: "7702004", nombre: "Huevos x 30", precioCompra: 15000, precioVenta: 18000, stock: 3, stockMinimo: 5 },
    { codigo: "7702005", nombre: "Café 250 g", precioCompra: 9800, precioVenta: 12500, stock: 15, stockMinimo: 5 },
  ];

  for (const p of productos) {
    await prisma.producto.upsert({
      where: { tiendaId_codigo: { tiendaId: tienda.id, codigo: p.codigo } },
      update: {},
      create: { ...p, tiendaId: tienda.id },
    });
  }

  console.log(`Datos de prueba listos: tienda "${tienda.nombre}", 1 administrador y ${productos.length} productos.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
