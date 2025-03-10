import { Note } from "@/types/note";

interface NoteContentProps {
  note: Note;
}

export default function NoteContent({ note }: Readonly<NoteContentProps>) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{note.title}</h2>
      <div>{note.content}</div>
    </div>
  );
}
