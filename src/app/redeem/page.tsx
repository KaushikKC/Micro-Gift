"use client"

import { useState, useEffect } from "react"
import { Gift, Wallet } from "lucide-react"
import { InteractiveButton } from "@/components/interactive-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RedeemGiftPage() {
  const [voucherId, setVoucherId] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [isRedeemed, setIsRedeemed] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleRedeem = async () => {
    setIsRedeeming(true)

    // Simulate redemption process
    setTimeout(() => {
      setIsRedeeming(false)
      setIsRedeemed(true)
    }, 2000)
  }

  if (isRedeemed) {
    return (
      <div className="bg-black min-h-screen pt-24 pb-12">
        <div className="container">
          <div className="text-center">
            <div className="card-simple max-w-md mx-auto">
              <h1 className="text-5xl font-bold mb-6">
                Gift Redeemed!
              </h1>

              <div className="card-dark mb-8">
                <div className="space-y-4">
                  <div className="text-3xl font-bold">$2 USDT</div>
                  <div className="text-sm">
                    <strong>From:</strong> 0xabc123...def456
                  </div>
                  <div className="text-sm">
                    <strong>Message:</strong> "Congrats on your achievement! 🎉"
                  </div>
                  <div className="text-xs text-gray">Redeemed on Morph Network • TX: 0x789...012</div>
                </div>
              </div>

              <p className="text-xl mb-8">The USDT has been transferred to your wallet successfully!</p>

              <InteractiveButton variant="outline" size="lg">
                View Transaction
              </InteractiveButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen pt-24 pb-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Redeem Your Crypto Gift
          </h1>
          <p className="text-xl text-gray">Enter your voucher ID to unwrap your surprise gift</p>
        </div>

        <div className="grid grid-2 gap-12 items-center">
          {/* Redemption Form */}
          <div>
            <div className="card-dark">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Unwrap Your Gift</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voucherId" className="text-white font-medium">
                    Voucher ID
                  </Label>
                  <Input
                    id="voucherId"
                    type="text"
                    placeholder="Enter voucher ID (e.g., XYZ123)"
                    value={voucherId}
                    onChange={(e) => setVoucherId(e.target.value)}
                    className="input-simple text-center text-lg font-mono"
                  />
                </div>

                <InteractiveButton variant="outline" size="lg" className="w-full" disabled={!voucherId.trim()}>
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                </InteractiveButton>

                <InteractiveButton
                  onClick={handleRedeem}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!voucherId.trim() || isRedeeming}
                >
                  {isRedeeming ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Redeeming...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 mr-2" />
                      Redeem Gift
                    </>
                  )}
                </InteractiveButton>

                <div className="text-center text-sm text-gray">
                  Don't have a voucher ID? Ask the sender to share it with you.
                </div>
              </div>
            </div>
          </div>

          {/* Gift Visualization */}
          <div>
            <div className="text-center">
              <div className="card-simple">
                <Gift className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">MYSTERY GIFT</h3>
                <p className="text-sm">Enter voucher ID to reveal</p>
              </div>
            </div>

            {/* Gift Info */}
            <div className="card-dark mt-8">
              <h4 className="text-lg font-semibold text-white mb-4 text-center">Sample Gift Info</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray">Voucher ID:</span>
                  <span className="text-white font-mono">XYZ123</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray">Amount:</span>
                  <span className="text-white">$2 USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray">From:</span>
                  <span className="text-white font-mono">0xabc...def</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray">Message:</span>
                  <span className="text-white">"Congrats!"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
