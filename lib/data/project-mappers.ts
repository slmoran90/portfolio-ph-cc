import type { Project } from './projects.types'

export interface ProjectCardProject {
  id: string
  title: string
  category: string
  coverImage: string
  date: string
  location: string
}

export function mapProjectToCardProject(project: Project): ProjectCardProject {
  return {
    id: project.id,
    title: project.title,
    category: project.category,
    coverImage: project.coverImage || '/placeholder.jpg',
    date: new Date(project.created_at).toLocaleDateString(),
    location: 'Tucumán'
  }
}
