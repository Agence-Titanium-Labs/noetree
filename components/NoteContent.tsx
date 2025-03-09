import { Note } from "@/types/note";
import Editor from "./Editor";

interface NoteContentProps {
  note: Note;
}

export default function NoteContent({ note }: Readonly<NoteContentProps>) {
  return (
    <div className="min-h-full flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{note.title}</h2>
      <div className="grow flex flex-col gap-4">
        <Editor noteId={note.id} />
      </div>
    </div>
  );
}
