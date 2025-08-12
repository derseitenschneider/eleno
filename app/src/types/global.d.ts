// src/types/global.d.ts

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>
  }
}

// This export statement is needed to treat this file as a module.
export type {}
