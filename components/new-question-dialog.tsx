import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from './ui/select'
import Difficulty from './select-difficulty'

export default function NewQuestion() {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add One Now!</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Question</DialogTitle>
            <DialogDescription>
              Add a new question to further track your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Bubble Sort"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic" className="text-right">
                Topic
              </Label>
              <Input
                id="topic"
                placeholder="Sorting Algorithms"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="question_link" className="text-right">
                Question Link
              </Label>
              <Input
                type="url"
                id="question_link"
                placeholder="https://leetcode.com/problems/sort-an-array/"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="topic" className="text-right">
            Difficulty
              </Label>
            <Difficulty />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="solution_link" className="text-right">
                Solution / Resource Link
              </Label>
              <Input
                type="url"
                id="solution_link"
                placeholder='https://leetcode.com/problems/sort-an-array/solution/'
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
