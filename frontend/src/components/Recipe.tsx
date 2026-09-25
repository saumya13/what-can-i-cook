import { Bookmark } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import DishImage from "./DishImage";
import { RECIPE_PROSE_CLASSNAME } from "../constants";
import type { GeneratedRecipe } from "../types";

export default function Recipe({
  recipe,
  onSave,
}: {
  recipe: GeneratedRecipe;
  onSave: (recipe: GeneratedRecipe) => void;
}) {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSave(recipe);
    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-2 border-b border-gray-300 pb-5">
        <span className="text-sm text-gray-500">
          Your Personal Chef recommends:
        </span>
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-orange-700">{recipe.name}</h1>
          <div className="group relative">
            <button
              type="button"
              onClick={handleSave}
              aria-label="Save recipe"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${
                saved
                  ? "border-orange-700 bg-orange-50 text-orange-700"
                  : "border-gray-500 bg-white text-gray-500 hover:border-orange-700 hover:bg-orange-50 hover:text-orange-700"
              }`}
            >
              <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
            </button>
            {saved ? (
              <span className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                Recipe already saved
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <div className={`${RECIPE_PROSE_CLASSNAME} min-w-0 flex-1 basis-0`}>
          <h2 className="mb-3 font-serif text-3xl font-semibold tracking-tight text-gray-900">
            Ingredients
          </h2>
          <ReactMarkdown>{recipe.ingredients}</ReactMarkdown>
        </div>
        <div className="min-w-0 flex-1 basis-0 overflow-hidden rounded-lg">
          <DishImage
            src={recipe.imageUrl}
            alt="Generated preview of the finished dish"
            className="h-full min-h-40 w-full"
          />
        </div>
      </div>
      <div className={`${RECIPE_PROSE_CLASSNAME} max-w-none`}>
        <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
      </div>
    </div>
  );
}
