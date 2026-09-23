import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";
import { Route } from "@/lib/routes";
import { SignInButton } from "./components/SignInButton";

export default async function SignInPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(Route.Dashboard.path);
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-100 p-6">
      <main className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Authentication
        </p>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-900">
          Sign In
        </h1>
        <p className="mb-8 text-zinc-600">
          Sign in with Microsoft Entra ID to access your files.
        </p>

        <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm font-medium text-zinc-700">Current session</p>
          <p className="mt-1 text-sm text-zinc-600">No active session</p>
        </div>

        <div className="flex flex-col items-start gap-4">
          <SignInButton />
          <Link
            className="text-sm font-semibold text-zinc-900 underline underline-offset-4"
            href={Route.Home.path}
          >
            Back home
          </Link>
        </div>
      </main>
    </div>
  );
}
