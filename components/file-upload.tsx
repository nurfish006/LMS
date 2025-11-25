"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileText, ImageIcon, File, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface FileUploadProps {
  onUploadComplete: (fileUrl: string, fileName: string) => void
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export function FileUpload({
  onUploadComplete,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.txt,.zip,.rar",
  maxSize = 50,
  className = "",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
      return <ImageIcon className="h-5 w-5" />
    }
    if (["pdf", "doc", "docx", "txt"].includes(ext || "")) {
      return <FileText className="h-5 w-5" />
    }
    return <File className="h-5 w-5" />
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${maxSize}MB`)
      return
    }

    try {
      setUploading(true)
      setProgress(10)

      const formData = new FormData()
      formData.append("file", file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const data = await response.json()
      setProgress(100)
      setUploadedFile({ name: file.name, url: data.fileUrl })
      onUploadComplete(data.fileUrl, file.name)
      toast.success("File uploaded successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload file")
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const handleRemove = () => {
    setUploadedFile(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {uploadedFile ? (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {getFileIcon(uploadedFile.name)}
            <span className="truncate text-sm font-medium">{uploadedFile.name}</span>
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemove} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-24 border-dashed"
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-6 w-6" />
            <span>{uploading ? "Uploading..." : "Click to upload file"}</span>
            <span className="text-xs text-muted-foreground">Max {maxSize}MB</span>
          </div>
        </Button>
      )}

      {uploading && progress > 0 && <Progress value={progress} className="h-2" />}
    </div>
  )
}
