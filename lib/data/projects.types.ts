export interface Project {
  id: string
  slug: string
  title: string
  short_description: string | null
  content: string | null
  category: string
  coverImage: string | null
  published: boolean
  created_at: string
}

export const categories = [
  { value: 'all', label: 'Todos los proyectos' },
  { value: 'weddings', label: 'Bodas' },
  { value: 'events', label: 'Eventos' },
  { value: 'portraits', label: 'Retratos' },
  { value: 'babyshowers', label: 'Baby Showers' }
]
