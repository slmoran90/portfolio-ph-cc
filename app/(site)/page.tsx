import {
  HeroSection,
  FeaturedProjectsSection,
  FeaturedGallery,
  AboutPreview,
  TestimonialsSection,
  CTASection,
} from "@/components/home"
import { getFeaturedProjects } from "@/lib/data/projects"
import { getServices } from "@/lib/data/services"
import { getFeaturedTestimonials } from "@/lib/data/testimonials"
import { getSiteSettings } from "@/lib/data/site-settings"

export default async function HomePage() {
  const [featuredProjects, services, testimonials, siteSettings] = await Promise.all([
    getFeaturedProjects(),
    getServices(),
    getFeaturedTestimonials(),
    getSiteSettings(),
  ])

  return (
    <>
      <HeroSection />
      <FeaturedProjectsSection projects={featuredProjects} />
      <AboutPreview />
      <FeaturedGallery services={services} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection
        whatsapp={siteSettings?.whatsapp}
        instagram={siteSettings?.instagram}
        email={siteSettings?.email}
      />
    </>
  )
}
