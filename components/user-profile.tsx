"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Briefcase, GraduationCap, Code, X } from "lucide-react"
import { motion } from "framer-motion"

interface UserProfile {
  name: string
  email: string
  experienceLevel: string
  skills: string[]
  education: string[]
}

interface UserProfileProps {
  onProfileComplete: (profile: UserProfile) => void
  initialProfile?: UserProfile
}

export function UserProfile({ onProfileComplete, initialProfile }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile || {
      name: "",
      email: "",
      experienceLevel: "",
      skills: [],
      education: [],
    },
  )
  const [currentSkill, setCurrentSkill] = useState("")
  const [currentEducation, setCurrentEducation] = useState("")

  const addSkill = () => {
    if (currentSkill.trim() && !profile.skills.includes(currentSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }))
      setCurrentSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const addEducation = () => {
    if (currentEducation.trim() && !profile.education.includes(currentEducation.trim())) {
      setProfile((prev) => ({
        ...prev,
        education: [...prev.education, currentEducation.trim()],
      }))
      setCurrentEducation("")
    }
  }

  const removeEducation = (educationToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu !== educationToRemove),
    }))
  }

  const handleSubmit = () => {
    if (profile.name && profile.email && profile.experienceLevel) {
      onProfileComplete(profile)
    }
  }

  const isValid = profile.name && profile.email && profile.experienceLevel

  const commonSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "AWS",
    "Docker",
    "SQL",
    "MongoDB",
    "Git",
    "Agile",
    "Machine Learning",
    "Data Analysis",
    "Project Management",
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-gray-900/90 border-gray-700/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
            <User className="h-6 w-6 text-purple-400" />
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-gray-300">
            Help us personalize your job search and cold emails
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-400" />
                Full Name *
              </Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200 flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-400" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
                className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label className="text-gray-200 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-yellow-400" />
              Experience Level *
            </Label>
            <Select
              value={profile.experienceLevel}
              onValueChange={(value) => setProfile((prev) => ({ ...prev, experienceLevel: value }))}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-200">
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="Entry Level">Entry Level (0-2 years)</SelectItem>
                <SelectItem value="Mid Level">Mid Level (2-5 years)</SelectItem>
                <SelectItem value="Senior Level">Senior Level (5+ years)</SelectItem>
                <SelectItem value="Lead/Principal">Lead/Principal (8+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <Label className="text-gray-200 flex items-center gap-2">
              <Code className="h-4 w-4 text-purple-400" />
              Technical Skills
            </Label>

            <div className="flex gap-2">
              <Input
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="Add a skill..."
                className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
              />
              <Button onClick={addSkill} className="bg-purple-600 hover:bg-purple-700">
                Add
              </Button>
            </div>

            {/* Common Skills Quick Add */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Quick add popular skills:</p>
              <div className="flex flex-wrap gap-2">
                {commonSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer bg-gray-800/30 text-gray-300 border-gray-600 hover:bg-purple-600/20 hover:border-purple-500 transition-colors"
                    onClick={() => {
                      if (!profile.skills.includes(skill)) {
                        setProfile((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
                      }
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Added Skills */}
            {profile.skills.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Your skills:</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-purple-600/20 text-purple-300 border-purple-500/30 flex items-center gap-1"
                    >
                      {skill}
                      <X className="h-3 w-3 cursor-pointer hover:text-red-400" onClick={() => removeSkill(skill)} />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Education */}
          <div className="space-y-3">
            <Label className="text-gray-200 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-pink-400" />
              Education & Certifications
            </Label>

            <div className="flex gap-2">
              <Input
                value={currentEducation}
                onChange={(e) => setCurrentEducation(e.target.value)}
                placeholder="e.g., Bachelor's in Computer Science, AWS Certified..."
                className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
                onKeyPress={(e) => e.key === "Enter" && addEducation()}
              />
              <Button onClick={addEducation} className="bg-pink-600 hover:bg-pink-700">
                Add
              </Button>
            </div>

            {/* Added Education */}
            {profile.education.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Your education:</p>
                <div className="space-y-2">
                  {profile.education.map((edu) => (
                    <div
                      key={edu}
                      className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2 border border-gray-700/50"
                    >
                      <span className="text-gray-200 text-sm">{edu}</span>
                      <X
                        className="h-4 w-4 cursor-pointer hover:text-red-400 text-gray-400"
                        onClick={() => removeEducation(edu)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Profile & Continue
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
