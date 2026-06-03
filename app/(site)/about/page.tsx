"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Section, Container } from "@/components/layout"
import { Camera, Heart, Award, Users } from "lucide-react"

const stats = [
  { label: "Años de experiencia", value: "10+", icon: Camera },
  { label: "Familias felices", value: "500+", icon: Heart },
  { label: "Premios ganados", value: "15", icon: Award },
  { label: "Eventos capturados", value: "1.200+", icon: Users },
]

const values = [
  {
    title: "Momentos auténticos",
    description: "Creo que las fotografías más bellas capturan emociones genuinas. Sin poses forzadas, solo conexiones reales y expresiones naturales.",
  },
  {
    title: "Arte atemporal",
    description: "Cada imagen que creo está diseñada para resistir el paso del tiempo. Composiciones clásicas que se encuentran con sensibilidades modernas.",
  },
  {
    title: "Conexión personal",
    description: "Tomo el tiempo para entender a tu familia, tu historia y lo que hace única tu celebración.",
  },
  {
    title: "Atención al detalle",
    description: "Desde la primera consulta hasta la entrega final, cada paso se maneja con cuidado y precisión.",
  },
]

export default function AboutPage() {
  return (
    <motion.div className="pt-20">
        {/* Hero Section */}
        <Section className="bg-surface-alt">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block text-base tracking-[0.15em] uppercase text-primary font-medium mb-4">
                  Sobre mí
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-6 text-balance">
                  La historia detrás del lente
                </h1>
                <div className="space-y-4 text-foreground-muted leading-relaxed">
                  <p>
                    Hola, soy Carla Cáceres, una fotógrafa de eventos profesional con base en el corazón de la ciudad. Durante más de una década, he tenido el privilegio de documentar las celebraciones más preciadas de la vida.
                  </p>
                  <p>
                    Mi viaje en la fotografía comenzó con un deseo simple: congelar el tiempo y preservar las emociones que hacen que los momentos sean significativos. Desde la anticipación en un baby shower hasta la alegría pura de un cumpleaños infantil, cada evento ofrece una historia única esperando ser contada.
                  </p>
                  <p>
                    Lo que distingue mi trabajo es mi enfoque. No solo tomo fotos; creo narrativas visuales que capturan la esencia de tu celebración. Mi estilo combina autenticidad documental con elegancia artística, resultando en imágenes que son tanto naturales como refinadas.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/photographer-portrait.jpg"
                    alt="Carla Cáceres - Fotógrafa profesional"
                    fill
                    className="object-cover image-premium"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-champagne/50 rounded-2xl -z-10" />
              </motion.div>
            </div>
          </Container>
        </Section>

        {/* Stats Section */}
        <Section>
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-14 h-14 mx-auto bg-cream rounded-full flex items-center justify-center mb-4">
                    <stat.icon className="w-6 h-6 text-primary-soft" />
                  </div>
                  <p className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-foreground-muted tracking-wide">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>

        {/* My Approach Section */}
        <Section className="bg-secondary/50">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/about-studio.jpg"
                    alt="Carla Cáceres trabajando en el lugar"
                    fill
                    className="object-cover image-premium"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <span className="inline-block text-base tracking-[0.15em] uppercase text-primary font-medium mb-4">
                  Mi enfoque
                </span>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 text-balance">
                  Cómo trabajo
                </h2>
                <div className="space-y-4 text-foreground-muted leading-relaxed">
                  <p>
                    Antes de cada evento, tomo el tiempo para entender tu visión y los momentos que más te importan. Esta preparación me permite estar en el lugar correcto en el momento correcto, capturando las emociones que cuentan tu historia.
                  </p>
                  <p>
                    Durante el evento, trabajo con un estilo documental tranquilo. Me mezclo con el fondo, dejando que las interacciones genuinas se desarrollen naturalmente. Mi objetivo es capturar momentos auténticos sin interrumpir el flujo de tu celebración.
                  </p>
                  <p>
                    Después del evento, curó y edito cuidadosamente cada imagen para crear una galería pulida que atesorarás por años. Cada foto se selecciona y refina con cuidado, asegurando que la colección final refleje la belleza y la emoción de tu día.
                  </p>
                </div>
              </motion.div>
            </div>
          </Container>
        </Section>

        {/* Values Section */}
        <Section>
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block text-base tracking-[0.15em] uppercase text-primary font-medium mb-4">
                Mi filosofía
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight text-balance">
                Lo que guía mi trabajo
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-2xl p-8 border border-border/50"
                >
                  <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-foreground-muted leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>
    </motion.div>
  )
}
