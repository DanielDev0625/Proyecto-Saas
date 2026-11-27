import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Usa solo auth.config.ts (sin Prisma) porque el middleware corre en el entorno Edge.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
