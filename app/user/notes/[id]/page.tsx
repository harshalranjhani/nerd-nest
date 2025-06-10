import Link from "next/link";
import { CircleUser, Menu, Package2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { redirect } from "next/dist/server/api-utils";
import Note from "@/components/note";
import Notes from "@/components/notes-page";
import AddNote from "@/components/new-note-dialog";
import { getNotes } from "@/app/actions";
import { ErrorBoundary } from "@/components/error-boundary";
import { Loading } from "@/components/loading";
import { Suspense } from "react";
import { getUserDetails } from "../../settings/[id]/page";

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function Dashboard({ params }: ChatPageProps): Promise<any> {
  const cookieStore = cookies();
  const session = await auth({ cookieStore });

  if (params.id !== session?.user?.id) {
    return null;
  }

  const dataReceived = await getUserDetails(params.id);
  
  if (!dataReceived || dataReceived.error) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold">
          {dataReceived?.error || "Something went wrong"}
        </h1>
      </div>
    );
  }

  if (!dataReceived.userData || dataReceived.userData.length === 0) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold">User not found</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-6 bg-muted/40 p-4 md:gap-8 md:p-6">
        <div className="mx-auto grid w-full max-w-7xl gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-7xl items-start gap-6 md:grid-cols-[200px_1fr] lg:grid-cols-[280px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground sticky top-4">
            <Link href={`/user/settings/${session?.user?.id}`} className="transition-colors hover:text-foreground">General</Link>
            <Link href={`/user/progress/${session?.user?.id}`} className="transition-colors hover:text-foreground">Progress</Link>
            <Link href={`/user/questions/${session?.user?.id}`} className="transition-colors hover:text-foreground">Custom</Link>
            <Link href={`/user/stars/${session?.user?.id}`} className="transition-colors hover:text-foreground">Stars</Link>
            <Link href="#" className="font-semibold text-primary">
              Notes
            </Link>
          </nav>
          <div className="grid gap-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">Your Notes</h2>
                <p className="text-muted-foreground">Manage and organize your coding notes</p>
              </div>
              <AddNote buttonTitle="Add Note" userId={session?.user?.id} />
            </div>
            <ErrorBoundary>
              <Suspense fallback={<NotesLoadingSkeleton />}>
                <NotesWrapper userId={params.id} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </main>
    </div>
  );
}

async function NotesWrapper({ userId }: { userId: string }) {
  const notes = await getNotes(userId);
  return <Notes notes={notes} />;
}

function NotesLoadingSkeleton() {
  return (
    <div className="grid gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2 mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-2/3 mt-2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
