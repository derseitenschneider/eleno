import supabaseAdmin from '../supabaseAdmin'

export async function populateStudents(userId: string) {
  console.log('Creating a student for user ', userId)
  const { error } = await supabaseAdmin.from('students').insert({
    user_id: userId,
    firstName: 'Test',
    lastName: 'Student',
    instrument: 'Gitarre',
  })

  if (error) {
    throw new Error(`Error inserting student: ${error.message}`)
  }
}
