// api route to add a new note in the notes table with the given values and user_id as the user_id of the user who added the note as the foreign key

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

  const { data, error } = await supabase.from('notes').insert([
    {
      user: user_id,
      title,
      description,
      links,
      question_id,
    }
  ])
  console.log(error)
  return new Response(JSON.stringify(data), { status: 200 })
}
