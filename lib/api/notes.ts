/**
 * Fetches note content from the server
 */
export async function fetchNoteContent(noteId: number): Promise<string> {
  // Placeholder for actual API call
  // In a real implementation, you would fetch from your backend
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get from localStorage for demo purposes
    const storedContent = localStorage.getItem(`note-${noteId}`);
    return storedContent ?? '';
  } catch (error) {
    console.error(`Error fetching note ${noteId}:`, error);
    throw error;
  }
}

/**
 * Saves note content to the server
 */
export async function saveNoteContent(noteId: number, content: string): Promise<void> {
  // Placeholder for actual API call
  try {
    // For demo purposes, save to localStorage
    localStorage.setItem(`note-${noteId}`, content);
    
    // In a real implementation:
    // await fetch(`/api/notes/${noteId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content }),
    // });
    
    console.log(`Note ${noteId} saved`);
  } catch (error) {
    console.error(`Error saving note ${noteId}:`, error);
    throw error;
  }
}
