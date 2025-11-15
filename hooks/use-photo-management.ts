import { useState, useRef, type RefObject } from "react"
import { toast } from "sonner"

export function usePhotoManagement() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [showPhotoCropModal, setShowPhotoCropModal] = useState(false)
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null)
  
  const photoInputRef = useRef<HTMLInputElement>(null) as RefObject<HTMLInputElement>

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setPendingPhotoFile(file)
    setShowPhotoCropModal(true)
    event.target.value = ""
  }

  const handlePhotoCropSave = (croppedImageUrl: string) => {
    setPhotoPreview(croppedImageUrl)
    if (pendingPhotoFile) {
      setPhotoFile(pendingPhotoFile)
      toast.success(`Photo cropped and saved: ${pendingPhotoFile.name}`)
    }
    setPendingPhotoFile(null)
  }

  

  return {
    photoPreview,
    photoFile,
    showPhotoCropModal,
    pendingPhotoFile,
    photoInputRef,
    setShowPhotoCropModal,
    handlePhotoChange,
    handlePhotoCropSave,
  }
}
