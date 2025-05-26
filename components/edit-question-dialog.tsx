"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "./ui/select"
import Difficulty from "./select-difficulty"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { Checkbox } from "./ui/checkbox"
import { Question } from "./questions-table"
import { DialogClose } from "@radix-ui/react-dialog"

export interface EditQuestionProps {
  //   userId: string,
  buttonTitle: string
  question: any
}

export default function EditQuestion({
  buttonTitle,
  question
}: EditQuestionProps) {
  const [title, setTitle] = useState(question.title)
  const [topic, setTopic] = useState(question.topic)
  const [question_link, setQuestionLink] = useState(question.question_link)
  const [difficulty, setDifficulty] = useState(question.difficulty)
  const [solution_link, setSolutionLink] = useState(question.solution_link)
  const [is_solved, setIsSolved] = useState(question.is_solved)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Handle escape key to close dialog
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  const editQuestion = async () => {
    if (!title || !topic || !difficulty) {
      toast.error("Title, Topic and Difficulty are required")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/user/editQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: question.user,
          id: question.id,
          title,
          topic,
          question_link,
          difficulty,
          solution_link,
          is_solved
        })
      })
      const data = await response.json()
      toast.success("Question updated successfully!")
      // close the dialog
      setLoading(false)
      setIsOpen(false)
    } catch (e: any) {
      toast.error(e.message)
      setLoading(false)
    }
  }
  return (
    <Dialog open={isOpen}>
      <DialogTrigger className="w-full" asChild>
        <Button
          variant="outline"
          className="w-[100%]"
          onClick={e => {
            setIsOpen(true)
            e.stopPropagation()
          }}
        >
          {buttonTitle}
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={e => {
          e.stopPropagation()
        }}
        onKeyDown={e => {
          if (e.key === " ") {
            e.stopPropagation()
          }
        }}
      >
        <DialogHeader>
          <DialogClose />
          <DialogTitle>Edit Question</DialogTitle>
          <DialogDescription>
            Edit the question details below.{" "}
            <i className="col-span-4 text-center">
              Have pdf or image files and nowhere to upload? Check out{" "}
              <a
                href="https://storage.harshalranjhani.in"
                target="_blank"
                className="text-teal-500 underline"
              >
                storage.harshalranjhani.in
              </a>
              !
            </i>
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
              onChange={e => {
                setTitle(e.target.value)
              }}
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
              onChange={e => {
                setTopic(e.target.value)
              }}
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
              value={question_link || ""}
              onChange={(e: any) => setQuestionLink(e.target.value)}
              placeholder="https://leetcode.com/problems/sort-an-array/"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="topic" className="text-right">
              Difficulty
            </Label>
            <Difficulty setDifficulty={setDifficulty} difficulty={difficulty} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="solution_link" className="text-right">
              Solution / Resource Link
            </Label>
            <Input
              type="url"
              value={solution_link || ""}
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
              checked={is_solved}
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
          <div className="flex w-[100%] justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                setIsOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={editQuestion}>
              {loading ? "Updating..." : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
