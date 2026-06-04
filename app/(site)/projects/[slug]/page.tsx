import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getProjects, getProjectBySlug, getRelatedProjects } from '@/lib/data/projects'
import { ProjectDetailClient } from './project-detail-client'

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const projects = await getProjects()
    return projects.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) return { title: 'Proyecto no encontrado | Carla Cáceres Photography' }

  const baseUrl = 'https://portfolio-ph-cc-slmoran90s-projects.vercel.app'

  return {
    title: project.title,
    description: project.short_description ?? undefined,
    openGraph: {
      title: project.title,
      images: project.cover_image ? [project.cover_image] : []
    },
    alternates: {
      canonical: `${baseUrl}/projects/${slug}`,
    },
  }
}

export default async function SingleProjectPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const relatedProjects = await getRelatedProjects(project.category, project.slug)

  return <ProjectDetailClient project={project} relatedProjects={relatedProjects} />
}
