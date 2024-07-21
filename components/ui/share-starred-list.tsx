import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import toast from 'react-hot-toast'


export function ShareList({ questions }: any) {
  const [loading, setLoading] = React.useState(false as boolean)
  const [email, setEmail] = React.useState('' as string)
  const sendEmail = async () => {
    setLoading(true)
    const mailObj = {
      questions,
      email
    }
    try {
      const response = await fetch(
        `https://api.harshalranjhani.in/mail/questions-pdf`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mailObj
          })
        }
      )
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-white px-3 hover:bg-white my-5 text-black">
          Share the list
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share list</DialogTitle>
          <DialogDescription>
            Enter the email address to share the list with. They will receive
            the list in their inbox as a PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input onChange={(e)=>{setEmail(e.target.value)}} id="email" placeholder="mail@harshalranjhani.in" />
          </div>
          <Button
            className="bg-teal-400 px-3 hover:bg-teal-500"
            onClick={sendEmail}
            size="sm"
          >
            <span className="sr-only">Send</span>
            {loading ? <DotsHorizontalIcon className="h-4 w-4" /> : <PaperPlaneIcon className="h-4 w-4" />}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
