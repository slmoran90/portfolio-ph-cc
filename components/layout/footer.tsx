"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Instagram } from "lucide-react"

const footerLinks = [
  { href: "/", label: "Inicio" },
  { href: "/about", label: "Sobre mí" },
  { href: "/projects", label: "Trabajos" },
  { href: "/gallery", label: "Galería" },
  { href: "/#contact", label: "Contacto" },
]

const socialLinks = [
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
]

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-secondary/50 border-t border-border/50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/">
              <span className="font-serif text-3xl font-medium tracking-wide text-foreground">
                Carla Cáceres
              </span>
            </Link>
            <p className="text-foreground-muted leading-relaxed max-w-xs">
              Capturando los momentos más preciosos de la vida con elegancia y arte.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm tracking-widest uppercase text-foreground font-medium">
              Enlaces
            </h4>
            <div className="flex flex-col gap-4">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground-muted hover:text-foreground transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-6">
            <h4 className="text-sm tracking-widest uppercase text-foreground font-medium">
              Conectá
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-foreground-muted hover:text-foreground hover:border-foreground transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground-muted">
              &copy; {new Date().getFullYear()} Carla Cáceres Photography. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Privacidad
              </Link>
              <Link href="/terms" className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
