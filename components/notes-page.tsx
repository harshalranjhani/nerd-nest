'use client';
import React, { useState } from 'react';
import Note from './note';

export interface NotesProps {
  notes: any;
}

const Notes = ({ notes }: NotesProps) => {
  const [notesArray, setNotesArray] = useState(notes);
  return (
    <div>
      {notesArray?.map((note: any) => {
        return <Note key={note.id} note={note} />;
      })}
    </div>
  );
};

export default Notes;
