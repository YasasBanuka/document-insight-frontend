/**
 * Skeleton loading components for better perceived performance
 * Replace spinners with content-aware skeletons
 */

export function DocumentCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 animate-pulse">
            <div className="flex items-start gap-3">
                {/* Icon skeleton */}
                <div className="w-12 h-12 bg-slate-200 rounded-lg flex-shrink-0"></div>

                <div className="flex-1 min-w-0">
                    {/* Title skeleton */}
                    <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                    {/* Size skeleton */}
                    <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                    {/* Metadata skeleton */}
                    <div className="flex gap-4">
                        <div className="h-3 bg-slate-200 rounded w-24"></div>
                        <div className="h-3 bg-slate-200 rounded w-16"></div>
                    </div>
                </div>

                {/* Delete button skeleton */}
                <div className="w-8 h-8 bg-slate-200 rounded-lg flex-shrink-0"></div>
            </div>
        </div>
    );
}

export function SearchResultSkeleton() {
    return (
        <div className="bg-white rounded-lg border border-slate-200 p-4 animate-pulse">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                    {/* Icon */}
                    <div className="w-8 h-8 bg-slate-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                        {/* Filename */}
                        <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
                        {/* Metadata */}
                        <div className="flex gap-3">
                            <div className="h-3 bg-slate-200 rounded w-16"></div>
                            <div className="h-3 bg-slate-200 rounded w-20"></div>
                        </div>
                    </div>
                </div>
                {/* Similarity badge */}
                <div className="w-12 h-6 bg-slate-200 rounded-lg"></div>
            </div>
            {/* Content preview */}
            <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                <div className="h-3 bg-slate-200 rounded w-4/6"></div>
            </div>
        </div>
    );
}

export function MessageSkeleton() {
    return (
        <div className="flex justify-start mb-4">
            <div className="max-w-[85%] rounded-xl px-4 py-3 bg-white border border-slate-200 animate-pulse">
                <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-64"></div>
                    <div className="h-3 bg-slate-200 rounded w-48"></div>
                    <div className="h-3 bg-slate-200 rounded w-56"></div>
                </div>
            </div>
        </div>
    );
}

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`bg-slate-200 rounded animate-pulse ${className}`}></div>
    );
}
