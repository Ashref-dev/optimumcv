# OptimumCV 📄✨

> AI-powered CV builder that helps you create, enhance, and tailor professional resumes in minutes.

## 🌟 Features

- **Import CV** - Upload existing resumes (PDF) and automatically parse them into structured format
- **ATS Optimization** - Optimize your entire CV for Applicant Tracking Systems with action verbs, keywords, and metrics
- **Job Adaptation** - Tailor your CV to specific job descriptions automatically
- **PDF Download** - Export your CV as a professional Harvard-style PDF
- **Professional Photo Enhancement** - Upload your photo and apply professional filters (brightness, contrast, saturation)
- **Real-time Preview** - See changes to your CV instantly
- **Modern UI** - Clean, professional interface with dark/light mode support
- **Form Validation** - Smart validation to ensure your CV is complete and error-free

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod validation
- **AI Integration**: Google Gemini AI
- **PDF Generation**: jsPDF + html2canvas
- **PDF Parsing**: PDF.js
- **State Management**: React hooks

## 📦 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Google Gemini API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rayenfassatoui/optimumcv.git
cd optimumcv
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Create a `.env` file in the root directory:
```env
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
```

> **Note**: 
> - **CV Text Features**: Powered by Gemini AI (free tier works perfectly!)
>   - CV import with AI parsing
>   - Professional summary enhancement
>   - Job description adaptation
> - **Photo Enhancement**: Uses browser-side filters (no API needed!)
>   - Applies professional brightness, contrast, and color adjustments
>   - Works offline, no quota limits
>   - Instant results

4. Run the development server:
```bash
bun dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

1. **Import a CV**: Click "Import CV" to upload an existing resume (PDF format)
2. **Upload Photo**: Click "Upload Photo" to add your profile picture
3. **Enhance Photo**: Click "Enhance Photo" to apply professional filters (brightness, contrast, saturation)
4. **Fill in Details**: Complete or edit your personal information, experience, education, projects, and skills
5. **ATS Optimize**: Click "ATS Optimize" to make your entire CV ATS-friendly with action verbs, keywords, and metrics
6. **Adapt to Job**: Paste a job description and click "Adapt to Job" to tailor your CV to that specific role
7. **Download PDF**: Click "Download PDF" to export your CV as a professional Harvard-style PDF
8. **Preview**: View your CV in real-time on the right panel

### Professional Photo Enhancement

The photo enhancement feature uses browser-side image processing for instant results:

**How it works:**
1. Upload your photo (any format)
2. Click "Enhance Photo"
3. Professional filters are applied instantly:
   - Brightness boost (+10%)
   - Contrast enhancement (+20%)
   - Color saturation adjustment (-15% for corporate look)
   - High-quality output

**Benefits:**
- ⚡ Instant results (no API calls)
- 🆓 Completely free (no quota limits)
- 🔒 Privacy-friendly (processed in your browser)
- 💾 Works offline

**Tips for best results:**
- Use a clear, well-lit photo
- Face should be clearly visible
- Photo will look more professional and polished
- Works with any photo style

## 📁 Project Structure

```
optimumcv/
├── app/
│   ├── api/
│   │   └── ai/           # AI enhancement endpoints
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── cv/
│   │   ├── cv-builder.tsx    # Main CV builder component
│   │   ├── cv-preview.tsx    # CV preview component
│   │   └── builder/          # Form sections
│   └── ui/               # Reusable UI components
├── lib/
│   ├── cv.ts            # CV data types and schemas
│   ├── pdf-parser.ts    # PDF parsing utilities
│   └── ai/              # AI integration
└── public/              # Static assets
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GENAI_API_KEY` | Google Gemini API key for AI text features (CV import, enhancement, adaptation) | Yes |

### Getting API Key

**Google Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GOOGLE_GENAI_API_KEY`

This API key powers the text AI features:
- CV parsing and import
- ATS optimization with keywords and action verbs
- Professional summary enhancement
- Job description adaptation

Photo enhancement runs in your browser and doesn't need any API key!

## 📥 PDF Features

### Download CV as PDF
Export your CV as a professional Harvard-style PDF with:
- Clean, professional formatting
- Multi-page support
- Photo inclusion
- Consistent typography
- Standard sections layout

### Import CV from PDF
Upload existing PDF resumes to automatically extract:
- Personal information
- Work experience
- Education
- Skills and certifications
- Projects

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Rayen Fassatoui**
- GitHub: [@rayenfassatoui](https://github.com/rayenfassatoui)
- LinkedIn: [rayenfassatoui](https://linkedin.com/in/rayenfassatoui)
- Website: [rayenft.dev](https://rayenft.dev)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [Radix UI](https://radix-ui.com)
- AI powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Icons from [Lucide](https://lucide.dev)

---

Made with ❤️ by Rayen Fassatoui
