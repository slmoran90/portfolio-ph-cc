"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, MessageCircle, Instagram, Mail } from "lucide-react"
import { Section, Container } from "@/components/layout"
import { Button } from "@/components/ui/button"

interface CTASectionProps {
  whatsapp?: string | null
  instagram?: string | null
  email?: string | null
}

function normalizeWhatsAppNumber(value: string): string {
  // If already a wa.me link, extract the number
  if (value.includes('wa.me/')) {
    const match = value.match(/wa\.me\/(.+)/)
    if (match) return match[1]
  }
  // Remove spaces, +, -, parentheses
  return value.replace(/[\s+\-\(\)]/g, '')
}

export function CTASection({ whatsapp, instagram, email }: CTASectionProps) {
  const whatsappUrl = whatsapp
    ? `https://wa.me/${normalizeWhatsAppNumber(whatsapp)}`
    : null

  return (
    <Section id="contact">
      <Container size="narrow">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-surface-alt rounded-3xl p-10 md:p-16 lg:p-20 text-center overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-champagne/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-soft/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block text-xs tracking-[0.3em] uppercase text-primary-soft font-medium mb-4"
            >
              Contacto
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight mb-6 text-balance"
            >
              Coordinemos tu sesión
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-foreground-muted leading-relaxed mb-10 max-w-xl mx-auto"
            >
              Ya sea un baby shower, una celebración de cumpleaños o un bautismo, me encantaría escuchar sobre tu próximo evento y crear recuerdos duraderos juntos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {whatsappUrl ? (
                <Button asChild size="lg" className="text-sm tracking-wider uppercase px-10">
                  <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Escribime por WhatsApp
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="text-sm tracking-wider uppercase px-10">
                  <Link href={email ? `mailto:${email}` : instagram || '#'}>
                    {email ? (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar email
                      </>
                    ) : instagram ? (
                      <>
                        <Instagram className="mr-2 h-4 w-4" />
                        Contactame por Instagram
                      </>
                    ) : (
                      <>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Contactame
                      </>
                    )}
                  </Link>
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
