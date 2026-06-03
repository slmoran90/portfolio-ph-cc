import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'
import { getSiteSettings } from '@/lib/data/site-settings'
import type { SiteSettings } from '@/lib/data/site-settings.types'

const DEMO_ADMIN_OPEN = process.env.DEMO_ADMIN_OPEN === 'true'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!DEMO_ADMIN_OPEN && !user) {
    redirect('/admin/login')
  }

  const siteSettings = await getSiteSettings()

  return (
    <div className='min-h-screen bg-surface-alt flex'>
      <AdminSidebar siteSettings={siteSettings} demoMode={DEMO_ADMIN_OPEN} />

      <main className='flex-1 flex flex-col'>
        {DEMO_ADMIN_OPEN && (
          <div className='bg-amber-100 border-b border-amber-200 px-6 py-2 text-sm text-amber-800 font-medium'>
            Demo mode — admin authentication disabled
          </div>
        )}
        <div className='flex-1 p-6 pt-16 lg:pt-6'>{children}</div>
      </main>
    </div>
  )
}
