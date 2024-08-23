declare module '@supabase/gotrue-js' {
  export * from '@supabase/gotrue-js'

  // Override the problematic functions
  export function decodeJWTPayload(jwt: string): any
  export function decodeBase64URL(str: string): string
}
