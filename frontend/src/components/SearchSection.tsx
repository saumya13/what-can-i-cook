import { Plus, X } from "lucide-react";

interface SearchProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (index: number) => void;
  onClearAll: () => void;
  remainingForRecipe: number;
}

export default function Search({
  ingredients,
  setIngredients,
  onRemove,
  onClearAll,
  remainingForRecipe,
}: SearchProps) {
  function addIngredient(formData: FormData) {
    const ingredient = formData.get("ingredient") as string;
    if (!ingredient?.trim()) return;

    setIngredients((prev) => [...prev, ingredient.trim()]);
  }

  return (
    <div className="flex w-full flex-col items-center gap-3 text-center font-work-sans">
      <h2 className="text-5xl font-medium text-gray-900 font-serif">
        What’s in your kitchen?
      </h2>
      <form
        action={addIngredient}
        className="flex w-full flex-wrap items-center gap-2 rounded-md bg-white px-3 py-2.5 text-left outline-1 -outline-offset-1 outline-gray-300 shadow-sm focus-within:outline-orange-500"
      >
        {ingredients.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 py-1 pl-3 pr-1.5 text-sm text-orange-800"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label={`Remove ${item}`}
              className="rounded-full p-0.5 text-orange-500 transition-colors hover:bg-orange-200 hover:text-red-600"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          className="h-8 min-w-[120px] flex-1 border-none bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
          aria-label="Add Ingredient"
          type="text"
          placeholder={
            ingredients.length === 0 ? "Add ingredients" : "Add another…"
          }
          name="ingredient"
        />
        <button
          type="submit"
          aria-label="Add ingredient"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-orange-600 hover:bg-orange-50 hover:text-orange-700"
        >
          <Plus size={18} />
        </button>
      </form>
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-500 tracking-wide">
          Add a few ingredients and we’ll work with what’s available.
        </p>
        {ingredients.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            title="Remove all ingredients"
            className="text-sm font-medium text-orange-600 underline hover:text-orange-700"
          >
            Clear all
          </button>
        )}
      </div>

      {ingredients.length > 0 && remainingForRecipe > 0 && (
        <p className="text-xs font-medium text-gray-400">
          {remainingForRecipe} more ingredient
          {remainingForRecipe > 1 ? "s" : ""} to go
        </p>
      )}
    </div>
  );
}
