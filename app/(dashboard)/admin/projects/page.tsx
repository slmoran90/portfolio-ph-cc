import { getAdminProjects } from '@/lib/data/projects'
import ProjectsListClient from './projects-list-client'

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects()
  return <ProjectsListClient projects={projects} />
}
