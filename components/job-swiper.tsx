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
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8])

  // Track swipe start position for better mobile detection
  const startX = useRef(0)
  const isDragging = useRef(false)

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
    }, 8000)

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

  const handleDragStart = (_: any, info: PanInfo) => {
    startX.current = info.point.x
    isDragging.current = true
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (!isDragging.current) return

    const threshold = 100
    const swipeDistance = info.offset.x
    const velocity = Math.abs(info.velocity.x)
    const swipeDirection = swipeDistance > 0 ? "right" : "left"

    console.log("Swipe direction:", swipeDirection, "Distance:", swipeDistance, "Velocity:", velocity)

    // Play swipe sound for any significant drag
    if (Math.abs(swipeDistance) > 50) {
      playSound("swipe")
    }

    if (Math.abs(swipeDistance) > threshold || velocity > 500) {
      // Determine if it's a right swipe (interested) or left swipe (not interested)
      const isInterested = swipeDirection === "right"
      handleSwipe(isInterested, false) // false = swipe action, not button click
    } else {
      x.set(0) // Reset position if swipe wasn't strong enough
    }

    isDragging.current = false
  }

  const handleSwipe = (interested: boolean, isButtonClick = false) => {
    const currentJob = jobs[currentIndex]

    // Set swipe direction for splash effect
    setSwipeDirection(interested ? "right" : "left")

    if (interested) {
      // Enhanced feedback for right swipe (interested)
      playSound("success")
      triggerVibration([100, 50, 100, 50, 100])

      // Only redirect to LinkedIn if it's a button click (heart button)
      if (isButtonClick && currentJob.jobLink) {
        // Use a more reliable method for mobile redirect
        setTimeout(() => {
          try {
            if (isMobile) {
              // For mobile, use location.href for better compatibility
              window.location.href = currentJob.jobLink!
            } else {
              // For desktop, use window.open
              window.open(currentJob.jobLink, "_blank", "noopener,noreferrer")
            }
          } catch (error) {
            console.error("Failed to open LinkedIn URL:", error)
            // Fallback: try the other method
            if (isMobile) {
              window.open(currentJob.jobLink!, "_blank", "noopener,noreferrer")
            } else {
              window.location.href = currentJob.jobLink!
            }
          }
        }, 500)
      }
    } else {
      // Enhanced feedback for left swipe (not interested)
      playSound("reject")
      triggerVibration([200, 100, 200])
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
    }, 300)
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
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-4 text-white">Great job!</h3>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            You've reviewed all available positions. Check back later for new opportunities or generate cold emails for
            the jobs you liked.
          </p>
          <Button
            onClick={() => setCurrentIndex(0)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/50"
          >
            Start Over
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Swipe splash effect */}
      <SwipeSplash direction={swipeDirection} onComplete={handleSplashComplete} />

      {/* Instructions Alert */}
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <Alert className="max-w-md mx-auto bg-blue-900/70 border-blue-500/30 backdrop-blur-sm shadow-lg shadow-blue-500/10">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-green-400" />
                  <span>
                    <strong>Tap heart:</strong> Opens LinkedIn job page
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">👆</span>
                  <span>
                    <strong>Swipe right:</strong> Saves to interested jobs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-400" />
                  <span>
                    <strong>Swipe left:</strong> Skip this job
                  </span>
                </div>
                <div className="text-xs text-blue-200 mt-2">💡 Saved jobs can be used to generate cold emails!</div>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Data source indicator */}
      {(dataSource === "spreadsheet" || dataSource === "manual") && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Alert className="max-w-md mx-auto bg-gray-900/70 border-green-500/30 backdrop-blur-sm shadow-lg shadow-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="flex items-center justify-between text-green-300">
              <span>✅ Using your LinkedIn job data! Showing {jobs.length} jobs.</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:shadow-green-500/20 transition-all duration-300"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <div className="relative max-w-md mx-auto h-[650px] md:h-[650px]">
        <motion.div
          className="absolute inset-0"
          style={{ x, rotate, opacity, scale }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.05, rotateZ: x.get() / 10 }}
          animate={{
            boxShadow:
              x.get() > 50
                ? "0 0 40px rgba(34, 197, 94, 0.6), 0 0 80px rgba(34, 197, 94, 0.3)"
                : x.get() < -50
                  ? "0 0 40px rgba(239, 68, 68, 0.6), 0 0 80px rgba(239, 68, 68, 0.3)"
                  : "0 0 30px rgba(147, 51, 234, 0.4), 0 0 60px rgba(147, 51, 234, 0.2)",
          }}
          transition={{ duration: 0.2 }}
        >
          <Card className="h-full cursor-grab active:cursor-grabbing bg-gray-800/95 border-gray-600/50 backdrop-blur-md shadow-2xl min-h-[600px] md:min-h-[700px] overflow-auto">
            <CardHeader className="pb-6 p-4 md:p-8">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl md:text-2xl text-white font-bold leading-tight mb-3">
                    {currentJob.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-300 text-base md:text-lg">
                    <Building className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                    {currentJob.company}
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300 border-purple-500/30 ml-3 px-2 py-1 md:px-4 md:py-2 text-sm md:text-lg"
                >
                  {currentJob.type}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 md:space-y-6 pb-24 p-4 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-base md:text-lg">
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                  <span className="truncate">{currentJob.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
                  {currentJob.postedDate}
                </div>
              </div>

              <div className="flex items-center gap-2 text-green-400 font-semibold text-xl md:text-2xl">
                <DollarSign className="h-5 w-5 md:h-6 md:w-6" />
                {currentJob.salary}
              </div>

              <p className="text-gray-300 leading-relaxed text-base md:text-lg">{currentJob.description}</p>

              {currentJob.skills.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-base md:text-lg text-white">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {currentJob.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs md:text-sm bg-blue-500/10 text-blue-300 border-blue-500/30 hover:bg-blue-500/20 transition-colors px-2 py-0.5 md:px-3 md:py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* LinkedIn link indicator */}
              {currentJob.jobLink && (
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-300 text-sm">
                    <ExternalLink className="h-4 w-4" />
                    <span>Tap the ❤️ button to view this job on LinkedIn</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced glowing action buttons with better labels */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6 md:gap-10">
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="lg"
              onClick={() => handleSwipe(false, true)}
              className="rounded-full w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 border-0 shadow-lg transition-all duration-300 relative overflow-hidden group"
              style={{
                boxShadow: "0 0 30px rgba(239, 68, 68, 0.5), 0 0 60px rgba(239, 68, 68, 0.2)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              <X className="h-6 w-6 md:h-8 md:w-8 text-white relative z-10" />
            </Button>
            <div className="text-center mt-2">
              <span className="text-xs text-gray-400">Skip</span>
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="lg"
              onClick={() => handleSwipe(true, true)}
              className="rounded-full w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0 shadow-lg transition-all duration-300 relative overflow-hidden group"
              style={{
                boxShadow: "0 0 30px rgba(34, 197, 94, 0.5), 0 0 60px rgba(34, 197, 94, 0.2)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              <Heart className="h-6 w-6 md:h-8 md:w-8 text-white relative z-10" />
            </Button>
            <div className="text-center mt-2">
              <span className="text-xs text-gray-400">View & Save</span>
            </div>
          </motion.div>
        </div>

        {/* Enhanced swipe indicators */}
        <motion.div
          className="absolute top-1/2 left-8 transform -translate-y-1/2 text-4xl md:text-6xl"
          animate={{
            opacity: x.get() < -50 ? 1 : 0,
            scale: x.get() < -50 ? 1.3 : 0.8,
            rotate: x.get() < -50 ? [0, -10, 10, 0] : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          ❌
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-8 transform -translate-y-1/2 text-4xl md:text-6xl"
          animate={{
            opacity: x.get() > 50 ? 1 : 0,
            scale: x.get() > 50 ? 1.3 : 0.8,
            rotate: x.get() > 50 ? [0, -10, 10, 0] : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          💾
        </motion.div>
      </div>

      {/* Mobile swipe instructions */}
      {isMobile && (
        <div className="text-center text-gray-400 text-sm mt-4 space-y-1">
          <p>Swipe left to skip, swipe right to save</p>
          <p className="text-xs">Tap ❤️ to open LinkedIn • Saved jobs → Cold emails</p>
        </div>
      )}
    </div>
  )
}

function JobCardSkeleton() {
  return (
    <div className="relative max-w-md mx-auto h-[600px] md:h-[650px]">
      <Card className="h-full bg-gray-900/80 border-gray-700/50 backdrop-blur-md shadow-2xl">
        <CardHeader className="p-4 md:p-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 md:h-8 w-3/4 bg-gray-700/50" />
              <Skeleton className="h-4 md:h-4 w-1/2 bg-gray-700/50" />
            </div>
            <Skeleton className="h-5 md:h-6 w-16 md:w-20 bg-gray-700/50" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 md:space-y-6 p-4 md:p-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24 md:w-32 bg-gray-700/50" />
            <Skeleton className="h-4 w-20 md:w-24 bg-gray-700/50" />
          </div>
          <Skeleton className="h-4 w-28 md:w-36 bg-gray-700/50" />
          <div className="space-y-2">
            <Skeleton className="h-16 md:h-20 w-full bg-gray-700/50" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 md:w-32 bg-gray-700/50" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-5 md:h-6 w-12 md:w-16 bg-gray-700/50" />
              <Skeleton className="h-5 md:h-6 w-16 md:w-20 bg-gray-700/50" />
              <Skeleton className="h-5 md:h-6 w-20 md:w-24 bg-gray-700/50" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
