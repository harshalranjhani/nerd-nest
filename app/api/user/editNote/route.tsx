import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

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
    question_id
  } = body

  if (!user_id) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400
    })
  }

  // update the note based on the id in the questions table
  const { data, error } = await supabase
    .from("notes")
    .update({
      user: user_id,
      title,
      description,
      links,
      question_id
    })
    .match({ id: body.id })

  return new Response(JSON.stringify(data), { status: 200 })
}
