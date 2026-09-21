import SoupLoader from "./SoupLoader";

// Mirrors Recipe.tsx's layout so there's no layout shift when the real
// recipe replaces this once generation finishes. The soup loader sits
// where the recipe instructions text will appear; everything else stays a
// plain shimmer block.
export default function RecipeSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="flex animate-pulse flex-col gap-2 border-b border-gray-300 pb-5"
      >
        <div className="h-3 w-40 rounded bg-gray-200" />
        <div className="flex items-center justify-between gap-4">
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200" />
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <div
          aria-hidden="true"
          className="flex min-w-0 flex-1 basis-0 animate-pulse flex-col gap-2"
        >
          <div className="mb-1 h-6 w-32 rounded bg-gray-200" />
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-5/6 rounded bg-gray-200" />
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-4/6 rounded bg-gray-200" />
        </div>
        <div
          aria-hidden="true"
          className="min-h-40 min-w-0 flex-1 basis-0 animate-pulse overflow-hidden rounded-lg"
        >
          <div className="h-full w-full rounded-lg bg-gray-200" />
        </div>
      </div>
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg bg-orange-50"
      >
        <SoupLoader />
        <span className="text-sm text-gray-500">Cooking up your recipe...</span>
      </div>
    </div>
  );
}
