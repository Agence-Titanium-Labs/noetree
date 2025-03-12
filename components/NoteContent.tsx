"use client";

import { Note } from "@/types/note";
import EditorToolbar from "./editor/EditorToolbar";
import { useEffect } from "react";
import { EditorContent } from "@tiptap/react";
import ConditionChecker from "./helpers/ConditionChecker";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEditorContext } from "@/providers/EditorProvider";

interface NoteContentProps {
  note: Note;
}

export default function NoteContent({ note }: Readonly<NoteContentProps>) {
  const {
    editor,
    isLoading,
    isSaving,
    saveStatus,
    hasUnsavedChanges,
    loadNoteContent
  } = useEditorContext();

  useEffect(() => {
    loadNoteContent(note.id);
  }, [note.id, loadNoteContent]);

  return (
    <div className="min-h-full flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">{note.title}</h2>
        <div className="flex items-center gap-2">
          <ConditionChecker condition={saveStatus === "error"}>
            <div className="flex items-center text-destructive gap-1">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Save failed</span>
            </div>
          </ConditionChecker>
          <ConditionChecker condition={saveStatus === "success"}>
            <div className="flex items-center text-green-600 gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Saved</span>
            </div>
          </ConditionChecker>
          <ConditionChecker condition={isSaving}>
            <span className="text-sm text-gray-500 animate-pulse">
              Saving...
            </span>
          </ConditionChecker>
          <ConditionChecker
            condition={hasUnsavedChanges && !isSaving && saveStatus === "idle"}
          >
            <span className="text-sm text-amber-500">Unsaved changes</span>
          </ConditionChecker>
        </div>
      </div>
      <div className="grow flex flex-col gap-4">
        <div className="flex flex-col gap-2 grow">
          <EditorToolbar />
          <ConditionChecker condition={isLoading}>
            <div className="flex-1 p-4 flex flex-col gap-4 border rounded-md">
              <div className="w-56 h-8 mt-4 bg-gray-100 rounded-sm animate-pulse"></div>
              <div className="flex flex-col gap-2">
                <div className="w-64 h-4 bg-gray-100 rounded-sm animate-pulse"></div>
                <div className="w-48 h-4 bg-gray-100 rounded-sm animate-pulse"></div>
              </div>
            </div>
          </ConditionChecker>
          <ConditionChecker condition={!isLoading}>
            <EditorContent editor={editor} />
          </ConditionChecker>
        </div>
      </div>
    </div>
  );
}
