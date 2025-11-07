/**
 * Extract text content from a PDF file using PDF.js
 * This function uses dynamic import to ensure it only runs in the browser
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  // Ensure we're in a browser environment
  if (typeof window === "undefined") {
    throw new Error("PDF extraction only works in the browser")
  }

  try {
    // Dynamic import of pdfjs-dist to avoid SSR issues
    const pdfjsLib = await import("pdfjs-dist")
    
    // Use a more reliable CDN with https
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
    
    const arrayBuffer = await file.arrayBuffer()
    const typedArray = new Uint8Array(arrayBuffer)
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: typedArray })
    const pdf = await loadingTask.promise
    
    const textParts: string[] = []
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str || "")
        .join(" ")
      textParts.push(pageText)
    }
    
    const fullText = textParts.join("\n\n").trim()
    console.log("[PDF Parser] Successfully extracted text, length:", fullText.length)
    return fullText
  } catch (error) {
    console.error("[PDF Parser] Failed to extract text:", error)
    throw new Error("Could not extract text from PDF. Please try a different file format.")
  }
}

/**
 * Extract text from various file types
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type.toLowerCase()
  const fileName = file.name.toLowerCase()

  // PDF files
  if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    return extractTextFromPDF(file)
  }

  // Plain text files
  if (
    fileType.startsWith("text/") ||
    fileName.endsWith(".txt") ||
    fileName.endsWith(".md")
  ) {
    return file.text()
  }

  // Try as text fallback
  try {
    const text = await file.text()
    // Check if it looks like PDF binary data
    if (text.startsWith("%PDF")) {
      return extractTextFromPDF(file)
    }
    return text
  } catch (error) {
    throw new Error("Unsupported file format. Please upload a PDF or text file.")
  }
}
