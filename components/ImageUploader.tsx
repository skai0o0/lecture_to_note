import React, { useRef, useCallback } from 'react';
import type { NoteMetadata } from '../App';

const UploadCloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);


interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imagePreviewUrl: string | undefined;
  onClear: () => void;
  isLoading: boolean;
  metadata: NoteMetadata;
  onMetadataChange: (field: keyof NoteMetadata, value: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreviewUrl, onClear, isLoading, metadata, onMetadataChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isLoading) return;
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
    }
  }, [isLoading, onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const openFileDialog = () => {
    if(!isLoading) {
        fileInputRef.current?.click();
    }
  }

  const commonInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <div className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-secondary mb-4">1. Tải lên &amp; Nhập thông tin</h2>
      
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Môn học</label>
          <input type="text" id="subject" value={metadata.subject} onChange={(e) => onMetadataChange('subject', e.target.value)} className={commonInputClass} disabled={isLoading} />
        </div>
        <div>
          <label htmlFor="lessonNumber" className="block text-sm font-medium text-gray-700">Số bài</label>
          <input type="number" id="lessonNumber" value={metadata.lessonNumber} onChange={(e) => onMetadataChange('lessonNumber', e.target.value)} className={commonInputClass} disabled={isLoading} />
        </div>
        <div>
          <label htmlFor="chapterNumber" className="block text-sm font-medium text-gray-700">Số chương</label>
          <input type="text" id="chapterNumber" placeholder="I, II, III..." value={metadata.chapterNumber} onChange={(e) => onMetadataChange('chapterNumber', e.target.value)} className={commonInputClass} disabled={isLoading} />
        </div>
        <div>
          <label htmlFor="userNote" className="block text-sm font-medium text-gray-700">Ghi chú thêm</label>
          <input type="text" id="userNote" value={metadata.userNote} onChange={(e) => onMetadataChange('userNote', e.target.value)} className={commonInputClass} disabled={isLoading} />
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isLoading}
        />
        {!imagePreviewUrl ? (
          <div
            onClick={openFileDialog}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`flex-grow border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-center p-8 transition-colors duration-300 ${isLoading ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer hover:border-primary hover:bg-indigo-50'}`}
          >
            <UploadCloudIcon />
            <p className="mt-4 font-semibold text-gray-600">
              <span className="text-primary">Nhấn để tải lên</span> hoặc kéo thả
            </p>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP, etc.</p>
          </div>
        ) : (
          <div className="flex-grow relative group rounded-lg overflow-hidden">
            <img src={imagePreviewUrl} alt="Lecture preview" className="w-full h-full object-contain" />
            {!isLoading && (
                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button
                        onClick={onClear}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-gray-200 flex items-center"
                    >
                        <XCircleIcon />
                        Tải lên ảnh khác
                    </button>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};