import { Header, Footer } from "@/components/layout"
import {
  HeroSection,
  FeaturedGallery,
  AboutPreview,
  TestimonialsSection,
  CTASection,
} from "@/components/home"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedGallery />
        <AboutPreview />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
