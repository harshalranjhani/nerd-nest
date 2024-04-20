// api route to add a new question in the questions table with the given values and user_id as the user_id of the user who added the question as the foreign key

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

  // insert a new question in the questions table with the given values and user_id as the user_id of the user who added the question as the foreign key

  if(!user_id) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 })
  }

  const { data, error } = await supabase.from('questions').insert([
    {
      user: user_id,
      title,
      topic,
      question_link: question_link || null,
      difficulty: difficulty || 'easy',
      solution_link: solution_link || null,
      is_solved: is_solved || false
    }
  ])
  console.log(error)
  return new Response(JSON.stringify(data), { status: 200 })
}
