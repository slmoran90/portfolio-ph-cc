export interface Service {
  id: string
  created_at: string
  updated_at: string | null
  title: string
  slug: string
  description: string | null
  image_url: string | null
  enabled: boolean
  sort_order: number | null
}
