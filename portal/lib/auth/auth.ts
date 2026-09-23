import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

export const auth = betterAuth({
  baseURL: requiredEnv("BETTER_AUTH_URL"),
  secret: requiredEnv("BETTER_AUTH_SECRET"),
  advanced: {
    cookiePrefix: "drop-ox-portal",
  },
  socialProviders: {
    microsoft: {
      clientId: requiredEnv("MICROSOFT_CLIENT_ID"),
      clientSecret: requiredEnv("MICROSOFT_CLIENT_SECRET"),
      tenantId: requiredEnv("MICROSOFT_TENANT_ID"),
    },
  },
  plugins: [nextCookies()],
});
