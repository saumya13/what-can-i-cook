import { Bookmark, CookingPot } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { GeneratedRecipe } from "../types";

export default function Recipe({
  recipe,
  onSave,
}: {
  recipe: GeneratedRecipe;
  onSave: (recipe: GeneratedRecipe) => void;
}) {
  console.log("recipe image: ", recipe.imageURL);
  const [saved, setSaved] = useState(false);
  const proseClassName =
    "font-work-sans prose prose-sm  prose-h1:font-serif prose-h1:font-semibold prose-h2:font-semibold prose-h3:font-normal leading-5 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-medium prose-h1:mb-2 prose-h2:mb-2 prose-h3:mb-1 prose-hr:my-4 prose-p:mb-1 prose-h3:text-orange-700 prose-h1:text-orange-700";

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
          <h1 className="font-serif text-3xl text-orange-700">{recipe.name}</h1>
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
        <div className={`${proseClassName} min-w-0 flex-1 basis-0`}>
          <h2 className="mb-3 font-work-sans text-2xl font-extrabold tracking-tight text-gray-900">
            Ingredients
          </h2>
          <ReactMarkdown>{recipe.ingredients}</ReactMarkdown>
        </div>
        <div className="min-w-0 flex-1 basis-0 overflow-hidden rounded-lg">
          {recipe.imageURL ? (
            <img
              src={recipe.imageURL}
              alt="Generated preview of the finished dish"
              className="h-full min-h-40 w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-40 w-full items-center justify-center bg-gradient-to-br from-orange-200 via-red-200 to-orange-300">
              <CookingPot
                className="h-10 w-10 text-white/80"
                strokeWidth={1.5}
              />
            </div>
          )}
        </div>
      </div>
      <div className={`${proseClassName} max-w-none`}>
        <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
      </div>
    </div>
  );
}
