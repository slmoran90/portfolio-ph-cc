import { notFound } from 'next/navigation'
import { getAdminProjectById } from '@/lib/data/projects'
import EditProjectClient from './edit-project-client'

export default async function EditProjectPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getAdminProjectById(id)

  if (!project) {
    notFound()
  }

  return <EditProjectClient project={project} />
}
