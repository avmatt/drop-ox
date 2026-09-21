"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/auth-client";
import { Route } from "@/lib/routes";

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push(Route.Home);
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Sign out
    </button>
  );
};
