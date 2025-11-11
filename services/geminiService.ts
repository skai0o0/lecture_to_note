import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

const model = 'gemini-2.5-flash';

interface GenerativePart {
    inlineData: {
        data: string;
        mimeType: string;
    };
}

export async function generateNotesFromImage(imagePart: GenerativePart): Promise<string> {
  const prompt = `
    Bạn là một trợ lý học thuật chuyên nghiệp. Nhiệm vụ của bạn là phân tích hình ảnh được cung cấp về một trang trình chiếu bài giảng, bảng trắng, hoặc trang sách giáo khoa và chuyển đổi nó thành các ghi chú có cấu trúc tốt, dễ hiểu.

    Hướng dẫn:
    1.  **Trích xuất tất cả văn bản và khái niệm có liên quan** từ hình ảnh.
    2.  **Sắp xếp thông tin** một cách logic bằng cách sử dụng định dạng Markdown.
    3.  **Sử dụng các tiêu đề rõ ràng (#, ##)** cho các chủ đề chính và phụ.
    4.  **Sử dụng các gạch đầu dòng (- hoặc *)** cho danh sách, các điểm chính và định nghĩa.
    5.  **Sử dụng chữ in đậm (**) để làm nổi bật các từ khóa và thuật ngữ quan trọng.**
    6.  Nếu có sơ đồ hoặc công thức, hãy mô tả ngắn gọn chúng nếu có thể hoặc biểu diễn chúng tốt nhất có thể bằng văn bản.
    7.  Duy trì giọng văn chuyên nghiệp và học thuật.
    8.  Nếu hình ảnh không rõ ràng hoặc không chứa văn bản có thể nhận dạng được, hãy nêu rõ rằng bạn không thể phân tích hình ảnh.

    Bây giờ, hãy tạo ghi chú dựa trên hình ảnh được cung cấp.
    `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: {
            parts: [
                imagePart,
                { text: prompt }
            ]
        },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Yêu cầu đến Gemini API thất bại. Điều này có thể do sự cố mạng hoặc API key không hợp lệ.");
  }
}