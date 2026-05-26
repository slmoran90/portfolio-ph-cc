import { getAdminProjects } from '@/lib/data/projects'
import DashboardClient from './dashboard-client'

export default async function AdminDashboard() {
  const projects = await getAdminProjects()
  return <DashboardClient projects={projects} />
}
