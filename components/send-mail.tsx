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
import toast from 'react-hot-toast'

export interface LeetCodeProps {
  questions: any
  email: string
}

const SendMail = ({ questions, email }: LeetCodeProps) => {
  const [loading, setLoading] = React.useState(false)

  const sendEmail = async () => {
    setLoading(true)
    const mailObj = {
      questions,
      email
    }
    try {
      const response = await fetch(`https://api.harshalranjhani.in/mail/questions-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mailObj
        })
      })
      if (response.status === 200) {
        toast.success('Email sent successfully')
      } else {
        toast.error('Failed to send email')
      }
      setLoading(false)
    } catch (e: any) {
      toast.error(e.message)
      setLoading(false)
      // console.log(e.message)
    }
  }

  return (
    <div>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Questions you have starred in the past.</CardTitle>
          <CardDescription>
            You can also email yourself the questions you have starred.
          </CardDescription>
        </CardHeader>
        <CardContent>
          This will help you keep track of the questions you find interesting.
          You can star a question by clicking on the star action on the question
          row.
        </CardContent>
        <div className="flex justify-center">
          <Button
            className="my-5 bg-teal-400 hover:bg-teal-500"
            onClick={sendEmail}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Email me questions'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default SendMail
