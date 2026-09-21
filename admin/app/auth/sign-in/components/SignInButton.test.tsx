import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SignInButton } from "@/app/auth/sign-in/components/SignInButton";

const { signInSocialMock } = vi.hoisted(() => ({
  signInSocialMock: vi.fn(),
}));

vi.mock("@/lib/auth/auth-client", () => ({
  authClient: {
    signIn: {
      social: signInSocialMock,
    },
  },
}));

describe("SignInButton", () => {
  beforeEach(() => {
    signInSocialMock.mockReset();
    signInSocialMock.mockResolvedValue(undefined);
  });

  it("starts Microsoft sign-in and disables the button while pending", async () => {
    let resolveSignIn: (() => void) | undefined;

    signInSocialMock.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveSignIn = resolve;
      }),
    );

    render(<SignInButton />);

    const button = screen.getByRole("button", { name: "Sign in with Microsoft" });

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(signInSocialMock).toHaveBeenCalledWith({
      provider: "microsoft",
      callbackURL: "/dashboard",
    });

    resolveSignIn?.();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});