"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { QrCode, Gift, Unlock } from "lucide-react"
import { InteractiveButton } from "@/components/interactive-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RedeemGiftPage() {
  const [giftCode, setGiftCode] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [showGift, setShowGift] = useState(false)
  const [giftData, setGiftData] = useState({
    amount: "5",
    message: "Happy Birthday! Enjoy your special day 🎉",
    sender: "0x1234...abcd",
    timestamp: "2024-01-15 14:30",
  })

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (giftCode.trim()) {
      setShowGift(true)
    }
  }

  const handleRedeem = () => {
    // Simulate redemption
    setTimeout(() => {
      setShowGift(false)
      setGiftCode("")
    }, 2000)
  }

  return (
    <div className="bg-soft min-h-screen pt-24 pb-12 bg-pattern">
      <div className="container-modern">
        <div className="text-center mb-12">
          <div className={isLoaded ? "fade-in" : ""}>
            <h1 className="text-4xl font-bold-modern text-primary mb-4">
              Unwrap Your Surprise
            </h1>
            <p className="text-xl font-regular-modern text-secondary">
              Enter your gift code to reveal and claim your crypto gift
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Gift Code Form */}
          <div className={isLoaded ? "fade-in-delay-1" : ""}>
            <div className="card-modern">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="giftCode" className="text-primary font-medium-modern">
                    Gift Code
                  </Label>
                  <div className="relative">
                    <Input
                      id="giftCode"
                      type="text"
                      placeholder="Enter your 12-digit gift code"
                      value={giftCode}
                      onChange={(e) => setGiftCode(e.target.value)}
                      className="w-full px-4 py-3 border border-soft rounded-xl bg-surface/50 backdrop-blur-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-center font-mono text-lg font-regular-modern"
                      maxLength={12}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-accent transition-colors"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-secondary text-center font-regular-modern">
                    Scan QR code or enter the code manually
                  </p>
                </div>

                <InteractiveButton variant="floating" size="lg" className="w-full">
                  <Unlock className="w-5 h-5 mr-2" />
                  Unwrap Gift
                </InteractiveButton>
              </form>
            </div>
          </div>

          {/* Gift Display */}
          {showGift && (
            <div className={isLoaded ? "fade-in-delay-2" : ""}>
              <div className="card-modern glow-cranberry text-center mt-8">
                <div className="relative">
                  {/* Gift Icon */}
                  <div className="mb-6">
                    <Gift className="w-20 h-20 mx-auto text-accent" />
                  </div>

                  {/* Gift Details */}
                  <h3 className="text-2xl font-bold-modern text-primary mb-4">
                    🎉 You've Got a Gift! 🎉
                  </h3>
                  
                  <div className="text-4xl font-bold-modern text-accent mb-6">
                    ${giftData.amount} USDT
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="text-secondary font-regular-modern">
                      <strong>From:</strong> {giftData.sender}
                    </div>
                    <div className="text-secondary font-regular-modern">
                      <strong>Sent:</strong> {giftData.timestamp}
                    </div>
                    <div className="text-primary font-medium-modern">
                      "{giftData.message}"
                    </div>
                  </div>

                  <InteractiveButton variant="floating" size="lg" onClick={handleRedeem}>
                    <Gift className="w-5 h-5 mr-2" />
                    Claim Gift
                  </InteractiveButton>
                </div>
              </div>

              {/* Gift Info */}
              <div className="card-modern mt-6">
                <h4 className="text-lg font-semibold-modern text-primary mb-4">Gift Information</h4>
                <div className="space-y-3 text-sm font-regular-modern">
                  <div className="flex justify-between">
                    <span className="text-secondary">Network:</span>
                    <span className="text-primary">Morph Blockchain</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Token:</span>
                    <span className="text-primary">USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Status:</span>
                    <span className="text-mint">Ready to Claim</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Expires:</span>
                    <span className="text-primary">Never</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className={isLoaded ? "fade-in-delay-2" : ""}>
            <div className="card-modern mt-8">
              <h3 className="text-xl font-bold-modern text-primary mb-4">How to Redeem</h3>
              <div className="space-y-4 text-secondary font-regular-modern">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <p>Enter the 12-digit gift code you received</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <p>Review the gift details and message from the sender</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <p>Click "Claim Gift" to receive the crypto in your wallet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
