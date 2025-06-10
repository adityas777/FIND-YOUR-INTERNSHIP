"use server"

import type { JobData } from "./fetch-jobs"

interface EmailResult {
  email: string
  improvements: string[]
  detailedImprovements: DetailedImprovements
}

interface DetailedImprovements {
  summary: string[]
  experience: string[]
  skills: string[]
  education: string[]
  general: string[]
}

interface UserProfile {
  name: string
  email: string
  experienceLevel: string
  skills: string[]
  education: string[]
}

export async function generateColdEmailWithProfile(profile: UserProfile, job: JobData): Promise<EmailResult> {
  try {
    const detailedImprovements = await generateDetailedImprovementsWithProfile(profile, job)

    // Generate personalized email using profile data
    const email = await generatePersonalizedEmailWithProfile(profile, job)

    return {
      email,
      improvements: [], // Legacy field
      detailedImprovements,
    }
  } catch (error) {
    console.error("Error generating email:", error)
    return {
      email: "Failed to generate email. Please try again.",
      improvements: [],
      detailedImprovements: {
        summary: [],
        experience: [],
        skills: [],
        education: [],
        general: [],
      },
    }
  }
}

export async function generateDetailedImprovementsWithProfile(
  profile: UserProfile,
  job: JobData,
): Promise<DetailedImprovements> {
  const improvements: DetailedImprovements = {
    summary: [],
    experience: [],
    skills: [],
    education: [],
    general: [],
  }

  // Handle null/undefined job or profile
  if (!job || !profile) {
    return improvements
  }

  try {
    // Summary improvements
    improvements.summary = [
      `Tailor your professional summary to highlight experience relevant to ${job.title || "this"} position`,
      `Include specific metrics and achievements that demonstrate your impact in previous roles`,
      `Mention your passion for ${job.company || "the company"}'s industry and mission`,
      `Highlight your most relevant skills for this role: ${(job.skills || []).slice(0, 3).join(", ") || "relevant technologies"}`,
      `Emphasize your ${profile.experienceLevel.toLowerCase()} background and how it applies to this role`,
    ]

    // Experience improvements
    improvements.experience = [
      `Quantify your achievements with specific numbers, percentages, or dollar amounts`,
      `Use action verbs that align with the job requirements (e.g., "developed," "implemented," "optimized")`,
      `Highlight any experience with technologies mentioned in the job: ${(job.skills || []).join(", ") || "relevant technologies"}`,
      `Include any experience working in ${job.type || "similar"} environments or similar company sizes`,
      `Emphasize problem-solving examples that relate to challenges ${job.company || "the company"} might face`,
      `Show progression in your ${profile.experienceLevel.toLowerCase()} career path`,
    ]

    // Skills improvements
    const jobSkills = job.skills || []
    const profileSkills = profile.skills || []
    const missingSkills = jobSkills.filter(
      (skill) => !profileSkills.some((profileSkill) => profileSkill.toLowerCase().includes(skill.toLowerCase())),
    )

    improvements.skills = [
      `Consider adding experience with: ${missingSkills.slice(0, 5).join(", ") || "relevant technologies"}`,
      `Create a dedicated "Technical Skills" section with proficiency levels`,
      `Include both hard and soft skills relevant to the role`,
      `Group skills by category (e.g., Programming Languages, Frameworks, Tools)`,
      `Add any certifications or courses related to the required technologies`,
      `Highlight your strongest skills: ${profileSkills.slice(0, 3).join(", ")}`,
    ]

    // Education improvements
    improvements.education = [
      `Include relevant coursework that aligns with the job requirements`,
      `Add any online courses, bootcamps, or certifications you've completed`,
      `Mention academic projects that demonstrate skills needed for this role`,
      `Include your GPA if it's above 3.5 and you're a recent graduate`,
      `Add any honors, awards, or relevant extracurricular activities`,
      profile.education.length > 0
        ? `Leverage your education: ${profile.education[0]} to show foundational knowledge`
        : `Consider adding relevant certifications to strengthen your profile`,
    ]

    // General improvements
    improvements.general = [
      `Customize your resume for each application to match the job description`,
      `Use keywords from the job posting throughout your resume`,
      `Ensure your contact information includes a professional email and LinkedIn profile`,
      `Keep your resume to 1-2 pages and use a clean, professional format`,
      `Include a portfolio link or GitHub profile if relevant to the role`,
      `Proofread carefully for grammar and spelling errors`,
      `Use consistent formatting for dates, bullet points, and section headers`,
      `Tailor your application to show why you're specifically interested in ${job.company}`,
    ]

    return improvements
  } catch (error) {
    console.error("Error in generateDetailedImprovementsWithProfile:", error)
    return improvements
  }
}

async function generatePersonalizedEmailWithProfile(profile: UserProfile, job: JobData): Promise<string> {
  const relevantSkills = profile.skills
    .filter((skill) =>
      job.skills.some(
        (jobSkill) =>
          skill.toLowerCase().includes(jobSkill.toLowerCase()) || jobSkill.toLowerCase().includes(skill.toLowerCase()),
      ),
    )
    .slice(0, 3)

  const email = `Subject: ${job.title} Position at ${job.company} - ${profile.name}

Dear Hiring Manager,

I hope this email finds you well. My name is ${profile.name}, and I am writing to express my strong interest in the ${job.title} position at ${job.company}. Having researched your company's innovative work in ${await getIndustryFocus(job.company)}, I am excited about the opportunity to contribute to your team's continued success.

With my ${profile.experienceLevel.toLowerCase()} background in ${relevantSkills.length > 0 ? relevantSkills.join(", ") : "software development"}, I believe I would be a valuable addition to your team. I was particularly drawn to this role because it aligns perfectly with my expertise in ${job.skills.slice(0, 2).join(" and ")}.

Key highlights of my background include:
• ${await getRelevantAccomplishmentWithProfile(profile, job)}
• Strong experience with ${relevantSkills[0] || job.skills[0]}, which I see is crucial for this role
• ${await getEducationHighlightWithProfile(profile)}
• Proven ability to ${await getSkillBasedAccomplishment(job.skills)}

I am particularly excited about ${job.company}'s commitment to ${await getCompanyValue(job.company)} and would love to contribute to projects that ${await getProjectType(job.skills)}. Your job posting mentioned ${job.skills[0]}, which aligns perfectly with my recent experience in ${relevantSkills[0] || "related technologies"}.

${profile.education.length > 0 ? `My educational background in ${profile.education[0]} has provided me with a strong foundation in the principles underlying this role.` : ""}

I have attached my resume for your review and would welcome the opportunity to discuss how my background in ${profile.skills.slice(0, 2).join(" and ")} can contribute to ${job.company}'s objectives. I am available for a conversation at your convenience and am excited about the possibility of joining your team in ${job.location}.

You can reach me at ${profile.email} or through LinkedIn. I look forward to the opportunity to discuss how my ${profile.experienceLevel.toLowerCase()} experience can benefit your team.

Thank you for considering my application. I look forward to hearing from you soon.

Best regards,
${profile.name}

P.S. I noticed that ${job.company} is ${await getCompanyNews(job.company)}. I would love to be part of such an innovative and forward-thinking organization.`

  return email
}

// Helper functions for email generation
async function getIndustryFocus(company: string): Promise<string> {
  const focuses: Record<string, string> = {
    Google: "search technology and cloud computing",
    Microsoft: "enterprise software and cloud services",
    Apple: "consumer technology and user experience",
    Amazon: "e-commerce and cloud infrastructure",
    Meta: "social technology and virtual reality",
    Netflix: "streaming technology and content delivery",
    Tesla: "electric vehicles and sustainable energy",
    Spotify: "music streaming and audio technology",
    TATA: "technology consulting and digital transformation",
  }
  return focuses[company] || "technology and innovation"
}

async function getCompanyValue(company: string): Promise<string> {
  const values: Record<string, string> = {
    Google: "organizing the world's information",
    Microsoft: "empowering every person and organization",
    Apple: "creating products that enrich people's lives",
    Amazon: "customer obsession and innovation",
    Meta: "connecting people around the world",
    Netflix: "entertaining the world",
    Tesla: "accelerating sustainable transport",
    Spotify: "unlocking the potential of human creativity",
    TATA: "improving the quality of life through innovation",
  }
  return values[company] || "innovation and excellence"
}

async function getCompanyNews(company: string): Promise<string> {
  const news: Record<string, string> = {
    Google: "leading the way in AI and machine learning research",
    Microsoft: "expanding its cloud services and AI capabilities",
    Apple: "revolutionizing personal technology with each product release",
    Amazon: "continuously innovating in cloud computing and logistics",
    Meta: "pioneering the future of virtual and augmented reality",
    Netflix: "transforming how the world consumes entertainment",
    Tesla: "driving the transition to sustainable energy",
    Spotify: "changing how people discover and enjoy music",
    TATA: "driving digital transformation across industries",
  }
  return news[company] || "at the forefront of technological innovation"
}

async function getRelevantAccomplishmentWithProfile(profile: UserProfile, job: JobData): Promise<string> {
  const accomplishments = [
    `Successfully delivered projects using ${profile.skills[0] || "modern technologies"} that improved system performance`,
    `Led cross-functional teams to implement solutions similar to what ${job.company} develops`,
    `Developed scalable applications that handled high user loads, relevant to ${job.company}'s scale`,
    `Optimized existing systems resulting in significant performance improvements`,
    `Collaborated with diverse teams to deliver complex technical solutions`,
    `Applied my ${profile.experienceLevel.toLowerCase()} expertise to solve challenging technical problems`,
  ]
  return accomplishments[Math.floor(Math.random() * accomplishments.length)]
}

async function getEducationHighlightWithProfile(profile: UserProfile): Promise<string> {
  if (profile.education.length > 0) {
    return `${profile.education[0]} with relevant coursework in computer science and software engineering`
  }
  return "Continuous learning mindset with focus on staying current with industry trends"
}

async function getSkillBasedAccomplishment(skills: string[]): Promise<string> {
  const skill = skills[0] || "software development"
  const accomplishments = [
    `work effectively in ${skill} environments`,
    `deliver high-quality solutions using ${skill}`,
    `collaborate with teams on ${skill} projects`,
    `solve complex problems using ${skill}`,
    `mentor others in ${skill} best practices`,
  ]
  return accomplishments[Math.floor(Math.random() * accomplishments.length)]
}

async function getProjectType(skills: string[]): Promise<string> {
  if (skills.some((skill) => skill.toLowerCase().includes("frontend") || skill.toLowerCase().includes("react"))) {
    return "enhance user experiences and interface design"
  }
  if (skills.some((skill) => skill.toLowerCase().includes("backend") || skill.toLowerCase().includes("api"))) {
    return "build robust backend systems and APIs"
  }
  if (skills.some((skill) => skill.toLowerCase().includes("data") || skill.toLowerCase().includes("ml"))) {
    return "leverage data science and machine learning"
  }
  if (skills.some((skill) => skill.toLowerCase().includes("mobile"))) {
    return "create innovative mobile experiences"
  }
  return "drive technological innovation and excellence"
}

// Legacy function for backward compatibility
export async function generateColdEmail(resume: string, job: JobData): Promise<EmailResult> {
  // This is kept for backward compatibility but should use the profile-based version
  const mockProfile: UserProfile = {
    name: "Professional",
    email: "professional@example.com",
    experienceLevel: "Mid Level",
    skills: ["JavaScript", "React", "Node.js"],
    education: ["Bachelor's Degree in Computer Science"],
  }

  return generateColdEmailWithProfile(mockProfile, job)
}

export async function analyzeResume(resume: string): Promise<any> {
  // Legacy function - kept for compatibility
  return {
    name: "",
    skills: [],
    experience: "Professional",
    education: [],
    strengths: [],
    weaknesses: [],
  }
}
