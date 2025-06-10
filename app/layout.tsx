import { Metadata } from "next"

import { Toaster } from "../components/ui/toaster"

import "@/app/globals.css"
import { fontMono } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { Providers } from "@/components/providers"
import { Header } from "@/components/header"
import { Toaster as HotToaster } from "react-hot-toast"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata: Metadata = {
  title: {
    default: "Nerd Nest",
    template: `%s - Nerd Nest`
  },
  description: "Ask Questions, Track Progress and Evolve!",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle chunk loading errors
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('Loading chunk')) {
                  console.warn('Chunk loading error detected, reloading page...');
                  window.location.reload();
                }
              });
              
              // Handle unhandled promise rejections (like ChunkLoadError)
              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.name === 'ChunkLoadError') {
                  console.warn('ChunkLoadError detected, reloading page...');
                  e.preventDefault();
                  window.location.reload();
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "font-sans antialiased",
          // fontSans.variable,
          fontMono.variable
        )}
      >
        <Toaster />
        <HotToaster />
        <ErrorBoundary>
          <Providers attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen flex-col">
              {/* @ts-ignore */}
              <Header />
              <main className="flex flex-1 flex-col bg-muted/50">{children}</main>
            </div>
            <TailwindIndicator />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
