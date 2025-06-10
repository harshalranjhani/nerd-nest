"use client"

import React from "react"
import { Button } from "./ui/button"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
    
    // Handle chunk loading errors specifically
    if (error.message && error.message.includes('Loading chunk')) {
      console.warn('Chunk loading error detected, attempting reload...')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      return
    }
    
    this.setState({ errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message?.includes('Loading chunk') || 
                          this.state.error?.name === 'ChunkLoadError'
      
      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4 p-4">
          <h2 className="text-2xl font-bold">
            {isChunkError ? 'Loading Error' : 'Something went wrong'}
          </h2>
          <p className="text-muted-foreground text-center max-w-md">
            {isChunkError 
              ? "There was an issue loading the application. This usually happens after an update."
              : (this.state.error?.message || "An unexpected error occurred")
            }
          </p>
          <div className="flex gap-2">
            {isChunkError ? (
              <Button onClick={this.handleReload}>
                Reload Page
              </Button>
            ) : (
              <>
                <Button onClick={this.handleRetry} variant="outline">
                  Try Again
                </Button>
                <Button onClick={this.handleReload}>
                  Reload Page
                </Button>
              </>
            )}
          </div>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="mt-4 p-4 bg-muted rounded-md max-w-2xl w-full">
              <summary className="cursor-pointer font-medium">Error Details</summary>
              <pre className="mt-2 text-sm overflow-auto">
                {this.state.error?.stack}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
} 