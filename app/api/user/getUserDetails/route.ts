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

  return new Response(JSON.stringify(data), { status: 200 })
}