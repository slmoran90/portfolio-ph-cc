import {
  HeroSection,
  FeaturedGallery,
  AboutPreview,
  TestimonialsSection,
  CTASection,
} from "@/components/home"
import { getServices } from "@/lib/data/services"
import { getTestimonials } from "@/lib/data/testimonials"

export default async function HomePage() {
  const [services, testimonials] = await Promise.all([
    getServices(),
    getTestimonials(),
  ])

  return (
    <>
      <HeroSection />
      <FeaturedGallery services={services} />
      <AboutPreview />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  )
}
