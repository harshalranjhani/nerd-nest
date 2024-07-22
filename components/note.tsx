'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ExternalLinkIcon } from 'lucide-react'
import { Badge } from './ui/badge'

export interface NoteProps {
  note: any
}

export default function Note({ note }: NoteProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div>
            <CardTitle>{note?.title}</CardTitle>
            <CardDescription>{note?.description}</CardDescription>
          </div>
          <div className="mt-2 flex items-center space-x-2 md:mt-0 md:space-x-4">
            {note?.links &&
              note?.links.map((link: string, index: number) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon className="text-gray-600 hover:text-gray-800" />
                </a>
              ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <Button size="sm" variant="secondary" className="mr-2">
              View
            </Button>
            {note?.questions?.question_link && (
              <a
                href={note.questions.question_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="secondary" className="mr-2">
                  Question
                </Button>
              </a>
            )}
            {note?.questions?.solution_link && (
              <a
                href={note?.questions.solution_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-400 text-black"
              >
                <Button size="sm" variant="secondary">
                  Solution
                </Button>
              </a>
            )}
            {!note?.questions?.solution_link && (
              <a
                href={note?.questions?.solution_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge variant="secondary" className="bg-teal-400 text-black">
                  No solution link
                </Badge>
              </a>
            )}
            {!note?.questions?.question_link && (
              <a
                href={note?.questions?.solution_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge variant="secondary" className="bg-teal-400 text-black mx-2">
                  No question referenced
                </Badge>
              </a>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(note?.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
