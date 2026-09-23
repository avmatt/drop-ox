"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth/auth-client";
import { Route } from "@/lib/routes";

type AuthDropdownProps = {
  email: string;
  name?: string | null;
};

export function AuthDropdown({ email, name }: AuthDropdownProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName = name && name.trim().length > 0 ? name : email;
  const initial = displayName[0]?.toUpperCase() ?? "U";

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await authClient.signOut();
      router.push(Route.Home.path);
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center gap-3 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-left transition hover:bg-zinc-100">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
          {initial}
        </span>
        <span className="hidden pr-1 text-sm font-medium text-zinc-800 sm:inline">{displayName}</span>
      </MenuButton>

      <MenuItems anchor="bottom end" className="z-20 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg">
        <div className="rounded-lg bg-zinc-50 px-3 py-2">
          <p className="text-sm font-semibold text-zinc-900">{displayName}</p>
          <p className="text-xs text-zinc-600">{email}</p>
        </div>

        <MenuItem>
          {({ close }) => (
            <button
              type="button"
              onClick={async () => {
                close();
                await handleSignOut();
              }}
              disabled={isSigningOut}
              className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-zinc-800 transition data-[focus]:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          )}
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
