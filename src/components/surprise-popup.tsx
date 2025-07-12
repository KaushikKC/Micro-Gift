"use client"

import { useState, useEffect } from "react"
import { X, Gift, Star, Trophy, Sparkles, Zap } from "lucide-react"
import { InteractiveButton } from "./interactive-button"

interface SurprisePopupProps {
  isOpen: boolean
  onClose: () => void
  type: "achievement" | "gift" | "bonus" | "level-up"
  title: string
  description: string
  reward?: string
  icon?: React.ComponentType<{ className?: string }>
}

export function SurprisePopup({
  isOpen,
  onClose,
  type,
  title,
  description,
  reward,
  icon: Icon = Gift,
}: SurprisePopupProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [isOpen])

  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case "achievement":
        return {
          bg: "bg-gradient-to-br from-gold to-yellow-500",
          border: "border-gold",
          icon: Star,
        }
      case "gift":
        return {
          bg: "bg-gradient-to-br from-primary-green to-emerald-600",
          border: "border-primary-green",
          icon: Gift,
        }
      case "bonus":
        return {
          bg: "bg-gradient-to-br from-purple to-indigo-600",
          border: "border-purple",
          icon: Sparkles,
        }
      case "level-up":
        return {
          bg: "bg-gradient-to-br from-primary-red to-rose-600",
          border: "border-primary-red",
          icon: Trophy,
        }
      default:
        return {
          bg: "bg-gradient-to-br from-primary-green to-emerald-600",
          border: "border-primary-green",
          icon: Gift,
        }
    }
  }

  const styles = getTypeStyles()
  const IconComponent = styles.icon

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 animate-confetti pointer-events-none ${
                i % 4 === 0
                  ? "bg-primary-green"
                  : i % 4 === 1
                  ? "bg-primary-red"
                  : i % 4 === 2
                  ? "bg-gold"
                  : "bg-purple"
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Popup Modal */}
      <div
        className={`popup-modal ${styles.bg} ${styles.border} rounded-3xl p-8 text-center max-w-md mx-4 relative overflow-hidden`}
      >
        {/* Background Sparkles */}
        <div className="absolute top-4 right-4 animate-sparkle">
          <Sparkles className="w-6 h-6 text-white/30" />
        </div>
        <div className="absolute bottom-4 left-4 animate-sparkle" style={{ animationDelay: "0.5s" }}>
          <Zap className="w-4 h-4 text-white/30" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <IconComponent className="w-10 h-10 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-4 animate-slide-up">{title}</h3>
        <p className="text-white/90 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {description}
        </p>

        {reward && (
          <div className="bg-white/10 rounded-2xl p-4 mb-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-3xl font-bold text-white">{reward}</div>
            <div className="text-white/70 text-sm">REWARD</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <InteractiveButton variant="emerald" size="sm" onClick={onClose}>
            <span className="font-geometric font-bold">COLLECT</span>
          </InteractiveButton>
          <InteractiveButton variant="indigo" size="sm">
            <span className="font-geometric font-bold">SHARE</span>
          </InteractiveButton>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-white/20 star animate-float" />
        <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-white/20 diamond animate-float" style={{ animationDelay: "1s" }} />
      </div>
    </div>
  )
} 