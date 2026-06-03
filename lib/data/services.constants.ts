// Mapping from service slugs to project category values
// This ensures service cards navigate to the correct filtered projects page
export const serviceSlugToCategoryMap: Record<string, string> = {
  'baby-shower': 'babyshowers',
  'babyshower': 'babyshowers',
  'eventos': 'events',
  'events': 'events',
  'empresarial': 'business',
  'emprendimientos': 'business',
  'business': 'business',
}

export function mapServiceSlugToCategory(slug: string): string {
  return serviceSlugToCategoryMap[slug] || 'all'
}
