export interface Project {
  id: string
  slug: string
  title: string
  short_description: string | null
  content: string | null
  category: string
  cover_image: string | null
  published: boolean | null
  created_at: string | null
  updated_at: string | null
  images: string[]
}
