// api route to get user details

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })

  const body = await request.json()
  const { user_id } = body

  // get the user details for the user whose user_id field matches the user_id passed in the request
  const { data } = await supabase
    .from('users')
    .select('*')
    .match({ user_id: user_id })
  
  // fetch questions from the questions table where the user_id field matches the user_id passed in the request
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .match({ user_id: user_id })
  
  const dataToBeSent = {
    userData: data,
    questionsData: questions
  }

  return new Response(JSON.stringify(dataToBeSent), { status: 200 })
}