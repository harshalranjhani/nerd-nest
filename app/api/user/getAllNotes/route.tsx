// api route to get user's notes.

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })

  const body = await request.json()
  const { user_id } = body
  console.log(user_id)

  const { data: notes } = await supabase
    .from('notes')
    .select(
      `*,
      questions!question_id(*)`
    )
    .match({ user: user_id })

  return new Response(JSON.stringify(notes), { status: 200 })
}
