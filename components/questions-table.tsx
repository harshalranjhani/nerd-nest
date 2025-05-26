"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { IconCheck, IconClose, IconEdit, IconExternalLink } from "./ui/icons"
import EditQuestion from "./edit-question-dialog"
import toast from "react-hot-toast"
import { DialogTrigger } from "@radix-ui/react-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@radix-ui/react-dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { RemoveQuestion } from "./remove-question-dialog"

export type Question = {
  id: string
  created_at: string
  title: string
  topic: string
  question_link?: string
  starred: boolean
  user: string
  difficulty: string
  solution_link?: string
  is_solved: boolean
}

const starQuestion = async (
  user_id: string,
  question_id: string,
  is_starred: boolean
) => {
  try {
    const response = await fetch("/api/user/starQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id,
        question_id,
        is_starred
      })
    })
    if (!response.ok) {
      throw new Error("Failed to star question")
    }
    const data = await response.json()
    window.location.reload()
    toast.success(is_starred ? "Question starred!" : "Question unstarred!")
  } catch (e: any) {
    toast.error(e.message)
  }
}

export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>
  },
  {
    accessorKey: "topic",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Topic
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("topic")}</div>
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficultyVal = row.getValue("difficulty")
      return (
        <div
          className="capitalize"
          style={{
            color:
              difficultyVal === "easy"
                ? "green"
                : difficultyVal === "medium"
                ? "yellow"
                : "red"
          }}
        >
          {row.getValue("difficulty")}
        </div>
      )
    }
  },
  {
    accessorKey: "question_link",
    header: "Question",
    cell: ({ row }) => {
      return row.getValue("question_link") ? (
        <a href={row.getValue("question_link")} target="_blank">
          <IconExternalLink />
        </a>
      ) : (
        <span className="text-muted-foreground">!</span>
      )
    }
  },
  {
    accessorKey: "solution_link",
    header: "Solution",
    cell: ({ row }) => {
      return row.getValue("solution_link") ? (
        <a href={row.getValue("solution_link")} target="_blank">
          <IconExternalLink />
        </a>
      ) : (
        <span className="text-muted-foreground">!</span>
      )
    }
  },
  {
    accessorKey: "is_solved",
    header: "Status",
    cell: ({ row }) => {
      return row.getValue("is_solved") ? <IconCheck /> : <IconClose />
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const question = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Button
                variant="outline"
                className="w-[100%]"
                onClick={() => {
                  starQuestion(
                    question.user,
                    question.id,
                    question.starred ? false : true
                  )
                }}
              >
                {question.starred ? "Unstar" : "Star"}
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <EditQuestion question={question} buttonTitle="Edit" />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div
                onClick={e => {
                  e.stopPropagation()
                }}
              >
                <RemoveQuestion
                  user_id={question.user}
                  question_id={question.id}
                />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

export interface QuestionsTableProps {
  questions: Question[]
}

export default function QuestionsTable({
  questions: data
}: QuestionsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    globalFilterFn: (row, columnId, filterValue) => {
      return (
        row.original.title.toLowerCase().includes(filterValue.toLowerCase()) ||
        row.original.topic.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
  })

  return (
    <div className="w-[90vw] md:w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by title or topic..."
          value={table.getState().globalFilter ?? ""}
          onChange={event => {
            table.setGlobalFilter(event.target.value)
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
