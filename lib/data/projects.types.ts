export interface Project {
  id: string
  slug: string
  title: string
  short_description: string | null
  content: string | null
  category: string
  cover_image: string | null
  published: boolean
  created_at: string
}
