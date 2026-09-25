import WokLoader from "./WokLoader";

// Mirrors Recipe.tsx's layout so there's no layout shift when the real
// recipe replaces this once generation finishes. Everything here is a plain
// shimmer block; the cooking animation lives outside it (the wok overlay).
function ShimmerLines({
  title,
  widths,
  className,
}: {
  title: string;
  widths: string[];
  className: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex animate-pulse flex-col gap-2 ${className}`}
    >
      <div className={`mb-1 h-6 rounded bg-gray-200 ${title}`} />
      {widths.map((width, i) => (
        <div key={i} className={`h-3 rounded bg-gray-200 ${width}`} />
      ))}
    </div>
  );
}

export default function RecipeSkeleton() {
  return (
    <div className="relative flex min-h-[44rem] flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
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
        <ShimmerLines
          title="w-32"
          widths={[
            "w-full",
            "w-5/6",
            "w-full",
            "w-4/6",
            "w-full",
            "w-3/4",
            "w-5/6",
            "w-2/3",
          ]}
          className="min-w-0 flex-1 basis-0"
        />
        <div
          aria-hidden="true"
          className="h-44 min-w-0 flex-1 basis-0 animate-pulse self-start rounded-lg bg-gray-200"
        />
      </div>
      <ShimmerLines
        title="w-40"
        widths={[
          "w-full",
          "w-full",
          "w-5/6",
          "w-full",
          "w-11/12",
          "w-4/6",
          "w-full",
          "w-3/4",
          "w-5/6",
          "w-full",
          "w-11/12",
          "w-full",
          "w-2/3",
        ]}
        className="flex-1"
      />
      <div
        role="status"
        aria-live="polite"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="wok-circle flex h-40 w-40 items-center justify-center rounded-full shadow-sm ring-1">
          <WokLoader />
        </div>
        <span className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#F7F6EF] px-4 py-1 font-serif text-lg text-gray-700">
          Cooking up your recipe…
        </span>
      </div>
    </div>
  );
}
