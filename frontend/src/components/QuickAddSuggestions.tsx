import { Plus } from "lucide-react";

const QUICK_ADD_SUGGESTIONS = [
  "Onions",
  "Garlic",
  "Tomatoes",
  "Tofu",
  "Ginger",
  "Potatoes",
];

interface QuickAddSuggestionsProps {
  onQuickAdd: (ingredient: string) => void;
}

export default function QuickAddSuggestions({
  onQuickAdd,
}: QuickAddSuggestionsProps) {
  return (
    <div className="flex w-full flex-wrap items-baseline justify-center gap-2 text-center font-work-sans tracking-wide">
      <span className="text-sm text-gray-500 font-work-sans">Quick add:</span>
      {QUICK_ADD_SUGGESTIONS.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onQuickAdd(item)}
          className="inline-flex items-center gap-1 rounded-xl border border-[#4D7C5A] bg-[#EFF5F1] px-3 py-1.5 text-sm text-[#3F6449] hover:bg-[#D3E4D8]"
        >
          <Plus size={14} />
          {item}
        </button>
      ))}
    </div>
  );
}
