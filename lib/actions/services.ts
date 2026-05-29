'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const DEMO_ADMIN_OPEN = process.env.DEMO_ADMIN_OPEN === 'true'

const DEMO_ERROR = 'This action is disabled in demo mode.'

export type ServiceMutationInput = {
  title: string
  description: string | null
  image_url: string | null
  enabled: boolean
  sort_order: number | null
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

async function resolveUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  baseSlug: string
): Promise<string> {
  let slug = baseSlug
  for (let suffix = 2; suffix <= 12; suffix++) {
    const { data } = await supabase
      .from('services')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    if (!data) return slug
    slug = `${baseSlug}-${suffix}`
  }
  return `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
}

export async function createService(
  input: ServiceMutationInput
): Promise<{ id: string; slug: string } | { error: string }> {
  if (DEMO_ADMIN_OPEN) return { error: DEMO_ERROR }
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const baseSlug = generateSlug(input.title)
  const slug = await resolveUniqueSlug(supabase, baseSlug)

  const { data, error } = await supabase
    .from('services')
    .insert({
      slug,
      title: input.title,
      description: input.description || null,
      image_url: input.image_url || null,
      enabled: input.enabled,
      sort_order: input.sort_order ?? null
    })
    .select('id, slug')
    .single()

  if (error) {
    console.error('createService error:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/services')

  return { id: data.id, slug: data.slug }
}

export async function updateService(
  id: string,
  input: ServiceMutationInput
): Promise<{ error?: string }> {
  if (DEMO_ADMIN_OPEN) return { error: DEMO_ERROR }
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('services')
    .update({
      title: input.title,
      description: input.description || null,
      image_url: input.image_url || null,
      enabled: input.enabled,
      sort_order: input.sort_order ?? null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('updateService error:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/services')

  return {}
}

export async function deleteService(
  id: string,
  imageUrl: string | null
): Promise<{ error?: string }> {
  if (DEMO_ADMIN_OPEN) return { error: DEMO_ERROR }
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  if (imageUrl) {
    const storageBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery-images/`
    if (imageUrl.startsWith(storageBase)) {
      const path = imageUrl.slice(storageBase.length)
      await supabase.storage.from('gallery-images').remove([path])
    }
  }

  const { error } = await supabase.from('services').delete().eq('id', id)

  if (error) {
    console.error('deleteService error:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/services')

  return {}
}
