import {
  HeroSection,
  FeaturedGallery,
  AboutPreview,
  TestimonialsSection,
  CTASection,
} from "@/components/home"
import { getServices } from "@/lib/data/services"

export default async function HomePage() {
  const services = await getServices()

  return (
    <>
      <HeroSection />
      <FeaturedGallery services={services} />
      <AboutPreview />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
