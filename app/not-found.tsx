'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section, Container } from '@/components/layout'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <Section className="min-h-[60vh] flex items-center">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6">
            Página no encontrada
          </h1>
          <p className="text-lg text-foreground-muted mb-8 leading-relaxed">
            La página que estás buscando no existe o fue movida.
          </p>
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
