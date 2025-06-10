"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
}

interface Logo {
  id: number
  src: string
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  rotation: number
  color: string
  baseX: number
  baseY: number
}

export function GalaxyBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [stars, setStars] = useState<Star[]>([])
  const [logos, setLogos] = useState<Logo[]>([])
  const animationRef = useRef<number>()

  const companyLogos = [
    { src: "/logos/google-new.jpg", color: "#4285F4" },
    { src: "/logos/apple-scary.jpg", color: "#A8A8A8" },
    { src: "/logos/tata.jpg", color: "#00BCF2" },
    { src: "/logos/apple-neon.jpg", color: "#FF6B6B" },
    { src: "/logos/hp.jpg", color: "#0096D6" },
    { src: "/logos/facebook.jpg", color: "#1877F2" },
  ]

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize stars (back to original)
    const initialStars: Star[] = []
    for (let i = 0; i < 200; i++) {
      initialStars.push({
        id: i,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      })
    }
    setStars(initialStars)

    // Initialize floating logos (back to original size and opacity)
    const initialLogos: Logo[] = []
    for (let i = 0; i < 15; i++) {
      const logo = companyLogos[i % companyLogos.length]
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      initialLogos.push({
        id: i,
        src: logo.src,
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 40 + 30, // Back to original size (30-70px)
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.1, // Back to original opacity (0.1-0.4)
        rotation: Math.random() * 360,
        color: logo.color,
      })
    }
    setLogos(initialLogos)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      // Clear canvas with galaxy gradient (back to original)
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2,
      )
      gradient.addColorStop(0, "rgba(15, 15, 35, 1)")
      gradient.addColorStop(0.3, "rgba(25, 15, 45, 1)")
      gradient.addColorStop(0.6, "rgba(35, 25, 55, 1)")
      gradient.addColorStop(1, "rgba(5, 5, 15, 1)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw twinkling stars (back to original)
      stars.forEach((star) => {
        const twinkle = Math.sin(Date.now() * star.twinkleSpeed) * 0.3 + 0.7
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`
        ctx.fill()

        // Add star glow (back to original)
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 200, 255, ${star.opacity * twinkle * 0.1})`
        ctx.fill()
      })

      // Draw nebula effect around mouse (back to original)
      const nebulaGradient = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        0,
        mouseRef.current.x,
        mouseRef.current.y,
        300,
      )
      nebulaGradient.addColorStop(0, "rgba(147, 51, 234, 0.15)")
      nebulaGradient.addColorStop(0.5, "rgba(79, 70, 229, 0.08)")
      nebulaGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = nebulaGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [stars])

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Floating company logos (back to original) */}
      {logos.map((logo) => (
        <motion.div
          key={logo.id}
          className="absolute"
          style={{
            left: logo.baseX,
            top: logo.baseY,
            width: logo.size,
            height: logo.size,
            opacity: logo.opacity,
          }}
          animate={{
            x: [0, Math.sin(Date.now() * 0.001 + logo.id) * 30],
            y: [0, Math.cos(Date.now() * 0.001 + logo.id) * 20],
            rotate: [logo.rotation, logo.rotation + 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 10 + (logo.id % 5),
            ease: "easeInOut",
          }}
        >
          <img
            src={logo.src || "/placeholder.svg"}
            alt="Company Logo"
            className="w-full h-full object-contain rounded-full"
            style={{
              filter: `drop-shadow(0 0 10px ${logo.color}40) blur(0.5px)`,
              border: `1px solid ${logo.color}30`,
            }}
          />
        </motion.div>
      ))}

      {/* Enhanced cosmic dust particles (back to original) */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-300 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 6 + Math.random() * 4,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  )
}
