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

const NoQuestions = ({ userId }: LeetCodeProps) => {
  return (
    <div>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>No Questions added so far.</CardTitle>
          <CardDescription>
            Add your own custom questions to further track your progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
            This will require you to add the question manually, where you can add the question title, description, and the solution.
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <NewQuestion userId={userId} buttonTitle='Add One Now!' />
        </CardFooter>
      </Card>
    </div>
  )
}

export default NoQuestions
