"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  MagnifyingGlassIcon,
  StarIcon,
  StarFilledIcon
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
import { Badge } from "@/components/ui/badge"
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
import { useRouter } from "next/navigation"

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
    window.location.reload();
    toast.success(is_starred ? "Question starred!" : "Question unstarred!")
  } catch (e: any) {
    toast.error(e.message)
  }
}

export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: "starred",
    header: "",
    cell: ({ row }) => {
      const question = row.original
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-transparent"
          onClick={() => {
            starQuestion(
              question.user,
              question.id,
              !question.starred
            )
          }}
        >
          {question.starred ? (
            <StarFilledIcon className="h-4 w-4 text-yellow-500" />
          ) : (
            <StarIcon className="h-4 w-4 text-muted-foreground hover:text-yellow-500" />
          )}
        </Button>
      )
    }
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    )
  },
  {
    accessorKey: "topic",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 text-left"
        >
          Topic
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal">
        {row.getValue("topic")}
      </Badge>
    )
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficultyVal = row.getValue("difficulty") as string
      const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
          case "easy":
            return "bg-green-500/10 text-green-500 border-green-500/20"
          case "medium":
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
          case "hard":
            return "bg-red-500/10 text-red-500 border-red-500/20"
          default:
            return "bg-gray-500/10 text-gray-500 border-gray-500/20"
        }
      }
      
      return (
        <Badge className={`capitalize ${getDifficultyColor(difficultyVal)}`}>
          {difficultyVal}
        </Badge>
      )
    }
  },
  {
    accessorKey: "question_link",
    header: "Question",
    cell: ({ row }) => {
      return row.getValue("question_link") ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          asChild
        >
          <a href={row.getValue("question_link")} target="_blank" rel="noopener noreferrer">
            <IconExternalLink className="h-4 w-4" />
          </a>
        </Button>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    }
  },
  {
    accessorKey: "solution_link",
    header: "Solution",
    cell: ({ row }) => {
      return row.getValue("solution_link") ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          asChild
        >
          <a href={row.getValue("solution_link")} target="_blank" rel="noopener noreferrer">
            <IconExternalLink className="h-4 w-4" />
          </a>
        </Button>
      ) : (
        <span className="text-muted-foreground">—</span>
      )
    }
  },
  {
    accessorKey: "is_solved",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.getValue("is_solved") ? "default" : "secondary"}
          className={
            row.getValue("is_solved")
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-gray-500/10 text-gray-500 border-gray-500/20"
          }
        >
          {row.getValue("is_solved") ? "Solved" : "Unsolved"}
        </Badge>
      )
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Button
                variant="ghost"
                className="w-full justify-start h-8 px-2"
                onClick={() => {
                  starQuestion(
                    question.user,
                    question.id,
                    question.starred ? false : true
                  )
                }}
              >
                {question.starred ? (
                  <>
                    <StarIcon className="mr-2 h-4 w-4" />
                    Unstar
                  </>
                ) : (
                  <>
                    <StarFilledIcon className="mr-2 h-4 w-4" />
                    Star
                  </>
                )}
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <EditQuestion question={question} buttonTitle="Edit" />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  
  // Filter states
  const [difficultyFilter, setDifficultyFilter] = React.useState<string[]>([])
  const [statusFilter, setStatusFilter] = React.useState<string>("")
  const [starredFilter, setStarredFilter] = React.useState<string>("")

  // Filter the data based on all our filters
  const filteredData = React.useMemo(() => {
    return data.filter((question) => {
      // Apply global search
      const globalMatch = globalFilter === "" || 
        question.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
        question.topic.toLowerCase().includes(globalFilter.toLowerCase())
      
      // Apply difficulty filter
      const difficultyMatch = difficultyFilter.length === 0 || 
        difficultyFilter.includes(question.difficulty)
      
      // Apply status filter
      const statusMatch = statusFilter === "" || 
        (statusFilter === "solved" && question.is_solved) ||
        (statusFilter === "unsolved" && !question.is_solved)
      
      // Apply starred filter
      const starredMatch = starredFilter === "" ||
        (starredFilter === "starred" && question.starred) ||
        (starredFilter === "unstarred" && !question.starred)
      
      return globalMatch && difficultyMatch && statusMatch && starredMatch
    })
  }, [data, globalFilter, difficultyFilter, statusFilter, starredFilter])

  const table = useReactTable({
    data: filteredData,
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
    }
  })

  const clearAllFilters = () => {
    setGlobalFilter("")
    setDifficultyFilter([])
    setStatusFilter("")
    setStarredFilter("")
  }

  const hasActiveFilters = globalFilter !== "" || difficultyFilter.length > 0 || statusFilter !== "" || starredFilter !== ""

  return (
    <div className="w-[90vw] md:w-full space-y-4">
      {/* Enhanced Filter Section */}
      <div className="flex flex-col space-y-4 bg-card/50 p-4 rounded-lg border border-border/50">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions by title or topic..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-10 bg-background/50 border-border/50 focus:border-border"
            />
          </div>
          
          {/* Difficulty Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[120px] justify-between bg-background/50 border-border/50">
                Difficulty
                {difficultyFilter.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {difficultyFilter.length}
                  </Badge>
                )}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Select Difficulty</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["easy", "medium", "hard"].map((difficulty) => (
                <DropdownMenuCheckboxItem
                  key={difficulty}
                  className="capitalize"
                  checked={difficultyFilter.includes(difficulty)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setDifficultyFilter([...difficultyFilter, difficulty])
                    } else {
                      setDifficultyFilter(difficultyFilter.filter(d => d !== difficulty))
                    }
                  }}
                >
                  {difficulty}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[100px] justify-between bg-background/50 border-border/50">
                Status
                {statusFilter && (
                  <Badge variant="secondary" className="ml-2 h-2 w-2 rounded-full p-0" />
                )}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("solved")}>
                Solved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("unsolved")}>
                Unsolved
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Starred Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[100px] justify-between bg-background/50 border-border/50">
                Starred
                {starredFilter && (
                  <Badge variant="secondary" className="ml-2 h-2 w-2 rounded-full p-0" />
                )}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Stars</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStarredFilter("")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStarredFilter("starred")}>
                Starred
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStarredFilter("unstarred")}>
                Unstarred
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filter Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                className="h-8 px-2 lg:px-3 text-sm"
              >
                Clear filters
              </Button>
            )}
                         <div className="text-sm text-muted-foreground">
               {filteredData.length} of {data.length} questions
             </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto bg-background/50 border-border/50">
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
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/50 border-border/50">
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className="text-muted-foreground font-medium">
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
                  className="hover:bg-muted/30 border-border/50 transition-colors"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="py-3">
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
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-background/50 border-border/50"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-background/50 border-border/50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
