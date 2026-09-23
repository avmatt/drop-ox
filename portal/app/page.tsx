import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";
import { Route } from "@/lib/routes";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(Route.Dashboard);
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-100 p-6">
      <main className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Home</p>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-900">DropOX Portal</h1>
        <p className="mb-8 text-zinc-600">
          Welcome. Use the sign in page to sign in with Microsoft Entra ID.
        </p>

        <div className="flex flex-col items-start gap-4">
          <Link
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            href={Route.SignIn}
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}
