import { NextResponse } from "next/server"

// This would integrate with your Google Sheets
// For now, returning sample data
export async function GET() {
  // In a real implementation, you would:
  // 1. Use Google Sheets API to fetch data from your spreadsheet
  // 2. Parse and format the job data
  // 3. Return the structured data

  const sampleJobs = [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $160k",
      description:
        "We're looking for a senior frontend developer to join our team and help build the next generation of web applications.",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      postedDate: "2 days ago",
      linkedinUrl: "https://linkedin.com/jobs/123456",
    },
    // Add more jobs from your spreadsheet
  ]

  return NextResponse.json({ jobs: sampleJobs })
}
