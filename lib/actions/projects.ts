'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const DEMO_ADMIN_OPEN = process.env.DEMO_ADMIN_OPEN === 'true'

const DEMO_ERROR = 'This action is disabled in demo mode.'

export type ProjectMutationInput = {
  title: string
  category: string
  event_date: string | null
  location: string | null
  short_description: string | null
  description: string | null
  published: boolean
  images: string[]
  cover_image: string | null
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
  for (let i = 1; i <= 10; i++) {
    const { data } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    if (!data) return slug
    slug = `${baseSlug}-${i + 1}`
  }
  return `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
}

export async function createProject(
  input: ProjectMutationInput
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
    .from('projects')
    .insert({
      slug,
      title: input.title,
      category: input.category,
      event_date: input.event_date || null,
      location: input.location || null,
      short_description: input.short_description || null,
      description: input.description || null,
      published: input.published,
      images: input.images,
      cover_image: input.cover_image
    })
    .select('id, slug')
    .single()

  if (error) {
    console.error('createProject error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/projects')
  revalidatePath('/projects')

  return { id: data.id, slug: data.slug }
}

export async function updateProject(
  id: string,
  slug: string,
  input: ProjectMutationInput
): Promise<{ error?: string }> {
  if (DEMO_ADMIN_OPEN) return { error: DEMO_ERROR }
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('projects')
    .update({
      title: input.title,
      category: input.category,
      event_date: input.event_date || null,
      location: input.location || null,
      short_description: input.short_description || null,
      description: input.description || null,
      published: input.published,
      images: input.images,
      cover_image: input.cover_image,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('updateProject error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/projects')
  revalidatePath(`/admin/projects/${id}`)
  revalidatePath('/projects')
  revalidatePath(`/projects/${slug}`)

  return {}
}

export async function deleteProject(
  id: string,
  slug: string,
  imageUrls: string[]
): Promise<{ error?: string }> {
  if (DEMO_ADMIN_OPEN) return { error: DEMO_ERROR }
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  if (imageUrls.length > 0) {
    const storageBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/`
    const paths = imageUrls
      .filter((url) => url.startsWith(storageBase))
      .map((url) => url.slice(storageBase.length))
    if (paths.length > 0) {
      await supabase.storage.from('project-images').remove(paths)
    }
  }

  const { error } = await supabase.from('projects').delete().eq('id', id)

  if (error) {
    console.error('deleteProject error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/projects')
  revalidatePath('/projects')
  revalidatePath(`/projects/${slug}`)

  return {}
}
