"use client"

import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Section, Container } from "@/components/layout"
import { PageHero, CategoryFilter, ProjectCard } from "@/components/site"
import { projects, categories } from "@/lib/projects-data"
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
      <CategoryFilter
        mode="link"
        options={categories}
        activeValue={activeCategory}
        className="mb-12 lg:mb-16"
        getHref={(value) =>
          value === "all" ? "/projects" : `/projects?category=${value}`
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            categoryLabel={categories.find((c) => c.value === project.category)?.label}
            index={index}
          />
        ))}
      </div>
    </>
  )
}

export default function ProjectsPage() {
  return (
    <motion.div className="pt-20">
      <PageHero
        label="Portfolio"
        title="Featured Projects"
        description="Explore a curated collection of celebrations, each one unique and filled with emotion. Every project tells a story worth remembering."
      />

      <Section>
        <Container>
          <Suspense fallback={<div className="text-center text-muted-foreground">Loading projects...</div>}>
            <ProjectsContent />
          </Suspense>
        </Container>
      </Section>
    </motion.div>
  )
}
