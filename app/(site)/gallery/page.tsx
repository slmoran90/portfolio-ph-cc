import { getGalleryImages } from '@/lib/data/gallery'
import GalleryClient from './gallery-client'
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Galería",
  description: "Explora nuestra colección de momentos capturados. Cada imagen cuenta una historia de amor, alegría y celebración de baby showers, cumpleaños y bautismos.",
}

export default async function GalleryPage() {
  const images = await getGalleryImages()
  return <GalleryClient images={images} />
}
