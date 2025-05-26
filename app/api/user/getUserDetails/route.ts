// api route to get user details

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })

  const body = await request.json()
  const { user_id } = body

  // get the user details for the user whose user_id field matches the user_id passed in the request
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .match({ user_id: user_id })
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  if (!data || data.length === 0) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 })
  }
  
  // fetch questions from the questions table where the user_id field matches the user_id passed in the request
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .match({ user: user_id })
  
  if (questionsError) {
    return new Response(JSON.stringify({ error: questionsError.message }), { status: 500 })
  }

  const dataToBeSent = {
    userData: data,
    questionsData: questions || []
  }

  return new Response(JSON.stringify(dataToBeSent), { status: 200 })
}