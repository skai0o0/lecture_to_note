# 📝 Lecture to Note - Chuyển Ảnh Bài Giảng Thành Ghi Chú

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)

Ứng dụng web giúp chuyển đổi ảnh chụp bài giảng thành ghi chú văn bản có cấu trúc, sử dụng AI Gemini.

[Demo](#) • [Báo lỗi](https://github.com/skai0o0/lecture_to_note/issues) • [Đóng góp](https://github.com/skai0o0/lecture_to_note/pulls)

</div>

---

## ✨ Tính năng

- 📸 **Upload ảnh bài giảng** - Kéo thả hoặc chọn file ảnh
- 🤖 **AI Processing** - Sử dụng Google Gemini để phân tích và tạo ghi chú
- 📝 **Markdown Output** - Ghi chú được format đẹp với Markdown
- 💾 **Lưu trữ Local** - Lưu ghi chú vào localStorage, load lại khi cần
- 📊 **Metadata Management** - Quản lý môn học, số bài, số chương
- 📤 **Export Files** - Xuất file .txt hoặc .docx
- 🎨 **UI/UX đẹp** - Giao diện hiện đại, responsive
- 🔐 **Privacy First** - Dữ liệu lưu trữ local, không gửi lên server

---

## 🚀 Chạy Locally

### Prerequisites
- Node.js (v18 trở lên)
- NPM hoặc Yarn
- Gemini API Key ([Lấy tại đây](https://aistudio.google.com/apikey))

### Cài đặt

1. **Clone repository:**
   ```bash
   git clone https://github.com/skai0o0/lecture_to_note.git
   cd lecture_to_note
   ```

2. **Cài dependencies:**
   ```bash
   npm install
   ```

3. **Setup API Key:**
   
   Tạo file `.env.local` trong thư mục gốc:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Chạy development server:**
   ```bash
   npm run dev
   ```
   
   Mở trình duyệt tại: `http://localhost:5173`

5. **Build production:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 📦 Cấu trúc Project

```
lecture_to_note/
├── components/           # React components
│   ├── Header.tsx
│   ├── ImageUploader.tsx
│   ├── NoteDisplay.tsx
│   └── SavedNotesList.tsx
├── services/            # Business logic
│   ├── geminiService.ts # Gemini AI integration
│   └── storageService.ts # LocalStorage management
├── utils/               # Utility functions
│   ├── exportUtils.ts   # Export to .txt/.docx
│   └── fileUtils.ts     # File handling
├── App.tsx              # Main app component
├── index.tsx            # Entry point
└── vite.config.ts       # Vite config
```

---

## 🎯 Cách sử dụng

1. **Nhập thông tin metadata:**
   - Môn học (VD: Toán học, Vật lý)
   - Số bài (VD: 1, 2, 3)
   - Số chương (VD: I, II, III)
   - Ghi chú thêm

2. **Upload ảnh bài giảng:**
   - Kéo thả ảnh vào vùng upload
   - Hoặc click để chọn file

3. **Chờ AI xử lý:**
   - Gemini AI sẽ phân tích ảnh
   - Tạo ghi chú có cấu trúc

4. **Lưu và quản lý:**
   - Click "Lưu ghi chú" để lưu vào local
   - Click "Ghi chú đã lưu" để xem danh sách
   - Load lại bất kỳ ghi chú nào

5. **Export:**
   - Sao chép text
   - Xuất file .txt
   - Xuất file .docx

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **AI:** Google Gemini AI
- **Markdown:** react-markdown + remark-gfm
- **Export:** docx library
- **Storage:** Browser LocalStorage

---

## 📝 Environment Variables

| Variable | Mô tả | Bắt buộc |
|----------|-------|----------|
| `VITE_GEMINI_API_KEY` | API key của Google Gemini | ✅ |

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**skai0o0**

- GitHub: [@skai0o0](https://github.com/skai0o0)
- Repository: [lecture_to_note](https://github.com/skai0o0/lecture_to_note)

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)

---

<div align="center">
Made with ❤️ by skai0o0
</div>
