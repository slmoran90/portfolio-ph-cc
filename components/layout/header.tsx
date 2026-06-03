"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/about", label: "Sobre mí" },
  { href: "/projects", label: "Trabajos" },
  { href: "/gallery", label: "Galería" },
  { href: "/#contact", label: "Contacto" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setShouldReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setIsMobile(window.innerWidth < 768)
  }, [])

  // Scroll threshold: 50px desktop, 30px mobile
  const scrollThreshold = isMobile ? 30 : 50

  // Transform scroll to background opacity
  const bgOpacity = useTransform(scrollY, [0, scrollThreshold], [0, 0.8], {
    clamp: true
  })

  // Transform scroll to border opacity
  const borderOpacity = useTransform(scrollY, [0, scrollThreshold], [0, 0.5], {
    clamp: true
  })

  // Transform scroll to shadow opacity
  const shadowOpacity = useTransform(scrollY, [0, scrollThreshold], [0, 0.1], {
    clamp: true
  })

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: shouldReduceMotion 
          ? 'rgba(var(--background), 0.8)' 
          : `rgba(var(--background), ${bgOpacity.get()})`,
        backdropFilter: shouldReduceMotion ? 'none' : 'blur(12px)',
        borderBottomColor: shouldReduceMotion 
          ? 'rgba(var(--border), 0.5)' 
          : `rgba(var(--border), ${borderOpacity.get()})`,
        borderBottomWidth: '1px',
        boxShadow: shouldReduceMotion 
          ? 'none' 
          : `0 1px 3px rgba(0, 0, 0, ${shadowOpacity.get()})`,
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="group">
            <span className="font-logo text-2xl lg:text-3xl font-medium tracking-wide text-foreground transition-colors group-hover:text-foreground-muted">
              Carla Cáceres
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const isContact = link.href === '/#contact'
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={isContact ? handleContactClick : undefined}
                  className="relative text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 group"
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-foreground"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {!isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-foreground/0 group-hover:bg-foreground/50"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Abrir menú"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-6 border-t border-border/50 overflow-hidden"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link, index) => {
                  const isContact = link.href === '/#contact'
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => {
                          if (isContact) {
                            handleContactClick(e)
                          }
                          setIsOpen(false)
                        }}
                        className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
