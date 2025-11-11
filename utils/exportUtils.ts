import type { NoteMetadata } from '../App';

// Since we are loading the docx library from a script tag,
// we need to declare it to TypeScript to avoid errors.
declare const docx: any;

function generateFilename(metadata: NoteMetadata, extension: string): string {
    const { subject, lessonNumber, chapterNumber, userNote } = metadata;
    const parts = [
        subject || 'GhiChu',
        chapterNumber ? `Chuong_${chapterNumber.replace(/\s/g, '_')}` : '',
        lessonNumber ? `Bai_${lessonNumber}` : '',
        userNote ? userNote.replace(/\s/g, '_') : ''
    ].filter(Boolean); // Filter out empty parts

    const safeFilename = parts.join('_').replace(/[^a-zA-Z0-9_.-]/g, '');
    return `${safeFilename || 'GhiChu'}.${extension}`;
}

function generateHeaderText(metadata: NoteMetadata): string {
    const { subject, lessonNumber, chapterNumber, userNote } = metadata;
    let header = '';
    if (subject) header += `Môn học: ${subject}\n`;
    if (chapterNumber) header += `Chương: ${chapterNumber}\n`;
    if (lessonNumber) header += `Bài: ${lessonNumber}\n`;
    if (userNote) header += `Ghi chú: ${userNote}\n`;
    
    if (header) {
        header += '-'.repeat(40) + '\n\n';
    }
    return header;
}

function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function exportAsTxt(metadata: NoteMetadata, content: string) {
    const filename = generateFilename(metadata, 'txt');
    const header = generateHeaderText(metadata);
    const fileContent = header + content;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    triggerDownload(blob, filename);
}

export function exportAsDocx(metadata: NoteMetadata, content: string) {
    const filename = generateFilename(metadata, 'docx');
    
    const headerLines = generateHeaderText(metadata).split('\n').filter(line => line.length > 0);
    const contentLines = content.split('\n');

    const doc = new docx.Document({
        sections: [{
            children: [
                ...headerLines.map(line => new docx.Paragraph({ 
                    children: [new docx.TextRun({ text: line, bold: headerLines.indexOf(line) < headerLines.length - 1 })] 
                })),
                ...contentLines.map(line => new docx.Paragraph({ text: line })),
            ],
        }],
    });

    docx.Packer.toBlob(doc).then((blob: Blob) => {
        triggerDownload(blob, filename);
    });
}
