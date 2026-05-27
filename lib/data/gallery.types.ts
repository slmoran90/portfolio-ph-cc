export interface GalleryImage {
  id: string
  created_at: string
  updated_at: string | null
  title: string | null
  category: string | null
  image_url: string
  featured: boolean
  sort_order: number | null
}
