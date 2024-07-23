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
import { useState } from 'react'
import { NoteViewModal } from './view-note-modal'

export interface NoteProps {
  note: any
}

export default function Note({ note }: NoteProps) {
  const [viewNoteModal, setViewNoteModal] = useState(false as boolean)
  const [viewNoteModalLoading, setViewNoteModalLoading] = useState(
    false as boolean
  )

  return (
    <>
      <NoteViewModal
        loading={viewNoteModalLoading}
        onClose={() => {
          setViewNoteModal(false)
        }}
        isOpen={viewNoteModal}
        data={note}
      />
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div>
              <CardTitle>{note?.title}</CardTitle>
              <CardDescription>{note?.questions?.title || "No question referenced."}</CardDescription>
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
              <Button
                size="sm"
                variant="secondary"
                className="mr-2"
                onClick={() => {
                  setViewNoteModal(true)
                }}
              >
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
                  <Badge
                    variant="secondary"
                    className="mx-2 bg-teal-400 text-black"
                  >
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
    </>
  )
}
