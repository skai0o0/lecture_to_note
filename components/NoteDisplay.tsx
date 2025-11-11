import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { NoteMetadata } from '../App';
import { exportAsTxt, exportAsDocx } from '../utils/exportUtils';

const MagicWandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L9 9l-7 3 7 3 3 7 3-7 7-3-7-3z" />
    </svg>
);

const ClipboardIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
    </svg>
);

const SkeletonLoader = () => (
    <div className="space-y-5 animate-pulse-fast">
        <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
        </div>
    </div>
);

interface NoteDisplayProps {
  notes: string;
  isLoading: boolean;
  error: string | null;
  hasImage: boolean;
  metadata: NoteMetadata;
  onSave?: () => void;
  canSave?: boolean;
}

export const NoteDisplay: React.FC<NoteDisplayProps> = ({ notes, isLoading, error, hasImage, metadata, onSave, canSave }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(notes).then(() => {
            setCopied(true);
        });
    };

    const handleExport = (format: 'txt' | 'docx') => {
        if (format === 'txt') {
            exportAsTxt(metadata, notes);
        } else {
            exportAsDocx(metadata, notes);
        }
    };
    
    const renderContent = () => {
        if (isLoading) {
            return <SkeletonLoader />;
        }
        if (error) {
            return <p className="text-red-500 text-center">{error}</p>;
        }
        if (notes) {
            return (
                <div className="prose prose-indigo max-w-none">
                     <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown>
                </div>
            );
        }
        if (hasImage) {
            return <p className="text-gray-500 text-center">Đang xử lý ảnh...</p>;
        }
        return (
            <div className="text-center text-gray-500 flex-grow flex flex-col justify-center items-center">
                <MagicWandIcon />
                <p className="mt-4 font-semibold">Ghi chú của bạn sẽ xuất hiện ở đây</p>
                <p className="text-sm">Tải ảnh lên để bắt đầu.</p>
            </div>
        );
    };

    const buttonClass = "bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 flex items-center space-x-2 transition-colors";

    return (
        <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col relative">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-semibold text-secondary">2. Ghi chú đã tạo</h2>
                {notes && !isLoading && (
                    <div className="flex items-center space-x-2">
                        {canSave && onSave && (
                            <button onClick={onSave} className="bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center space-x-2 transition-colors shadow-md">
                                <SaveIcon />
                                <span>Lưu bài giảng</span>
                            </button>
                        )}
                         <button onClick={handleCopy} className={buttonClass}>
                            {copied ? <CheckIcon /> : <ClipboardIcon />}
                            <span>{copied ? 'Đã sao chép!' : 'Sao chép'}</span>
                        </button>
                        <button onClick={() => handleExport('txt')} className={buttonClass}>
                            <span>Xuất .txt</span>
                        </button>
                         <button onClick={() => handleExport('docx')} className={buttonClass}>
                            <span>Xuất .docx</span>
                        </button>
                    </div>
                )}
            </div>
            <div className="bg-light p-4 rounded-lg flex-grow overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};