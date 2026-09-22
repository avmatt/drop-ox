import { cookies } from "next/headers";

const TOAST_COOKIE_NAME = "drop_ox_toast";

export type ToastVariant = "success";

type ToastOptions = {
  title: string;
  message: string;
  variant?: ToastVariant;
};

export async function setToastCookie({ title, message, variant = "success" }: ToastOptions) {
  const cookieStore = await cookies();

  cookieStore.set(
    TOAST_COOKIE_NAME,
    JSON.stringify({ title, message, variant }),
    {
      path: "/",
      sameSite: "lax",
    },
  );
}

export async function clearToastCookie() {
  const cookieStore = await cookies();

  cookieStore.delete(TOAST_COOKIE_NAME);
}

export function getToastCookieName() {
  return TOAST_COOKIE_NAME;
}