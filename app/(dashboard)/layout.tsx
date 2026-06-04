import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'
import { getSiteSettings } from '@/lib/data/site-settings'
import type { SiteSettings } from '@/lib/data/site-settings.types'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

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
    <div className='min-h-screen bg-surface-alt flex'>
      <AdminSidebar siteSettings={siteSettings} />

      <main className='flex-1 flex flex-col'>
        <div className='flex-1 p-6 pt-16 lg:pt-6'>{children}</div>
      </main>
    </div>
  )
}
