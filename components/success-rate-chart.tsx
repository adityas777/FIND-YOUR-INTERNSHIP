"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Target, Award, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface SuccessRateChartProps {
  onBack: () => void
}

export function SuccessRateChart({ onBack }: SuccessRateChartProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const targetValue = 85 // 85% success rate

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(targetValue)
    }, 500)

    return () => clearTimeout(timer)
  }, [targetValue])

  const getSuccessColor = (value: number) => {
    if (value >= 80) return "text-green-400"
    if (value >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getSuccessGradient = (value: number) => {
    if (value >= 80) return "from-green-500 to-emerald-500"
    if (value >= 60) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  const stats = [
    { label: "Applications Sent", value: "127", icon: Target, color: "text-blue-400" },
    { label: "Responses Received", value: "108", icon: TrendingUp, color: "text-green-400" },
    { label: "Interviews Scheduled", value: "45", icon: Award, color: "text-purple-400" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold text-white">Success Rate Analytics</h2>
      </div>

      {/* Main Success Rate Card */}
      <Card className="bg-gray-900/90 border-gray-700/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-2xl">Your Success Rate</CardTitle>
          <CardDescription className="text-gray-300">
            Based on your job application and response history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Circular Progress */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              {/* Background Circle */}
              <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(75, 85, 99, 0.3)" strokeWidth="8" fill="transparent" />
                {/* Progress Circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#successGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 40 * (1 - animatedValue / 100),
                  }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.5, type: "spring" }}
                  className={`text-5xl font-bold ${getSuccessColor(animatedValue)}`}
                >
                  {Math.round(animatedValue)}%
                </motion.div>
                <p className="text-gray-400 text-sm mt-2">Success Rate</p>
              </div>

              {/* Animated Arrow */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ rotate: -90 }}
                animate={{ rotate: (animatedValue / 100) * 180 - 90 }}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{ transformOrigin: "50% 50%" }}
              >
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-purple-500 border-t-2 border-t-transparent border-b-2 border-b-transparent" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.5 }}
            className="text-center"
          >
            <div className={`text-xl font-semibold ${getSuccessColor(animatedValue)} mb-2`}>
              {animatedValue >= 80 ? "Excellent Performance!" : animatedValue >= 60 ? "Good Progress!" : "Keep Going!"}
            </div>
            <p className="text-gray-400">
              {animatedValue >= 80
                ? "You're doing great! Your profile and emails are highly effective."
                : animatedValue >= 60
                  ? "You're on the right track. Consider optimizing your approach."
                  : "There's room for improvement. Let's enhance your strategy."}
            </p>
          </motion.div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          >
            <Card className="bg-gray-900/70 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Improvement Tips */}
      <Card className="bg-gray-900/70 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Tips to Improve Your Success Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2" />
                <div>
                  <h4 className="text-white font-medium">Personalize Your Emails</h4>
                  <p className="text-gray-400 text-sm">
                    Use our AI generator to create tailored cold emails for each company
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                <div>
                  <h4 className="text-white font-medium">Optimize Your Profile</h4>
                  <p className="text-gray-400 text-sm">Keep your skills and experience updated and relevant</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
                <div>
                  <h4 className="text-white font-medium">Follow Up Strategically</h4>
                  <p className="text-gray-400 text-sm">Send polite follow-ups after 1-2 weeks of no response</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2" />
                <div>
                  <h4 className="text-white font-medium">Target Right Companies</h4>
                  <p className="text-gray-400 text-sm">Focus on companies that match your skills and interests</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
