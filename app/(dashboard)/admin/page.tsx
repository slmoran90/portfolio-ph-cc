import { getAdminProjects } from '@/lib/data/projects'
import { getGalleryImagesCount, getRecentGalleryImages } from '@/lib/data/gallery'
import DashboardClient from './dashboard-client'

export default async function AdminDashboard() {
  const [projects, galleryCount, recentGallery] = await Promise.all([
    getAdminProjects(),
    getGalleryImagesCount(),
    getRecentGalleryImages(4)
  ])

  return (
    <DashboardClient
      projects={projects}
      galleryCount={galleryCount}
      recentGallery={recentGallery}
    />
  )
}
