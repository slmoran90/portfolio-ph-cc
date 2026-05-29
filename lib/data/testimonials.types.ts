export interface TestimonialService {
  id: string
  title: string
}

export interface Testimonial {
  id: string
  created_at: string
  updated_at: string | null
  client_name: string
  quote: string
  avatar_url: string | null
  rating: number
  featured: boolean
  enabled: boolean
  sort_order: number | null
  service_id: string | null
  service: TestimonialService | null
}
