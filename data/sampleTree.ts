import { Note } from "@/types/note";

export const sampleTree: Note = {
  id: 1,
  title: "Main Note",
  content: "",
  childNotes: [
    { id: 2, title: "First Sub Note", content: "" },
    {
      id: 3,
      title: "Second Sub Note",
      content: "",
      childNotes: [{ id: 4, title: "First Sub Sub Note", content: "" }]
    }
  ]
};
