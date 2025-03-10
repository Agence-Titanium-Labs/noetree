import { Note } from "@/types/note";
import { useState, useRef, useEffect } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "./ui/context-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "./ui/alert-dialog";
import ConditionChecker from "./helpers/ConditionChecker";

interface NoteTreeProps {
  tree: Note;
  selectedNote: Note;
  onSelectNote: (note: Note) => void;
  onUpdateNoteTitle: (noteId: number, newTitle: string) => void;
  onAddChildNote: (parentId: number, newNote: Note) => void;
  onDeleteNote: (noteId: number) => void;
}

export default function NotesTree({
  tree,
  selectedNote,
  onSelectNote,
  onUpdateNoteTitle,
  onAddChildNote,
  onDeleteNote
}: Readonly<NoteTreeProps>) {
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [renamingNoteId, setRenamingNoteId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [pendingFocusNoteId, setPendingFocusNoteId] = useState<number | null>(
    null
  );

  const addNoteInputRef = useRef<HTMLInputElement>(null);

  // Add this effect to handle focus when the menu closes
  useEffect(() => {
    if (pendingFocusNoteId !== null && editingNoteId === pendingFocusNoteId) {
      // Focus the input after the component has been fully rendered
      setTimeout(() => {
        if (addNoteInputRef.current) {
          addNoteInputRef.current.focus();
        }
      }, 0);
      setPendingFocusNoteId(null);
    }
  }, [editingNoteId, pendingFocusNoteId]);

  const addChildNote = (note: Note) => {
    if (newNoteTitle.trim() === "") return;

    const newNote = { id: Date.now(), title: newNoteTitle, content: "" };
    onAddChildNote(note.id, newNote);
    setNewNoteTitle("");
    setEditingNoteId(null);
  };

  const handleStartAddingNote = (noteId: number) => {
    setEditingNoteId(noteId);
    setPendingFocusNoteId(noteId);
    setNewNoteTitle("");
  };

  const handleStartRenamingNote = (note: Note) => {
    setRenamingNoteId(note.id);
    setEditedTitle(note.title);
  };

  const saveRenamedNote = (note: Note) => {
    if (editedTitle.trim() === "") return;
    onUpdateNoteTitle(note.id, editedTitle);
    setRenamingNoteId(null);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    note: Note
  ) => {
    if (e.key === "Enter") {
      addChildNote(note);
    }
    if (e.key === "Escape") {
      setEditingNoteId(null);
    }
  };

  const handleRenameKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    note: Note
  ) => {
    if (e.key === "Enter") {
      saveRenamedNote(note);
    }
    if (e.key === "Escape") {
      setRenamingNoteId(null);
    }
  };

  const renderNote = (note: Note) => {
    return (
      <>
        <ConditionChecker condition={renamingNoteId === note.id}>
          <Input
            type="text"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onKeyDown={e => handleRenameKeyDown(e, note)}
            onBlur={() => saveRenamedNote(note)}
            autoFocus
          />
        </ConditionChecker>

        <ConditionChecker condition={renamingNoteId !== note.id}>
          <ContextMenu>
            <ContextMenuTrigger>
              <Button
                type="button"
                variant={selectedNote.id === note.id ? "default" : "secondary"}
                onClick={() => onSelectNote(note)}
                onDoubleClick={() => handleStartRenamingNote(note)}
              >
                {note.title}
              </Button>
            </ContextMenuTrigger>
            <ContextMenuContent
              onFocusOutside={e => e.preventDefault()}
              onCloseAutoFocus={event => {
                event.preventDefault();
              }}
            >
              <ContextMenuItem onClick={() => handleStartAddingNote(note.id)}>
                Add a child note
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleStartRenamingNote(note)}>
                Rename
              </ContextMenuItem>
              <ConditionChecker condition={note.id !== tree.id}>
                <ContextMenuItem
                  variant="destructive"
                  onClick={() => setNoteToDelete(note.id)}
                >
                  Delete
                </ContextMenuItem>
              </ConditionChecker>
            </ContextMenuContent>
          </ContextMenu>
        </ConditionChecker>

        <ul className="flex flex-col items-start gap-4 mt-4 border-l-2 border-gray-200 pl-6">
          {note.childNotes?.map(childNote => (
            <li key={childNote.id}>{renderNote(childNote)}</li>
          ))}
          <li>
            <ConditionChecker condition={editingNoteId === note.id}>
              <Input
                ref={addNoteInputRef}
                type="text"
                value={newNoteTitle}
                onChange={e => setNewNoteTitle(e.target.value)}
                onKeyDown={e => handleKeyDown(e, note)}
                onBlur={() => setEditingNoteId(null)}
                placeholder="Note title"
                autoFocus
              />
            </ConditionChecker>

            <ConditionChecker condition={editingNoteId !== note.id}>
              <Button
                variant="outline"
                onClick={() => handleStartAddingNote(note.id)}
              >
                Add child note
              </Button>
            </ConditionChecker>
          </li>
        </ul>
      </>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Notes tree</h2>
      {renderNote(tree)}

      <AlertDialog
        open={noteToDelete !== null}
        onOpenChange={open => !open && setNoteToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              note and all of its child notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNoteToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (noteToDelete) {
                  onDeleteNote(noteToDelete);
                  setNoteToDelete(null);
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
