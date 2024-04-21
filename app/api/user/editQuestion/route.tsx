import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })

  const body = await request.json()
  const {
    user_id,
    title,
    topic,
    question_link,
    difficulty,
    solution_link,
    is_solved
  } = body

  if (!user_id) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400
    })
  }

  // update the question based on the id in the questions table
  const { data, error } = await supabase
    .from('questions')
    .update({
      user: user_id,
      title,
      topic,
      question_link: question_link || null,
      difficulty: difficulty || 'easy',
      solution_link: solution_link || null,
      is_solved: is_solved || false
    })
    .match({ id: body.id })

  return new Response(JSON.stringify(data), { status: 200 })
}
