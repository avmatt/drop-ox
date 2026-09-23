"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth/auth-client";
import { Provider } from "@/lib/auth/providers";
import { Route } from "@/lib/routes";

export function SignInButton() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);

    try {
      await authClient.signIn.social({
        provider: Provider.Microsoft,
        callbackURL: Route.Dashboard.path,
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isSigningIn}
      className="cursor-pointer rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      Sign in with Microsoft
    </button>
  );
}
