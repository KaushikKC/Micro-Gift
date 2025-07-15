import { motion } from "framer-motion"
import { Gift } from "lucide-react" // or your favorite gift icon
import clsx from "clsx"

export function GiftButton({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-pink-500 to-red-500 rounded-xl shadow-lg",
        "transition-all duration-300 cursor-pointer hover:shadow-2xl",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <Gift className="w-8 h-8 text-white animate-pulse" />

      {/* Ribbon Animation */}
      <div className="absolute w-3 h-16 bg-white top-0 left-1/2 -translate-x-1/2 rounded-full"></div>
      <div className="absolute h-3 w-16 bg-white left-0 top-1/2 -translate-y-1/2 rounded-full"></div>

      {/* Sparkle effect */}
      <motion.div
        className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full"
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
    </motion.button>
  )
}
