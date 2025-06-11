"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { Heart, X, MapPin, Building, Clock, DollarSign, CheckCircle, RefreshCw, Info, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { fetchJobsFromSheet, type JobData } from "@/app/actions/fetch-jobs"
import { SpreadsheetSetup } from "@/components/spreadsheet-setup"
import { SwipeSplash } from "@/components/swipe-splash"
import { useMediaQuery } from "@/hooks/use-media-query"

interface JobSwiperProps {
  onJobAction: (job: JobData, interested: boolean) => void
}

export function JobSwiper({ onJobAction }: JobSwiperProps) {
  const [jobs, setJobs] = useState<JobData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<"spreadsheet" | "fallback" | "manual">("fallback")
  const [refreshing, setRefreshing] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Audio refs for enhanced sound effects
  const successAudioRef = useRef<HTMLAudioElement | null>(null)
  const rejectAudioRef = useRef<HTMLAudioElement | null>(null)
  const swipeAudioRef = useRef<HTMLAudioElement | null>(null)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])
  const scale = useTransform(x, [-200, 0, 200], [0.9, 1, 0.9])

  // Enhanced audio initialization
  useEffect(() => {
    // Success sound (higher pitch, more pleasant)
    successAudioRef.current = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    )

    // Reject sound (lower pitch, more negative)
    rejectAudioRef.current = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    )

    // Swipe sound (subtle whoosh)
    swipeAudioRef.current = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
    )

    // Hide instructions after 5 seconds
    const timer = setTimeout(() => {
      setShowInstructions(false)
    }, 6000)

    return () => clearTimeout(timer)
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const fetchedJobs = await fetchJobsFromSheet()

      if (fetchedJobs.length === 0) {
        setError("No jobs found. Please check your spreadsheet data.")
        setDataSource("fallback")
      } else {
        setJobs(fetchedJobs)
        setError(null)

        const hasLinkedInUrls = fetchedJobs.some((job) => job.linkedinUrl?.includes("linkedin.com"))
        const hasManualData =
          fetchedJobs.length >= 8 && fetchedJobs.some((job) => job.company === "Google" || job.company === "Circles")

        if (hasManualData) {
          setDataSource("manual")
        } else if (hasLinkedInUrls) {
          setDataSource("spreadsheet")
        } else {
          setDataSource("fallback")
        }
      }
    } catch (err) {
      setError("Failed to load jobs. Please try again later.")
      setDataSource("fallback")
      console.error("Error loading jobs:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    loadJobs()
  }

  const playSound = (type: "success" | "reject" | "swipe") => {
    try {
      let audio: HTMLAudioElement | null = null
      switch (type) {
        case "success":
          audio = successAudioRef.current
          break
        case "reject":
          audio = rejectAudioRef.current
          break
        case "swipe":
          audio = swipeAudioRef.current
          break
      }

      if (audio) {
        audio.currentTime = 0
        audio.volume = 0.3
        audio.play().catch(() => {})
      }
    } catch (error) {
      console.log("Audio playback failed:", error)
    }
  }

  const triggerVibration = (pattern: number[]) => {
    try {
      if ("vibrate" in navigator) {
        navigator.vibrate(pattern)
      }
    } catch (error) {
      console.log("Vibration failed:", error)
    }
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 80
    const swipeDistance = info.offset.x
    const velocity = Math.abs(info.velocity.x)
    const swipeDirection = swipeDistance > 0 ? "right" : "left"

    // Play swipe sound for any significant drag
    if (Math.abs(swipeDistance) > 40) {
      playSound("swipe")
    }

    if (Math.abs(swipeDistance) > threshold || velocity > 400) {
      const isInterested = swipeDirection === "right"
      handleSwipe(isInterested)
    } else {
      x.set(0) // Reset position if swipe wasn't strong enough
    }
  }

  const handleSwipe = (interested: boolean, isButtonClick = false) => {
    const currentJob = jobs[currentIndex]

    // Set swipe direction for splash effect
    setSwipeDirection(interested ? "right" : "left")

    if (interested) {
      playSound("success")
      triggerVibration([100, 50, 100])

      // Only redirect to LinkedIn if it's a button click (heart button)
      if (isButtonClick && currentJob.jobLink) {
        setTimeout(() => {
          try {
            if (isMobile) {
              window.location.href = currentJob.jobLink!
            } else {
              window.open(currentJob.jobLink, "_blank", "noopener,noreferrer")
            }
          } catch (error) {
            console.error("Failed to open LinkedIn URL:", error)
            window.open(currentJob.jobLink!, "_blank", "noopener,noreferrer")
          }
        }, 300)
      }
    } else {
      playSound("reject")
      triggerVibration([150, 100])
    }

    onJobAction(currentJob, interested)

    // Animate card out and move to next
    setTimeout(() => {
      if (currentIndex < jobs.length - 1) {
        setCurrentIndex(currentIndex + 1)
        x.set(0)
      } else {
        setJobs([])
      }
    }, 250)
  }

  const handleSplashComplete = () => {
    setSwipeDirection(null)
  }

  if (loading) {
    return <JobCardSkeleton />
  }

  if (error && dataSource === "fallback" && jobs.length === 0) {
    return <SpreadsheetSetup onRetry={handleRefresh} />
  }

  const currentJob = jobs[currentIndex]

  if (!currentJob) {
    return (
      <div className="text-center py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-xl font-bold mb-3 text-white">Great job!</h3>
          <p className="text-gray-300 mb-4 max-w-sm mx-auto text-sm">
            You've reviewed all available positions. Check back later for new opportunities!
          </p>
          <Button
            onClick={() => setCurrentIndex(0)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Over
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-3 px-2">
      {/* Swipe splash effect */}
      <SwipeSplash direction={swipeDirection} onComplete={handleSplashComplete} />

      {/* Compact Instructions Alert */}
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <Alert className="max-w-sm mx-auto bg-blue-900/70 border-blue-500/30 backdrop-blur-sm shadow-lg py-2">
            <Info className="h-3 w-3 text-blue-400" />
            <AlertDescription className="text-blue-300 text-xs">
              <div className="flex items-center justify-between">
                <span>❤️ = LinkedIn • 👆 = Save • ❌ = Skip</span>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Compact Data source indicator */}
      {(dataSource === "spreadsheet" || dataSource === "manual") && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Alert className="max-w-sm mx-auto bg-gray-900/70 border-green-500/30 backdrop-blur-sm shadow-lg py-2">
            <CheckCircle className="h-3 w-3 text-green-400" />
            <AlertDescription className="flex items-center justify-between text-green-300 text-xs">
              <span>✅ {jobs.length} LinkedIn jobs loaded</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-green-500/30 text-green-400 hover:bg-green-500/10 h-6 px-2 text-xs"
              >
                <RefreshCw className={`h-2 w-2 mr-1 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "..." : "↻"}
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Compact Job Card - Fits in viewport */}
      <div className="relative max-w-sm mx-auto" style={{ height: isMobile ? "calc(100vh - 280px)" : "500px" }}>
        <motion.div
          className="absolute inset-0"
          style={{ x, rotate, opacity, scale }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.02, rotateZ: x.get() / 15 }}
          animate={{
            boxShadow:
              x.get() > 40
                ? "0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3)"
                : x.get() < -40
                  ? "0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3)"
                  : "0 0 20px rgba(147, 51, 234, 0.4), 0 0 40px rgba(147, 51, 234, 0.2)",
          }}
          transition={{ duration: 0.2 }}
        >
          <Card className="h-full cursor-grab active:cursor-grabbing bg-gray-800/95 border-gray-600/50 backdrop-blur-md shadow-2xl overflow-hidden">
            {/* Compact Header */}
            <CardHeader className="pb-3 p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-bold leading-tight mb-2 text-white truncate">
                    {currentJob.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-300 text-sm">
                    <Building className="h-3 w-3 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{currentJob.company}</span>
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-2 py-1 text-xs flex-shrink-0"
                >
                  {currentJob.type}
                </Badge>
              </div>
            </CardHeader>

            {/* Compact Content */}
            <CardContent className="space-y-3 pb-16 p-4 pt-0">
              {/* Location and Date - Compact Row */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-gray-300 min-w-0 flex-1">
                  <MapPin className="h-3 w-3 text-green-400 flex-shrink-0" />
                  <span className="truncate">{currentJob.location}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300 flex-shrink-0 ml-2">
                  <Clock className="h-3 w-3 text-yellow-400" />
                  <span className="text-xs">{currentJob.postedDate}</span>
                </div>
              </div>

              {/* Salary */}
              <div className="flex items-center gap-2 text-green-400 font-semibold text-lg">
                <DollarSign className="h-4 w-4" />
                <span className="truncate">{currentJob.salary}</span>
              </div>

              {/* Description - Truncated */}
              <p className="text-gray-300 leading-relaxed text-sm line-clamp-3">{currentJob.description}</p>

              {/* Skills - Compact */}
              {currentJob.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-white">Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {currentJob.skills.slice(0, 6).map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-blue-500/10 text-blue-300 border-blue-500/30 px-2 py-0.5"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {currentJob.skills.length > 6 && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-gray-500/10 text-gray-400 border-gray-500/30 px-2 py-0.5"
                      >
                        +{currentJob.skills.length - 6}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* LinkedIn link indicator - Compact */}
              {currentJob.jobLink && (
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-2">
                  <div className="flex items-center gap-2 text-blue-300 text-xs">
                    <ExternalLink className="h-3 w-3" />
                    <span>Tap ❤️ to view on LinkedIn</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Compact Action Buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-8">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={() => handleSwipe(false, true)}
              className="rounded-full w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0 shadow-lg transition-all duration-300 relative overflow-hidden group"
              style={{
                boxShadow: "0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.2)",
              }}
            >
              <X className="h-5 w-5 text-white" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={() => handleSwipe(true, true)}
              className="rounded-full w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0 shadow-lg transition-all duration-300 relative overflow-hidden group"
              style={{
                boxShadow: "0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.2)",
              }}
            >
              <Heart className="h-5 w-5 text-white" />
            </Button>
          </motion.div>
        </div>

        {/* Compact Swipe Indicators */}
        <motion.div
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-3xl"
          animate={{
            opacity: x.get() < -40 ? 1 : 0,
            scale: x.get() < -40 ? 1.2 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          ❌
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-3xl"
          animate={{
            opacity: x.get() > 40 ? 1 : 0,
            scale: x.get() > 40 ? 1.2 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          💾
        </motion.div>
      </div>

      {/* Compact Mobile Instructions */}
      {isMobile && (
        <div className="text-center text-gray-400 text-xs mt-2">
          <p>Swipe left ❌ • Swipe right 💾 • Tap ❤️ for LinkedIn</p>
        </div>
      )}
    </div>
  )
}

function JobCardSkeleton() {
  return (
    <div className="relative max-w-sm mx-auto h-96 px-2">
      <Card className="h-full bg-gray-900/80 border-gray-700/50 backdrop-blur-md shadow-2xl">
        <CardHeader className="p-4 pb-3">
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4 bg-gray-700/50" />
              <Skeleton className="h-4 w-1/2 bg-gray-700/50" />
            </div>
            <Skeleton className="h-6 w-16 bg-gray-700/50" />
          </div>
        </CardHeader>

        <CardContent className="space-y-3 p-4 pt-0">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 bg-gray-700/50" />
            <Skeleton className="h-4 w-20 bg-gray-700/50" />
          </div>
          <Skeleton className="h-4 w-28 bg-gray-700/50" />
          <Skeleton className="h-12 w-full bg-gray-700/50" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 bg-gray-700/50" />
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-5 w-12 bg-gray-700/50" />
              <Skeleton className="h-5 w-16 bg-gray-700/50" />
              <Skeleton className="h-5 w-14 bg-gray-700/50" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
