"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { motion } from "framer-motion"

export function AnimatedHero() {
  const prefersReducedMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)

    // Parallax effect for decorative elements
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return

      const { clientX, clientY } = e
      const { width, height, left, top } = heroRef.current.getBoundingClientRect()

      const x = (clientX - left) / width
      const y = (clientY - top) / height

      const decorElements = heroRef.current.querySelectorAll(".decor-element")
      decorElements.forEach((elem, i) => {
        const depth = i + 1
        const moveX = (x - 0.5) * depth * 20
        const moveY = (y - 0.5) * depth * 20

        elem.setAttribute("style", `transform: translate(${moveX}px, ${moveY}px)`)
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [prefersReducedMotion])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  }

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.4 },
    },
  }

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-r from-soft-lavender to-soft-mint dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="decor-element absolute top-[10%] left-[5%] w-24 h-24 rounded-full bg-gold/10 dark:bg-gold/5 blur-xl"></div>
        <div className="decor-element absolute top-[60%] left-[15%] w-32 h-32 rounded-full bg-teal/10 dark:bg-teal/5 blur-xl"></div>
        <div className="decor-element absolute top-[20%] right-[10%] w-40 h-40 rounded-full bg-purple/10 dark:bg-purple/5 blur-xl"></div>
        <div className="decor-element absolute bottom-[10%] right-[20%] w-28 h-28 rounded-full bg-coral/10 dark:bg-coral/5 blur-xl"></div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('/noise-pattern.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="grid md:grid-cols-2 gap-8 items-center"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div>
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-teal-100 text-teal-800 hover:bg-teal-200 shine-effect">
                <span className="font-brand">Launching April 2, 2025</span>
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text-animated text-balance"
              variants={itemVariants}
            >
              Sensory-Friendly Apparel That Celebrates Communication
            </motion.h1>

            <motion.p className="text-lg md:text-xl mb-6 text-gray-700 text-balance" variants={itemVariants}>
              Comfortable, inclusive designs for Speech-Language Pathologists, Educators, Parents, and Behavior
              Analysts.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
              <Button
                asChild
                className="bg-gradient-to-r from-gold to-teal text-black hover:from-gold/90 hover:to-teal/90 btn-animated"
                size="lg"
              >
                <Link href="/collections">Shop Collections</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="btn-animated">
                <Link href="/about">Learn More</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div className="relative" variants={imageVariants}>
            <div className="aspect-square max-w-md mx-auto overflow-hidden rounded-xl shadow-lg relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple/20 via-transparent to-teal/20 z-10"></div>
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Different Not Less Apparel"
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />

              {/* Floating elements around the image */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gold/20 rounded-full blur-xl animate-pulse-subtle"></div>
              <div
                className="absolute -bottom-6 -left-6 w-24 h-24 bg-teal/20 rounded-full blur-xl animate-pulse-subtle"
                style={{ animationDelay: "1s" }}
              ></div>

              {/* Floating badges */}
              <div className="absolute top-4 right-4 animate-float" style={{ animationDelay: "0.5s" }}>
                <Badge className="bg-teal text-white">
                  <span className="font-brand">Sensory-Friendly</span>
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 animate-float" style={{ animationDelay: "1.2s" }}>
                <Badge className="bg-gold text-black">
                  <span className="font-brand">Inclusive Design</span>
                </Badge>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle gradient transition instead of wave */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-soft-cream"></div>
    </section>
  )
}

