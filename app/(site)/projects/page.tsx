import ProjectsPageClient from './projects-page-client'

import { getProjects } from '@/lib/data/projects'
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Trabajos",
  description: "Explora una colección curada de celebraciones de baby showers, cumpleaños infantiles y bautismos. Cada trabajo cuenta una historia única.",
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return <ProjectsPageClient projects={projects} />
}
