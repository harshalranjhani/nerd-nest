"use server"
import "server-only"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Database } from "@/lib/db_types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { type Chat } from "@/lib/types"


export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })
    const { data } = await supabase
      .from("chats")
      .select("payload")
      .order("payload->createdAt", { ascending: false })
      .eq("user_id", userId)
      .throwOnError()

    return (data?.map(entry => entry.payload) as Chat[]) ?? []
  } catch (error) {
    return []
  }
}

export async function getChat(id: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  })
  const { data } = await supabase
    .from("chats")
    .select("payload")
    .eq("id", id)
    .maybeSingle()

  console.log("chat data", data)

  return (data?.payload as Chat) ?? null
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })
    await supabase.from("chats").delete().eq("id", id).throwOnError()

    revalidatePath("/")
    return revalidatePath(path)
  } catch (error) {
    return {
      error: "Unauthorized"
    }
  }
}

export async function clearChats(id: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerActionClient<Database>({
      cookies: () => cookieStore
    })
    await supabase.from("chats").delete().eq("user_id", id).throwOnError()
    revalidatePath("/")
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  } catch (error) {
    console.log("clear chats error", error)
    return {
      error: "Unauthorized"
    }
  }
}

export async function getSharedChat(id: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  })
  const { data } = await supabase
    .from("chats")
    .select("payload")
    .eq("id", id)
    .not("payload->sharePath", "is", null)
    .maybeSingle()

  return (data?.payload as Chat) ?? null
}

export async function shareChat(chat: Chat) {
  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient<Database>({
    cookies: () => cookieStore
  })
  await supabase
    .from("chats")
    .update({ payload: payload as any })
    .eq("id", chat.id)
    .throwOnError()

  return payload
}

export async function getLeetCodeDetails(username: string) {
  if(!username) {
    return null
  }
  const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}/`)
  const data = await response.json()
  return data
}

export const getNotes = async (user_id: string): Promise<any> => {
  if (!user_id) {
    return null
  }
  if (user_id) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/user/getAllNotes`,
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
