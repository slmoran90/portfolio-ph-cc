"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Header, Footer, Section, Container } from "@/components/layout"
import { projects, categories } from "@/lib/projects-data"
import { ArrowUpRight } from "lucide-react"
import { Suspense } from "react"

function ProjectsContent() {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category") || "all"

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category === activeCategory)

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 lg:mb-16">
        {categories.map((category) => (
          <Link
            key={category.value}
            href={category.value === "all" ? "/projects" : `/projects?category=${category.value}`}
            className={`px-6 py-3 rounded-full text-sm tracking-wider transition-all duration-300 ${
              activeCategory === category.value
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            }`}
          >
            {category.label}
          </Link>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link href={`/projects/${project.id}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-5">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover image-premium transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 right-4 w-12 h-12 bg-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <ArrowUpRight className="w-5 h-5 text-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs tracking-[0.2em] uppercase text-dusty-rose">
                  {categories.find((c) => c.value === project.category)?.label}
                </span>
                <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-warm-gray transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.date} • {project.location}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  )
}

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <Section className="bg-cream">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block text-xs tracking-[0.3em] uppercase text-dusty-rose font-medium mb-4">
                Portfolio
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-tight mb-6 text-balance">
                Featured Projects
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Explore a curated collection of celebrations, each one unique and filled with emotion. Every project tells a story worth remembering.
              </p>
            </motion.div>
          </Container>
        </Section>

        {/* Projects Grid */}
        <Section>
          <Container>
            <Suspense fallback={<div className="text-center text-muted-foreground">Loading projects...</div>}>
              <ProjectsContent />
            </Suspense>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  )
}
