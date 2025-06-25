import type React from "react"
import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import "./globals.css"

export const metadata: Metadata = {
  title: "FundingPips Stock Tracker",
  description: "Track real-time stock prices and manage your portfolio",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <Navigation />
        {children}
      </body>
    </html>
  )
}
