import type { NoteMetadata } from '../App';

export interface SavedNote {
  id: string;
  timestamp: number;
  metadata: NoteMetadata;
  imagePath: string; // Base64 encoded image
  notes: string;
  fileName: string; // Generated from metadata
}

const STORAGE_KEY = 'hocmely_saved_notes';

// Generate a readable file name from metadata
export function generateFileName(metadata: NoteMetadata): string {
  const parts = [];
  
  if (metadata.subject) parts.push(metadata.subject);
  if (metadata.chapterNumber) parts.push(`Chương ${metadata.chapterNumber}`);
  if (metadata.lessonNumber) parts.push(`Bài ${metadata.lessonNumber}`);
  if (metadata.userNote) parts.push(metadata.userNote);
  
  return parts.length > 0 ? parts.join(' - ') : 'Ghi chú chưa đặt tên';
}

// Convert File to Base64
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Convert Base64 to Blob URL for preview
export function base64ToBlobUrl(base64: string): string {
  return base64; // Base64 can be used directly as src
}

// Save a note
export async function saveNote(
  metadata: NoteMetadata,
  imageFile: File,
  notes: string
): Promise<SavedNote> {
  const savedNotes = getSavedNotes();
  
  const imagePath = await fileToBase64(imageFile);
  const fileName = generateFileName(metadata);
  
  const newNote: SavedNote = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    metadata,
    imagePath,
    notes,
    fileName,
  };
  
  savedNotes.push(newNote);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedNotes));
  
  return newNote;
}

// Get all saved notes
export function getSavedNotes(): SavedNote[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading saved notes:', error);
    return [];
  }
}

// Get a specific note by ID
export function getSavedNoteById(id: string): SavedNote | null {
  const savedNotes = getSavedNotes();
  return savedNotes.find(note => note.id === id) || null;
}

// Delete a note
export function deleteNote(id: string): void {
  const savedNotes = getSavedNotes();
  const filtered = savedNotes.filter(note => note.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// Update a note
export async function updateNote(
  id: string,
  metadata: NoteMetadata,
  imageFile?: File,
  notes?: string
): Promise<SavedNote | null> {
  const savedNotes = getSavedNotes();
  const index = savedNotes.findIndex(note => note.id === id);
  
  if (index === -1) return null;
  
  const existingNote = savedNotes[index];
  const fileName = generateFileName(metadata);
  
  const updatedNote: SavedNote = {
    ...existingNote,
    metadata,
    fileName,
    notes: notes ?? existingNote.notes,
    imagePath: imageFile ? await fileToBase64(imageFile) : existingNote.imagePath,
    timestamp: Date.now(),
  };
  
  savedNotes[index] = updatedNote;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedNotes));
  
  return updatedNote;
}

// Format date for display
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
