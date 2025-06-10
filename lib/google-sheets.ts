// Utility functions to integrate with Google Sheets API
// You'll need to set up Google Sheets API credentials

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
}

export async function fetchJobsFromSheet(): Promise<JobData[]> {
  // Replace with your Google Sheets API integration
  // This is a placeholder implementation

  try {
    const response = await fetch("/api/jobs")
    const data = await response.json()
    return data.jobs || []
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return []
  }
}

export async function saveUserInterest(jobId: string, interested: boolean) {
  try {
    await fetch("/api/user-interests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId, interested }),
    })
  } catch (error) {
    console.error("Error saving user interest:", error)
  }
}
