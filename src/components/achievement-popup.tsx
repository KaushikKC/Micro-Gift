"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface AchievementPopupProps {
  achievement: Achievement | null
  onClose: () => void
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  const rarityColors = {
    common: "border-gray-400 bg-gray-500/20",
    rare: "border-primary-green bg-primary-green/20",
    epic: "border-purple bg-purple/20",
    legendary: "border-gold bg-gold/20",
  }

  const Icon = achievement.icon

  return (
    <div
      className={`popup-modal animate-popup ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
    >
      <div
        className={`achievement-badge w-16 h-16 flex items-center justify-center mx-auto mb-4 ${rarityColors[achievement.rarity]}`}
      >
        <Icon className="w-8 h-8 text-gold" />
      </div>

      <div className="text-center">
        <h3 className="text-xl font-bold font-geometric text-gold mb-2 animate-glow-pulse">ACHIEVEMENT UNLOCKED!</h3>
        <h4 className="text-lg font-geometric text-white mb-2">{achievement.title}</h4>
        <p className="text-sm text-gray-300">{achievement.description}</p>

        <div className="flex justify-center mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < (achievement.rarity === "legendary" ? 5 : achievement.rarity === "epic" ? 4 : achievement.rarity === "rare" ? 3 : 2) ? "text-gold" : "text-gray-600"}`}
              fill="currentColor"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
