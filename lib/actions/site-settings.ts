'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const DEMO_ADMIN_OPEN = process.env.DEMO_ADMIN_OPEN === 'true'

const DEMO_ERROR = 'This action is disabled in demo mode.'

const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery-images/`

function stripStoragePath(url: string): string | null {
  if (url.startsWith(STORAGE_BASE)) return url.slice(STORAGE_BASE.length)
  return null
}

export async function updateProfileSettings(input: {
  id: string
  full_name: string | null
  bio: string | null
  profile_image_url: string | null
}): Promise<{ error?: string }> {
  if (DEMO_ADMIN_OPEN) return { error: DEMO_ERROR }
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: current } = await supabase
    .from('site_settings')
    .select('profile_image_url')
    .eq('id', input.id)
    .single()

  if (
    current?.profile_image_url &&
    current.profile_image_url !== input.profile_image_url
  ) {
    const path = stripStoragePath(current.profile_image_url)
    if (path) await supabase.storage.from('gallery-images').remove([path])
  }

  const { error } = await supabase
    .from('site_settings')
    .update({
      full_name: input.full_name || null,
      bio: input.bio || null,
      profile_image_url: input.profile_image_url || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', input.id)

  if (error) {
    console.error('updateProfileSettings error:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/admin/settings')

  return {}
}

export async function updateContactSettings(input: {
  id: string
  email: string | null
  instagram: string | null
  whatsapp: string | null
}): Promise<{ error?: string }> {
  if (DEMO_ADMIN_OPEN) return { error: DEMO_ERROR }
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('site_settings')
    .update({
      email: input.email || null,
      instagram: input.instagram || null,
      whatsapp: input.whatsapp || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', input.id)

  if (error) {
    console.error('updateContactSettings error:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/admin/settings')

  return {}
}

export async function updatePassword(input: {
  currentPassword: string
  newPassword: string
}): Promise<{ error?: string }> {
  if (DEMO_ADMIN_OPEN) return { error: DEMO_ERROR }
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user || !user.email) return { error: 'Unauthorized' }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: input.currentPassword
  })
  if (signInError) return { error: 'Current password is incorrect.' }

  const { error } = await supabase.auth.updateUser({
    password: input.newPassword
  })
  if (error) return { error: error.message }

  return {}
}
