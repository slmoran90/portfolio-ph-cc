'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type TestimonialMutationInput = {
  client_name: string
  quote: string
  avatar_url: string | null
  rating: number
  featured: boolean
  enabled: boolean
  sort_order: number | null
  service_id: string | null
}

export async function createTestimonial(
  input: TestimonialMutationInput
): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('testimonials')
    .insert({
      client_name: input.client_name,
      quote: input.quote,
      avatar_url: input.avatar_url || null,
      rating: input.rating,
      featured: input.featured,
      enabled: input.enabled,
      sort_order: input.sort_order ?? null,
      service_id: input.service_id
    })
    .select('id')
    .single()

  if (error) {
    console.error('createTestimonial error:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/testimonials')

  return { id: data.id }
}

export async function updateTestimonial(
  id: string,
  input: TestimonialMutationInput
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('testimonials')
    .update({
      client_name: input.client_name,
      quote: input.quote,
      avatar_url: input.avatar_url || null,
      rating: input.rating,
      featured: input.featured,
      enabled: input.enabled,
      sort_order: input.sort_order ?? null,
      updated_at: new Date().toISOString(),
      service_id: input.service_id
    })
    .eq('id', id)

  if (error) {
    console.error('updateTestimonial error:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/testimonials')

  return {}
}

export async function deleteTestimonial(
  id: string,
  avatarUrl: string | null
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  if (avatarUrl) {
    const storageBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery-images/`
    if (avatarUrl.startsWith(storageBase)) {
      const path = avatarUrl.slice(storageBase.length)
      await supabase.storage.from('gallery-images').remove([path])
    }
  }

  const { error } = await supabase.from('testimonials').delete().eq('id', id)

  if (error) {
    console.error('deleteTestimonial error:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/testimonials')

  return {}
}
