import { auth } from '@/auth'
import Main from '@/components/main'
import { cookies } from 'next/headers'

export const runtime = 'edge'

export default async function IndexPage() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  return <Main session={session} />
}
