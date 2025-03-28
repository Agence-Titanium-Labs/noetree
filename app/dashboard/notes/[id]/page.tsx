"use client";

import { useState, useCallback } from "react";
import NoteTree from "@/components/NotesTree";
import NoteContent from "@/components/NoteContent";
import { sampleTree } from "@/data/sampleTree";
import { Note } from "@/types/note";
import { EditorProvider } from "@/providers/EditorProvider";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";

// Helper functions moved outside the component to prevent recreation on each render
const findNoteById = (tree: Note, id: number): Note | undefined => {
  if (tree.id === id) return tree;
  if (!tree.childNotes) return undefined;

  for (const child of tree.childNotes) {
    const found = findNoteById(child, id);
    if (found) return found;
  }

  return undefined;
};

const findParentNote = (tree: Note, childId: number): Note | undefined => {
  if (!tree.childNotes) return undefined;

  if (tree.childNotes.some(child => child.id === childId)) {
    return tree;
  }

  for (const child of tree.childNotes) {
    const found = findParentNote(child, childId);
    if (found) return found;
  }

  return undefined;
};

// Clone the tree to avoid mutating the original
const cloneTree = (tree: Note): Note => {
  return JSON.parse(JSON.stringify(tree));
};

export default function NotePage() {
  const [tree, setTree] = useState<Note>(sampleTree);
  const [selectedNote, setSelectedNote] = useState<Note>(tree);

  const addChildNote = useCallback((parentId: number, newNote: Note) => {
    setTree(currentTree => {
      const updatedTree = cloneTree(currentTree);
      const parentNote = findNoteById(updatedTree, parentId);

      if (parentNote) {
        parentNote.childNotes = [...(parentNote.childNotes || []), newNote];
        setSelectedNote(newNote);
      }

      return updatedTree;
    });
  }, []);

  const updateNoteTitle = useCallback(
    (noteId: number, newTitle: string) => {
      setTree(currentTree => {
        const updatedTree = cloneTree(currentTree);
        const note = findNoteById(updatedTree, noteId);

        if (note) {
          note.title = newTitle;
          // If we're updating the selected note, update that reference too
          if (selectedNote.id === noteId) {
            setSelectedNote({ ...note });
          }
        }

        return updatedTree;
      });
    },
    [selectedNote.id]
  );

  const deleteNote = useCallback(
    (noteId: number) => {
      if (noteId === tree.id) return; // Don't delete root

      setTree(currentTree => {
        const updatedTree = cloneTree(currentTree);
        const parentNote = findParentNote(updatedTree, noteId);

        if (parentNote) {
          parentNote.childNotes = parentNote.childNotes?.filter(
            child => child.id !== noteId
          );

          // Update selected note if the deleted note was selected
          if (selectedNote.id === noteId) {
            setSelectedNote(parentNote);
          }
        }

        return updatedTree;
      });
    },
    [selectedNote.id, tree.id]
  );

  return (
    <EditorProvider>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={40}
          minSize={20}
          className="p-4 !overflow-y-auto"
        >
          <NoteTree
            tree={tree}
            selectedNote={selectedNote}
            onSelectNote={setSelectedNote}
            onUpdateNoteTitle={updateNoteTitle}
            onAddChildNote={addChildNote}
            onDeleteNote={deleteNote}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={60}
          minSize={40}
          className="p-4 !overflow-y-auto"
        >
          <NoteContent note={selectedNote} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </EditorProvider>
  );
}
