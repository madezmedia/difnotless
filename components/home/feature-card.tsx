"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
  iconClassName?: string
}

export function FeatureCard({ icon, title, description, className, iconClassName }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const cardVariants = {
    initial: { y: 0 },
    hover: { y: -8 },
  }

  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
  }

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl p-6 transition-colors",
        "bg-white/70 backdrop-blur-sm dark:bg-gray-800/70",
        "border border-gray-100/50 dark:border-gray-700/50",
        "hover:bg-white/90 dark:hover:bg-gray-800/90",
        "shadow-sm hover:shadow-md",
        className,
      )}
      initial="initial"
      animate={isHovered && !prefersReducedMotion ? "hover" : "initial"}
      variants={cardVariants}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Background gradient that shifts on hover */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gold/5 via-teal/5 to-purple/5 opacity-0 transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0 }}
      />

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          className={cn(
            "mb-4 flex h-12 w-12 items-center justify-center rounded-full",
            "bg-gradient-to-br from-gold/20 to-teal/20",
            iconClassName,
          )}
          variants={iconVariants}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {icon}
        </motion.div>

        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>

      {/* Corner accent */}
      <div
        className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-gradient-to-br from-gold/10 to-teal/10 blur-xl transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0 }}
      />
    </motion.div>
  )
}

