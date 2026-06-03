"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, MessageCircle, Instagram, Mail } from "lucide-react"
import { Section, Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/motion/blur-fade"

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
        <BlurFade duration={0.6} y={16} blur={4}>
          <div className="relative bg-surface-alt rounded-3xl p-10 md:p-16 lg:p-20 text-center overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <span className="inline-block text-base tracking-[0.15em] uppercase text-primary font-medium mb-4">
                Contacto
              </span>

              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 text-balance">
                Coordinemos tu sesión
              </h2>

              <p className="text-foreground-muted leading-relaxed mb-10 max-w-xl mx-auto">
                Ya sea un baby shower, una celebración de cumpleaños o un bautismo, me encantaría escuchar sobre tu próximo evento y crear recuerdos duraderos juntos.
              </p>

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
            </div>
          </div>
        </BlurFade>
      </Container>
    </Section>
  )
}
