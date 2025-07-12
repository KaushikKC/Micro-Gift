"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wallet, Gift, History, Home } from "lucide-react"
import { InteractiveButton } from "./interactive-button"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/create", label: "Create Gift", icon: Gift },
    { href: "/history", label: "History", icon: History },
  ]

  return (
    <nav className="bg-black border-b border-white">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="text-white">
            <Link href="/" className="text-xl font-bold">
              Morph-Gift
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 text-white ${
                    pathname === item.href ? "bg-white text-black" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div>
            <InteractiveButton variant="outline" size="sm">
              <Wallet className="w-4 h-4 mr-2" />
              CONNECT
            </InteractiveButton>
          </div>
        </div>
      </div>
    </nav>
  )
}
