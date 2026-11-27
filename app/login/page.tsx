import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8">
        <Link href="/">
          <Image src="/logo.svg" alt="MartGo" width={140} height={40} priority />
        </Link>
        <h1 className="mt-6 text-lg font-semibold">Inicia sesión en tu tienda</h1>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}