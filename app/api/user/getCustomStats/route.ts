// api to get user questions and then categorize with difficulty and count
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore
  })

  const body = await request.json()
  const { user_id } = body

  if (!user_id) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      status: 400
    })
  }

  // get all questions
  const { data, error } = await supabase
    .from('questions')
    .select()
    .eq('user', user_id)

  // categorize questions based on difficulty using the data received
  let dataToBeSent: any = {}

  // count the number of easy, medium and hard questions from the data
  let easy = 0
  let medium = 0
  let hard = 0
  data?.forEach((question: any) => {
    if (question.difficulty === 'easy') {
      easy++
    } else if (question.difficulty === 'medium') {
      medium++
    } else {
      hard++
    }
  })

  // count the number of easy, medium and hard questions solved from the data
  let easySolved = 0
  let mediumSolved = 0
  let hardSolved = 0

  data?.forEach((question: any) => {
    if (question.difficulty === 'easy' && question.is_solved) {
      easySolved++
    } else if (question.difficulty === 'medium' && question.is_solved) {
      mediumSolved++
    } else if (question.difficulty === 'hard' && question.is_solved) {
      hardSolved++
    }
  })

  const total = easy + medium + hard
  const totalSolved = easySolved + mediumSolved + hardSolved

  // create the data to be sent
  dataToBeSent = [
    {
      difficulty: 'All',
      totalQuestions: total,
      solvedQuestions: totalSolved
    },
    {
      difficulty: 'Easy',
      totalQuestions: easy,
      solvedQuestions: easySolved
    },
    {
      difficulty: 'Medium',
      totalQuestions: medium,
      solvedQuestions: mediumSolved
    },
    {
      difficulty: 'Hard',
      totalQuestions: hard,
      solvedQuestions: hardSolved
    }
  ]

  return new Response(JSON.stringify(dataToBeSent), { status: 200 })
}
