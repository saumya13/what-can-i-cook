import { CookingPot } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-10"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-14 items-end justify-center">
        <div className="absolute -top-1 flex gap-1.5">
          <span
            className="h-3 w-1 rounded-full bg-orange-300/70 [animation:steam-rise_1.6s_ease-in-out_infinite]"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="h-3 w-1 rounded-full bg-orange-300/70 [animation:steam-rise_1.6s_ease-in-out_infinite]"
            style={{ animationDelay: "0.3s" }}
          />
          <span
            className="h-3 w-1 rounded-full bg-orange-300/70 [animation:steam-rise_1.6s_ease-in-out_infinite]"
            style={{ animationDelay: "0.6s" }}
          />
        </div>
        <CookingPot
          className="h-12 w-12 origin-bottom text-orange-600 [animation:sizzle_1.1s_ease-in-out_infinite]"
          strokeWidth={1.75}
        />
      </div>
      <span className="text-sm text-gray-500">Cooking up your recipe...</span>
    </div>
  );
}
