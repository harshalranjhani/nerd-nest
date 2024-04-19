'use client'
import React from 'react'
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
import { toast } from 'react-hot-toast'
import { Badge } from './ui/badge'

export interface LeetCodeProps {
  userId: string
  leetcode_username: string
}

const saveUsername = async (username: string, user_id: string) => {
  if (!username) {
    return
  }
  if (username) {
    await fetch('/api/user/saveLeetCodeUsername', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id,
        username
      })
    })
      .then(() => {
        toast.success('Username saved')
      })
      .catch(error => {
        toast.error(error.message)
      })
  }
}

const LeetCode = ({ userId, leetcode_username }: LeetCodeProps) => {
  const [username, setUsername] = React.useState(leetcode_username)
  return (
    <div>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Leetcode username</CardTitle>
          <CardDescription>
            Used for fetching your submissions and problems.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input
              placeholder="username-here"
              onChange={e => {
                setUsername(e.target.value)
              }}
              value={username}
            />
            {leetcode_username && <Badge className='mt-2'>Username saved, change to edit</Badge>}
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              saveUsername(username, userId)
            }
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LeetCode
