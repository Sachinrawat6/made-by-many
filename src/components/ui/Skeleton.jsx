import clsx from "clsx";

/**
 * Skeleton — shimmer placeholder for loading states.
 */
export function Skeleton({ className }) {
  return (
    <div
      className={clsx(
        "rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200",
        "bg-[length:200%_100%] animate-shimmer",
        className
      )}
      aria-hidden="true"
    />
  );
}

/**
 * TeamMemberCard skeleton — matches the real card layout.
 */
export function TeamMemberCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
    </div>
  );
}
