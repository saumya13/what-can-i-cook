import { Soup } from "lucide-react";

// A bowl of soup bobbing gently, with bubbles popping off the surface in a
// staggered loop like it's simmering. Purely decorative — pair it with a
// `role="status"`/`aria-live` wrapper and visible caption for a11y.
export default function SoupLoader() {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <div className="absolute -top-1 flex gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full bg-orange-400/80 [animation:bubble-pop_1.4s_ease-in-out_infinite]"
          style={{ animationDelay: "0s" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-orange-400/80 [animation:bubble-pop_1.4s_ease-in-out_infinite]"
          style={{ animationDelay: "0.45s" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-orange-400/80 [animation:bubble-pop_1.4s_ease-in-out_infinite]"
          style={{ animationDelay: "0.9s" }}
        />
      </div>
      <Soup
        className="h-12 w-12 text-orange-600 [animation:boil-bounce_1.4s_ease-in-out_infinite]"
        strokeWidth={1.75}
      />
    </div>
  );
}
