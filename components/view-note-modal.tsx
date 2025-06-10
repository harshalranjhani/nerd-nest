"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "./ui/modal";
import { CalendarIcon, ExternalLinkIcon, LinkIcon } from "lucide-react";
import { Badge } from "./ui/badge";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  data: any;
}

export const NoteViewModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  loading,
  data
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setIsMounted(true);
    // Format date on client side only to avoid hydration mismatch
    if (data?.created_at) {
      const options: Intl.DateTimeFormatOptions = { 
        year: "numeric", 
        month: "long", 
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      };
      setFormattedDate(new Date(data.created_at).toLocaleDateString("en-US", options));
    }
  }, [data?.created_at]);

  // Helper function to safely render HTML content
  const renderContent = (htmlContent: string) => {
    if (!htmlContent) return "No content available";
    
    // Clean up the HTML content
    const cleanedContent = htmlContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ''); // Remove styles
    
    return cleanedContent;
  };

  if (!isMounted) {
    return null;
  }

  if (!data) {
    return null;
  }

  return (
    <Modal
      title={data.title || "Untitled Note"}
      description={data?.questions?.title ? `Linked to: ${data.questions.title}` : "Personal note"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-6 max-w-full">
        {/* Header with metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="w-4 h-4 flex-shrink-0" />
              <span className="break-all">{formattedDate || "Loading..."}</span>
            </div>
            {data?.links && data.links.length > 0 && (
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{data.links.length} links</span>
              </div>
            )}
          </div>
          
          {/* Status badges */}
          <div className="flex gap-2 flex-wrap">
            {data?.questions ? (
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                Question linked
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                Personal note
              </Badge>
            )}
          </div>
        </div>

        {/* Note content */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-foreground">Note Content</h4>
          <div className="max-h-[50vh] overflow-y-auto rounded-md border border-border/50 bg-muted/20 p-4">
            <div 
              className="prose prose-sm dark:prose-invert max-w-none break-words"
              dangerouslySetInnerHTML={{ 
                __html: renderContent(data.description || "") 
              }} 
            />
          </div>
        </div>

        {/* Question info section */}
        {data?.questions && (
          <div className="space-y-3 p-4 bg-muted/30 rounded-md border border-border/50">
            <h4 className="font-medium text-sm text-foreground">Linked Question</h4>
            <p className="text-sm text-muted-foreground break-words">{data.questions.title}</p>
            <div className="flex gap-2 flex-wrap">
              {data.questions.question_link && (
                <a 
                  href={data.questions.question_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    <ExternalLinkIcon className="w-3 h-3 mr-1" />
                    View Question
                  </Button>
                </a>
              )}
              {data.questions.solution_link && (
                <a 
                  href={data.questions.solution_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    <ExternalLinkIcon className="w-3 h-3 mr-1" />
                    View Solution
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Additional links section */}
        {data?.links && data.links.length > 0 && (
          <div className="space-y-3 p-4 bg-muted/30 rounded-md border border-border/50">
            <h4 className="font-medium text-sm text-foreground">Additional Resources</h4>
            <div className="grid gap-2 max-h-48 overflow-y-auto">
              {data.links.map((link: string, index: number) => (
                link && (
                  <a 
                    key={index}
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-md bg-background/50 hover:bg-background transition-colors duration-200 text-sm group min-w-0"
                  >
                    <ExternalLinkIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200 flex-shrink-0" />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200 break-all">
                      {link}
                    </span>
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full items-center justify-end space-x-2 pt-6 border-t border-border/50">
        <Button 
          disabled={loading} 
          variant="default" 
          onClick={onClose}
          className="transition-all duration-200"
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};