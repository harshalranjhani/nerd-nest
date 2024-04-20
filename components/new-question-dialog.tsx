'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './ui/select'
import Difficulty from './select-difficulty'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Checkbox } from './ui/checkbox'

export interface NewQuestionProps {
  userId: string,
  buttonTitle: string
}

export default function NewQuestion({ userId, buttonTitle }: NewQuestionProps) {
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [question_link, setQuestionLink] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [solution_link, setSolutionLink] = useState('')
  const [is_solved, setIsSolved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const addQuestion = async () => {
    if (!title || !topic || !difficulty) {
      toast.error('Title, Topic and Difficulty are required')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/user/addNewQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          title,
          topic,
          question_link,
          difficulty,
          solution_link,
          is_solved
        })
      })
      const data = await response.json()
      console.log(data)
      toast.success('Question added successfully!')
      setTitle('')
      setTopic('')
      setQuestionLink('')
      setDifficulty('easy')
      setSolutionLink('')
      setIsSolved(false)
      setLoading(false)
    } catch (e: any) {
      toast.error(e.message)
      setLoading(false)
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>{buttonTitle}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Question</DialogTitle>
            <DialogDescription>
              Add a new question to further track your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Bubble Sort"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic" className="text-right">
                Topic
              </Label>
              <Input
                id="topic"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Sorting Algorithms"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="question_link" className="text-right">
                Question Link
              </Label>
              <Input
                type="url"
                id="question_link"
                value={question_link}
                onChange={e => setQuestionLink(e.target.value)}
                placeholder="https://leetcode.com/problems/sort-an-array/"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic" className="text-right">
                Difficulty
              </Label>
              <Difficulty
                setDifficulty={setDifficulty}
                difficulty={difficulty}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="solution_link" className="text-right">
                Solution / Resource Link
              </Label>
              <Input
                type="url"
                value={solution_link}
                onChange={e => setSolutionLink(e.target.value)}
                id="solution_link"
                placeholder="https://leetcode.com/problems/sort-an-array/solution/"
                className="col-span-3"
              />
            </div>
            <div className="m-2 flex w-full justify-center">
              <Checkbox
                id="is_solved"
                onCheckedChange={(value: boolean) => {
                  setIsSolved(value)
                }}
              />
              <label
                htmlFor="is_solved"
                className="mx-5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I was able to solve this question.
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={addQuestion}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
