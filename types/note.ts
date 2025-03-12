import { Content } from "@tiptap/react";

export interface Note {
  id: number;
  title: string;
  content: Content;
  childNotes?: Note[];
}
