import {
  HeroSection,
  FeaturedGallery,
  AboutPreview,
  TestimonialsSection,
  CTASection,
} from "@/components/home"
import { getServices } from "@/lib/data/services"
import { getTestimonials } from "@/lib/data/testimonials"
import { getSiteSettings } from "@/lib/data/site-settings"

export default async function HomePage() {
  const [services, testimonials, siteSettings] = await Promise.all([
    getServices(),
    getTestimonials(),
    getSiteSettings(),
  ])

  return (
    <>
      <HeroSection />
      <FeaturedGallery services={services} />
      <AboutPreview />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection
        whatsapp={siteSettings?.whatsapp}
        instagram={siteSettings?.instagram}
        email={siteSettings?.email}
      />
    </>
  )
}
