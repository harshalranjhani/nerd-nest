import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })

  const body = await request.json()
  const { user_id, note_id } = body

    const { data } = await supabase
        .from("notes")
        .delete()
        .match({ id: note_id, user: user_id })
        .throwOnError()

  return new Response(JSON.stringify(data), { status: 200 })
}