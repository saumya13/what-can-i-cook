import type { SavedRecipe } from "../types";
import RecipeCard from "./RecipeCard";

interface CookbookProps {
  savedRecipes: SavedRecipe[];
  onDelete: (id: number) => void;
}

export default function Cookbook({ savedRecipes, onDelete }: CookbookProps) {
  return (
    <div
      id="recipes-section"
      className="scroll-mt-20 bg-white py-16 font-work-sans tracking-wide"
    >
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-medium text-gray-900 sm:text-3xl font-serif">
            Your personal cookbook, made one meal at a time.
          </h2>
          <p className="text-base text-gray-600 font-work-sans tracking-wide">
            Recipes you save will show up here.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              name={recipe.name}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
