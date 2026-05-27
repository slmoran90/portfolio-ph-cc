import { getAdminGalleryImages } from '@/lib/data/gallery'
import GalleryClient from './gallery-client'

export default async function AdminGalleryPage() {
  const images = await getAdminGalleryImages()
  return <GalleryClient initialImages={images} />
}
