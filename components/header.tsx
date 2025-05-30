import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { auth } from "@/auth"
import { clearChats } from "@/app/actions"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { SidebarList } from "@/components/sidebar-list"
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from "@/components/ui/icons"
import { SidebarFooter } from "@/components/sidebar-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { ClearHistory } from "@/components/clear-history"
import { UserMenu } from "@/components/user-menu"
import { cookies } from "next/headers"

export async function Header() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex items-center">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              {/* @ts-ignore */}
              <SidebarList userId={session?.user?.id} />
            </React.Suspense>
            <SidebarFooter>
              <ThemeToggle />
              <ClearHistory
                clearChats={clearChats.bind(null, session?.user?.id)}
              />
            </SidebarFooter>
          </Sidebar>
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            <IconNextChat className="mr-2 h-6 w-6 dark:hidden" inverted />
            <IconNextChat className="mr-2 hidden h-6 w-6 dark:block" />
          </Link>
        )}
        <div className="flex items-center">
          <IconSeparator className="h-6 w-6 text-muted-foreground/50" />
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Button variant="link" asChild className="-ml-2">
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
      <Button className="my-5">
          <Link href={`/`}>
            Home
          </Link>
        </Button>
        <Button className="my-5 bg-teal-400 hover:bg-teal-500">
          <Link href={`/user/questions/${session?.user?.id}`}>
            Track your progress
          </Link>
        </Button>
      </div>
    </header>
  )
}
