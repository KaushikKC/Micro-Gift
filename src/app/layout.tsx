import type React from "react"
import type { Metadata } from "next"
import { Orbitron, Rajdhani } from "next/font/google"
import "../app/globals.css"
import { Navbar } from "@/components/navbar"

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron",
})

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
})

export const metadata: Metadata = {
  title: "Morph-Gift - Send Micro-Gifts on Morph",
  description: "Send crypto gifts with a smile! Micro-gifts in USDT, instant and global.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${rajdhani.variable} bg-black text-white font-rajdhani`}>
        <div className="relative">
          <Navbar />
          <main className="relative z-10">{children}</main>
        </div>
      </body>
    </html>
  )
}
