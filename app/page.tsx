"use client"

import { useState } from "react"
import { ResumeUpload } from "@/components/resume-upload"
import { UserProfile } from "@/components/user-profile"
import { JobSwiper } from "@/components/job-swiper"
import { InterestedJobs } from "@/components/interested-jobs"
import { ColdEmailGenerator } from "@/components/cold-email-generator"
import { LatestJobs } from "@/components/latest-jobs"
import { Dashboard } from "@/components/dashboard"
import { Header } from "@/components/header"
import { GalaxyBackground } from "@/components/galaxy-background"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { JobData } from "@/app/actions/fetch-jobs"

interface UserProfileData {
  name: string
  email: string
  experienceLevel: string
  skills: string[]
  education: string[]
}

export default function HomePage() {
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [resumeContent, setResumeContent] = useState("")
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null)
  const [interestedJobs, setInterestedJobs] = useState<JobData[]>([])
  const [currentTab, setCurrentTab] = useState("dashboard")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleJobInterest = (job: JobData, interested: boolean) => {
    if (interested) {
      setInterestedJobs((prev) => [...prev, job])
    }
  }

  const handleResumeUpload = (content: string) => {
    setResumeContent(content)
    setResumeUploaded(true)
  }

  const handleProfileComplete = (profile: UserProfileData) => {
    setUserProfile(profile)
    setCurrentTab("dashboard")
  }

  const handleNavigate = (section: "swipe" | "interested" | "email" | "latest") => {
    setCurrentTab(section)
  }

  // Show resume upload first
  if (!resumeUploaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
        <GalaxyBackground />
        <div className="fixed inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none z-10" />
        <Header />
        <main className="container mx-auto px-4 py-8 relative z-20">
          <ResumeUpload onUploadComplete={handleResumeUpload} />
        </main>
      </div>
    )
  }

  // Show profile setup after resume upload
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
        <GalaxyBackground />
        <div className="fixed inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none z-10" />
        <Header />
        <main className="container mx-auto px-4 py-8 relative z-20">
          <UserProfile onProfileComplete={handleProfileComplete} />
        </main>
      </div>
    )
  }

  // Show main app after profile is complete
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 relative overflow-hidden">
      <GalaxyBackground />

      {/* Cosmic overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none z-10" />

      <Header />

      <main className="container mx-auto px-4 py-8 relative z-20">
        {currentTab === "dashboard" ? (
          <Dashboard
            onNavigate={handleNavigate}
            interestedJobsCount={interestedJobs.length}
            resumeContent={resumeContent}
          />
        ) : (
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="max-w-4xl mx-auto">
            {/* Main navigation tabs */}
            <TabsList
              className={`grid w-full ${isMobile ? "grid-cols-2" : "grid-cols-5"} bg-gray-800/90 border-gray-600/50 backdrop-blur-md shadow-lg shadow-purple-500/10 h-12 md:h-16 mb-4`}
            >
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-purple-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 text-sm md:text-lg font-medium"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="swipe"
                className="data-[state=active]:bg-purple-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 text-sm md:text-lg font-medium"
              >
                {isMobile ? "Find" : "Find Jobs"}
              </TabsTrigger>
              {!isMobile && (
                <>
                  <TabsTrigger
                    value="latest"
                    className="data-[state=active]:bg-purple-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 text-sm md:text-lg font-medium"
                  >
                    Latest Jobs
                  </TabsTrigger>
                  <TabsTrigger
                    value="interested"
                    className="data-[state=active]:bg-purple-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 text-sm md:text-lg font-medium"
                  >
                    Interested ({interestedJobs.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="email"
                    className="data-[state=active]:bg-purple-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 text-sm md:text-lg font-medium"
                  >
                    Cold Email
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Mobile secondary navigation */}
            {isMobile && (
              <TabsList className="grid w-full grid-cols-3 bg-gray-800/90 border-gray-600/50 backdrop-blur-md shadow-lg shadow-purple-500/10 h-12 mb-4">
                <TabsTrigger
                  value="latest"
                  className="data-[state=active]:bg-purple-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 text-sm font-medium"
                >
                  Latest
                </TabsTrigger>
                <TabsTrigger
                  value="interested"
                  className="data-[state=active]:bg-purple-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 text-sm font-medium"
                >
                  Saved ({interestedJobs.length})
                </TabsTrigger>
                <TabsTrigger
                  value="email"
                  className="data-[state=active]:bg-purple-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/20 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 text-sm font-medium"
                >
                  Email
                </TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="dashboard" className="mt-6">
              <Dashboard
                onNavigate={handleNavigate}
                interestedJobsCount={interestedJobs.length}
                resumeContent={resumeContent}
              />
            </TabsContent>

            <TabsContent value="latest" className="mt-6">
              <LatestJobs />
            </TabsContent>

            <TabsContent value="swipe" className="mt-6">
              <JobSwiper onJobAction={handleJobInterest} />
            </TabsContent>

            <TabsContent value="interested" className="mt-6">
              <InterestedJobs jobs={interestedJobs} />
            </TabsContent>

            <TabsContent value="email" className="mt-6">
              <ColdEmailGenerator
                interestedJobs={interestedJobs}
                resumeContent={resumeContent}
                userProfile={userProfile}
              />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
