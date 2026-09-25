import { Plus } from "lucide-react";

const QUICK_ADD_SUGGESTIONS = [
  "Onions",
  "Garlic",
  "Tomatoes",
  "Tofu",
  "Ginger",
  "Potatoes",
  "Noodles",
  "Carrots",
  "Spices",
  "Rice",
];

interface QuickAddSuggestionsProps {
  onQuickAdd: (ingredient: string) => void;
}

export default function QuickAddSuggestions({
  onQuickAdd,
}: QuickAddSuggestionsProps) {
  return (
    <div className="flex w-full flex-wrap items-baseline justify-center gap-2 text-center tracking-wide">
      <span className="text-sm text-gray-500">Quick add:</span>
      {QUICK_ADD_SUGGESTIONS.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onQuickAdd(item)}
          className="inline-flex items-center gap-1 rounded-xl border border-[#A7C492] bg-[#A7C492]/15 px-3 py-1.5 text-sm text-[#4B6B3A] hover:bg-[#A7C492]/30"
        >
          <Plus size={14} />
          {item}
        </button>
      ))}
    </div>
  );
}
