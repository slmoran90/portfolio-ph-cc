import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'
import { getSiteSettings } from '@/lib/data/site-settings'
import type { SiteSettings } from '@/lib/data/site-settings.types'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const siteSettings = await getSiteSettings()

  return (
    <div className='min-h-screen bg-cream flex'>
      <AdminSidebar siteSettings={siteSettings} />

      <main className='flex-1 flex flex-col'>
        <div className='flex-1 p-6'>{children}</div>
      </main>
    </div>
  )
}
