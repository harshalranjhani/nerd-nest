"use client"
import { nanoid } from "@/lib/utils"
import React, { useEffect, useState } from "react"
import NoGPTKey from "./no-api-key"
import { Chat } from "./chat"
import CryptoJS from "crypto-js"


const Main: React.FC<any> = ({ session }) => {
  const id = nanoid()
  const [apiKey, setApiKey] = useState("")

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

  if (!apiKey) {
    return <NoGPTKey userId={session?.user?.id} />
  } else {
    return <Chat id={id} />
  }
}

export default Main
