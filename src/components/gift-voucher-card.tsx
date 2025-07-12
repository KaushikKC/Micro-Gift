"use client"

import { useState } from "react"
import { Gift, User, MessageCircle, Calendar } from "lucide-react"

interface GiftVoucherCardProps {
  recipient?: string
  amount?: string
  message?: string
  date?: string
  isPreview?: boolean
  className?: string
}

export function GiftVoucherCard({
  recipient,
  amount,
  message,
  date,
  isPreview = false,
  className,
}: GiftVoucherCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className={`relative w-full max-w-sm mx-auto perspective-1000 ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative w-full h-48 transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-green-600 via-red-500 to-green-500 geometric-card p-1">
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black geometric-card p-6 relative overflow-hidden">
              {/* Geometric decorations */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-green-400/20 to-red-400/20 hexagon" />
              <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-br from-red-400/20 to-green-400/20 diamond" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-6 h-6 text-green-400" />
                    <span className="text-sm font-bold font-geometric text-green-400">Morph-Gift</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-geometric text-white">{amount || "$0"}</div>
                    <div className="text-xs text-gray-400 font-geometric">USDT</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <User className="w-4 h-4" />
                    <span className="truncate font-mono">{recipient || "Recipient address"}</span>
                  </div>
                  {message && (
                    <div className="flex items-start space-x-2 text-sm text-gray-300">
                      <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{message}</span>
                    </div>
                  )}
                </div>

                {/* Geometric perforations */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1">
                  <div className="w-4 h-4 bg-gray-900 hexagon" />
                </div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
                  <div className="w-4 h-4 bg-gray-900 hexagon" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-red-500 via-green-500 to-red-500 geometric-card p-1">
            <div className="w-full h-full bg-gradient-to-br from-black to-gray-900 geometric-card p-6 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-red-400 hexagon flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-geometric text-white mb-2">GIFT VOUCHER</h3>
                <p className="text-sm text-gray-300">Redeemable on Morph Network</p>
                {date && (
                  <div className="flex items-center justify-center space-x-1 mt-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span className="font-mono">{date}</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 font-mono geometric-card bg-gray-800/50 px-2 py-1">
                ID: {isPreview ? "PREVIEW" : "XYZ123ABC"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
