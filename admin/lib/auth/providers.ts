export const Provider = {
  Microsoft: "microsoft",
}

export type Provider = typeof Provider[keyof typeof Provider]; 
