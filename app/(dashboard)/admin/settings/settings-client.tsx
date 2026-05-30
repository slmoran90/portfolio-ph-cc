'use client'

import { useState, useRef, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AdminHeader, AdminCard } from '@/components/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  User,
  Mail,
  Instagram,
  Lock,
  Save,
  Upload,
  Loader2,
  Check,
  AlertCircle,
  MessageCircle
} from 'lucide-react'
import { uploadProfileImage } from '@/lib/supabase/storage'
import {
  updateProfileSettings,
  updateContactSettings,
  updatePassword
} from '@/lib/actions/site-settings'
import type { SiteSettings } from '@/lib/data/site-settings.types'

const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_BYTES = 10 * 1024 * 1024

type Tab = 'profile' | 'contact' | 'security'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'contact', label: 'Contact Info', icon: Mail },
  { id: 'security', label: 'Security', icon: Lock }
]

export default function SettingsClient({
  initialSettings
}: {
  initialSettings: SiteSettings | null
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  const [fullName, setFullName] = useState(initialSettings?.full_name ?? '')
  const [bio, setBio] = useState(initialSettings?.bio ?? '')
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    initialSettings?.profile_image_url ?? null
  )
  const [imageUploading, setImageUploading] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState(initialSettings?.email ?? '')
  const [instagram, setInstagram] = useState(initialSettings?.instagram ?? '')
  const [whatsapp, setWhatsapp] = useState(initialSettings?.whatsapp ?? '')
  const [contactSaving, setContactSaving] = useState(false)
  const [contactError, setContactError] = useState<string | null>(null)
  const [contactSuccess, setContactSuccess] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const settingsId = initialSettings?.id

  async function handleImageSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!ACCEPTED_MIME.includes(file.type)) {
      setProfileError('Unsupported format. Use JPEG, PNG, WebP, or AVIF.')
      return
    }
    if (file.size > MAX_BYTES) {
      setProfileError('File exceeds 10 MB.')
      return
    }
    setProfileError(null)
    setImageUploading(true)
    try {
      const url = await uploadProfileImage(file)
      setProfileImageUrl(url)
    } catch (err) {
      setProfileError(String(err))
    } finally {
      setImageUploading(false)
    }
  }

  async function handleSaveProfile() {
    if (!settingsId) return
    setProfileSaving(true)
    setProfileError(null)
    setProfileSuccess(false)
    const result = await updateProfileSettings({
      id: settingsId,
      full_name: fullName.trim() || null,
      bio: bio.trim() || null,
      profile_image_url: profileImageUrl
    })
    setProfileSaving(false)
    if (result.error) {
      setProfileError(result.error)
    } else {
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
      router.refresh()
    }
  }

  async function handleSaveContact() {
    if (!settingsId) return
    setContactSaving(true)
    setContactError(null)
    setContactSuccess(false)
    const result = await updateContactSettings({
      id: settingsId,
      email: email.trim() || null,
      instagram: instagram.trim() || null,
      whatsapp: whatsapp.trim() || null
    })
    setContactSaving(false)
    if (result.error) {
      setContactError(result.error)
    } else {
      setContactSuccess(true)
      setTimeout(() => setContactSuccess(false), 3000)
      router.refresh()
    }
  }

  async function handleUpdatePassword() {
    setPasswordError(null)
    setPasswordSuccess(false)
    if (!currentPassword) {
      setPasswordError('Current password is required.')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }
    setPasswordSaving(true)
    const result = await updatePassword({ currentPassword, newPassword })
    setPasswordSaving(false)
    if (result.error) {
      setPasswordError(result.error)
    } else {
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSuccess(false), 4000)
    }
  }

  if (!initialSettings) {
    return (
      <>
        <AdminHeader
          title='Settings'
          description='Manage your account and preferences'
        />
        <main className='flex-1 p-6 flex items-center justify-center'>
          <p className='text-foreground-muted text-sm'>
            Settings row not found. Please insert an initial row into the{' '}
            <code className='text-foreground'>site_settings</code> table.
          </p>
        </main>
      </>
    )
  }

  return (
    <>
      <AdminHeader
        title='Settings'
        description='Manage your account and preferences'
      />

      <main className='flex-1 p-6 overflow-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Sidebar Tabs */}
          <div className='lg:col-span-1'>
            <AdminCard title='Settings'>
              <nav className='space-y-1'>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-champagne/30 text-foreground'
                        : 'text-foreground-muted hover:bg-secondary/50 hover:text-foreground'
                    }`}
                  >
                    <tab.icon className='w-5 h-5' />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </AdminCard>
          </div>

          {/* Content */}
          <div className='lg:col-span-3'>
            {/* ── Profile ── */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AdminCard
                  title='Profile Information'
                  description='Update your personal details and photo'
                >
                  {/* Avatar row */}
                  <div className='flex items-center gap-6 mb-8'>
                    <div className='relative w-24 h-24 rounded-full overflow-hidden bg-secondary shrink-0'>
                      {profileImageUrl ? (
                        <Image
                          src={profileImageUrl}
                          alt='Profile photo'
                          fill
                          className='object-cover'
                          sizes='96px'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                          <User className='w-8 h-8 text-foreground-muted' />
                        </div>
                      )}
                      {imageUploading && (
                        <div className='absolute inset-0 bg-background/70 flex items-center justify-center'>
                          <Loader2 className='w-5 h-5 animate-spin text-primary-soft' />
                        </div>
                      )}
                    </div>
                    <div>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageUploading}
                      >
                        <Upload className='w-4 h-4 mr-2' />
                        {profileImageUrl ? 'Change Photo' : 'Upload Photo'}
                      </Button>
                      <p className='text-xs text-foreground-muted mt-2'>
                        JPEG, PNG, WebP, AVIF · max 10 MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept='image/jpeg,image/png,image/webp,image/avif'
                      className='hidden'
                      onChange={handleImageSelect}
                    />
                  </div>

                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='fullName'>Full Name</Label>
                      <Input
                        id='fullName'
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder='Your name'
                        className='h-12 bg-background border-border/50'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='bio'>Bio</Label>
                      <textarea
                        id='bio'
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder='A short bio shown on the about page'
                        className='w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-sm text-foreground placeholder:text-foreground-muted focus:border-primary-soft focus:outline-none focus:ring-1 focus:ring-primary-soft resize-none'
                      />
                    </div>
                  </div>

                  {profileError && (
                    <p className='flex items-center gap-2 text-sm text-destructive mt-4'>
                      <AlertCircle className='w-4 h-4 shrink-0' />
                      {profileError}
                    </p>
                  )}

                  <div className='flex items-center gap-3 mt-6'>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={profileSaving || imageUploading}
                    >
                      {profileSaving ? (
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      ) : (
                        <Save className='w-4 h-4 mr-2' />
                      )}
                      Save Profile
                    </Button>
                    {profileSuccess && (
                      <span className='flex items-center gap-1.5 text-sm text-green-600'>
                        <Check className='w-4 h-4' />
                        Saved
                      </span>
                    )}
                  </div>
                </AdminCard>
              </motion.div>
            )}

            {/* ── Contact ── */}
            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AdminCard
                  title='Contact Information'
                  description='Update your public contact details'
                >
                  <div className='space-y-4 max-w-md'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='email'
                        className='flex items-center gap-2'
                      >
                        <Mail className='w-4 h-4' />
                        Email Address
                      </Label>
                      <Input
                        id='email'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='hello@example.com'
                        className='h-12 bg-background border-border/50'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='instagram'
                        className='flex items-center gap-2'
                      >
                        <Instagram className='w-4 h-4' />
                        Instagram
                      </Label>
                      <Input
                        id='instagram'
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder='@yourhandle'
                        className='h-12 bg-background border-border/50'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='whatsapp'
                        className='flex items-center gap-2'
                      >
                        <MessageCircle className='w-4 h-4' />
                        WhatsApp
                      </Label>
                      <Input
                        id='whatsapp'
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder='+54 9 381 123-4567'
                        className='h-12 bg-background border-border/50'
                      />
                    </div>
                  </div>

                  {contactError && (
                    <p className='flex items-center gap-2 text-sm text-destructive mt-4'>
                      <AlertCircle className='w-4 h-4 shrink-0' />
                      {contactError}
                    </p>
                  )}

                  <div className='flex items-center gap-3 mt-6'>
                    <Button
                      onClick={handleSaveContact}
                      disabled={contactSaving}
                    >
                      {contactSaving ? (
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      ) : (
                        <Save className='w-4 h-4 mr-2' />
                      )}
                      Save Contact
                    </Button>
                    {contactSuccess && (
                      <span className='flex items-center gap-1.5 text-sm text-green-600'>
                        <Check className='w-4 h-4' />
                        Saved
                      </span>
                    )}
                  </div>
                </AdminCard>
              </motion.div>
            )}

            {/* ── Security ── */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AdminCard
                  title='Change Password'
                  description='Update your account password'
                >
                  <div className='space-y-4 max-w-md'>
                    <div className='space-y-2'>
                      <Label htmlFor='currentPassword'>Current Password</Label>
                      <Input
                        id='currentPassword'
                        type='password'
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete='current-password'
                        className='h-12 bg-background border-border/50'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='newPassword'>New Password</Label>
                      <Input
                        id='newPassword'
                        type='password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete='new-password'
                        className='h-12 bg-background border-border/50'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='confirmPassword'>
                        Confirm New Password
                      </Label>
                      <Input
                        id='confirmPassword'
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete='new-password'
                        className='h-12 bg-background border-border/50'
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <p className='flex items-center gap-2 text-sm text-destructive mt-4'>
                      <AlertCircle className='w-4 h-4 shrink-0' />
                      {passwordError}
                    </p>
                  )}
                  {passwordSuccess && (
                    <p className='flex items-center gap-2 text-sm text-green-600 mt-4'>
                      <Check className='w-4 h-4' />
                      Password updated successfully.
                    </p>
                  )}

                  <div className='mt-6'>
                    <Button
                      onClick={handleUpdatePassword}
                      disabled={passwordSaving}
                    >
                      {passwordSaving ? (
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      ) : (
                        <Lock className='w-4 h-4 mr-2' />
                      )}
                      Update Password
                    </Button>
                  </div>
                </AdminCard>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
