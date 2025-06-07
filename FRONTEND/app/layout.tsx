import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/contexts/auth-context"
import { PreferencesProvider } from "@/contexts/preferences-context"
import { AnalyticsProvider } from "@/contexts/analytics-context"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlightBooker - Find Your Perfect Flight",
  description: "Compare prices from hundreds of airlines and travel sites",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PreferencesProvider>
            <AnalyticsProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
                {children}
              </Suspense>
            </AnalyticsProvider>
          </PreferencesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
