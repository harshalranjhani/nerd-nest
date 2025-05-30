"use client"

import { useChat, type Message } from "ai/react"

import { cn } from "@/lib/utils"
import { ChatList } from "@/components/chat-list"
import { ChatPanel } from "@/components/chat-panel"
import { EmptyScreen } from "@/components/empty-screen"
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { toast } from "react-hot-toast"
import { useEffect } from "react"
import * as CryptoJS from "crypto-js"
import { useToast } from "./ui/use-toast"

const IS_PREVIEW = process.env.VERCEL_ENV === "preview"
export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    "ai-token",
    null
  )
  const [apiKey, setApiKey] = useState("")
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? "")
  const { toast } = useToast()

  useEffect(() => {
    // check if the api key is already saved in the browser
    const encryptedApiKey = localStorage?.getItem("nerd-nest-gpt-api-key")
    if (encryptedApiKey) {
      // decrypt the api key
      const decryptedApiKey = CryptoJS.AES.decrypt(
        encryptedApiKey,
        "SOME-ENCRYPTION-KEY"
      )
      setApiKey(decryptedApiKey.toString(CryptoJS.enc.Utf8))
    }
  }, [])

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        previewToken,
        apiKey
      },
      async onResponse(response) {
        if (!response.ok) {
          toast({
            duration: 1000,
            description: "Invalid API key. Please enter a valid API key."
          })
        }
      }
    })
  return (
    <>
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{" "}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{" "}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={(e: any) => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
