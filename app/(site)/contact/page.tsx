import { getSiteSettings } from '@/lib/data/site-settings'
import { Section, Container } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { MessageCircle, Mail, Instagram } from 'lucide-react'
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacto",
  description: "¿Tenés una idea o querés agendar una sesión? Contactá a Carla Cáceres Photography para baby showers, cumpleaños infantiles y bautismos.",
}

export default async function ContactPage() {
  const siteSettings = await getSiteSettings()

  const hasContactInfo = siteSettings?.whatsapp || siteSettings?.email || siteSettings?.instagram

  return (
    <Section className="min-h-[60vh] flex items-center pt-20">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6">
            Contacto
          </h1>
          <p className="text-lg text-foreground-muted mb-12 leading-relaxed">
            ¿Tenés una idea o querés agendar una sesión? Escribime y charlamos.
          </p>

          {hasContactInfo ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {siteSettings?.whatsapp && (
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a
                    href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              )}
              {siteSettings?.email && (
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <a href={`mailto:${siteSettings.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </a>
                </Button>
              )}
              {siteSettings?.instagram && (
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <a
                    href={siteSettings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </a>
                </Button>
              )}
            </div>
          ) : (
            <p className="text-foreground-muted">
              Los datos de contacto no están disponibles en este momento.
            </p>
          )}
        </div>
      </Container>
    </Section>
  )
}
