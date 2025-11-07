import { GoogleGenAI } from "@google/genai"

import { cvSchema, defaultCV, experienceSchema, type CVData, type ExperienceItem } from "@/lib/cv"

const TEXT_MODEL = "gemini-2.5-flash-lite"

let client: GoogleGenAI | null = null

const ensureClient = () => {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY
  if (!apiKey) {
    throw new Error("GOOGLE_GENAI_API_KEY is not configured")
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey })
  }

  return client
}

const generateText = async (prompt: string) => {
  const response = await ensureClient().models.generateContent({
    model: TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }]}],
  })

  const direct = typeof response.text === "string" ? response.text.trim() : ""
  if (direct) {
    return direct
  }

  const primaryCandidate = response.candidates?.[0]
  if (!primaryCandidate?.content?.parts?.length) {
    return ""
  }

  const fallback = primaryCandidate.content.parts
    .map((part) => {
      const maybeText = (part as { text?: unknown }).text
      return typeof maybeText === "string" ? maybeText.trim() : ""
    })
    .filter((value): value is string => value.length > 0)
    .join(" ")

  return fallback.trim()
}

const sanitizeBullet = (value: string) => value.replace(/^[-*•\d\.\)\s]+/, "").replace(/\s+/g, " ").trim()

const dedupe = (values: string[]) => Array.from(new Set(values.filter(Boolean)))

const fallbackKeywordsFrom = (input: string) => {
  return dedupe(
    input
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 3)
  ).slice(0, 10);
}

const titleCase = (input: string) =>
  input
    .split(" ")
    .map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : ""))
    .join(" ")

const applyKeywordsToExperience = (experience: ExperienceItem, keywords: string[]): ExperienceItem => {
  if (!keywords.length) return experience

  const highlights = experience.highlights.length
    ? experience.highlights.map((line, index) => {
        const keyword = keywords[index % keywords.length]
        return `${line.replace(/\.$/, "")} — Demonstrated ${titleCase(keyword)}.`;
      })
    : [
        `Delivered measurable outcomes aligned with ${titleCase(keywords[0]!)} priorities.`,
      ]

  return {
    ...experience,
    highlights,
  }
}

export const isGenAIConfigured = () => Boolean(process.env.GOOGLE_GENAI_API_KEY)

export const enhanceSummaryWithAI = async (summary: string, context?: string) => {
  const trimmed = summary.trim()
  if (!trimmed) {
    return "Product builder focused on translating customer insight into measurable business impact."
  }

  const prompt = [
    "You are a career coach polishing a professional summary.",
    context ? `Context: ${context}` : "",
    "Rewrite the summary to sound confident, results-oriented, and concise (max 3 sentences, under 75 words).",
    "Avoid bullet points and keep the meaning consistent.",
    `Summary: """${trimmed}"""`,
  ]
    .filter(Boolean)
    .join("\n")

  const enhanced = await generateText(prompt)
  return enhanced || trimmed
}

export const enhanceExperienceWithAI = async (
  experienceInput: ExperienceItem,
  jobDescription?: string,
  seededKeywords: string[] = []
) => {
  const experience = experienceSchema.parse(experienceInput)
  const keywords = seededKeywords.length ? seededKeywords : jobDescription ? fallbackKeywordsFrom(jobDescription) : []

  const prompt = [
    "You are refreshing resume bullet points for a senior professional.",
    jobDescription ? `Align with the following job focus: ${jobDescription}` : "",
    `Here is the experience entry as JSON: ${JSON.stringify(experience)}`,
    "Return between 3 and 4 bullet sentences, each under 22 words.",
    "Each bullet must start with a strong verb, include measurable outcomes when possible, and avoid numbering or special characters.",
    "Respond with plain text bullets separated by newline characters only.",
  ]
    .filter(Boolean)
    .join("\n")

  const response = await generateText(prompt)
  const suggestions = response
    .split(/\n+/)
      .map((value: string) => sanitizeBullet(value))
      .filter((line: string): line is string => line.length > 4)

  if (!suggestions.length) {
    return applyKeywordsToExperience(experience, keywords)
  }

  return {
    ...experience,
    highlights: suggestions.slice(0, 5),
  }
}

const suggestKeywords = async (jobDescription: string) => {
  const prompt = [
    "Extract up to 12 core skills or themes from this job description.",
    "Return them as a comma-separated list of short lowercase phrases without numbering or commentary.",
    `Job description: """${jobDescription}"""`,
  ].join("\n")

  const response = await generateText(prompt)

  const extracted = response
    .split(/[,\n;]/)
      .map((item: string) => item.trim().toLowerCase())
      .filter((item: string): item is string => item.length > 2)

  const unique = dedupe(extracted)
  return unique.length ? unique.slice(0, 12) : fallbackKeywordsFrom(jobDescription)
}

const mergeSkills = (current: string[], additions: string[]) => {
  const normalized = additions.map(titleCase)
  return dedupe([...current, ...normalized]).slice(0, 15)
}

export const adaptCVWithAI = async (cvInput: CVData, jobDescription: string) => {
  const cv = cvSchema.parse(cvInput)

  const keywords = await suggestKeywords(jobDescription)
  const summaryContext = keywords.length ? `a role prioritizing ${keywords.slice(0, 3).join(", ")}` : jobDescription

  let summary = cv.personal.summary
  try {
    summary = await enhanceSummaryWithAI(cv.personal.summary, summaryContext)
  } catch (error) {
    summary = cv.personal.summary
  }

  const experience = await Promise.all(
    cv.experience.map(async (role) => {
      try {
        return await enhanceExperienceWithAI(role, jobDescription, keywords)
      } catch (error) {
        return applyKeywordsToExperience(role, keywords)
      }
    })
  )

  return {
    ...cv,
    personal: {
      ...cv.personal,
      summary,
    },
    skills: mergeSkills(cv.skills, keywords),
    experience,
  }
}

const stripCodeFences = (input: string) => {
  const trimmed = input.trim()
  if (!trimmed.startsWith("```")) {
    return trimmed
  }

  const lines = trimmed.split("\n")
  if (lines[0]?.startsWith("```")) {
    lines.shift()
  }
  if (lines[lines.length - 1]?.startsWith("```")) {
    lines.pop()
  }
  return lines.join("\n").trim()
}

const extractJsonObject = (input: string) => {
  const cleaned = stripCodeFences(input)
  const start = cleaned.indexOf("{")
  const end = cleaned.lastIndexOf("}")
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not include a JSON object")
  }
  return cleaned.slice(start, end + 1)
}

const ensureIds = (cv: CVData): CVData => {
  const fallback = defaultCV()
  return {
    ...cv,
    experience: cv.experience.map((item, index) => ({
      ...item,
      id: item.id || `ai_experience_${index}`,
    })),
    education: cv.education.map((item, index) => ({
      ...item,
      id: item.id || `ai_education_${index}`,
    })),
    projects: cv.projects.map((item, index) => ({
      ...item,
      id: item.id || `ai_project_${index}`,
    })),
    skills: cv.skills.length ? cv.skills : fallback.skills,
  }
}

const sanitizePersonalData = (data: Record<string, unknown>) => {
  const personal = (data.personal || {}) as Record<string, unknown>
  
  return {
    fullName: typeof personal.fullName === "string" && personal.fullName.trim() 
      ? personal.fullName.trim() 
      : "Candidate",
    title: typeof personal.title === "string" ? personal.title.trim() : "",
    summary: typeof personal.summary === "string" ? personal.summary.trim() : "",
    email: typeof personal.email === "string" && personal.email.includes("@") 
      ? personal.email.trim() 
      : "candidate@example.com",
    phone: typeof personal.phone === "string" ? personal.phone.trim() : "",
    location: typeof personal.location === "string" ? personal.location.trim() : "",
    website: typeof personal.website === "string" ? personal.website.trim() : "",
    linkedin: typeof personal.linkedin === "string" ? personal.linkedin.trim() : "",
  }
}

export const importCVWithAI = async (resumeText: string) => {
  const trimmed = resumeText.trim()
  if (!trimmed) {
    throw new Error("Resume content is empty")
  }

  // Log first 500 chars for debugging
  console.log("[AI Import] Processing resume, first 500 chars:", trimmed.slice(0, 500))

  const prompt = [
    "You are an expert resume parser. Extract ALL available information from the resume below.",
    "",
    "OUTPUT FORMAT: Return ONLY a valid JSON object with this exact structure:",
    JSON.stringify({
      personal: {
        fullName: "John Doe",
        title: "Software Engineer",
        summary: "Brief professional summary",
        email: "john@example.com",
        phone: "+1234567890",
        location: "City, Country",
        website: "https://example.com",
        linkedin: "https://linkedin.com/in/johndoe",
      },
      experience: [
        {
          id: "exp1",
          role: "Senior Engineer",
          company: "Tech Corp",
          location: "San Francisco",
          startDate: "Jan 2020",
          endDate: "Present",
          highlights: ["Led team of 5 engineers", "Increased performance by 40%"],
        },
      ],
      education: [
        {
          id: "edu1",
          school: "University Name",
          degree: "Bachelor of Science in Computer Science",
          location: "City",
          startDate: "2015",
          endDate: "2019",
          highlights: ["GPA: 3.8"],
        },
      ],
      projects: [
        {
          id: "proj1",
          name: "Project Name",
          summary: "Brief description",
          link: "https://github.com/user/repo",
          highlights: ["Built with React", "10k+ users"],
        },
      ],
      skills: ["JavaScript", "Python", "React"],
      certifications: ["AWS Certified"],
      languages: ["English", "Spanish"],
    }, null, 2),
    "",
    "EXTRACTION RULES:",
    "1. Extract the person's real name from the resume → use for 'fullName' (never use placeholder)",
    "2. Extract the person's real email → use for 'email' (must be valid email format)",
    "3. Extract job title/role → use for 'title'",
    "4. Extract professional summary/objective → use for 'summary'",
    "5. Extract ALL job positions with their descriptions → add to 'experience' array",
    "6. Extract ALL education entries → add to 'education' array",
    "7. Extract ALL projects → add to 'projects' array",
    "8. Extract ALL technical skills → add to 'skills' array",
    "9. Extract certifications if present → add to 'certifications' array",
    "10. Extract languages if present → add to 'languages' array",
    "",
    "IMPORTANT:",
    "- Return ONLY the JSON object, no markdown fences, no explanations",
    "- Use empty string \"\" for missing text fields (never null)",
    "- Use empty array [] for missing list fields (never null)",
    "- Preserve all bullet points from work experience as separate items in highlights array",
    "- Keep dates in simple format: 'Jan 2023', '2020', or 'Present'",
    "- Be thorough - extract every detail you can find",
    "",
    "RESUME TO PARSE:",
    "---",
    trimmed,
    "---",
  ].join("\n")

  const response = await generateText(prompt)
  console.log("[AI Import] Raw AI response length:", response.length)
  console.log("[AI Import] First 500 chars of response:", response.slice(0, 500))
  
  const jsonPayload = extractJsonObject(response)
  const parsed = JSON.parse(jsonPayload) as Record<string, unknown>
  
  console.log("[AI Import] Parsed personal data:", JSON.stringify((parsed.personal as Record<string, unknown>) || {}))
  console.log("[AI Import] Experience count:", Array.isArray(parsed.experience) ? parsed.experience.length : 0)
  
  // Sanitize and ensure required fields have valid values
  const sanitized = {
    ...parsed,
    personal: sanitizePersonalData(parsed),
  }
  
  const cv = cvSchema.parse(sanitized)
  return ensureIds(cv)
}
