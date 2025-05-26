// api route to get user details

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })

  const body = await request.json()
  const { user_id, question_id, is_starred } = body

  const { data } = await supabase
    .from("questions")
    .update({ starred:is_starred })
    .match({ user: user_id, id: question_id })

  return new Response(JSON.stringify(data), { status: 200 })
}
