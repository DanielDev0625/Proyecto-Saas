import type { DefaultSession } from "next-auth";
import "next-auth/jwt";

// Le explica a TypeScript qué datos extra lleva cada usuario: su rol y su tienda.
declare module "next-auth" {
  interface User {
    rol?: string;
    tiendaId?: string;
  }
  interface Session {
    user: { id: string; rol: string; tiendaId: string } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    rol?: string;
    tiendaId?: string;
  }
}
