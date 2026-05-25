import type { Project } from './projects.types'

export interface ProjectCardProject {
  id: string
  slug: string
  title: string
  category: string
  coverImage: string
  date: string
  location: string
}

export function mapProjectToCardProject(project: Project): ProjectCardProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: project.category,
    coverImage: project.coverImage || '/placeholder.jpg',
    date: project.created_at
  ? new Date(project.created_at).toLocaleDateString()
  : '',
    location: 'Tucumán'
  }
}
