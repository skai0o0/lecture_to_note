import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { NoteDisplay } from './components/NoteDisplay';
import { SavedNotesList } from './components/SavedNotesList';
import { generateNotesFromImage } from './services/geminiService';
import { fileToGenerativePart } from './utils/fileUtils';
import { saveNote, base64ToBlobUrl, type SavedNote } from './services/storageService';

// Define the structure for the image file state
interface ImageFile {
  file: File;
  previewUrl: string;
}

export interface NoteMetadata {
  subject: string;
  lessonNumber: string;
  chapterNumber: string;
  userNote: string;
}

export default function App() {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [generatedNotes, setGeneratedNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<NoteMetadata>({
    subject: '',
    lessonNumber: '',
    chapterNumber: '',
    userNote: '',
  });
  const [isSavedNotesOpen, setIsSavedNotesOpen] = useState<boolean>(false);
  const [currentSaveId, setCurrentSaveId] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setGeneratedNotes('');
    setError(null);
    setImageFile({
      file,
      previewUrl: URL.createObjectURL(file),
    });

    try {
      const imagePart = await fileToGenerativePart(file);
      const notes = await generateNotesFromImage(imagePart);
      setGeneratedNotes(notes);
    } catch (err) {
      console.error(err);
      setError('Tạo ghi chú thất bại. Vui lòng kiểm tra API key và thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleClear = useCallback(() => {
    setImageFile(null);
    setGeneratedNotes('');
    setError(null);
    setIsLoading(false);
    setMetadata({
      subject: '',
      lessonNumber: '',
      chapterNumber: '',
      userNote: '',
    });
    setCurrentSaveId(null);
  }, []);

  const handleMetadataChange = useCallback((field: keyof NoteMetadata, value: string) => {
    setMetadata(prev => ({...prev, [field]: value}));
  }, []);

  const handleSave = useCallback(async () => {
    if (!imageFile || !generatedNotes) {
      alert('Không có gì để lưu!');
      return;
    }

    try {
      const savedNote = await saveNote(metadata, imageFile.file, generatedNotes);
      setCurrentSaveId(savedNote.id);
      alert('Đã lưu ghi chú thành công!');
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Lỗi khi lưu ghi chú. Vui lòng thử lại.');
    }
  }, [imageFile, generatedNotes, metadata]);

  const handleLoadNote = useCallback((note: SavedNote) => {
    // Convert base64 back to preview URL
    setImageFile({
      file: new File([], note.fileName), // Placeholder file
      previewUrl: note.imagePath,
    });
    setGeneratedNotes(note.notes);
    setMetadata(note.metadata);
    setCurrentSaveId(note.id);
    setError(null);
  }, []);

  const openSavedNotes = useCallback(() => {
    setIsSavedNotesOpen(true);
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-4 flex justify-end">
          <button
            onClick={openSavedNotes}
            className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
            <span>Ghi chú đã lưu</span>
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <ImageUploader 
            onImageUpload={handleImageUpload}
            imagePreviewUrl={imageFile?.previewUrl}
            onClear={handleClear}
            isLoading={isLoading}
            metadata={metadata}
            onMetadataChange={handleMetadataChange}
          />
          <NoteDisplay 
            notes={generatedNotes}
            isLoading={isLoading}
            error={error}
            hasImage={!!imageFile}
            metadata={metadata}
            onSave={handleSave}
            canSave={!!imageFile && !!generatedNotes}
          />
        </div>
      </main>
      <SavedNotesList
        isOpen={isSavedNotesOpen}
        onClose={() => setIsSavedNotesOpen(false)}
        onLoad={handleLoadNote}
      />
    </div>
  );
}