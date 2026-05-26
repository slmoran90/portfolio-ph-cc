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
