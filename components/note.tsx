"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLinkIcon, CalendarIcon, LinkIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { NoteViewModal } from "./view-note-modal";

export interface NoteProps {
  note: any;
}

export default function Note({ note }: NoteProps) {
  const [viewNoteModal, setViewNoteModal] = useState(false as boolean);
  const [viewNoteModalLoading, setViewNoteModalLoading] = useState(false as boolean);
  const [isMounted, setIsMounted] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setIsMounted(true);
    // Format date on client side only to avoid hydration mismatch
    if (note?.created_at) {
      const options: Intl.DateTimeFormatOptions = { 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      };
      setFormattedDate(new Date(note.created_at).toLocaleDateString("en-US", options));
    }
  }, [note?.created_at]);

  const truncateText = (text: string, maxLength: number = 120) => {
    if (!text) return "No content available";
    // Remove HTML tags and extra whitespace more thoroughly
    const cleanText = text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, ' ') // Remove HTML entities
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + "...";
  };

  // Render minimal content during hydration
  if (!isMounted) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold leading-tight truncate">
            {note?.title || "Untitled Note"}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1 truncate">
            {note?.questions?.title ? note.questions.title : "Personal note"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <Button 
              size="sm" 
              variant="default" 
              className="h-7 text-xs bg-primary/90 hover:bg-primary"
            >
              View Details
            </Button>
            <div className="text-xs text-muted-foreground">
              Loading...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't render if note data is missing
  if (!note) {
    return null;
  }

  return (
    <>
      <NoteViewModal
        loading={viewNoteModalLoading}
        onClose={() => {
          setViewNoteModal(false);
        }}
        isOpen={viewNoteModal}
        data={note}
      />
      <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20 cursor-pointer bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle 
                  className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors duration-200 break-words hyphens-auto" 
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                >
                  {note?.title || "Untitled Note"}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1 truncate">
                  {note?.questions?.title ? (
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0"></span>
                      <span className="truncate">{note.questions.title}</span>
                    </span>
                  ) : (
                    "Personal note"
                  )}
                </CardDescription>
              </div>
              {note?.links && note.links.length > 0 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{note.links.length}</span>
                </div>
              )}
            </div>
            
            {/* Preview of note content */}
            <div className="text-sm text-muted-foreground/80 bg-muted/30 rounded-md p-3 border border-muted/50">
              <div 
                className="break-words overflow-hidden hyphens-auto" 
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {truncateText(note?.description || "")}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
              <Button 
                size="sm" 
                variant="default" 
                className="h-7 text-xs bg-primary/90 hover:bg-primary transition-colors duration-200 flex-shrink-0" 
                onClick={(e) => {
                  e.stopPropagation();
                  setViewNoteModal(true);
                }}
              >
                View Details
              </Button>
              
              {note?.questions?.question_link && (
                <a 
                  href={note.questions.question_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button size="sm" variant="outline" className="h-7 text-xs hover:bg-muted/50 transition-colors duration-200 flex-shrink-0">
                    <ExternalLinkIcon className="w-3 h-3 mr-1" />
                    Question
                  </Button>
                </a>
              )}
              
              {note?.questions?.solution_link && (
                <a 
                  href={note.questions.solution_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button size="sm" variant="outline" className="h-7 text-xs hover:bg-muted/50 transition-colors duration-200 flex-shrink-0">
                    <ExternalLinkIcon className="w-3 h-3 mr-1" />
                    Solution
                  </Button>
                </a>
              )}
              
              {/* Additional links - show only first 2 to avoid overflow */}
              {note?.links && note.links.slice(0, 2).map((link: string, index: number) => (
                link && (
                  <a 
                    key={index} 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button size="sm" variant="outline" className="h-7 text-xs hover:bg-muted/50 transition-colors duration-200 flex-shrink-0">
                      <ExternalLinkIcon className="w-3 h-3 mr-1" />
                      Link {index + 1}
                    </Button>
                  </a>
                )
              ))}
              
              {/* Show count if more than 2 links */}
              {note?.links && note.links.length > 2 && (
                <Badge variant="secondary" className="h-7 text-xs flex-shrink-0">
                  +{note.links.length - 2} more
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-shrink-0">
              <CalendarIcon className="w-3 h-3" />
              <span className="whitespace-nowrap">{formattedDate || "Loading..."}</span>
            </div>
          </div>
          
          {/* Status badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {!note?.questions?.solution_link && note?.questions?.question_link && (
              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                No solution link
              </Badge>
            )}
            {!note?.questions?.question_link && note?.questions && (
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs">
                No question link
              </Badge>
            )}
            {!note?.questions && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                Personal note
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
