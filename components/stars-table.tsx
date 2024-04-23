import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { IconCheck, IconClose, IconExternalLink } from './ui/icons'

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card'
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal'
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer'
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card'
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal'
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer'
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card'
  }
]

export interface starsTableProps {
  questions: any
}

export function StarsTable({ questions }: starsTableProps) {
  return (
    <div>
      <div className="my-5">
        <span className="text-3xl font-semibold text-primary">
          Questions that you have starred in the past.
        </span>
      </div>
      <div>
        <Table>
          <TableCaption>A list of your starred questions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Solution</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question: any) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium">{question?.title}</TableCell>
                <TableCell>{question?.topic}</TableCell>

                <TableCell
                  className="capitalize"
                  style={{
                    color:
                      question?.difficulty === 'easy'
                        ? 'green'
                        : question?.difficulty === 'medium'
                        ? 'yellow'
                        : 'red'
                  }}
                >
                  {question?.difficulty}
                </TableCell>
                <TableCell>
                  {question?.question_link ? (
                    <a href={question?.question_link} target="_blank">
                      <IconExternalLink />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">!</span>
                  )}
                </TableCell>
                <TableCell>
                  {question?.solution_link ? (
                    <a href={question?.solution_link} target="_blank">
                      <IconExternalLink />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">!</span>
                  )}
                </TableCell>
                <TableCell>
                  {question?.is_solved ? <IconCheck /> : <IconClose />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
