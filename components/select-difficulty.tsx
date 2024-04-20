import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface DifficultyProps {
    difficulty: string,
    setDifficulty: (difficulty: string) => void
}

export default function Difficulty({difficulty, setDifficulty}: DifficultyProps) {
  return (
    <Select 
    onValueChange={(value) => {
        setDifficulty(value)
    }}
    value={difficulty}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={difficulty} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
