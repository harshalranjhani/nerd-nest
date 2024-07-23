import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })

  const body = await request.json()
  const {
    user_id,
    title,
    description,
    links,
    question_id,
  } = body

  if(!user_id) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 })
  }

  // Insert the new note
  const { data, error } = await supabase.from('notes').insert([
    {
      user: user_id,
      title,
      description,
      links,
      question_id,
    }
  ]).select()

  if (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: 'Failed to add note' }), { status: 500 })
  }

  // Get the inserted note ID
  const noteId = data[0]?.id

  if (noteId) {
    // Update the question with the note ID
    const { error: updateError } = await supabase.from('questions').update({
      note_id: noteId
    }).eq('id', question_id)

    if (updateError) {
      console.log(updateError)
      return new Response(JSON.stringify({ error: 'Failed to link note to question' }), { status: 500 })
    }
  }

  return new Response(JSON.stringify(data), { status: 200 })
}
