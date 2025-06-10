"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ResumeUploadProps {
  onUploadComplete: (content: string) => void
}

export function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        setUploadedFile(file)
        setUploading(true)

        // Read file content
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string

          // Simulate upload progress
          let progress = 0
          const interval = setInterval(() => {
            progress += 10
            setUploadProgress(progress)

            if (progress >= 100) {
              clearInterval(interval)
              setTimeout(() => {
                setUploading(false)
                onUploadComplete(content || "Resume content could not be extracted")
              }, 500)
            }
          }, 200)
        }
        reader.readAsText(file)
      }
    },
    [onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  })

  if (uploading) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gray-900/90 border-gray-700/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-white">
            <FileText className="h-6 w-6 text-blue-400" />
            Uploading Resume
          </CardTitle>
          <CardDescription className="text-gray-300">Processing your resume...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress
            value={uploadProgress}
            className="w-full h-2 bg-gray-700"
            indicatorClassName="bg-gradient-to-r from-purple-500 to-blue-500"
          />
          <p className="text-sm text-center text-gray-400">{uploadedFile?.name}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-900/90 border-gray-700/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-white">
          <Briefcase className="h-6 w-6 text-purple-400" />
          Upload Your Resume
        </CardTitle>
        <CardDescription className="text-gray-300">Upload your resume to start matching with jobs</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-purple-500 bg-purple-900/20" : "border-gray-700 hover:border-gray-500 bg-gray-800/30"
          }`}
        >
          <input {...getInputProps()} id="resume-file-input" />
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          {isDragActive ? (
            <p className="text-purple-400">Drop your resume here...</p>
          ) : (
            <div>
              <p className="text-gray-300 mb-2">Drag & drop your resume here, or click to select</p>
              <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX files</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            onClick={() => document.getElementById("resume-file-input")?.click()}
          >
            Choose File
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
