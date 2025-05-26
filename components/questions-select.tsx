"use client"
import * as React from "react"
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

export function QuestionSelect({ userId, setQuestionReferenced }: { userId: string, setQuestionReferenced: (id: string) => void }) {
  const [questions, setQuestions] = React.useState([] as any)
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selected, setSelected] = React.useState<any>(null)

  React.useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/user/getAllQuestions", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId
        })
      })
      const data = await response.json()
      setQuestions(data)
    } catch (e) {
      toast.error("Failed to fetch questions")
    }
  }

  const handleSelect = (question: any) => {
    setSelected(question)
    setQuestionReferenced(question.id)
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpen(true)}
        type="button"
      >
        {selected ? selected.title : "Select a question"}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search questions..."
          value={searchTerm}
          onValueChange={setSearchTerm}
          autoFocus
        />
        <CommandList>
          <CommandEmpty>No questions found.</CommandEmpty>
          <CommandGroup heading="Questions">
            {questions
              .filter((question: any) =>
                question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                question.topic.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((question: any) => (
                <CommandItem
                  key={question.id}
                  value={question.title}
                  onSelect={() => handleSelect(question)}
                  className="cursor-pointer"
                >
                  {question.title}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
