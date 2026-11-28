import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario || !usuario.activo) return null;

        const valida = await bcrypt.compare(password, usuario.passwordHash);
        if (!valida) return null;

        return {
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          tiendaId: usuario.tiendaId,
        };
      },
    }),
  ],
});
