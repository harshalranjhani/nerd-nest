import 'server-only'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the Auth Helpers package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore
    })
    const session = await supabase.auth.exchangeCodeForSession(code)
    // insert the user into the users table
    // await supabase.from('users').insert([{ id: session.user.id }])
    const supabase_user = session?.data?.session?.user
    await supabase
      .from('users')
      .upsert({
        user_id: supabase_user?.identities[0]?.user_id,
        email: supabase_user?.email,
        role: supabase_user?.role,
        created_at: supabase_user?.identities[0]?.created_at,
        updated_at: supabase_user?.identities[0]?.updated_at,
        name: supabase_user?.user_metadata?.user_name,
      })
      .throwOnError()
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
