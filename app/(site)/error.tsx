'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Section, Container } from '@/components/layout'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Public site error:', error)
  }, [error])

  return (
    <Section className="min-h-[60vh] flex items-center">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6">
            Algo salió mal
          </h1>
          <p className="text-lg text-foreground-muted mb-8 leading-relaxed">
            Hubo un error inesperado al cargar la página. Por favor, intentá nuevamente.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={reset} size="lg">
              Intentar nuevamente
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/">Volver al inicio</a>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
