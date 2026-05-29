'use client'

import { createClient } from '@/lib/supabase/browser'

export async function uploadProjectImage(
  uploadSessionId: string,
  file: File
): Promise<string> {
  const supabase = createClient()
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `${uploadSessionId}/${Date.now()}-${sanitizedName}`

  const { error } = await supabase.storage
    .from('project-images')
    .upload(path, file, { upsert: false })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage
    .from('project-images')
    .getPublicUrl(path)

  return data.publicUrl
}

export async function uploadGalleryImage(
  sessionId: string,
  file: File
): Promise<string> {
  const supabase = createClient()
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `${sessionId}/${Date.now()}-${sanitizedName}`

  const { error } = await supabase.storage
    .from('gallery-images')
    .upload(path, file, { upsert: false })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage
    .from('gallery-images')
    .getPublicUrl(path)

  return data.publicUrl
}

export async function uploadProfileImage(file: File): Promise<string> {
  const supabase = createClient()
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `settings/${Date.now()}-${sanitizedName}`

  const { error } = await supabase.storage
    .from('gallery-images')
    .upload(path, file, { upsert: false })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('gallery-images').getPublicUrl(path)

  return data.publicUrl
}

export async function uploadTestimonialAvatar(file: File): Promise<string> {
  const supabase = createClient()
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `testimonials/${Date.now()}-${sanitizedName}`

  const { error } = await supabase.storage
    .from('gallery-images')
    .upload(path, file, { upsert: false })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('gallery-images').getPublicUrl(path)

  return data.publicUrl
}

export async function deleteTestimonialAvatar(publicUrl: string): Promise<void> {
  const supabase = createClient()
  const marker = '/gallery-images/'
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return
  const path = decodeURIComponent(publicUrl.slice(idx + marker.length))
  const { error } = await supabase.storage.from('gallery-images').remove([path])
  if (error) console.error('deleteTestimonialAvatar error:', error)
}

export async function uploadServiceImage(
  sessionId: string,
  file: File
): Promise<string> {
  const supabase = createClient()
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `services/${sessionId}/${Date.now()}-${sanitizedName}`

  const { error } = await supabase.storage
    .from('gallery-images')
    .upload(path, file, { upsert: false })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage
    .from('gallery-images')
    .getPublicUrl(path)

  return data.publicUrl
}
