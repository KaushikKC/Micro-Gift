"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Zap, Shield, Globe, Trophy, Gift } from "lucide-react"
import { InteractiveButton } from "@/components/interactive-button"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const features = [
    {
      icon: Zap,
      title: "INSTANT SEND",
      description: "Lightning-fast micro-gifts powered by Morph blockchain technology",
    },
    {
      icon: Shield,
      title: "SECURE CHAIN",
      description: "Every gift secured on-chain with full transparency and verification",
    },
    {
      icon: Globe,
      title: "GLOBAL REACH",
      description: "Send gifts anywhere in the world, instantly and borderlessly",
    },
  ]

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2 gap-8 items-center">
            {/* Left side - Text content */}
            <div className="text-white">
              <h1 className="text-6xl font-black mb-6">
                CRYPTO GIFTS
              </h1>
              <p className="text-xl text-gray mb-6">
                Send micro-gifts instantly and securely
              </p>
              <div className="flex gap-6">
                <Link href="/create">
                  <InteractiveButton variant="primary" size="lg">
                    CREATE GIFT
                  </InteractiveButton>
                </Link>
                <Link href="/redeem">
                  <InteractiveButton variant="outline" size="lg">
                    REDEEM GIFT
                  </InteractiveButton>
                </Link>
              </div>
            </div>

            {/* Right side - Simple illustration */}
            <div className="text-center">
              <div className="card-simple">
                <Gift className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">CRYPTO GIFT</h3>
                <p className="text-sm">Send and receive instantly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-gray">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              FEATURES
            </h2>
          </div>

          <div className="grid grid-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card-dark">
                  <Icon className="w-8 h-8 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              GET STARTED
            </h2>
            <p className="text-xl text-gray mb-8">
              Start sending crypto gifts today
            </p>
            <Link href="/create">
              <InteractiveButton variant="primary" size="lg">
                CREATE YOUR FIRST GIFT
              </InteractiveButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
