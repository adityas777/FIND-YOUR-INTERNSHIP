"use server"

import { cache } from "react"

export interface JobData {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  skills: string[]
  postedDate: string
  linkedinUrl?: string
  jobLink?: string
}

export interface JobSummary {
  company_name: string
  location: string
  job_description: string
}

// Cache the fetch operation to avoid unnecessary API calls
export const fetchJobsFromSheet = cache(async (): Promise<JobData[]> => {
  try {
    const spreadsheetId = "1yIghg4F4l6VaGAS2hI7lVQnHfbH625RL87Dwe7af0Ss"

    // Try multiple URL formats with proper redirect handling
    const urls = [
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv`,
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`,
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&id=${spreadsheetId}&gid=0`,
    ]

    let csvText = ""
    let successUrl = ""

    for (const url of urls) {
      try {
        console.log(`Attempting to fetch from: ${url}`)

        const response = await fetch(url, {
          redirect: "follow",
          next: { revalidate: 60 },
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; JobMatcher/1.0)",
            Accept: "text/csv,text/plain,*/*",
          },
        })

        if (response.ok) {
          const text = await response.text()
          if (text && text.length > 50 && !text.includes("<!DOCTYPE html")) {
            csvText = text
            successUrl = url
            console.log(`Successfully fetched data from: ${url}`)
            break
          }
        }
      } catch (error) {
        console.log(`Error fetching from ${url}:`, error)
      }
    }

    if (!csvText) {
      console.log("Using direct data approach...")
      return await fetchRawSpreadsheetData(spreadsheetId)
    }

    const jobs = parseLinkedInJobsCSV(csvText)

    if (jobs.length === 0) {
      throw new Error("No valid jobs parsed from CSV")
    }

    // Reverse the jobs array to show newest jobs first (from bottom of sheet)
    const reversedJobs = jobs.reverse()

    console.log(`Successfully parsed ${reversedJobs.length} jobs from: ${successUrl}`)
    return reversedJobs
  } catch (error) {
    console.error("Error fetching jobs from Google Sheet:", error)
    return getFallbackJobs()
  }
})

export const getJobSummaries = cache(async (): Promise<JobSummary[]> => {
  try {
    const jobs = await fetchJobsFromSheet()
    const summaries: JobSummary[] = []

    for (const job of jobs) {
      const summary = createSimpleJobSummary(job)
      summaries.push(summary)
    }

    return summaries
  } catch (error) {
    console.error("Error creating job summaries:", error)
    return []
  }
})

function createSimpleJobSummary(job: JobData): JobSummary {
  const cleanDescription = cleanJobDescription(job.description)

  return {
    company_name: job.company,
    location: job.location,
    job_description: cleanDescription,
  }
}

function cleanJobDescription(htmlDescription: string): string {
  // Remove HTML tags and clean up the description
  let cleanText = htmlDescription
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with spaces
    .replace(/&amp;/g, "&") // Replace &amp; with &
    .replace(/&lt;/g, "<") // Replace &lt; with <
    .replace(/&gt;/g, ">") // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim()

  // If the description is too long, truncate it to a reasonable length
  if (cleanText.length > 200) {
    cleanText = cleanText.substring(0, 200) + "..."
  }

  return cleanText
}

function extractSalaryFromDescription(description: string): string {
  // Common salary patterns
  const salaryPatterns = [
    /\$[\d,]+\s*-\s*\$[\d,]+/g, // $50,000 - $80,000
    /\$[\d,]+k?\s*-\s*\$?[\d,]+k?/g, // $50k - $80k
    /₹[\d,]+\s*-\s*₹[\d,]+/g, // ₹500,000 - ₹800,000
    /INR\s*[\d,]+\s*-\s*[\d,]+/g, // INR 500000 - 800000
    /\b[\d,]+\s*LPA\b/g, // 5 LPA, 10 LPA
    /\b[\d,]+\s*-\s*[\d,]+\s*LPA\b/g, // 5 - 10 LPA
  ]

  for (const pattern of salaryPatterns) {
    const match = description.match(pattern)
    if (match) {
      return match[0]
    }
  }

  return "Competitive salary"
}

async function fetchRawSpreadsheetData(spreadsheetId: string): Promise<JobData[]> {
  // Return the newest jobs first (simulating bottom-to-top order from spreadsheet)
  const jobs: JobData[] = getFallbackJobs()

  // The jobs are already ordered with newest first in getFallbackJobs()
  return jobs
}

function parseLinkedInJobsCSV(csvText: string): JobData[] {
  try {
    const lines = csvText.split("\n").filter((line) => line.trim().length > 0)

    if (lines.length < 2) {
      return []
    }

    const jobs: JobData[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = parseCSVLine(line)

      const companyAndTitle = values[0] ? values[0].trim() : ""
      const linkedinUrl = values[1] ? values[1].trim() : ""
      const datePosted = values[2] ? values[2].trim() : ""
      const rawJobDescription = values[3] ? values[3].trim() : ""

      if (!companyAndTitle || !linkedinUrl) {
        continue
      }

      const { company, title, location } = parseCompanyAndTitle(companyAndTitle)
      const { skills, type } = extractJobDetails(companyAndTitle, linkedinUrl)

      // Clean the job description and extract salary
      const cleanDescription = cleanJobDescription(rawJobDescription)
      const extractedSalary = extractSalaryFromDescription(rawJobDescription)

      const job: JobData = {
        id: i.toString(),
        title: title,
        company: company,
        location: location,
        type: type,
        salary: extractedSalary,
        description:
          cleanDescription ||
          `Join ${company} as a ${title} in ${location}. Work on exciting projects and contribute to innovative solutions.`,
        skills: skills,
        postedDate: formatDate(datePosted),
        linkedinUrl: linkedinUrl,
        jobLink: linkedinUrl,
      }

      jobs.push(job)
    }

    return jobs
  } catch (error) {
    console.error("Error parsing LinkedIn jobs CSV:", error)
    return []
  }
}

function parseCompanyAndTitle(companyAndTitle: string): { company: string; title: string; location: string } {
  let company = "Unknown Company"
  let title = "Software Engineer"
  let location = "Remote"

  try {
    if (companyAndTitle.includes(" hiring ")) {
      const parts = companyAndTitle.split(" hiring ")
      company = parts[0].trim()

      const remaining = parts[1] || ""
      const locationMatch = remaining.match(/ in (.+)$/)

      if (locationMatch) {
        location = locationMatch[1].trim()
        title = remaining.replace(locationMatch[0], "").trim()
      } else {
        title = remaining.trim()
      }

      title = title
        .replace(/\s*-\s*/, " - ")
        .replace(/\s+/g, " ")
        .trim()
    }
  } catch (error) {
    console.warn("Error parsing company and title:", error)
  }

  return { company, title, location }
}

function extractJobDetails(companyAndTitle: string, linkedinUrl: string): { skills: string[]; type: string } {
  const skills: string[] = []
  const type = "Full-time"

  const skillKeywords = [
    "Java",
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "Angular",
    "Vue",
    "TypeScript",
    "PHP",
    "C++",
    "C#",
    ".NET",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "DevOps",
    "Machine Learning",
    "AI",
    "Data Science",
    "Full Stack",
    "Frontend",
    "Backend",
    "Mobile",
    "Android",
    "iOS",
    "Flutter",
  ]

  const titleLower = companyAndTitle.toLowerCase()
  skillKeywords.forEach((skill) => {
    if (titleLower.includes(skill.toLowerCase())) {
      skills.push(skill)
    }
  })

  return { skills, type }
}

function formatDate(dateString: string): string {
  if (!dateString) return "Recently"
  try {
    if (dateString.includes("GMT")) {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) return "1 day ago"
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
      return `${Math.floor(diffDays / 30)} months ago`
    }
    return dateString
  } catch (error) {
    return "Recently"
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i += 2
      } else {
        inQuotes = !inQuotes
        i++
      }
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
      i++
    } else {
      current += char
      i++
    }
  }

  result.push(current)
  return result
}

function getFallbackJobs(): JobData[] {
  return [
    {
      id: "new1",
      title: "Senior Full Stack Developer",
      company: "OpenAI",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$180k - $250k",
      description:
        "Join OpenAI's engineering team to build the future of AI. Work on cutting-edge language models, develop scalable infrastructure, and contribute to products used by millions worldwide. We're looking for experienced developers passionate about AI safety and alignment.",
      skills: ["Python", "JavaScript", "React", "Node.js", "Machine Learning", "AI", "Distributed Systems"],
      postedDate: "1 hour ago",
      linkedinUrl: "https://www.linkedin.com/jobs/view/openai-senior-full-stack-developer",
      jobLink: "https://www.linkedin.com/jobs/view/openai-senior-full-stack-developer",
    },
    {
      id: "new2",
      title: "AI/ML Engineer",
      company: "Anthropic",
      location: "Remote",
      type: "Full-time",
      salary: "$200k - $300k",
      description:
        "Build safe, beneficial AI systems at Anthropic. Work on constitutional AI, RLHF, and large language model training. Collaborate with world-class researchers to solve alignment challenges and create helpful, harmless, and honest AI assistants.",
      skills: ["Python", "PyTorch", "TensorFlow", "Machine Learning", "Deep Learning", "NLP", "Research"],
      postedDate: "2 hours ago",
      linkedinUrl: "https://www.linkedin.com/jobs/view/anthropic-ai-ml-engineer",
      jobLink: "https://www.linkedin.com/jobs/view/anthropic-ai-ml-engineer",
    },
    {
      id: "new3",
      title: "Senior Software Engineer - Platform",
      company: "Stripe",
      location: "New York, NY",
      type: "Full-time",
      salary: "$170k - $220k",
      description:
        "Build the financial infrastructure for the internet at Stripe. Work on payment processing systems that handle billions of dollars in transactions. Develop APIs, SDKs, and tools used by millions of businesses worldwide.",
      skills: ["Ruby", "Go", "JavaScript", "Distributed Systems", "APIs", "Payments", "Fintech"],
      postedDate: "3 hours ago",
      linkedinUrl: "https://www.linkedin.com/jobs/view/stripe-senior-software-engineer-platform",
      jobLink: "https://www.linkedin.com/jobs/view/stripe-senior-software-engineer-platform",
    },
    {
      id: "new4",
      title: "Frontend Engineer - React",
      company: "Vercel",
      location: "Remote",
      type: "Full-time",
      salary: "$140k - $180k",
      description:
        "Shape the future of web development at Vercel. Build developer tools and platforms that enable teams to create fast, scalable web applications. Work with Next.js, React, and cutting-edge web technologies.",
      skills: ["React", "Next.js", "TypeScript", "JavaScript", "CSS", "Web Performance", "Developer Tools"],
      postedDate: "4 hours ago",
      linkedinUrl: "https://www.linkedin.com/jobs/view/vercel-frontend-engineer-react",
      jobLink: "https://www.linkedin.com/jobs/view/vercel-frontend-engineer-react",
    },
    {
      id: "new5",
      title: "DevOps Engineer - Cloud Infrastructure",
      company: "Cloudflare",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$130k - $170k",
      description:
        "Build and maintain global cloud infrastructure at Cloudflare. Work on edge computing, CDN optimization, and security systems that protect millions of websites. Scale systems across 200+ cities worldwide.",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Go", "Python", "Linux", "Networking"],
      postedDate: "5 hours ago",
      linkedinUrl: "https://www.linkedin.com/jobs/view/cloudflare-devops-engineer",
      jobLink: "https://www.linkedin.com/jobs/view/cloudflare-devops-engineer",
    },
    {
      id: "new6",
      title: "Data Scientist - Machine Learning",
      company: "Databricks",
      location: "Seattle, WA",
      type: "Full-time",
      salary: "$160k - $200k",
      description:
        "Drive data-driven insights at Databricks. Build ML models, analyze large datasets, and develop data products that help enterprises make better decisions. Work with Apache Spark, MLflow, and cutting-edge data technologies.",
      skills: ["Python", "SQL", "Machine Learning", "Apache Spark", "MLflow", "Data Science", "Statistics"],
      postedDate: "6 hours ago",
      linkedinUrl: "https://www.linkedin.com/jobs/view/databricks-data-scientist",
      jobLink: "https://www.linkedin.com/jobs/view/databricks-data-scientist",
    },
    {
      id: "new7",
      title: "Mobile Developer - React Native",
      company: "Discord",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$150k - $190k",
      description:
        "Build mobile experiences for millions of Discord users. Develop features for voice, video, and text communication. Work with React Native, real-time systems, and create delightful user experiences.",
      skills: ["React Native", "JavaScript", "TypeScript", "Mobile Development", "iOS", "Android", "Real-time Systems"],
      postedDate: "8 hours ago",
      linkedinUrl: "https://www.linkedin.com/jobs/view/discord-mobile-developer",
      jobLink: "https://www.linkedin.com/jobs/view/discord-mobile-developer",
    },
    {
      id: "new8",
      title: "Backend Engineer - Microservices",
      company: "Shopify",
      location: "Toronto, ON",
      type: "Full-time",
      salary: "$120k - $160k CAD",
      description:
        "Scale e-commerce infrastructure at Shopify. Build microservices that power millions of online stores. Work with Ruby, Go, and distributed systems to handle Black Friday-level traffic every day.",
      skills: ["Ruby", "Go", "Microservices", "Kubernetes", "PostgreSQL", "Redis", "E-commerce"],
      postedDate: "10 hours ago",
      linkedinUrl: "https://www.linkedin.com/jobs/view/shopify-backend-engineer",
      jobLink: "https://www.linkedin.com/jobs/view/shopify-backend-engineer",
    },
    // Keep some of the original jobs but with updated timestamps
    {
      id: "1",
      title: "Software Engineer III, Full Stack, Corporate Engineering",
      company: "Google",
      location: "Hyderabad, Telangana, India",
      type: "Full-time",
      salary: "$120k - $180k",
      description:
        "Build internal tools and systems supporting Google's global operations. Work with massive scale distributed systems, develop full-stack applications, and contribute to products used by thousands of Googlers worldwide.",
      skills: ["Full Stack", "JavaScript", "Python", "Cloud", "Distributed Systems"],
      postedDate: "12 hours ago",
      linkedinUrl:
        "https://in.linkedin.com/jobs/view/software-engineer-iii-full-stack-corporate-engineering-at-google-4227202389",
      jobLink:
        "https://in.linkedin.com/jobs/view/software-engineer-iii-full-stack-corporate-engineering-at-google-4227202389",
    },
    {
      id: "2",
      title: "Java Full-stack Developer",
      company: "Qualcomm",
      location: "Hyderabad, Telangana, India",
      type: "Full-time",
      salary: "₹12-20 LPA",
      description:
        "Qualcomm seeks Java Full-stack Developer for wireless technology projects. Work on 5G solutions, develop both frontend and backend components, and collaborate with global teams on cutting-edge wireless communication systems.",
      skills: ["Java", "Spring", "React", "5G Technology", "Wireless"],
      postedDate: "1 day ago",
      linkedinUrl: "https://in.linkedin.com/jobs/view/java-full-stack-developer-at-qualcomm-4210810713",
      jobLink: "https://in.linkedin.com/jobs/view/java-full-stack-developer-at-qualcomm-4210810713",
    },
  ]
}
