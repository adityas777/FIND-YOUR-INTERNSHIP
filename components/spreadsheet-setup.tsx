"use client"

import { AlertCircle, CheckCircle, ExternalLink, Copy, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface SpreadsheetSetupProps {
  onRetry?: () => void
}

export function SpreadsheetSetup({ onRetry }: SpreadsheetSetupProps) {
  const [copied, setCopied] = useState(false)
  const [retrying, setRetrying] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRetry = () => {
    setRetrying(true)
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  return (
    <Card className="max-w-2xl mx-auto bg-gray-900/90 border-gray-700/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <AlertCircle className="h-5 w-5 text-orange-400" />
          Spreadsheet Access Setup
        </CardTitle>
        <CardDescription className="text-gray-300">
          Your spreadsheet needs to be properly shared to display job data. Follow these steps:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-gray-800/50 border-orange-500/30">
          <AlertCircle className="h-4 w-4 text-orange-400" />
          <AlertTitle className="text-white">Current Status</AlertTitle>
          <AlertDescription className="text-gray-300">
            Cannot access your spreadsheet. Currently showing sample data instead.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="border border-gray-700/50 rounded-lg p-4 space-y-3 bg-gray-800/30">
            <h4 className="font-semibold text-green-400">✅ Recommended Method: Share with Link</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Open your Google Spreadsheet</li>
              <li>Click the "Share" button (top right corner)</li>
              <li>Click "Change to anyone with the link"</li>
              <li>Set permission to "Viewer"</li>
              <li>Click "Copy link" and "Done"</li>
              <li>Refresh this page</li>
            </ol>
          </div>

          <div className="border border-gray-700/50 rounded-lg p-4 space-y-3 bg-gray-800/30">
            <h4 className="font-semibold text-blue-400">📋 Alternative: Publish to Web</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>In your spreadsheet: File → Share → Publish to web</li>
              <li>Select "Entire Document" and "Comma-separated values (.csv)"</li>
              <li>Click "Publish"</li>
              <li>Copy the generated CSV link</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>

        <Alert className="bg-gray-800/50 border-green-500/30">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertTitle className="text-white">Expected Spreadsheet Format</AlertTitle>
          <AlertDescription className="text-gray-300">
            Your spreadsheet should have columns like: Title, Company, Location, Type, Salary, Description, Skills,
            Date, URL
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300">Your Spreadsheet ID:</p>
          <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded text-sm font-mono text-gray-300">
            <span className="flex-1">1yIghg4F4l6VaGAS2hI7lVQnHfbH625RL87Dwe7af0Ss</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard("1yIghg4F4l6VaGAS2hI7lVQnHfbH625RL87Dwe7af0Ss")}
              className="border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              <Copy className="h-3 w-3 mr-1" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              window.open(
                "https://docs.google.com/spreadsheets/d/1yIghg4F4l6VaGAS2hI7lVQnHfbH625RL87Dwe7af0Ss/edit",
                "_blank",
              )
            }
            className="border-gray-700 text-gray-300 hover:bg-gray-700"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Spreadsheet
          </Button>
          <Button
            onClick={handleRetry}
            disabled={retrying}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${retrying ? "animate-spin" : ""}`} />
            {retrying ? "Trying..." : "Try Again"}
          </Button>
        </div>

        <Alert className="bg-gray-800/50 border-orange-500/30">
          <AlertCircle className="h-4 w-4 text-orange-400" />
          <AlertTitle className="text-white">Troubleshooting</AlertTitle>
          <AlertDescription className="text-gray-300">
            If you're still having issues, make sure your spreadsheet contains actual job data and the sharing settings
            are correct.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
