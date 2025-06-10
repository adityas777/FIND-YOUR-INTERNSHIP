"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Mail, TrendingUp, Users, Target, Zap, ArrowRight, FileText, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { SuccessRateChart } from "@/components/success-rate-chart"

interface DashboardProps {
  onNavigate: (section: "swipe" | "interested" | "email" | "latest") => void
  interestedJobsCount: number
  resumeContent?: string
}

export function Dashboard({ onNavigate, interestedJobsCount, resumeContent }: DashboardProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [showSuccessRate, setShowSuccessRate] = useState(false)

  if (showSuccessRate) {
    return <SuccessRateChart onBack={() => setShowSuccessRate(false)} />
  }

  const stats = [
    {
      label: "Jobs Available",
      value: "500+",
      icon: Briefcase,
      color: "text-blue-400",
      onClick: () => onNavigate("swipe"),
    },
    {
      label: "Interested Jobs",
      value: interestedJobsCount.toString(),
      icon: Target,
      color: "text-green-400",
      onClick: () => onNavigate("interested"),
    },
    {
      label: "Success Rate",
      value: "85%",
      icon: TrendingUp,
      color: "text-purple-400",
      onClick: () => setShowSuccessRate(true),
    },
    { label: "Active Users", value: "10K+", icon: Users, color: "text-pink-400" },
  ]

  const features = [
    {
      id: "swipe",
      title: "Find Jobs",
      description: "Swipe through curated job opportunities tailored to your skills",
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500",
      hoverColor: "hover:shadow-blue-500/25",
      action: "Start Swiping",
    },
    {
      id: "email",
      title: "Cold Email Generator",
      description: "Generate personalized cold emails using AI and your resume",
      icon: Mail,
      color: "from-purple-500 to-pink-500",
      hoverColor: "hover:shadow-purple-500/25",
      action: "Generate Emails",
    },
    {
      id: "interested",
      title: "My Interested Jobs",
      description: "View and manage jobs you've shown interest in",
      icon: Target,
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:shadow-green-500/25",
      action: "View Jobs",
      badge: interestedJobsCount > 0 ? interestedJobsCount.toString() : undefined,
    },
    {
      id: "latest",
      title: "Latest Job Openings",
      description: "Browse the newest job postings from LinkedIn across IT sectors",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      hoverColor: "hover:shadow-orange-500/25",
      action: "Browse Latest",
    },
  ]

  return (
    <div className="space-y-10">
      {/* Welcome Section - Bigger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Welcome to JobMatcher
        </h1>
        <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Your AI-powered job search companion. Swipe, match, and land your dream job with personalized cold emails.
        </p>
        {resumeContent && (
          <div className="flex items-center justify-center gap-3 text-green-400 text-lg">
            <FileText className="h-6 w-6" />
            <span>Resume uploaded and ready to use</span>
          </div>
        )}
      </motion.div>

      {/* Stats Grid - Darker and Bigger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className={`bg-gray-800/80 border-gray-600/50 backdrop-blur-sm hover:bg-gray-700/80 transition-all duration-300 ${
              stat.onClick ? "cursor-pointer hover:scale-105" : ""
            }`}
            onClick={stat.onClick}
          >
            <CardContent className="p-6 text-center">
              <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-base text-gray-300">{stat.label}</div>
              {stat.onClick && (
                <div className="mt-3">
                  <BarChart3 className="h-5 w-5 mx-auto text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Features - Darker and Bigger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
            onHoverStart={() => setHoveredCard(feature.id)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Card
              className={`bg-gray-800/90 border-gray-600/50 backdrop-blur-sm hover:bg-gray-700/90 transition-all duration-300 cursor-pointer group ${feature.hoverColor} hover:shadow-xl hover:scale-105 relative overflow-hidden min-h-[280px]`}
              onClick={() => onNavigate(feature.id as "swipe" | "interested" | "email" | "latest")}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <CardHeader className="relative p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  {feature.badge && (
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-lg px-3 py-1">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-white text-2xl mb-3">{feature.title}</CardTitle>
                <CardDescription className="text-gray-300 text-lg leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative p-8 pt-0">
                <Button
                  className={`w-full bg-gradient-to-r ${feature.color} hover:opacity-90 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-lg text-lg`}
                >
                  {feature.action}
                  <ArrowRight
                    className={`ml-3 h-5 w-5 transition-transform duration-300 ${
                      hoveredCard === feature.id ? "translate-x-1" : ""
                    }`}
                  />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions - Darker and Bigger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gray-800/80 border border-gray-600/50 rounded-xl p-8 backdrop-blur-sm"
      >
        <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          <Zap className="h-6 w-6 text-yellow-400" />
          Quick Start Guide
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
              1
            </div>
            <div>
              <p className="text-white font-medium text-lg mb-2">Complete Profile</p>
              <p className="text-gray-300 text-base">Set up your profile with skills and experience.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg">
              2
            </div>
            <div>
              <p className="text-white font-medium text-lg mb-2">Find Jobs</p>
              <p className="text-gray-300 text-base">Swipe through jobs and mark your interests.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
              3
            </div>
            <div>
              <p className="text-white font-medium text-lg mb-2">Generate Emails</p>
              <p className="text-gray-300 text-base">Create personalized cold emails for your dream jobs.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
