"use client"
import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { toast } from "react-hot-toast"
import { Badge } from "./ui/badge"
import { AES } from "crypto-js"
import { useEffect } from "react"
import { useToast } from "./ui/use-toast"
import * as CryptoJS from "crypto-js"

const saveApiKey = async (apiKey: string, toast: any, setSaved: any) => {
  if (!apiKey) {
    return
  }

  // encrypt the api key
  const encryptedApiKey = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(apiKey), "SOME-ENCRYPTION-KEY");

  // store the api key in the browser
  localStorage.setItem("nerd-nest-gpt-api-key", encryptedApiKey.toString())
  toast({
    duration: 1000,
    description: "API key saved!"
  })
  setSaved(true)
}

const GPTKey = () => {
  const [apiKey, setApiKey] = React.useState("")
  const [saved, setSaved] = React.useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // check if the api key is already saved in the browser
    const encryptedApiKey = localStorage?.getItem("nerd-nest-gpt-api-key")
    if (encryptedApiKey) {
      toast({
        description: "API key loaded!"
      })
      // decrypt the api key
      const decryptedApiKey = CryptoJS.AES.decrypt(encryptedApiKey, "SOME-ENCRYPTION-KEY")
      setApiKey(decryptedApiKey.toString(CryptoJS.enc.Utf8))
      setSaved(true)
    }
  }, [])

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Add GPT API Key</CardTitle>
          <CardDescription>
            Used for the AI assistant in the chat. This is not stored on the
            server. It is encrypted and stored in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input
              placeholder="api-key-here"
              onChange={(e: any) => {
                setApiKey(e.target.value)
              }}
              value={apiKey}
            />
            {saved && (
              <Badge className="mt-2">API key saved, change to edit</Badge>
            )}
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              saveApiKey(apiKey, toast, setSaved)
            }
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default GPTKey
