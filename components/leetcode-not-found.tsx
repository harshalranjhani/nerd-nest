"use client"
import React, { useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

export interface LeetCodeProps {
  userId: string
}

const LeetCodeNotFound = ({ userId }: LeetCodeProps) => {
  return (
    <div>
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Leetcode details not found.</CardTitle>
          <CardDescription>
            Kindly check your leetcode username.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Button
            className="w-full bg-teal-400 hover:bg-teal-500"
            onClick={()=>{
                window.location.reload()
            }}
          >
            Refresh
          </Button>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            className="w-full"
            onClick={() => {
              window.location.href = `/user/settings/${userId}`
            }}
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LeetCodeNotFound
