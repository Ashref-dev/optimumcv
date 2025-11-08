import { NextRequest, NextResponse } from "next/server"
import { generateProfessionalPhoto } from "@/lib/ai/google"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("photo") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No photo file provided" },
        { status: 400 }
      )
    }

    console.log("[Photo API] Processing photo:", file.name, file.type, file.size)

    const professionalPhotoUrl = await generateProfessionalPhoto(file)

    return NextResponse.json({ 
      success: true, 
      photoUrl: professionalPhotoUrl 
    })
  } catch (error) {
    console.error("[Photo API] Error:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to generate professional photo" 
      },
      { status: 500 }
    )
  }
}
