import { getSiteSettings } from '@/lib/data/site-settings'
import SettingsClient from './settings-client'

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()
  return <SettingsClient initialSettings={settings} />
}
