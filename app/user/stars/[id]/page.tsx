import Link from 'next/link'
import { CircleUser, Menu, Package2, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
// import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { redirect } from 'next/dist/server/api-utils'
import LeetCode from '@/components/leetcode'
import { StarsTable } from '@/components/stars-table'
import NoStarred from '@/components/no-starred.'
import { getUserDetails } from '../../settings/[id]/page'

export interface ChatPageProps {
  params: {
    id: string
  }
}

const getStarredQuestions = async (user_id: string): Promise<any> => {
  if (!user_id) {
    return null
  }
  if (user_id) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/user/getStarred`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id
          })
        }
      )
      const data = await response.json()
      console.log(data)
      return data
    } catch (e: any) {
      console.log(e.message)
      // toast.error(e.message)
      return null
    }
  }
}

export default async function Dashboard({
  params
}: ChatPageProps): Promise<any> {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  if (params.id !== session?.user?.id) {
    return null
  }
  const dataReceived = await getUserDetails(params.id)
  console.log(dataReceived)
  const starred = await getStarredQuestions(params.id)
  const userDetails = dataReceived.userData[0]
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm text-muted-foreground"
            x-chunk="dashboard-04-chunk-0"
          >
            <Link
              href={`/user/settings/${session?.user?.id}`}
            >
              General
            </Link>
            <Link href={`/user/progress/${session?.user?.id}`}>Progress</Link>
            <Link href={`/user/questions/${session?.user?.id}`}>Custom</Link>
            <Link href="#" className="font-semibold text-primary">Stars</Link>
          </nav>
          {!starred.length ? (
              <NoStarred userId={session?.user?.id || ''} />
            ) : (
              <div>
                <StarsTable questions={starred} />
              </div>
            )}
        </div>
      </main>
    </div>
  )
}
