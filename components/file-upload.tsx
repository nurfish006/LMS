"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileText, ImageIcon, File, CheckCircle, Loader2 } from "lucide-react"
// Assuming you are using sonner for toasts, otherwise change to useToast from shadcn/ui
import { toast } from "sonner" 

interface FileUploadProps {
  // 💡 Note: onUploadComplete now correctly passes two string arguments
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

      const xhr = new XMLHttpRequest()

      const uploadPromise = new Promise<{ fileUrl: string; fileName: string }>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 90)
            setProgress(percentComplete)
          }
        })

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText)
            // Assuming the /api/upload endpoint returns { fileUrl: "...", fileName: "..." }
            resolve(data) 
          } else {
            try {
              const error = JSON.parse(xhr.responseText)
              reject(new Error(error.error || "Upload failed"))
            } catch {
              reject(new Error("Upload failed"))
            }
          }
        })

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"))
        })

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload cancelled"))
        })

        // 💡 Note: This is the URL that handles the actual file storage (e.g., S3 upload, local storage)
        xhr.open("POST", "/api/upload") 
        xhr.send(formData)
      })

      const data = await uploadPromise
      setProgress(100)
      setUploadedFile({ name: file.name, url: data.fileUrl })
      
      // 💡 This calls the handler in TeacherMaterialsPage with the URL and Name
      onUploadComplete(data.fileUrl, file.name) 
      
      toast.success("File uploaded successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload file")
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const handleRemove = async () => {
    if (uploadedFile?.url) {
      try {
        // Send a request to the backend to delete the stored file
        await fetch(`/api/upload?url=${encodeURIComponent(uploadedFile.url)}`, {
          method: "DELETE",
        })
      } catch (error) {
        // Silently fail - file might already be deleted or deletion API doesn't exist/matter
      }
    }
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
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
            <span>{uploading ? "Uploading..." : "Click to upload file"}</span>
            <span className="text-xs text-muted-foreground">Max {maxSize}MB</span>
          </div>
        </Button>
      )}

      {uploading && progress > 0 && <Progress value={progress} className="h-2" />}
    </div>
  )
}