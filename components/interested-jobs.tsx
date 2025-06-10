"use client"

import { Building, MapPin, Clock, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { JobData } from "@/app/actions/fetch-jobs"

interface InterestedJobsProps {
  jobs: JobData[]
}

export function InterestedJobs({ jobs }: InterestedJobsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl md:text-2xl font-semibold mb-4 text-white">No interested jobs yet</h3>
        <p className="text-gray-300 text-base md:text-xl">Start swiping to find jobs you're interested in!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-white">Jobs You're Interested In</h2>

      <div className="grid gap-4">
        {jobs.map((job, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow bg-gray-800/95 border-gray-600/50 backdrop-blur-sm min-h-[180px] md:min-h-[250px]"
          >
            <CardHeader className="p-4 md:p-8">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg md:text-2xl text-white mb-2 md:mb-3">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-300 text-sm md:text-lg">
                    <Building className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                    {job.company}
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-2 py-1 md:px-4 md:py-2 text-xs md:text-lg"
                >
                  {job.type}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 md:space-y-6 p-4 md:p-8 pt-0">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm md:text-lg text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
                  {job.postedDate}
                </div>
                <div className="flex items-center gap-2 text-green-400 font-semibold text-base md:text-xl">
                  <DollarSign className="h-4 w-4 md:h-5 md:w-5" />
                  {job.salary}
                </div>
              </div>

              <p className="text-sm md:text-lg text-gray-300 line-clamp-2 md:line-clamp-none leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2 md:gap-3">
                {job.skills.slice(0, isMobile ? 2 : 4).map((skill: string, skillIndex: number) => (
                  <Badge
                    key={skillIndex}
                    variant="outline"
                    className="text-xs md:text-sm bg-blue-500/10 text-blue-300 border-blue-500/30 px-2 py-0.5 md:px-3 md:py-1"
                  >
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > (isMobile ? 2 : 4) && (
                  <Badge
                    variant="outline"
                    className="text-xs md:text-sm bg-blue-500/10 text-blue-300 border-blue-500/30 px-2 py-0.5 md:px-3 md:py-1"
                  >
                    +{job.skills.length - (isMobile ? 2 : 4)} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
