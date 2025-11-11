import React, { useState, useEffect } from 'react';
import { getSavedNotes, deleteNote, formatDate, type SavedNote } from '../services/storageService';

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

interface SavedNotesListProps {
  onLoad: (note: SavedNote) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SavedNotesList: React.FC<SavedNotesListProps> = ({ onLoad, isOpen, onClose }) => {
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSavedNotes();
    }
  }, [isOpen]);

  const loadSavedNotes = () => {
    const notes = getSavedNotes();
    // Sort by timestamp descending (newest first)
    notes.sort((a, b) => b.timestamp - a.timestamp);
    setSavedNotes(notes);
  };

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Bạn có chắc chắn muốn xóa ghi chú này?')) {
      deleteNote(id);
      loadSavedNotes();
      if (selectedId === id) {
        setSelectedId(null);
      }
    }
  };

  const handleLoad = (note: SavedNote) => {
    setSelectedId(note.id);
    onLoad(note);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FolderIcon />
              <h2 className="text-2xl font-semibold text-secondary">Ghi chú đã lưu</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6">
          {savedNotes.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <FolderIcon />
              <p className="mt-4 font-semibold">Chưa có ghi chú nào được lưu</p>
              <p className="text-sm">Tạo và lưu ghi chú đầu tiên của bạn!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleLoad(note)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedId === note.id ? 'border-primary bg-indigo-50' : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800 mb-2">{note.fileName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <ClockIcon />
                          <span>{formatDate(note.timestamp)}</span>
                        </div>
                        {note.metadata.subject && (
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {note.metadata.subject}
                          </span>
                        )}
                        {note.metadata.lessonNumber && (
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                            Bài {note.metadata.lessonNumber}
                          </span>
                        )}
                      </div>
                      {note.notes && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {note.notes.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDelete(note.id, e)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Tổng số: <span className="font-semibold">{savedNotes.length}</span> ghi chú
            </p>
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
