import { getAdminProjects } from '@/lib/data/projects'
import { getGalleryImagesCount, getRecentGalleryImages } from '@/lib/data/gallery'
import { getSiteSettings } from '@/lib/data/site-settings'
import DashboardClient from './dashboard-client'

export default async function AdminDashboard() {
  const [projects, galleryCount, recentGallery, siteSettings] = await Promise.all([
    getAdminProjects(),
    getGalleryImagesCount(),
    getRecentGalleryImages(4),
    getSiteSettings()
  ])

  return (
    <DashboardClient
      projects={projects}
      galleryCount={galleryCount}
      recentGallery={recentGallery}
      siteSettings={siteSettings}
    />
  )
}
