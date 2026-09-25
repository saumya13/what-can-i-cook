import { useMemo, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { INGREDIENT_SUGGESTIONS } from "../data/ingredientSuggestions";

interface SearchProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (index: number) => void;
  onClearAll: () => void;
  remainingForRecipe: number;
}

const MAX_SUGGESTIONS = 6;

export default function Search({
  ingredients,
  setIngredients,
  onRemove,
  onClearAll,
  remainingForRecipe,
}: SearchProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const blurTimeout = useRef<ReturnType<typeof setTimeout>>();

  const suggestions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    const added = new Set(ingredients.map((item) => item.toLowerCase()));
    return INGREDIENT_SUGGESTIONS.filter(
      (item) =>
        !added.has(item.name.toLowerCase()) &&
        item.name.toLowerCase().includes(trimmed),
    ).slice(0, MAX_SUGGESTIONS);
  }, [query, ingredients]);

  function addIngredientValue(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setIngredients((prev) => [...prev, trimmed]);
    setQuery("");
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      addIngredientValue(suggestions[highlightedIndex].name);
      return;
    }
    addIngredientValue(query);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length,
      );
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  }

  function handleBlur() {
    blurTimeout.current = setTimeout(() => {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }, 150);
  }

  function handleFocus() {
    clearTimeout(blurTimeout.current);
    if (query.trim()) setShowSuggestions(true);
  }

  return (
    <div className="flex w-full flex-col items-center gap-3 text-center">
      <h2 className="font-serif text-5xl font-medium tracking-tight text-gray-900">
        What’s in your kitchen?
      </h2>
      <div className="relative w-full">
        <form
          onSubmit={handleSubmit}
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
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(-1);
              setShowSuggestions(e.target.value.trim().length > 0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions && suggestions.length > 0}
            aria-controls="ingredient-suggestions"
          />
          <button
            type="submit"
            aria-label="Add ingredient"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-orange-600 hover:bg-orange-50 hover:text-orange-700"
          >
            <Plus size={18} />
          </button>
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <ul
            id="ingredient-suggestions"
            role="listbox"
            className="absolute left-0 right-0 top-full z-10 mt-1.5 overflow-hidden rounded-md border border-gray-200 bg-white text-left shadow-lg"
          >
            {suggestions.map((item, index) => (
              <li key={item.name} role="option" aria-selected={index === highlightedIndex}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addIngredientValue(item.name)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm ${
                    index === highlightedIndex
                      ? "bg-orange-50 text-orange-800"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
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
