'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type GalleryMutationInput = {
  title: string | null
  category: string | null
  featured: boolean
  sort_order: number | null
}

export async function createGalleryImage(
  imageUrl: string,
  input: GalleryMutationInput
): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('gallery_images')
    .insert({
      image_url: imageUrl,
      title: input.title || null,
      category: input.category || null,
      featured: input.featured,
      sort_order: input.sort_order ?? null
    })
    .select('id')
    .single()

  if (error) {
    console.error('createGalleryImage error:', error)
    return { error: error.message }
  }

  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
  revalidatePath('/admin')

  return { id: data.id }
}

export async function updateGalleryImage(
  id: string,
  input: GalleryMutationInput
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('gallery_images')
    .update({
      title: input.title || null,
      category: input.category || null,
      featured: input.featured,
      sort_order: input.sort_order ?? null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('updateGalleryImage error:', error)
    return { error: error.message }
  }

  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')

  return {}
}

export async function deleteGalleryImage(
  id: string,
  imageUrl: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const storageBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery-images/`
  if (imageUrl.startsWith(storageBase)) {
    const path = imageUrl.slice(storageBase.length)
    await supabase.storage.from('gallery-images').remove([path])
  }

  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('deleteGalleryImage error:', error)
    return { error: error.message }
  }

  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
  revalidatePath('/admin')

  return {}
}
