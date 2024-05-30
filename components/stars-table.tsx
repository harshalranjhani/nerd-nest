"use client";
import * as React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { IconCheck, IconClose, IconExternalLink } from './ui/icons'
import { Button } from './ui/button'
import { Input } from '@/components/ui/input'
import SendMail from './send-mail'

export interface StarsTableProps {
  questions: any,
  email: string
}

export function StarsTable({ questions, email }: StarsTableProps) {
  const [filterValue, setFilterValue] = React.useState('')
  const [filteredQuestions, setFilteredQuestions] = React.useState(questions)

  React.useEffect(() => {
    setFilteredQuestions(
      questions.filter((question: any) =>
        question.title.toLowerCase().includes(filterValue.toLowerCase()) ||
        question.topic.toLowerCase().includes(filterValue.toLowerCase())
      )
    )
  }, [filterValue, questions])

  return (
    <div className="w-[90vw] md:w-full">
      <div className="my-5 flex flex-col">
        <SendMail questions={questions} email={email} />
      </div>
      <div className="mb-4 flex items-center">
        <Input
          placeholder="Filter by title or topic..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div>
        <Table>
          <TableCaption>A list of your starred questions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Solution</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map((question: any) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium">{question?.title}</TableCell>
                <TableCell>{question?.topic}</TableCell>
                <TableCell
                  className="capitalize"
                  style={{
                    color:
                      question?.difficulty === 'easy'
                        ? 'green'
                        : question?.difficulty === 'medium'
                        ? 'yellow'
                        : 'red'
                  }}
                >
                  {question?.difficulty}
                </TableCell>
                <TableCell>
                  {question?.question_link ? (
                    <a href={question?.question_link} target="_blank">
                      <IconExternalLink />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">!</span>
                  )}
                </TableCell>
                <TableCell>
                  {question?.solution_link ? (
                    <a href={question?.solution_link} target="_blank">
                      <IconExternalLink />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">!</span>
                  )}
                </TableCell>
                <TableCell>
                  {question?.is_solved ? <IconCheck /> : <IconClose />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
