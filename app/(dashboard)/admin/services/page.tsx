import { getAdminServices } from '@/lib/data/services'
import ServicesClient from './services-client'

export default async function AdminServicesPage() {
  const services = await getAdminServices()
  return <ServicesClient initialServices={services} />
}
