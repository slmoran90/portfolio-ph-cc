import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Testimonial } from './testimonials.types'

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('testimonials')
    .select('*, service:services(id, title)')
    .eq('enabled', true)
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getTestimonials error:', error)
    return []
  }

  return data as Testimonial[]
}

export async function getFeaturedTestimonials(
  limit = 6
): Promise<Testimonial[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('testimonials')
    .select('*, service:services(id, title)')
    .eq('enabled', true)
    .eq('featured', true)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getFeaturedTestimonials error:', error)
    return []
  }

  return data as Testimonial[]
}

export async function getAdminTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('testimonials')
    .select('*, service:services(id, title)')
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getAdminTestimonials error:', error)
    throw new Error('Failed to fetch testimonials')
  }

  return data as Testimonial[]
}
