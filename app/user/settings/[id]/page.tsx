import Link from "next/link"
import { CircleUser, Menu, Package2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cookies } from "next/headers"
import { auth } from "@/auth"
import { redirect } from "next/dist/server/api-utils"
import LeetCode from "@/components/leetcode"
import GPTKey from "@/components/gpt-key"

export interface ChatPageProps {
  params: {
    id: string
  }
}

export const getUserDetails = async (user_id: string): Promise<any> => {
  if (!user_id) {
    return null
  }
  if (user_id) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/user/getUserDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id
          }),
          next: { revalidate: 60 } // Cache for 60 seconds
        }
      )
      const data = await response.json()
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
  
  if (!dataReceived || dataReceived.error) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold">
          {dataReceived?.error || "Something went wrong"}
        </h1>
      </div>
    )
  }

  if (!dataReceived.userData || dataReceived.userData.length === 0) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold">User not found</h1>
      </div>
    )
  }

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
          >
            <Link className="font-semibold text-primary" href="#">General</Link>
            <Link href={`/user/progress/${session?.user?.id}`} prefetch>Progress</Link>
            <Link href={`/user/questions/${session?.user?.id}`} prefetch>
              Custom
            </Link>
            <Link href={`/user/stars/${session?.user?.id}`} prefetch>
              Stars
            </Link>
            <Link href={`/user/notes/${session?.user?.id}`} prefetch>
              Notes
            </Link>
          </nav>
          <div className="grid gap-6">
            <LeetCode userId={session?.user?.id} leetcode_username={userDetails?.leetcode_username} />
            <GPTKey />
          </div>
        </div>
      </main>
    </div>
  )
}
