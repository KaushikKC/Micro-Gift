"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Gift, History, Home } from "lucide-react"
import { ConnectWallet } from "./connect-wallet"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/create", label: "Create Gift", icon: Gift },
    { href: "/history", label: "History", icon: History },
  ]

  return (
    <nav className="bg-surface/90 backdrop-blur-md border-b border-soft sticky top-0 z-50">
      <div className="container-modern">
        <div className="flex items-center justify-between h-16">
          <div className="text-primary">
            <Link href="/" className="text-xl font-bold-modern">
              🎁 Morph-Gift
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    pathname === item.href 
                      ? "bg-accent text-white" 
                      : "text-secondary hover:text-primary hover:bg-soft/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium-modern">{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div>
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  )
}
