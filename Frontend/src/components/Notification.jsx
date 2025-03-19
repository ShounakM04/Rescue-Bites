import React, { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle } from "lucide-react"

const Notification = ({
  message,
  type = "info",
  position = "top-right",
  onClose,
  duration = 5000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  // Position classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2"
  }

  // Type styles
  const typeStyles = {
    success: {
      bg: "bg-gradient-to-r from-green-500 to-emerald-600",
      icon: <CheckCircle className="w-5 h-5" />
    },
    error: {
      bg: "bg-gradient-to-r from-red-500 to-rose-600",
      icon: <AlertCircle className="w-5 h-5" />
    },
    warning: {
      bg: "bg-gradient-to-r from-amber-500 to-orange-600",
      icon: <AlertCircle className="w-5 h-5" />
    },
    info: {
      bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
      icon: <CheckCircle className="w-5 h-5" />
    }
  }

  // Animation variants
  const containerVariants = {
    initial: {
      opacity: 0,
      y: position.includes("top") ? -20 : 20,
      scale: 0.9,
      x: position.includes("right") ? 20 : position.includes("left") ? -20 : 0
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: position.includes("top") ? -20 : 20,
      x: position.includes("right") ? 20 : position.includes("left") ? -20 : 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  // Progress bar animation
  const progressVariants = {
    initial: { width: "100%" },
    animate: {
      width: "0%",
      transition: {
        duration: duration / 1000,
        ease: "linear"
      }
    }
  }

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className={`fixed ${positionClasses[position]} z-50 max-w-md w-full sm:w-auto`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={containerVariants}
          layout
        >
          <div
            className={`${typeStyles[type].bg} rounded-lg shadow-2xl overflow-hidden`}
          >
            <motion.div
              className="p-4 flex items-start gap-3 text-white backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="shrink-0 mt-0.5">{typeStyles[type].icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{message}</p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-full p-1 hover:bg-white/20 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="h-1 bg-white/30"
              variants={progressVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Notification
