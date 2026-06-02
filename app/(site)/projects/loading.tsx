import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="pt-20">
      {/* Page Hero Skeleton */}
      <section className="bg-surface-alt py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <Skeleton className="h-4 w-24 mx-auto" />
          <Skeleton className="h-12 md:h-16 lg:h-20 w-full" />
          <Skeleton className="h-5 w-full max-w-xl mx-auto" />
        </div>
      </section>

      {/* Category Filter Skeleton */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid Skeleton */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
