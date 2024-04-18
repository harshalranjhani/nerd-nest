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
import { Progress } from '@/components/ui/progress'
import { getLeetCodeDetails } from '@/app/actions'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconExternalLink } from '@/components/ui/icons'


export default async function Dashboard() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  const data = await getLeetCodeDetails('harshalranjhani')

  const statData = [
    {
      id: 1,
      difficulty: 'All',
      totalQuestionsSlug: 'totalQuestions',
      totalSolvedSlug: 'totalSolved'
    },
    {
      id: 2,
      difficulty: 'Easy',
      totalQuestionsSlug: 'totalEasy',
      totalSolvedSlug: 'easySolved'
    },
    {
      id: 3,
      difficulty: 'Medium',
      totalQuestionsSlug: 'totalMedium',
      totalSolvedSlug: 'mediumSolved'
    },
    {
      id: 4,
      difficulty: 'Hard',
      totalQuestionsSlug: 'totalHard',
      totalSolvedSlug: 'hardSolved'
    }
  ]

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
            <Link href={`/user/settings/${session?.user?.id}`}>General</Link>
            <Link href="#">Security</Link>
            <Link href="#" className="font-semibold text-primary">
              Progress
            </Link>
            <Link href="#">Support</Link>
            <Link href="#">Organizations</Link>
            <Link href="#">Advanced</Link>
          </nav>
          <div className="grid gap-6">
            <span className="text-3xl font-semibold text-primary">
              Hey there, {session?.user?.email}
            </span>
            <div className="md:flex">
              {statData.map(stat => (
                <>
                  <Card className="md:mx-5">
                    <CardHeader className="pb-2">
                      <CardDescription>{stat.difficulty}</CardDescription>
                      <CardTitle className="text-4xl md:text-2xl">
                        {data[stat.totalSolvedSlug]} solved
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        out of {data[stat.totalQuestionsSlug]} questions
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Progress value={data[stat.totalSolvedSlug]/data[stat.totalQuestionsSlug]} />
                    </CardFooter>
                  </Card>
                </>
              ))}
            </div>
            <h1>Recent Submissions</h1>
            <Table>
      <TableCaption>A list of your recent submissions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Visit</TableHead>
          <TableHead>Question</TableHead>
          <TableHead>Submission Time</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.recentSubmissions.map((submission:any) => (
          <TableRow key={submission.timestamp}>
            <TableCell><a href={`https://leetcode.com/problems/${submission.titleSlug}`}><IconExternalLink/></a></TableCell>
            <TableCell className="font-medium">{submission.title}</TableCell>
            <TableCell>{new Date(submission.timestamp * 1000).toLocaleString()}</TableCell>
            <TableCell className="text-right">{submission.statusDisplay}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
          </div>
        </div>
      </main>
    </div>
  )
}
