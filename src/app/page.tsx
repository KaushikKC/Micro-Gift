"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Zap, Shield, Globe, Gift } from "lucide-react"
import { InteractiveButton } from "@/components/interactive-button"
import clsx from "clsx"
// import { Web3ErrorBoundary } from "@/components/web3-error-boundary"
// import { Web3Status } from "@/components/web3-status"
// import { ChainDebug } from "@/components/chain-debug"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Send gifts instantly across the globe",
      color: "cranberry",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Blockchain-powered security for every gift",
      color: "mint",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with anyone, anywhere, anytime",
      color: "champagne",
    },
  ]

  return (
    <div className="bg-soft min-h-screen bg-pattern">
      {/* Floating Confetti - Only render on client */}
      {isLoaded && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Wallet Status Section */}
      {/* <section className="section-modern pt-8">
        <div className="container-modern">
          <div className="max-w-md mx-auto space-y-4">
            <Web3ErrorBoundary>
              <Web3Status />
              <ChainDebug />
            </Web3ErrorBoundary>
          </div>
        </div>
      </section> */}

      {/* Hero Section */}
      <section className="section-modern pt-32">
        <div className="container-modern">
          <div className="grid-modern grid-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="space-y-modern">
              <div className={isLoaded ? "fade-in" : ""}>
                <h1 className="text-6xl font-bold-modern text-primary mb-6">
                  Unwrap
                  <span className="block text-accent">Joy</span>
                </h1>
                <p className="text-xl font-regular-modern text-secondary mb-8">
                  Send surprise crypto gifts that bring smiles across the digital world
                </p>
              </div>

              <div className={clsx("flex items-center gap-x-4", isLoaded && "fade-in-delay-1")}>
                <Link href="/create">
                  <InteractiveButton size="lg">
                    <div className="flex items-center">
                      <Gift className="w-5 h-5 mr-2" />
                      Send a Gift
                    </div>
                  </InteractiveButton>
                </Link>
                <Link href="/redeem">
                  <InteractiveButton variant="outline" size="lg">
                    Unwrap Surprise
                  </InteractiveButton>
                </Link>
              </div>

              {/* Stats */}
              <div className={isLoaded ? "fade-in-delay-2" : ""}>
                <div className="grid grid-3 gap-6 mt-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold-modern text-accent">10K+</div>
                    <div className="text-sm font-regular-modern text-secondary">Gifts Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold-modern text-cranberry">$50K+</div>
                    <div className="text-sm font-regular-modern text-secondary">Value Shared</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold-modern text-mint">150+</div>
                    <div className="text-sm font-regular-modern text-secondary">Countries</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Gift Box */}
            <div className="text-center">
              <div className="relative">
                {/* Main Gift Box */}
                <div className={isLoaded ? "scale-in" : ""}>
                  <div className="card-modern glow-cranberry p-12 max-w-sm mx-auto">
                    <Gift className="w-24 h-24 mx-auto mb-6 text-accent" />
                    <h3 className="text-2xl font-bold-modern text-primary mb-2">
                      Your Gift Awaits
                    </h3>
                    <p className="text-secondary font-regular-modern">
                      Click to reveal the surprise inside
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-modern bg-blob">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold-modern text-primary mb-4">
              Why Choose Crypto Gifts?
            </h2>
            <p className="text-xl font-regular-modern text-secondary max-w-2xl mx-auto">
              Experience the magic of instant, secure, and global gifting
            </p>
          </div>

          <div className="grid-modern grid-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`card-feature ${feature.color} ${isLoaded ? "fade-in" : ""}`}
                  style={{ animationDelay: isLoaded ? `${index * 0.2}s` : "0s" }}
                >
                  <div className="w-16 h-16 bg-soft rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold-modern text-primary mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-secondary font-regular-modern">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-modern">
        <div className="container-modern">
          <div className="text-center">
            <div className="card-modern glass max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold-modern text-primary mb-6">
                Ready to Spread Joy?
              </h2>
              <p className="text-xl font-regular-modern text-secondary mb-8">
                Join thousands of people sending surprise crypto gifts around the world
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/create">
                  <InteractiveButton size="lg">
                    <div className="flex items-center">
                      <Gift className="w-5 h-5 mr-2" />
                      Start Gifting
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </InteractiveButton>
                </Link>
                <Link href="/redeem">
                  <InteractiveButton variant="outline" size="lg">
                    Check Your Gifts
                  </InteractiveButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-soft">
        <div className="container-modern">
          <div className="text-center">
            <p className="text-secondary font-regular-modern">
              Made with ❤️ for the morph community
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
