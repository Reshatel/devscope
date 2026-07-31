export function ProfileSkeleton() {
  return (
    <div className="mt-6 animate-pulse rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-3 w-1/4 rounded bg-gray-200" />
        </div>
      </div>
      <div className="mt-4 h-3 w-2/3 rounded bg-gray-200" />
    </div>
  );
}