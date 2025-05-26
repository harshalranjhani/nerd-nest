// import { auth } from "@/auth"
// import { LoginButton } from "@/components/login-button"
// import { LoginForm } from "@/components/login-form"
// import { Separator } from "@/components/ui/separator"
// import { cookies } from "next/headers"
// import { redirect } from "next/navigation"

// export default async function SignInPage() {
  // const cookieStore = cookies()
  // const session = await auth({ cookieStore })
  // // redirect to home if user is already logged in
  // if (session?.user) {
  //   redirect("/")
  // }
//   return (
//     // <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center py-10">
//     //   <div className="w-full max-w-sm">
//     //     <LoginForm action="sign-in" />
//     //     <Separator className="my-4" />
//     //     <div className="flex justify-center">
//     //       <LoginButton />
//     //     </div>
//     //   </div>
//     // </div>

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoginButton } from "@/components/login-button"
import { cookies } from "next/headers"
import { auth } from "@/auth"
import { redirect } from "next/dist/server/api-utils"
import image from "@/public/Nerd.png"

export default async function SignInPage() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  if (session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            {/* <h1 className="text-3xl font-bold">Login</h1> */}
            {/* <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button> */}
            <LoginButton />
          </div>
          {/* <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div> */}
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={image}
          alt="Nerd Nest"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
