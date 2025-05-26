// api route to save leetcode username to the user table

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })

  const body = await request.json()
  const { user_id, username } = body

  // save the username for the user whose user_id field matches the user_id passed in the request
  await supabase
    .from("users")
    .update({ leetcode_username: username })
    .match({ user_id: user_id })

  return new Response(null, { status: 200 })
}
