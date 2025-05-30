import { UseChatHelpers } from "ai/react"

import { Button } from "@/components/ui/button"
import { ExternalLink } from "@/components/external-link"
import { IconArrowRight } from "@/components/ui/icons"

const exampleMessages = [
  {
    heading: "Help with a question",
    message: `I need help with the following question: \n`
  },
  {
    heading: "Explain a concept",
    message: "Can you explain the concept of "
  },
  {
    heading: "Syntax help",
    message: `I"m having trouble with the syntax for \n`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, "setInput">) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to Nerd Nest!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          This is an AI chatbot that can help you with your placement tests and other questions.
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
