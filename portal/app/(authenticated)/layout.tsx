import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { auth } from "@/lib/auth/auth";
import { Route } from "@/lib/routes";
import { AuthDropdown } from "./components/AuthDropdown";

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(Route.SignIn);
  }

  const name = session.user.name || session.user.email;

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Drop OX</p>
            <p className="text-lg font-semibold tracking-tight text-zinc-900">Client Portal</p>
          </div>
          <AuthDropdown email={session.user.email} name={name} />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-6 py-6">
        <aside className="h-fit w-64 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Navigation</p>
          <nav className="space-y-1" aria-label="Authenticated navigation">
            <Link
              href={Route.Dashboard}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
            >
              Dashboard
            </Link>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
