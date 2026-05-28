import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { SiteSettings } from './site-settings.types'

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('getSiteSettings error:', error)
    return null
  }

  return data as SiteSettings | null
}
