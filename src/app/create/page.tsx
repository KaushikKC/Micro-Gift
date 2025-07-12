"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { QrCode, Send } from "lucide-react"
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
    <div className="bg-black min-h-screen pt-24 pb-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create a Crypto Gift
          </h1>
          <p className="text-xl text-gray">
            Send a personalized micro-gift to anyone, anywhere in the world
          </p>
        </div>

        <div className="grid grid-2 gap-12 items-start">
          {/* Form Section */}
          <div>
            <div className="card-dark">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recipient Address */}
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-white font-medium">
                    Recipient Wallet Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="recipient"
                      type="text"
                      placeholder="0x1234...abcd"
                      value={formData.recipient}
                      onChange={(e) => handleInputChange("recipient", e.target.value)}
                      className="input-simple"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Gift Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white font-medium">
                    Gift Amount (USDT)
                  </Label>
                  <Select value={formData.amount} onValueChange={(value) => handleInputChange("amount", value)}>
                    <SelectTrigger className="input-simple">
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border border-white">
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
                  <Label htmlFor="message" className="text-white font-medium">
                    Personal Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Happy Birthday! Enjoy your coffee ☕"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    maxLength={50}
                    className="input-simple resize-none"
                    rows={3}
                  />
                  <div className="text-right text-sm text-gray">{formData.message.length}/50</div>
                </div>

                {/* Submit Button */}
                <InteractiveButton variant="primary" size="lg" className="w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Send Gift
                </InteractiveButton>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Gift Preview</h3>

              <div className="card-simple">
                <div className="text-center">
                  <h4 className="text-xl font-bold mb-2">CRYPTO GIFT</h4>
                  <div className="text-2xl font-bold mb-4">
                    {formData.amount ? `$${formData.amount}` : "$0"}
                  </div>
                  <div className="text-sm mb-4">
                    <strong>To:</strong> {formData.recipient || "0x1234...abcd"}
                  </div>
                  <div className="text-sm">
                    <strong>Message:</strong> {formData.message || "Your personalized message here"}
                  </div>
                </div>
              </div>

              {/* Gift Details */}
              <div className="card-dark mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">Gift Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray">Network:</span>
                    <span className="text-white">Morph Blockchain</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">Token:</span>
                    <span className="text-white">USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">Gas Fee:</span>
                    <span className="text-white">~$0.01</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray">Total:</span>
                    <span className="text-white">${formData.amount || "0"}.01</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="card-simple text-center max-w-md mx-4">
              <h3 className="text-2xl font-bold mb-2">Gift Sent!</h3>
              <p className="text-sm mb-4">Your crypto gift has been successfully sent to the recipient.</p>
              <div className="text-xs text-gray font-mono">TX: 0xabc123...def456</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
