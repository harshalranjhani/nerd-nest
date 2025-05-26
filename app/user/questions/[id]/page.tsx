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
import NoQuestions from "@/components/no-questions"
import { getUserDetails } from "../../settings/[id]/page"
import QuestionsTable from "@/components/questions-table"
import NewQuestion from "@/components/new-question-dialog"
import { Progress } from "@/components/ui/progress"
export interface ChatPageProps {
  params: {
    id: string
  }
}

async function getStats(user_id: string) {
  if (!user_id) {
    return null
  }
  if (user_id) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/user/getCustomStats`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id
          })
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
  const receivedData = await getUserDetails(params.id)
  const statData = await getStats(params.id)
  const userDetails = receivedData?.userData[0]
  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Settings</h1>
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <nav
              className="grid gap-4 text-sm text-muted-foreground"
            >
              <Link href={`/user/settings/${session?.user?.id}`}>General</Link>
              <Link href={`/user/progress/${session?.user?.id}`}>Progress</Link>
              <Link className="font-semibold text-primary" href="#">
                Custom
              </Link>
              <Link href={`/user/stars/${session?.user?.id}`}>Stars</Link>
              <Link href={`/user/notes/${session?.user?.id}`}>
              Notes
            </Link>
            </nav>
            <div className="grid gap-6">
              <span className="text-3xl font-semibold text-primary">
                Hey there, {userDetails?.name}
              </span>
              <div className="md:flex">
                {statData?.map((stat: any) => (
                  <>
                    <Card className="md:mx-5">
                      <CardHeader className="pb-2">
                        <CardDescription>{stat.difficulty}</CardDescription>
                        <CardTitle className="text-4xl md:text-2xl">
                          {stat.solvedQuestions} solved
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground">
                          out of {stat.totalQuestions} questions
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Progress
                          value={
                            (stat.solvedQuestions / stat.totalQuestions) * 100
                          }
                        />
                      </CardFooter>
                    </Card>
                  </>
                ))}
              </div>
              {!receivedData.questionsData.length ? (
                <NoQuestions userId={session?.user?.id || ""} />
              ) : (
                <div>
                  <NewQuestion
                    userId={session?.user?.id}
                    buttonTitle="Add More"
                  />
                  <QuestionsTable questions={receivedData?.questionsData} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
