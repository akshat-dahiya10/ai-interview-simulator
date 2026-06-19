import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex h-[100dvh] w-full">
      {/* sidebar skeleton */}
      <div className="hidden w-72 flex-col gap-5 border-r border-white/8 p-5 lg:flex">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>

      {/* chat skeleton */}
      <div className="flex flex-1 flex-col">
        <div className="hidden items-center justify-between border-b border-white/8 px-8 py-4 lg:flex">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-2.5 w-56 rounded-full" />
        </div>
        <div className="flex-1 space-y-6 px-8 py-8">
          <div className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[22rem]" />
              <Skeleton className="h-4 w-[18rem]" />
              <Skeleton className="h-4 w-[24rem]" />
            </div>
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-16 w-72 rounded-2xl" />
          </div>
          <div className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-24 w-[26rem] rounded-2xl" />
          </div>
        </div>
        <div className="px-8 pb-6">
          <Skeleton className="mx-auto h-14 max-w-3xl rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
