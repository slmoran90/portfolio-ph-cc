import 'server-only'

import { createClient } from '@/lib/supabase/server'

import type { Project } from './projects.types'

export async function getProjects() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    throw new Error('Failed to fetch projects')
  }

  return data as Project[]
}

export async function getProjectBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    return null
  }

  return data as Project
}
