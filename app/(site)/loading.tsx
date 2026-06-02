import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="pt-20">
      {/* Hero Skeleton */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-secondary/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-16">
          <div className="max-w-3xl space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 md:h-20 lg:h-28 w-full" />
            <Skeleton className="h-6 w-full max-w-xl" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Skeleton */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-12 md:h-16 lg:h-20 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-5 w-full max-w-xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
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

      {/* About Preview Skeleton */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Skeleton className="aspect-4/5 w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gallery Skeleton */}
      <section className="py-20 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-12 md:h-16 lg:h-20 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-5 w-full max-w-xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Skeleton */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-12 md:h-16 lg:h-20 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-5 w-full max-w-xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 h-full space-y-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Skeleton key={j} className="h-4 w-4" />
                  ))}
                </div>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <div className="pt-6 border-t border-border/50 flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-surface-alt rounded-3xl p-10 md:p-16 lg:p-20 text-center space-y-6">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-12 md:h-16 lg:h-20 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-5 w-full max-w-xl mx-auto" />
            <Skeleton className="h-12 w-48 mx-auto" />
          </div>
        </div>
      </section>
    </div>
  )
}
