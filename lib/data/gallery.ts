import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { GalleryImage } from './gallery.types'

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    throw new Error('Failed to fetch gallery images')
  }

  return data as GalleryImage[]
}

export async function getAdminGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    throw new Error('Failed to fetch gallery images')
  }

  return data as GalleryImage[]
}

export async function getGalleryImagesCount(): Promise<number> {
  const supabase = await createClient()

  const { count } = await supabase
    .from('gallery_images')
    .select('*', { count: 'exact', head: true })

  return count ?? 0
}

export async function getRecentGalleryImages(limit = 4): Promise<GalleryImage[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data as GalleryImage[]) ?? []
}
