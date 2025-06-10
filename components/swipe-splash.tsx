"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface SwipeSplashProps {
  direction: "left" | "right" | null
  onComplete: () => void
}

export function SwipeSplash({ direction, onComplete }: SwipeSplashProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (direction) {
      // Generate particles for splash effect
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }))
      setParticles(newParticles)

      // Clear particles after animation
      const timer = setTimeout(() => {
        setParticles([])
        onComplete()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [direction, onComplete])

  if (!direction) return null

  const isRight = direction === "right"
  const color = isRight ? "rgba(34, 197, 94, 0.8)" : "rgba(239, 68, 68, 0.8)"
  const emoji = isRight ? "💚" : "❌"

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Main splash circle */}
        <motion.div
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}, transparent)`,
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 3, rotate: 360 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-32 h-32" />
        </motion.div>

        {/* Emoji */}
        <motion.div
          className="text-6xl z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.4, ease: "backOut" }}
        >
          {emoji}
        </motion.div>

        {/* Particle explosion */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: isRight ? "#22c55e" : "#ef4444",
              boxShadow: `0 0 10px ${isRight ? "#22c55e" : "#ef4444"}`,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: (particle.x - 50) * 4,
              y: (particle.y - 50) * 4,
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: particle.id * 0.02,
            }}
          />
        ))}

        {/* Ripple effect */}
        <motion.div
          className="absolute border-4 rounded-full"
          style={{
            borderColor: isRight ? "#22c55e" : "#ef4444",
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-20 h-20" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
