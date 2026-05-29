import { getAdminTestimonials } from '@/lib/data/testimonials'
import { getAdminServices } from '@/lib/data/services'
import TestimonialsClient from './testimonials-client'

export default async function AdminTestimonialsPage() {
  const [testimonials, services] = await Promise.all([
    getAdminTestimonials(),
    getAdminServices()
  ])
  return <TestimonialsClient initialTestimonials={testimonials} services={services} />
}
