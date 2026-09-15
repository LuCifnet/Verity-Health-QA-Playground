import React from 'react'

export interface SkeletonProps {
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-shimmer rounded bg-slate-200/80 ${className}`}
      aria-hidden="true"
    />
  )
}

export const SkeletonLine: React.FC<{ width?: string; height?: string; className?: string }> = ({
  width = 'w-full',
  height = 'h-4',
  className = ''
}) => {
  return <Skeleton className={`${width} ${height} ${className}`} />
}

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  )
}

export const FormSkeleton: React.FC = () => {
  return (
    <div className="space-y-5 animate-pulse" aria-label="Loading form content">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      <Skeleton className="h-11 w-full rounded-lg mt-6" />
    </div>
  )
}

export const PageLoader: React.FC<{ message?: string }> = ({
  message = 'Loading Verity QA Playground...'
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center max-w-sm w-full text-center">
        {/* Animated Brand Icon */}
        <div className="relative mb-6">
          <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-200 animate-bounce">
            V
          </div>
          <div className="absolute -inset-1 rounded-2xl border-2 border-indigo-400/40 animate-ping opacity-75 pointer-events-none" />
        </div>

        <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
          Verity QA Playground
        </h2>
        <p className="text-sm text-slate-500 mb-6">{message}</p>

        {/* Progress Bar Shimmer */}
        <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full w-full bg-indigo-600 rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  )
}

export const HomePageSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero / Header Card Skeleton */}
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <Skeleton className="h-8 w-64 rounded-md" />
            <Skeleton className="h-4 w-96 max-w-full rounded-md" />
          </div>
          <Skeleton className="h-10 w-24 rounded-lg self-start" />
        </div>

        {/* Details Grid Skeleton */}
        <div className="mt-6">
          <Skeleton className="h-4 w-48 mb-4 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-4 border border-slate-100 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature / Info Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
