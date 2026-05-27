import { getGalleryImages } from '@/lib/data/gallery'
import GalleryClient from './gallery-client'

export default async function GalleryPage() {
  const images = await getGalleryImages()
  return <GalleryClient images={images} />
}
