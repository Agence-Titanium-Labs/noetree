import { Editor } from "@tiptap/core";
import { Content, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { fetchNoteContent, saveNoteContent } from "@/lib/api/notes";
import { useDebouncedCallback } from "use-debounce";

interface EditorContextType {
  editor: Editor | null;
  isLoading: boolean;
  isSaving: boolean;
  saveStatus: "idle" | "success" | "error";
  hasUnsavedChanges: boolean;
  loadNoteContent: (noteId: number) => Promise<void>;
}

const EditorContext = createContext<EditorContextType>({
  editor: null,
  isLoading: false,
  isSaving: false,
  saveStatus: "idle",
  hasUnsavedChanges: false,
  loadNoteContent: async () => {}
});

export const useEditorContext = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context)
    throw new Error("useEditorContext must be used within an EditorProvider");
  return context;
};

interface EditorProviderProps {
  children: ReactNode;
}

export function EditorProvider({ children }: Readonly<EditorProviderProps>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [currentNoteId, setCurrentNoteId] = useState<number | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something…"
      }),
      Link,
      Image
    ],
    editorProps: {
      attributes: {
        class: "flex-1 overflow-y-auto border rounded-md p-4"
      }
    }
  });

  //timout if no editor
  useEffect(() => {
    if (!editor) return;
    const timeout = setTimeout(() => {}, 1000);
    return () => clearTimeout(timeout);
  }, [editor]);

  const loadNoteContent = useCallback(
    async (noteId: number) => {
      if (!editor) return;

      setIsLoading(true);
      setSaveStatus("idle");
      setHasUnsavedChanges(false);
      setCurrentNoteId(noteId);

      try {
        const content = await fetchNoteContent(noteId);
        if (editor) {
          editor.commands.setContent(content);
        }
      } catch (error) {
        console.error("Failed to load note content", error);
        if (editor) {
          editor.commands.setContent("");
        }
        setSaveStatus("error");
      } finally {
        setIsLoading(false);
      }
    },
    [editor]
  );

  const debouncedSave = useDebouncedCallback(
    async (noteId: number, content: Content) => {
      if (!hasUnsavedChanges || !noteId) return;

      try {
        setIsSaving(true);
        await saveNoteContent(noteId, JSON.stringify(content));
        setSaveStatus("success");
        setHasUnsavedChanges(false);

        // Reset success status after 3 seconds
        setTimeout(() => {
          setSaveStatus("idle");
        }, 3000);
      } catch (error) {
        console.error("Failed to save note content", error);
        setSaveStatus("error");
      } finally {
        setIsSaving(false);
      }
    },
    1000
  );

  editor?.on("update", ({ editor }) => {
    if (!currentNoteId) return;
    setHasUnsavedChanges(true);
    debouncedSave(currentNoteId, editor.getJSON());
  });

  const contextValue = {
    editor,
    isLoading,
    isSaving,
    saveStatus,
    hasUnsavedChanges,
    loadNoteContent
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
}
