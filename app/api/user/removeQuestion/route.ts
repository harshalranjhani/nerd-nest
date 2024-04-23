// api route to get user details

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })

  const body = await request.json()
  const { user_id, question_id } = body

  // delete the question from the questions table where the question_id field matches the question_id passed in the request and the user field matches the user_id passed in the request
    const { data } = await supabase
        .from('questions')
        .delete()
        .match({ id: question_id, user: user_id })
        .throwOnError()

  return new Response(JSON.stringify(data), { status: 200 })
}