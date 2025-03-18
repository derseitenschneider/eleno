import supabaseAdmin from './supabaseAdmin.ts'

export default async function deleteUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (error) {
    throw new Error(`Error deleting  user: ${error.message}`)
  }
}
