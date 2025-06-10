import "server-only"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore
    })
    const session = await supabase.auth.exchangeCodeForSession(code)
    const supabase_user = session?.data?.session?.user

    if (
      supabase_user &&
      supabase_user.identities &&
      supabase_user.identities.length > 0 &&
      supabase_user.identities[0]
    ) {
      const firstIdentity = supabase_user.identities[0]
      
      // Check if user already exists in the database
      const { data: userExists, error: userExistsError } = await supabase
        .from("users")
        .select("user_id")
        .eq("user_id", firstIdentity.user_id)
        .single()

      if (userExistsError && !userExists) {
        // Only insert if user does not exist
        const { data } = await supabase
          .from("users")
          .insert({
            user_id: firstIdentity.user_id,
            email: supabase_user.email,
            role: supabase_user.role,
            created_at: firstIdentity.created_at,
            updated_at: firstIdentity.updated_at,
            name: supabase_user.user_metadata?.user_name
          })
          .throwOnError()
        console.log("User data after signup:", data)

        // send email to user
        const mailObj = {
          email: supabase_user.email,
          name: supabase_user.user_metadata?.user_name
        }

        try {
          const response = await fetch(
            `https://api.harshalranjhani.in/mail/nerd-nest/welcome`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                mailObj
              })
            }
          )
          if (response.status === 200) {
            console.log("Email sent successfully")
          } else {
            console.log("Failed to send email")
          }
        } catch (e: any) {
          console.error(e.message)
        }
      } else {
        console.log("User already exists, skipping insertion.")
      }
    } else {
      // Handle cases where identities are undefined or empty
      console.error("No identities found for the user")
    }
  }

  return NextResponse.redirect(requestUrl.origin)
}
