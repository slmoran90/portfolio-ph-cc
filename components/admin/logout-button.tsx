'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/browser'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()

    await supabase.auth.signOut()

    router.refresh()
    router.push('/admin/login')
  }

  return (
    <Button
      variant='outline'
      onClick={handleLogout}
    >
      Cerrar sesión
    </Button>
  )
}
