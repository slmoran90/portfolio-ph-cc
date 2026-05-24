import ProjectsPageClient from './projects-page-client'

import { getProjects } from '@/lib/data/projects'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return <ProjectsPageClient projects={projects} />
}
