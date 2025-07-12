"use client"

import { useState } from "react"
import { Gift, Star, Sparkles } from "lucide-react"

interface SurpriseGiftBoxProps {
  size?: "sm" | "md" | "lg"
  amount?: string
  className?: string
  onReveal?: () => void
}

export function SurpriseGiftBox({ size = "md", amount, className, onReveal }: SurpriseGiftBoxProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const handleClick = () => {
    setIsShaking(true)
    setTimeout(() => {
      setIsShaking(false)
      setIsRevealed(true)
      onReveal?.()
    }, 500)
  }

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      <div
        className={`relative w-full h-full cursor-pointer surprise-box group ${isShaking ? "animate-shake" : ""} ${isRevealed ? "animate-gift-reveal" : "animate-bounce-gentle"}`}
        onClick={handleClick}
      >
        {!isRevealed ? (
          <>
            {/* Gift Box */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-red via-primary-green to-gold geometric-card transform group-hover:rotate-3 transition-transform duration-300" />
            <div className="absolute inset-1 bg-gradient-to-br from-red-400 via-green-400 to-yellow-400 diamond flex items-center justify-center">
              <Gift className="w-8 h-8 text-white animate-bounce-gentle" />
            </div>

            {/* Ribbon */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-gold to-yellow-500 geometric-card" />
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-2 bg-gradient-to-r from-gold to-yellow-500 geometric-card" />

            {/* Floating sparkles */}
            <div className="absolute -top-2 -right-2 animate-sparkle">
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-sparkle" style={{ animationDelay: "0.5s" }}>
              <Star className="w-3 h-3 text-accent-green" />
            </div>
          </>
        ) : (
          <>
            {/* Revealed Content */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold to-yellow-500 star flex items-center justify-center animate-glow-pulse">
              <div className="text-center">
                <div className="text-2xl font-bold font-geometric text-black">{amount || "$?"}</div>
                <div className="text-xs text-black/80 font-geometric">USDT</div>
              </div>
            </div>
          </>
        )}

        {/* Amount label */}
        {amount && !isRevealed && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm geometric-card px-3 py-1 text-xs font-geometric font-bold text-gold border border-gold">
            SURPRISE!
          </div>
        )}
      </div>
    </div>
  )
}
