'use client';
import React, { useState, useMemo } from 'react';
import Note from './note';

export interface NotesProps {
  notes: any;
}

const Notes = React.memo(({ notes }: NotesProps) => {
  const [notesArray, setNotesArray] = useState(notes);
  
  const memoizedNotes = useMemo(() => {
    return notesArray?.map((note: any) => (
      <Note key={note.id} note={note} />
    ));
  }, [notesArray]);

  return (
    <div>
      {memoizedNotes}
    </div>
  );
});

Notes.displayName = 'Notes';

export default Notes;
