// api route to get user's starred questions.

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })

  const body = await request.json()
  const { user_id } = body

  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .match({ user: user_id, starred: true })

  return new Response(JSON.stringify(questions), { status: 200 })
}
