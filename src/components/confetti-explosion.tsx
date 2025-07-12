"use client"

import { useEffect, useState } from "react"

interface ConfettiExplosionProps {
  trigger: boolean
  onComplete?: () => void
}

export function ConfettiExplosion({ trigger, onComplete }: ConfettiExplosionProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>(
    [],
  )

  useEffect(() => {
    if (trigger) {
      const colors = ["confetti-green", "confetti-red", "confetti-gold", "confetti-purple"]
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
      }))

      setParticles(newParticles)

      setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 3000)
    }
  }, [trigger, onComplete])

  if (!trigger) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`confetti-particle ${particle.color} animate-confetti`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
