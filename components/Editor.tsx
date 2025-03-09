"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useCallback, useState } from "react";
import EditorToolbar from "./editor/EditorToolbar";
import { useDebouncedCallback } from "use-debounce";
import { fetchNoteContent, saveNoteContent } from "@/lib/api/notes";

interface EditorProps {
  noteId: number;
}

export default function Editor({ noteId }: Readonly<EditorProps>) {
  const [isLoading, setIsLoading] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something…",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full rounded-md",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert focus:outline-none max-w-none p-4",
      },
    },
    immediatelyRender: false,
  });

  // Debounced auto-save
  const debouncedSave = useDebouncedCallback((content: string) => {
    saveNoteContent(noteId, content);
  }, 1000);

  // Handle content change and auto-save
  const handleUpdate = useCallback(() => {
    const content = editor?.getHTML();
    if (content) {
      debouncedSave(content);
    }
  }, [editor, debouncedSave]);

  // Load note content when noteId changes
  useEffect(() => {
    if (!editor || !noteId) return;

    setIsLoading(true);

    const loadContent = async () => {
      try {
        const content = await fetchNoteContent(noteId);
        editor.commands.setContent(content);
      } catch (error) {
        console.error("Failed to load note content", error);
        editor.commands.setContent("");
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();

    // Setup update listener
    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, noteId, handleUpdate]);

  return (
    <div className="flex flex-col gap-2 grow">
      <EditorToolbar editor={editor} />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="animate-pulse">Loading note content...</span>
        </div>
      ) : (
        <EditorContent
          editor={editor}
          className="flex-1 overflow-y-auto border rounded-md focus-within:ring-1 focus-within:ring-primary"
        />
      )}
    </div>
  );
}
