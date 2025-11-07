import { CVBuilder } from "@/components/cv/cv-builder"

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-12 px-6 py-16 sm:px-10 lg:px-20">
      <div className="absolute inset-x-0 top-10 -z-10 mx-auto h-[420px] max-w-5xl rounded-full bg-gradient-to-br from-primary/25 via-transparent to-primary/10 blur-3xl" />
      <header className="space-y-4 text-center sm:text-left">
        <span className="text-sm font-semibold uppercase tracking-[0.4rem] text-primary">OptimumCV</span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Build, enhance, and adapt a professional CV in minutes.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Import existing resumes, collaborate with AI to polish each section, tailor content to any job description, and instantly export pixel-perfect PDFs.
        </p>
      </header>
      <CVBuilder />
    </main>
  )
}
