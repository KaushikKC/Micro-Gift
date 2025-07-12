"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { QrCode, Send, Gift } from "lucide-react"
import { InteractiveButton } from "@/components/interactive-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateGiftPage() {
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    message: "",
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-soft min-h-screen pt-24 pb-12 bg-pattern">
      <div className="container-modern">
        <div className="text-center mb-12">
          <div className={isLoaded ? "fade-in" : ""}>
            <h1 className="text-4xl font-bold-modern text-primary mb-4">
              Create a Special Gift
            </h1>
            <p className="text-xl font-regular-modern text-secondary">
              Send a personalized crypto gift to anyone, anywhere in the world
            </p>
          </div>
        </div>

        <div className="grid-modern grid-2 gap-16 items-start">
          {/* Form Section */}
          <div className={isLoaded ? "fade-in-delay-1" : ""}>
            <div className="card-modern">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recipient Address */}
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-primary font-medium-modern">
                    Recipient Wallet Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="recipient"
                      type="text"
                      placeholder="0x1234...abcd"
                      value={formData.recipient}
                      onChange={(e) => handleInputChange("recipient", e.target.value)}
                      className="w-full px-4 py-3 border border-soft rounded-xl bg-surface/50 backdrop-blur-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all font-regular-modern"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-accent transition-colors"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Gift Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-primary font-medium-modern">
                    Gift Amount (USDT)
                  </Label>
                  <Select value={formData.amount} onValueChange={(value) => handleInputChange("amount", value)}>
                    <SelectTrigger className="w-full px-4 py-3 border border-soft rounded-xl bg-surface/50 backdrop-blur-sm focus:border-accent font-regular-modern">
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border border-soft rounded-xl">
                      <SelectItem value="1">$1 USDT</SelectItem>
                      <SelectItem value="2">$2 USDT</SelectItem>
                      <SelectItem value="3">$3 USDT</SelectItem>
                      <SelectItem value="4">$4 USDT</SelectItem>
                      <SelectItem value="5">$5 USDT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-primary font-medium-modern">
                    Personal Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Happy Birthday! Enjoy your coffee ☕"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    maxLength={50}
                    className="w-full px-4 py-3 border border-soft rounded-xl bg-surface/50 backdrop-blur-sm focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none font-regular-modern"
                    rows={3}
                  />
                  <div className="text-right text-sm text-secondary font-regular-modern">{formData.message.length}/50</div>
                </div>

                {/* Submit Button */}
                <InteractiveButton variant="floating" size="lg" className="w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Send Gift
                </InteractiveButton>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className={isLoaded ? "fade-in-delay-2" : ""}>
            <div>
              <h3 className="text-2xl font-bold-modern text-primary mb-6 text-center">Gift Preview</h3>

              <div className="card-modern glow-cranberry">
                <div className="text-center">
                  <Gift className="w-16 h-16 mx-auto mb-4 text-accent" />
                  <h4 className="text-xl font-semibold-modern text-primary mb-2">CRYPTO GIFT</h4>
                  <div className="text-3xl font-bold-modern text-accent mb-4">
                    {formData.amount ? `$${formData.amount}` : "$0"}
                  </div>
                  <div className="text-sm text-secondary mb-4 font-regular-modern">
                    <strong>To:</strong> {formData.recipient || "0x1234...abcd"}
                  </div>
                  <div className="text-sm text-secondary font-regular-modern">
                    <strong>Message:</strong> {formData.message || "Your personalized message here"}
                  </div>
                </div>
              </div>

              {/* Gift Details */}
              <div className="card-modern mt-8">
                <h4 className="text-lg font-semibold-modern text-primary mb-4">Gift Details</h4>
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
                    <span className="text-secondary">Gas Fee:</span>
                    <span className="text-accent">~$0.01</span>
                  </div>
                  <div className="flex justify-between font-semibold-modern">
                    <span className="text-secondary">Total:</span>
                    <span className="text-primary">${formData.amount || "0"}.01</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="card-modern glow-mint text-center max-w-md mx-4 scale-in">
              <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold-modern text-primary mb-2">Gift Sent!</h3>
              <p className="text-secondary mb-4 font-regular-modern">Your crypto gift has been successfully sent to the recipient.</p>
              <div className="text-xs text-secondary font-mono font-regular-modern">TX: 0xabc123...def456</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
