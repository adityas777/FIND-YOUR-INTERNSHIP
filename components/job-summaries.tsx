"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, RefreshCw } from "lucide-react"
import type { JobSummary } from "@/app/actions/fetch-jobs"

export function JobSummaries() {
  const [summaries, setSummaries] = useState<JobSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchSummaries()
  }, [])

  const fetchSummaries = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/job-summaries")
      const data = await response.json()
      setSummaries(data)
    } catch (error) {
      console.error("Error fetching summaries:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(summaries, null, 2)
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadJSON = () => {
    const jsonString = JSON.stringify(summaries, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "job-summaries.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Loading Job Summaries...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Simplified Job Summaries JSON</CardTitle>
              <CardDescription>
                Company name, location, and one-line job description ({summaries.length} jobs)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchSummaries}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy JSON"}
              </Button>
              <Button variant="outline" size="sm" onClick={downloadJSON}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
            {JSON.stringify(summaries, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {/* Preview cards */}
      <div className="grid gap-4 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold">Preview:</h3>
        {summaries.slice(0, 5).map((summary, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{summary.company_name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="outline">{summary.location}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{summary.job_description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sample JSON structure display */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">JSON Structure</CardTitle>
          <CardDescription>Each job entry contains only these three fields:</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded-lg text-sm">
            {`[
  {
    "company_name": "Google",
    "location": "Hyderabad, Telangana, India", 
    "job_description": "Google is seeking a Software Engineer III, Full Stack, Corporate Engineering with expertise in Full Stack, JavaScript, Python to join our innovative team and contribute to cutting-edge internal tools and systems."
  },
  {
    "company_name": "Qualcomm",
    "location": "Hyderabad, Telangana, India",
    "job_description": "Qualcomm is hiring a Java Full-stack Developer with expertise in Java, Full-stack, Spring to work on exciting wireless technology projects and drive technological innovation."
  }
]`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
