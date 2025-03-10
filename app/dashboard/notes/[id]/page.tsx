"use client";

import { useState } from "react";
import NoteTree from "@/components/NotesTree";
import NoteContent from "@/components/NoteContent";
import ResizablePanel from "@/components/ResizablePanel";
import { sampleTree } from "@/data/sampleTree";
import { Note } from "@/types/note";

export default function NotePage() {
  const [tree, setTree] = useState<Note>(sampleTree);
  const [selectedNote, setSelectedNote] = useState<Note>(tree);

  const addChildNote = (parentId: number, newNote: Note) => {
    const parentNote = traverseTree(tree, note => note.id === parentId);
    if (parentNote) {
      parentNote.childNotes = [...(parentNote.childNotes || []), newNote];
      setTree({ ...tree });
      setSelectedNote(newNote);
    }
  };

  const updateNoteTitle = (noteId: number, newTitle: string) => {
    const note = traverseTree(tree, note => note.id === noteId);
    if (note) {
      note.title = newTitle;
      setTree({ ...tree });
    }
  };

  const deleteNote = (noteId: number) => {
    const note = traverseTree(tree, note => note.id === noteId);
    if (!note || noteId === tree.id) return;
    const parentNote = traverseTree(
      tree,
      note => note.childNotes?.some(child => child.id === noteId) ?? false
    );
    if (parentNote) {
      parentNote.childNotes = parentNote.childNotes?.filter(
        child => child.id !== noteId
      );
      setTree({ ...tree });
      setSelectedNote(parentNote);
    }
  };

  const traverseTree = (
    note: Note,
    callback: (note: Note) => boolean
  ): Note | undefined => {
    if (callback(note)) return note;
    if (note.childNotes) {
      for (const child of note.childNotes) {
        const found = traverseTree(child, callback);
        if (found) return found;
      }
    }
  };

  return (
    <ResizablePanel
      leftPanel={
        <NoteTree
          tree={tree}
          selectedNote={selectedNote}
          onSelectNote={setSelectedNote}
          onUpdateNoteTitle={updateNoteTitle}
          onAddChildNote={addChildNote}
          onDeleteNote={deleteNote}
        />
      }
      rightPanel={<NoteContent note={selectedNote} />}
      cookieKey="notePagePanelWidth"
    />
  );
}
