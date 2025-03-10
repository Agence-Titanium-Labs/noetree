import { Note } from "@/types/note";

export const sampleTree: Note = {
  id: 1,
  title: "Main Note",
  content: "This is the main note",
  childNotes: [
    {
      id: 2,
      title: "First Sub Note",
      content: "This is the first sub note"
    },
    {
      id: 3,
      title: "Second Sub Note",
      content: "This is another sub note",
      childNotes: [
        {
          id: 4,
          title: "First Sub Sub Note",
          content: "This is a detailed sub sub note"
        }
      ]
    }
  ]
};
