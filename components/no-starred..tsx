'use client'
import React, { useEffect } from 'react'
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
import { Badge } from './ui/badge'
import NewQuestion from './new-question-dialog'

export interface LeetCodeProps {
  userId: string
}

const NoStarred = ({ userId }: LeetCodeProps) => {
  return (
    <div>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>No Questions starred so far.</CardTitle>
          <CardDescription>
            Head over to the questions page to star your favorite questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
            This will help you keep track of the questions you find interesting. You can star a question by clicking on the star action on the question row.
        </CardContent>
        {/* <CardFooter className="border-t px-6 py-4">
          <NewQuestion userId={userId} buttonTitle='Add One Now!' />
        </CardFooter> */}
      </Card>
    </div>
  )
}

export default NoStarred
