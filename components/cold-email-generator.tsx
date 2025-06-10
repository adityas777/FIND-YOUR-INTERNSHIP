"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Copy,
  Send,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  User,
  FileText,
  Target,
  Lightbulb,
  Mail,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { generateColdEmailWithProfile } from "@/app/actions/generate-email"
import type { JobData } from "@/app/actions/fetch-jobs"
import { motion } from "framer-motion"

interface ColdEmailGeneratorProps {
  interestedJobs: JobData[]
  resumeContent: string
  userProfile?: {
    name: string
    email: string
    experienceLevel: string
    skills: string[]
    education: string[]
  }
}

interface DetailedImprovements {
  summary: string[]
  experience: string[]
  skills: string[]
  education: string[]
  general: string[]
}

export function ColdEmailGenerator({ interestedJobs = [], resumeContent = "", userProfile }: ColdEmailGeneratorProps) {
  const [selectedJobIndex, setSelectedJobIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [emailContent, setEmailContent] = useState("")
  const [improvements, setImprovements] = useState<DetailedImprovements>({
    summary: [],
    experience: [],
    skills: [],
    education: [],
    general: [],
  })
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateEmail = async () => {
    if (!userProfile) {
      setError("Please complete your profile first")
      return
    }

    if (!interestedJobs || interestedJobs.length === 0) {
      setError("You need to swipe right on at least one job first")
      return
    }

    if (selectedJobIndex >= interestedJobs.length) {
      setError("Selected job is not available")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const selectedJob = interestedJobs[selectedJobIndex]
      if (!selectedJob) {
        throw new Error("Selected job not found")
      }

      const result = await generateColdEmailWithProfile(userProfile, selectedJob)

      if (result.email) {
        setEmailContent(result.email)
        setImprovements(
          result.detailedImprovements || {
            summary: [],
            experience: [],
            skills: [],
            education: [],
            general: [],
          },
        )
      } else {
        setError("Failed to generate email. Please try again.")
      }
    } catch (err) {
      console.error("Error generating email:", err)
      setError("An error occurred while generating the email")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const improvementSections = [
    { key: "summary", title: "Professional Summary", icon: User, color: "text-blue-400" },
    { key: "experience", title: "Work Experience", icon: Target, color: "text-green-400" },
    { key: "skills", title: "Skills & Technologies", icon: Lightbulb, color: "text-yellow-400" },
    { key: "education", title: "Education & Certifications", icon: FileText, color: "text-purple-400" },
    { key: "general", title: "General Improvements", icon: CheckCircle, color: "text-pink-400" },
  ]

  // Safe access to interested jobs
  const currentJob = interestedJobs && interestedJobs.length > 0 ? interestedJobs[selectedJobIndex] : null

  return (
    <div className="space-y-6">
      {/* Email Generator Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="bg-gray-800/95 border-gray-600/50 backdrop-blur-sm shadow-2xl min-h-[400px]">
          <CardHeader className="p-8">
            <CardTitle className="text-white text-3xl flex items-center gap-3">
              <Send className="h-8 w-8 text-purple-400" />
              Cold Email Generator
            </CardTitle>
            <CardDescription className="text-gray-300 text-xl">
              Generate personalized cold emails using your profile and job descriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            {/* Profile Summary */}
            {userProfile && (
              <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600/50">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-3 text-xl">
                  <User className="h-6 w-6 text-blue-400" />
                  Using Profile: {userProfile.name}
                </h4>
                <div className="grid md:grid-cols-2 gap-6 text-lg">
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <span className="text-gray-200 ml-3">{userProfile.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Experience:</span>
                    <span className="text-gray-200 ml-3">{userProfile.experienceLevel}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-gray-400 text-lg">Top Skills:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userProfile.skills.slice(0, 5).map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-sm bg-blue-500/10 text-blue-300 border-blue-500/30 px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-gray-200">Select Job</Label>
              {interestedJobs && interestedJobs.length > 0 ? (
                <div className="grid gap-3">
                  <div className="flex flex-wrap gap-2">
                    {interestedJobs.map((job, index) => (
                      <Badge
                        key={index}
                        variant={selectedJobIndex === index ? "default" : "outline"}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedJobIndex === index
                            ? "bg-purple-600 hover:bg-purple-700 shadow-lg"
                            : "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600"
                        }`}
                        onClick={() => setSelectedJobIndex(index)}
                      >
                        {job.company || "Unknown Company"} - {job.title || "Unknown Position"}
                      </Badge>
                    ))}
                  </div>
                  {currentJob && (
                    <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600/50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-white font-semibold text-2xl">
                            {currentJob.title || "Unknown Position"}
                          </h4>
                          <p className="text-gray-400 text-lg">{currentJob.company || "Unknown Company"}</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2 text-lg">
                          {currentJob.salary || "Competitive"}
                        </Badge>
                      </div>
                      <p className="text-gray-300 mb-4 text-lg leading-relaxed">
                        {currentJob.description || "No description available"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(currentJob.skills || []).slice(0, 5).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-sm bg-blue-500/10 text-blue-300 border-blue-500/30 px-3 py-1"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-800/50 rounded-lg p-6 text-center border border-gray-700/50">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-300 mb-2">No interested jobs yet</p>
                  <p className="text-gray-500 text-sm">Swipe right on jobs you're interested in first.</p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleGenerateEmail}
              disabled={loading || !interestedJobs || interestedJobs.length === 0 || !userProfile}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 text-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Generating Personalized Email...
                </>
              ) : (
                <>
                  <Send className="mr-3 h-6 w-6" />
                  Generate Cold Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {emailContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <TabsTrigger
                value="email"
                className="data-[state=active]:bg-purple-500/30 data-[state=active]:text-white text-gray-300"
              >
                Generated Email
              </TabsTrigger>
              <TabsTrigger
                value="improvements"
                className="data-[state=active]:bg-purple-500/30 data-[state=active]:text-white text-gray-300"
              >
                Profile Improvements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <Card className="bg-gray-900/90 border-gray-700/50 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="h-5 w-5 text-green-400" />
                    Your Personalized Cold Email
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    AI-generated email based on your profile and the selected job description
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                    <pre className="whitespace-pre-wrap text-gray-200 font-sans leading-relaxed">{emailContent}</pre>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={handleGenerateEmail}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={copyToClipboard}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Email
                          </>
                        )}
                      </Button>
                      {currentJob && userProfile && (
                        <Button
                          onClick={() => {
                            window.location.href = `mailto:?subject=Regarding ${
                              currentJob.title || "Position"
                            } Position&body=${encodeURIComponent(emailContent)}`
                          }}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Send Email
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="improvements">
              <div className="space-y-4">
                {improvementSections.map((section, index) => {
                  const sectionImprovements = improvements[section.key as keyof DetailedImprovements] || []
                  if (!sectionImprovements || sectionImprovements.length === 0) return null

                  return (
                    <motion.div
                      key={section.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="bg-gray-900/90 border-gray-700/50 backdrop-blur-sm shadow-xl">
                        <CardHeader>
                          <CardTitle className={`text-white flex items-center gap-2 ${section.color}`}>
                            <section.icon className="h-5 w-5" />
                            {section.title}
                          </CardTitle>
                          <CardDescription className="text-gray-300">
                            Recommendations to improve this section of your profile
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {sectionImprovements.map((improvement, improvementIndex) => (
                              <div
                                key={improvementIndex}
                                className="flex gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30"
                              >
                                <div className={`w-2 h-2 rounded-full mt-2 ${section.color.replace("text-", "bg-")}`} />
                                <p className="text-gray-200 leading-relaxed">{improvement}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  )
}
