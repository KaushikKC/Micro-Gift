import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { PrivyWagmiProvider } from "@/components/privy-provider"

export const metadata: Metadata = {
  title: "Morph Gift - Send Crypto Gifts Instantly",
  description: "Send surprise crypto gifts to anyone, anywhere in the world. Fast, secure, and fun gifting on the Morph blockchain.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-modern antialiased">
        <PrivyWagmiProvider>
          <Navbar />
          <main>{children}</main>
        </PrivyWagmiProvider>
      </body>
    </html>
  )
}
