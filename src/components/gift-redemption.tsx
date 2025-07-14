import React, { useState } from "react";
import { Gift } from "lucide-react";
// If you see a module not found error for framer-motion, run: npm install framer-motion
import { motion, AnimatePresence } from "framer-motion";
import { ConfettiExplosion } from "./confetti-explosion";
import { InteractiveButton } from "./interactive-button";

interface GiftRedemptionProps {
  voucher: {
    voucherId: string;
    amount: string;
    message: string;
    sender: string;
    timestamp: string;
    redeemed: boolean;
  };
  onClaim: () => Promise<void>;
  loading: boolean;
}

export function GiftRedemption({ voucher, onClaim, loading }: GiftRedemptionProps) {
  const [unwrapped, setUnwrapped] = useState(false);

  const handleUnwrap = async () => {
    setUnwrapped(true);
    try {
      await onClaim();
    } catch {
      setUnwrapped(false);
    }
  };

  return (
    <div className="card-modern glow-cranberry text-center mt-8">
      <div className="relative">
        <AnimatePresence>
          {!unwrapped && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Gift className="w-20 h-20 mx-auto text-accent" />
              <InteractiveButton
                variant="floating"
                size="lg"
                onClick={handleUnwrap}
                disabled={loading || voucher.redeemed}
                className="mt-6"
              >
                <Gift className="w-5 h-5 mr-2" />
                {voucher.redeemed ? "Already Claimed" : "Claim Gift"}
              </InteractiveButton>
            </motion.div>
          )}
          {unwrapped && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ConfettiExplosion trigger={unwrapped} />
              <h3 className="text-2xl font-bold-modern text-primary mb-4">
                🎉 You&apos;ve Got a Gift! 🎉
              </h3>
              <div className="text-4xl font-bold-modern text-accent mb-6">
                ${voucher.amount} USDT
              </div>
              <div className="space-y-4 mb-8">
                <div className="text-secondary font-regular-modern">
                  <strong>From:</strong> {voucher.sender}
                </div>
                <div className="text-secondary font-regular-modern">
                  <strong>Sent:</strong> {voucher.timestamp}
                </div>
                <div className="text-primary font-medium-modern">
                  &quot;{voucher.message}&quot;
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 