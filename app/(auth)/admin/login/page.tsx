'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/browser'

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
    setLoading(false)
  }

  return (
    <div className='min-h-screen bg-cream flex items-center justify-center p-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-md'
      >
        {/* Logo */}
        <div className='text-center mb-10'>
          <div className='w-16 h-16 bg-champagne/30 rounded-2xl flex items-center justify-center mx-auto mb-4'>
            <Camera className='w-8 h-8 text-dusty-rose' />
          </div>
          <h1 className='font-serif text-3xl font-medium text-foreground'>
            Carla
          </h1>
          <p className='text-muted-foreground mt-2'>
            Inicia sesión en tu panel de administración
          </p>
        </div>

        {/* Login Form */}
        <div className='bg-card rounded-2xl p-8 shadow-sm border border-border/50'>
          <form
            onSubmit={handleLogin}
            className='space-y-6'
          >
            <div className='space-y-2'>
              <Label
                htmlFor='email'
                className='text-sm font-medium'
              >
                Email
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='h-12 bg-background border-border/50 focus:border-dusty-rose'
              />
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='password'
                className='text-sm font-medium'
              >
                Contraseña
              </Label>
              <div className='relative'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='h-12 bg-background border-border/50 focus:border-dusty-rose pr-12'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <div className='text-red-500 text-sm'>{error}</div>}

            <div className='flex items-center justify-between'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  className='w-4 h-4 rounded border-border text-dusty-rose focus:ring-dusty-rose'
                />
                <span className='text-sm text-muted-foreground'>
                  Recordarme
                </span>
              </label>
              <a
                href='#'
                className='text-sm text-dusty-rose hover:text-dusty-rose/80 transition-colors'
              >
                Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type='submit'
              size='lg'
              disabled={loading}
              className='w-full h-12 disabled:opacity-50'
            >
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
