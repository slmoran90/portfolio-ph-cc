"use client"

import { motion } from "framer-motion"
import { Section, Container } from "@/components/layout"
import { PageHero } from "@/components/site"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Instagram, MessageCircle, Send } from "lucide-react"
import { useState } from "react"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@luminara.com",
    href: "mailto:hello@luminara.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "123 Photography Lane, Suite 100",
    href: "#",
  },
]

const socialLinks = [
  {
    icon: Instagram,
    label: "Instagram",
    value: "@luminara.photo",
    href: "https://instagram.com/luminara.photo",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    href: "https://wa.me/15551234567",
  },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <motion.div className="pt-20">
      <PageHero
        label="Get In Touch"
        title="Let&apos;s Create Something Beautiful"
        description="I&apos;d love to hear about your upcoming celebration. Whether you have questions or are ready to book, reach out and let&apos;s start planning your perfect session."
        containerSize="narrow"
        descriptionClassName="max-w-2xl mx-auto"
      />

        {/* Contact Form & Info */}
        <Section>
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-8">
                  Send a Message
                </h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-surface-alt rounded-2xl p-10 text-center"
                  >
                    <div className="w-16 h-16 mx-auto bg-champagne/30 rounded-full flex items-center justify-center mb-6">
                      <Send className="w-7 h-7 text-primary-soft" />
                    </div>
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-3">
                      Message Sent!
                    </h3>
                    <p className="text-foreground-muted">
                      Thank you for reaching out. I&apos;ll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          className="h-12 bg-background border-border/50 focus:border-primary-soft"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          className="h-12 bg-background border-border/50 focus:border-primary-soft"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="h-12 bg-background border-border/50 focus:border-dusty-rose"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="h-12 bg-background border-border/50 focus:border-dusty-rose"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventType" className="text-sm font-medium">
                        Event Type
                      </Label>
                      <select
                        id="eventType"
                        name="eventType"
                        required
                        className="w-full h-12 px-4 rounded-lg border border-border/50 bg-background text-foreground focus:border-primary-soft focus:outline-none focus:ring-1 focus:ring-primary-soft"
                      >
                        <option value="">Select an event type</option>
                        <option value="baby-shower">Baby Shower</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="baptism">Baptism</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Your Message
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        placeholder="Tell me about your event, preferred date, and any special requests..."
                        className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground placeholder:text-foreground-muted focus:border-primary-soft focus:outline-none focus:ring-1 focus:ring-primary-soft resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto text-sm tracking-wider uppercase px-10"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-8">
                  Contact Information
                </h2>

                <div className="space-y-6 mb-12">
                  {contactInfo.map((info) => (
                    <a
                      key={info.label}
                      href={info.href}
                      className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                    >
                      <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center shrink-0">
                        <info.icon className="w-5 h-5 text-primary-soft" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground-muted mb-1">
                          {info.label}
                        </p>
                        <p className="text-foreground font-medium group-hover:text-foreground-muted transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>

                <h3 className="font-serif text-xl font-medium text-foreground mb-6">
                  Connect on Social
                </h3>

                <div className="space-y-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary-soft/50 hover:bg-surface-alt/50 transition-all group"
                    >
                      <div className="w-12 h-12 bg-surface-alt rounded-full flex items-center justify-center shrink-0">
                        <social.icon className="w-5 h-5 text-primary-soft" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium group-hover:text-foreground-muted transition-colors">
                          {social.label}
                        </p>
                        <p className="text-sm text-foreground-muted">
                          {social.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Response Time */}
                <div className="mt-12 p-6 bg-surface-alt rounded-2xl">
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    <strong className="text-foreground">Response Time:</strong> I typically respond to all inquiries within 24 hours. For urgent requests, please reach out via WhatsApp.
                  </p>
                </div>
              </motion.div>
            </div>
          </Container>
        </Section>
    </motion.div>
  )
}
