'use client'
import React, { useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import NewQuestion from './new-question-dialog'

export interface LeetCodeProps {
  userId: string
}

const NoGPTKey = ({ userId }: LeetCodeProps) => {
  return (
    <div className="m-10">
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>No GPT API Key was found linked to the account.</CardTitle>
          <CardDescription>
            Head over to the settings page to add your GPT API Key.
          </CardDescription>
        </CardHeader>
        <CardContent>
          This key is not stored on the server. It is encrypted and stored in
          your browser. It is used for the AI assistant in the chat. Without
          this key, the AI assistant will not work.
        </CardContent>
        <div className="flex justify-center">
          <Button
            className="my-5 bg-teal-400 hover:bg-teal-500"
            onClick={() => {
              window.location.href = `/user/settings/${userId}`
            }}
          >
            Add your key
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default NoGPTKey
