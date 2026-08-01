export function ProfileSkeleton() {
  return (
    <div className="mt-6 animate-pulse rounded-lg border border-sage/20 bg-surface p-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-surface-hover" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-surface-hover" />
          <div className="h-3 w-1/4 rounded bg-surface-hover" />
        </div>
      </div>
      <div className="mt-4 h-3 w-2/3 rounded bg-surface-hover" />
    </div>
  );
}