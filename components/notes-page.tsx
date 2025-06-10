"use client";
import React, { useState, useMemo, useEffect } from "react";
import Note from "./note";

export interface NotesProps {
  notes: any;
}

const Notes = React.memo(({ notes }: NotesProps) => {
  const [notesArray, setNotesArray] = useState(notes);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update notes when props change (after router.refresh())
  useEffect(() => {
    setNotesArray(notes);
  }, [notes]);

  const memoizedNotes = useMemo(() => {
    if (!notesArray || notesArray.length === 0) {
      return (
        <div className={`flex flex-col items-center justify-center py-16 text-center ${isMounted ? 'animate-in fade-in-50 duration-500' : ''}`}>
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 transition-all duration-300 hover:bg-muted/70">
            <svg 
              className="w-8 h-8 text-muted-foreground transition-colors duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No notes yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Start by adding your first note to keep track of your coding journey and important insights.
          </p>
        </div>
      );
    }

    return notesArray?.map((note: any, index: number) => (
      <div
        key={note.id}
        className={isMounted ? "animate-in slide-in-from-bottom-4 fade-in-0 duration-500" : ""}
        style={isMounted ? { 
          animationDelay: `${index * 100}ms`,
          animationFillMode: 'both'
        } : {}}
      >
        <Note note={note} />
      </div>
    ));
  }, [notesArray, isMounted]);

  return (
    <div className="space-y-4">
      {notesArray && notesArray.length > 0 ? (
        <div className={`grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 ${isMounted ? 'animate-in fade-in-0 duration-300' : ''}`}>
          {memoizedNotes}
        </div>
      ) : (
        memoizedNotes
      )}
    </div>
  );
});

Notes.displayName = "Notes";

export default Notes;
