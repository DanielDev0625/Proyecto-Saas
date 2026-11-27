import type { NextAuthConfig } from "next-auth";

// Configuración base de Auth.js. No usa Prisma ni bcrypt para que también
// pueda ejecutarse en el middleware (Edge), donde esas librerías no funcionan.
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    // Decide quién puede entrar a cada ruta.
    authorized({ auth, request: { nextUrl } }) {
      const conectado = !!auth?.user;
      if (nextUrl.pathname.startsWith("/dashboard")) return conectado;
      if (conectado && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    // Al iniciar sesión, guarda el rol y la tienda dentro del token (cookie firmada).
    jwt({ token, user }) {
      if (user) {
        token.rol = user.rol;
        token.tiendaId = user.tiendaId;
      }
      return token;
    },
    // Pasa los datos del token a la sesión que leen las páginas.
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      session.user.rol = token.rol ?? "VENDEDOR";
      session.user.tiendaId = token.tiendaId ?? "";
      return session;
    },
  },
} satisfies NextAuthConfig;
