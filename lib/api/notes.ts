import { Content } from "@tiptap/react";

/**
 * Fetches note content from the server
 */
export async function fetchNoteContent(noteId: number): Promise<Content> {
  // In a real application, this would make an API request
  // For now we're simulating with mock data
  console.log(`Fetching content for note ${noteId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          { type: "text", text: `This is the content for note ${noteId}.` }
        ]
      }
    ]
  };
}

/**
 * Saves note content to the server
 */
export async function saveNoteContent(noteId: number, content: string): Promise<void> {
  // In a real application, this would make an API request to save the content
  console.log(`Saving content for note ${noteId}`, content);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return success
  return;
}
