"use client"

import { useState, useEffect } from "react"
import { Gift } from "lucide-react"

interface AnimatedGiftBoxProps {
  size?: "sm" | "md" | "lg"
  amount?: string
  className?: string
}

export function AnimatedGiftBox({ size = "md", amount, className }: AnimatedGiftBoxProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newParticle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
      }
      setParticles((prev) => [...prev, newParticle])

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
      }, 3000)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      {/* Main gift box */}
      <div className="relative w-full h-full animate-float group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-green-500 to-red-600 geometric-card transform rotate-3 group-hover:rotate-6 transition-transform duration-300" />
        <div className="absolute inset-1 bg-gradient-to-br from-red-400 via-green-400 to-red-500 diamond flex items-center justify-center">
          <Gift className="w-8 h-8 text-white animate-pulse-glow" />
        </div>

        {/* Geometric ribbon */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-yellow-300 to-yellow-500 geometric-card" />
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-2 bg-gradient-to-r from-yellow-300 to-yellow-500 geometric-card" />

        {/* Amount label */}
        {amount && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm geometric-card px-3 py-1 text-xs font-geometric font-bold text-green-400 border border-green-400/30">
            {amount}
          </div>
        )}
      </div>

      {/* Floating geometric particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-red-400 diamond animate-particle pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
        />
      ))}
    </div>
  )
}
