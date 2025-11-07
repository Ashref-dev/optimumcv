import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "OptimumCV — AI CV Builder",
  description:
    "Generate, enhance, and tailor professional resumes in minutes with OptimumCV's AI-powered builder.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen bg-background text-foreground"
        )}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors expand={false} closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
