"use client"

import { useEffect, useState } from "react"
import NoGPTKey from "@/components/no-api-key"
import { Chat } from "@/components/chat"

interface ChatWrapperProps {
  chat: {
    id: string
    messages: any[] // Adjust this type based on the actual structure of your messages
  }
  session: {
    user?: {
      id: string
    }
  }
}

export default function ChatWrapper({ chat, session }: ChatWrapperProps) {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const encryptedApiKey = localStorage.getItem("nerd-nest-gpt-api-key")
    if (encryptedApiKey) {
      setHasApiKey(true)
      setLoaded(true)
    } else {
      setHasApiKey(false)
      setLoaded(true)
    }
  }, [])

  if (!hasApiKey && !loaded) {
    return <div>Loading...</div>
  }

  if (loaded && !hasApiKey) {
    return <NoGPTKey userId={session?.user?.id || ""} />
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />
}
