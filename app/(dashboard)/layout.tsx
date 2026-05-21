import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/sidebar'
import { LogoutButton } from '@/components/admin/logout-button'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className='min-h-screen bg-cream flex'>
      <AdminSidebar />

      <main className='flex-1 lg:ml-64'>
        <header className='h-16 border-b border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-end px-6'>
          <LogoutButton />
        </header>

        <div className='p-6'>{children}</div>
      </main>
    </div>
  )
}
