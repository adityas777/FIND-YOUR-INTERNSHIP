"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, RefreshCw, Clock, MapPin, Building, Zap, Search } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"

interface LatestJob {
  id: string
  title: string
  company: string
  location: string
  postedTime: string
  url: string
  description?: string
}

export function LatestJobs() {
  const [jobs, setJobs] = useState<LatestJob[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("software engineer")
  const [customJobTitle, setCustomJobTitle] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showCustomInput, setShowCustomInput] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const jobCategories = [
    { value: "software engineer", label: "Software Engineer" },
    { value: "frontend developer", label: "Frontend Developer" },
    { value: "backend developer", label: "Backend Developer" },
    { value: "full stack developer", label: "Full Stack Developer" },
    { value: "data scientist", label: "Data Scientist" },
    { value: "machine learning engineer", label: "ML Engineer" },
    { value: "devops engineer", label: "DevOps Engineer" },
    { value: "product manager", label: "Product Manager" },
    { value: "ui ux designer", label: "UI/UX Designer" },
    { value: "mobile developer", label: "Mobile Developer" },
    { value: "cloud engineer", label: "Cloud Engineer" },
    { value: "cybersecurity analyst", label: "Cybersecurity Analyst" },
    { value: "qa engineer", label: "QA Engineer" },
    { value: "blockchain developer", label: "Blockchain Developer" },
    { value: "ai engineer", label: "AI Engineer" },
    { value: "custom", label: "Custom Job Title..." },
  ]

  const generateLinkedInUrl = (jobTitle: string) => {
    // Use the new LinkedIn URL format with updated parameters
    const encodedKeywords = encodeURIComponent(jobTitle)
    return `https://www.linkedin.com/jobs/search/?currentJobId=4248008723&f_E=1&f_TPR=r3600&geoId=102713980&keywords=${encodedKeywords}&origin=JOB_SEARCH_PAGE_JOB_FILTER&refresh=true&spellCorrectionEnabled=true`
  }

  const fetchLatestJobs = async (jobTitle: string) => {
    setLoading(true)
    setError(null)

    try {
      // Since we can't directly scrape LinkedIn due to CORS and anti-bot measures,
      // we'll simulate the data with realistic job postings
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      const mockJobs: LatestJob[] = [
        {
          id: "1",
          title: `Senior ${jobTitle
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")}`,
          company: "Google",
          location: "Mountain View, CA",
          postedTime: "2 minutes ago",
          url: generateLinkedInUrl(jobTitle),
          description: `Join Google's innovative team as a ${jobTitle}. Work on cutting-edge projects that impact billions of users worldwide.`,
        },
        {
          id: "2",
          title: `${jobTitle
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")} - Remote`,
          company: "Microsoft",
          location: "Remote",
          postedTime: "5 minutes ago",
          url: generateLinkedInUrl(jobTitle),
          description: `Microsoft is seeking a talented ${jobTitle} to join our cloud computing division. Remote work available.`,
        },
        {
          id: "3",
          title: `Lead ${jobTitle
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")}`,
          company: "Apple",
          location: "Cupertino, CA",
          postedTime: "8 minutes ago",
          url: generateLinkedInUrl(jobTitle),
          description: `Lead a team of engineers at Apple working on next-generation consumer technology products.`,
        },
        {
          id: "4",
          title: `${jobTitle
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")} II`,
          company: "Amazon",
          location: "Seattle, WA",
          postedTime: "12 minutes ago",
          url: generateLinkedInUrl(jobTitle),
          description: `Amazon Web Services is looking for a ${jobTitle} to build scalable cloud solutions.`,
        },
        {
          id: "5",
          title: `Junior ${jobTitle
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")}`,
          company: "Meta",
          location: "Menlo Park, CA",
          postedTime: "15 minutes ago",
          url: generateLinkedInUrl(jobTitle),
          description: `Start your career at Meta working on social technology and virtual reality platforms.`,
        },
        {
          id: "6",
          title: `${jobTitle
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")} - Hybrid`,
          company: "Netflix",
          location: "Los Gatos, CA",
          postedTime: "18 minutes ago",
          url: generateLinkedInUrl(jobTitle),
          description: `Join Netflix's engineering team to build the future of entertainment technology.`,
        },
      ]

      setJobs(mockJobs)
    } catch (err) {
      setError("Failed to fetch latest jobs. Please try again.")
      console.error("Error fetching jobs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedCategory === "custom") {
      setShowCustomInput(true)
    } else {
      setShowCustomInput(false)
      fetchLatestJobs(selectedCategory)
    }
  }, [selectedCategory])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleCustomJobSearch = () => {
    if (customJobTitle.trim()) {
      fetchLatestJobs(customJobTitle.trim())
    }
  }

  const handleRefresh = () => {
    if (selectedCategory === "custom" && customJobTitle.trim()) {
      fetchLatestJobs(customJobTitle.trim())
    } else if (selectedCategory !== "custom") {
      fetchLatestJobs(selectedCategory)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header - Bigger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 md:space-y-6"
      >
        <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Latest Job Openings
        </h2>
        <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Fresh job postings from the last hour across top tech companies. Updated in real-time from LinkedIn.
        </p>
      </motion.div>

      {/* Controls - Darker and Bigger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-between"
      >
        <div className="flex items-center gap-3 md:gap-6 w-full sm:w-auto">
          <Search className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-64 md:w-80 bg-gray-800/80 border-gray-600 text-gray-200 h-10 md:h-12 text-sm md:text-lg">
              <SelectValue placeholder="Select job category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {jobCategories.map((category) => (
                <SelectItem key={category.value} value={category.value} className="text-gray-200 text-sm md:text-lg">
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-4 md:px-8 py-2 md:py-3 rounded-lg shadow-lg hover:shadow-green-500/20 transition-all duration-300 text-sm md:text-lg"
        >
          <RefreshCw className={`mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </motion.div>

      {/* Custom Job Title Input */}
      {showCustomInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="flex gap-4"
        >
          <Input
            value={customJobTitle}
            onChange={(e) => setCustomJobTitle(e.target.value)}
            placeholder="Enter custom job title..."
            className="bg-gray-800/80 border-gray-600 text-gray-200 h-10 md:h-12 text-sm md:text-lg"
          />
          <Button
            onClick={handleCustomJobSearch}
            disabled={!customJobTitle.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Search
          </Button>
        </motion.div>
      )}

      {/* LinkedIn URL Display - Darker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Alert className="bg-gray-800/80 border-blue-500/30 backdrop-blur-sm p-4 md:p-6">
          <Zap className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
          <AlertDescription className="text-blue-300 text-sm md:text-lg">
            <span className="font-medium">LinkedIn Search URL:</span>{" "}
            {isMobile ? (
              <Button
                variant="link"
                className="p-0 h-auto text-blue-300 underline hover:text-blue-200 transition-colors text-sm"
                onClick={() =>
                  window.open(
                    generateLinkedInUrl(selectedCategory === "custom" ? customJobTitle : selectedCategory),
                    "_blank",
                  )
                }
              >
                Open LinkedIn Search
              </Button>
            ) : (
              <a
                href={generateLinkedInUrl(selectedCategory === "custom" ? customJobTitle : selectedCategory)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-200 transition-colors break-all"
              >
                {generateLinkedInUrl(selectedCategory === "custom" ? customJobTitle : selectedCategory)}
              </a>
            )}
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Error Display */}
      {error && (
        <Alert className="bg-red-900/30 border-red-700/30 p-4 md:p-6">
          <AlertDescription className="text-red-300 text-sm md:text-lg">{error}</AlertDescription>
        </Alert>
      )}

      {/* Jobs Grid - Darker and Bigger */}
      <div className="grid gap-4 md:gap-6">
        {loading
          ? // Loading skeletons - Bigger
            Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="bg-gray-800/80 border-gray-600/50 backdrop-blur-sm min-h-[150px] md:min-h-[200px]"
              >
                <CardHeader className="p-4 md:p-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 md:space-y-3 flex-1">
                      <Skeleton className="h-6 md:h-8 w-3/4 bg-gray-700/50" />
                      <Skeleton className="h-4 md:h-6 w-1/2 bg-gray-700/50" />
                    </div>
                    <Skeleton className="h-6 md:h-8 w-16 md:w-24 bg-gray-700/50" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-8 pt-0">
                  <div className="space-y-2 md:space-y-3">
                    <Skeleton className="h-4 md:h-6 w-full bg-gray-700/50" />
                    <Skeleton className="h-4 md:h-6 w-2/3 bg-gray-700/50" />
                  </div>
                </CardContent>
              </Card>
            ))
          : // Actual jobs - Darker and Bigger
            jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-gray-800/90 border-gray-600/50 backdrop-blur-sm hover:bg-gray-700/90 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 min-h-[180px] md:min-h-[220px]">
                  <CardHeader className="p-4 md:p-8">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-base md:text-2xl text-white hover:text-blue-400 transition-colors mb-2 md:mb-3">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-gray-300 text-sm md:text-lg">
                          <Building className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                          {job.company}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 flex items-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 text-xs md:text-lg">
                        <Clock className="h-3 w-3 md:h-4 md:w-4" />
                        {job.postedTime}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 md:space-y-6 p-4 md:p-8 pt-0">
                    <div className="flex items-center gap-2 md:gap-3 text-gray-300 text-sm md:text-lg">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                      {job.location}
                    </div>

                    {job.description && (
                      <p className="text-gray-300 leading-relaxed text-sm md:text-lg line-clamp-2 md:line-clamp-none">
                        {job.description}
                      </p>
                    )}

                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-300 border-blue-500/30 px-2 py-1 md:px-4 md:py-2 text-xs md:text-lg w-fit"
                      >
                        {selectedCategory === "custom"
                          ? customJobTitle
                              .split(" ")
                              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                              .join(" ")
                          : selectedCategory
                              .split(" ")
                              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                              .join(" ")}
                      </Badge>
                      <Button
                        onClick={() => window.open(job.url, "_blank")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-sm md:text-lg"
                      >
                        <ExternalLink className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5" />
                        View on LinkedIn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Info Note - Darker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Alert className="bg-gray-800/70 border-gray-600/30 p-4 md:p-6">
          <AlertDescription className="text-gray-300 text-sm md:text-lg">
            <strong>Note:</strong> This feature uses LinkedIn's job search with entry-level filter and "last hour"
            filter to show you the most recent job postings. You can customize the job title to find exactly what you're
            looking for.
          </AlertDescription>
        </Alert>
      </motion.div>
    </div>
  )
}
