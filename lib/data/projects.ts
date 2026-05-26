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

export async function getAdminProjects(): Promise<Project[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    throw new Error('Failed to fetch projects')
  }

  return data as Project[]
}

export async function getAdminProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null

  return data as Project
}

export async function getRelatedProjects(
  category: string,
  excludeSlug: string,
  limit = 3
): Promise<Project[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .neq('slug', excludeSlug)
    .limit(limit)

  return (data as Project[]) ?? []
}
