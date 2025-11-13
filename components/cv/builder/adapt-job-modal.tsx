"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

type AdaptJobModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValue?: string
  onSave: (jobDescription: string) => void
}

export function AdaptJobModal({ 
  open, 
  onOpenChange, 
  initialValue = "", 
  onSave 
}: AdaptJobModalProps) {
  const [jobPrompt, setJobPrompt] = useState(initialValue)

  const handleSave = () => {
    onSave(jobPrompt)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setJobPrompt(initialValue)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adapt to Job</DialogTitle>
          <DialogDescription>
            Enter the job description or title to automatically tailor your CV to match the role's requirements.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="job-prompt">Job Description</Label>
            <ScrollArea className="h-[300px] rounded-md border">
              <Textarea
                id="job-prompt"
                placeholder="Paste the full job description, or enter the job title and key requirements..."
                value={jobPrompt}
                onChange={(e) => setJobPrompt(e.target.value)}
                className="min-h-[280px] resize-none border-0 focus-visible:ring-0 p-4"
              />
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!jobPrompt.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
