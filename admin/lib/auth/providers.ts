export const Provider = {
  Microsoft: "microsoft",
} as const;

export type Provider = (typeof Provider)[keyof typeof Provider];
