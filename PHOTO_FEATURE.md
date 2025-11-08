# Professional Photo Enhancement Feature 📸

## Overview

This feature allows users to upload a casual photo and have AI analyze it and generate a professional headshot suitable for CVs and LinkedIn profiles using **Google Gemini's native image generation**.

## How It Works

### 1. Upload Photo
- User clicks "Upload Photo" button in the Personal Information section
- Accepts image files (JPEG, PNG, etc.)
- Preview is shown immediately

### 2. AI Analysis (using Gemini Vision)
- When user clicks "Enhance Photo", the photo is sent to the API
- Gemini 2.0 Flash Exp analyzes the photo for:
  - Current attire (casual vs professional)
  - Background quality and type
  - Lighting conditions
  - Pose and composition
  - Overall professionalism score

### 3. Professional Photo Generation (using Gemini Image)

The feature uses **Gemini 2.5 Flash Image** model to generate professional headshots:

#### AI Generation Mode (Primary - Uses Gemini Image)
- 🎨 Generates completely new professional photo using `gemini-2.5-flash-image`
- 👔 Creates business professional attire automatically
- 🖼️ Generates studio-quality background
- 💡 Professional lighting and composition
- ✨ High-quality photorealistic output
- ⚡ Fast generation (streams response)

#### Basic Fallback Mode (If Generation Fails)
- Applies professional enhancement filters using HTML5 Canvas:
  - Brightness: +10%
  - Contrast: +20%
  - Saturation: -10% (for more professional look)
- Returns enhanced version instantly

## Technical Implementation

### Files Modified

1. **`lib/ai/google.ts`**
   - Added `generateProfessionalPhoto()` function
   - Uses Gemini Vision for photo analysis
   - Uses Gemini Image for generation via `generateContentStream`
   - Streams image response and converts to blob URL
   
2. **`app/api/ai/photo/route.ts`**
   - Server-side API endpoint for photo processing
   - Handles file upload via FormData
   - Returns generated photo URL or error

3. **`components/cv/cv-builder.tsx`**
   - Added `handleEnhancePhoto()` function
   - Added `applyBasicPhotoEnhancement()` helper for fallback
   - Integrates with API endpoint
   - Shows progress toasts

4. **`README.md`**
   - Documented photo feature
   - Updated to reflect Gemini-only approach
   - Removed Replicate references

## API Endpoints

### POST `/api/ai/photo`

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData with `photo` field (File)

**Response:**
```json
{
  "success": true,
  "photoUrl": "blob:http://localhost:3000/..."
}
```

**Error Response:**
```json
{
  "error": "BASIC_ENHANCEMENT_NEEDED:Analysis text here"
}
```

## Environment Variables

### Required
- `GOOGLE_GENAI_API_KEY` - For AI analysis AND image generation

No additional services or API keys needed! Everything is powered by Google Gemini.

## User Flow

1. User uploads a casual photo
2. User clicks "Enhance Photo" button
3. System shows "Analyzing your photo..." toast
4. Photo is sent to backend API
5. Gemini Vision analyzes the photo quality
6. Gemini Image generates professional headshot
7. Generated photo streams back from API
8. System converts to blob URL and displays
9. Shows "Professional photo generated!" success message
10. If generation fails, applies basic enhancement filters

## Benefits

- **Single API Key**: Only need Google Gemini API key
- **No Extra Services**: Everything powered by Gemini
- **High Quality**: Studio-quality professional headshots
- **Fast**: Streaming response for quick results
- **Easy to Use**: One-click enhancement
- **Smart Analysis**: AI understands professionalism
- **Reliable Fallback**: Basic enhancement if generation fails

## Future Enhancements

Potential improvements:
- Multiple photo style options (corporate, creative, academic)
- Batch processing for teams
- Background removal/replacement
- Clothing color customization
- Integration with other image generation APIs (Stability AI, DALL-E)
- Photo quality scoring and recommendations

## Troubleshooting

### Photo not enhancing?
- Check if `GOOGLE_GENAI_API_KEY` is set in `.env`
- Check browser console for errors
- Ensure photo file is a valid image format
- Verify your Gemini API key has access to image generation models

### Generated photo looks different from original?
- This is expected! Gemini generates a NEW professional photo
- It maintains general style but creates studio-quality result
- For exact photo preservation, the system falls back to basic filters

### Image generation taking too long?
- First generation may take 10-30 seconds
- Check your internet connection
- Review API logs for any errors

## Credits

- **AI Models Used:**
  - Google Gemini 2.0 Flash Exp (vision analysis)
  - Google Gemini 2.5 Flash Image (professional headshot generation)
- **Image Processing:** HTML5 Canvas API (fallback)
- **File Handling:** Next.js App Router FormData
