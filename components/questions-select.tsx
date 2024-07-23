'use client'
import * as React from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import toast from 'react-hot-toast'

export function QuestionSelect({ userId, setQuestionReferenced }: { userId: string, setQuestionReferenced: (id: string) => void }) {
  const [questions, setQuestions] = React.useState([] as any)
  
  React.useEffect(() => {
    // Fetch questions when the dialog is opened
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/user/getAllQuestions', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId
        })
      })
      const data = await response.json()
      console.log(data)
      setQuestions(data)
    } catch (e) {
      toast.error('Failed to fetch questions')
    }
  }

  const handleSelectChange = (value: string) => {
    console.log(value)
    setQuestionReferenced(value)
  }

  return (
    <Select onValueChange={handleSelectChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a question" />
      </SelectTrigger>
      <SelectContent className="max-h-[200px] overflow-y-auto">
        <SelectGroup>
          <SelectLabel>Questions</SelectLabel>
          {questions?.map((question: any) => {
            return (
              <SelectItem key={question.id} value={question.id}>
                {question.title}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
