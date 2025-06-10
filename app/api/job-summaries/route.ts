import { NextResponse } from "next/server"
import { getJobSummaries } from "@/app/actions/fetch-jobs"

export async function GET() {
  try {
    const jobSummaries = await getJobSummaries()

    return NextResponse.json(jobSummaries, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching job summaries:", error)
    return NextResponse.json({ error: "Failed to fetch job summaries" }, { status: 500 })
  }
}
