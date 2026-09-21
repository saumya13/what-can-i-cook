import { CookingPot } from "lucide-react";

interface DishImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

// Shows the generated/saved dish photo, or a placeholder gradient with a
// cooking-pot icon when there isn't one (generation failed, or an older
// saved recipe predates image support).
export default function DishImage({ src, alt, className }: DishImageProps) {
  if (src) {
    return (
      <img src={src} alt={alt} className={`object-cover ${className ?? ""}`} />
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-orange-200 via-red-200 to-orange-300 ${className ?? ""}`}
    >
      <CookingPot className="h-10 w-10 text-white/80" strokeWidth={1.5} />
    </div>
  );
}
