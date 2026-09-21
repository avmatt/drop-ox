import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { SignOutButton } from "./components/SignOutButton";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-100 p-6">
      <main className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Protected Route
        </p>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-900">
          Files
        </h1>
        <p className="mb-8 text-zinc-600">
          You are authenticated with Microsoft Entra ID.
        </p>

        <div className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm font-medium text-zinc-700">Session details</p>
          <p className="mt-1 text-sm text-zinc-600">Email: {session?.user.email}</p>
          <p className="mt-1 text-sm text-zinc-600">
            Name: {session?.user.name || "Unknown"}
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <SignOutButton />
        </div>
      </main>
    </div>
  );
}