interface GetRecipeProps {
  generateRecipe: () => void;
  loading: boolean;
  remainingForRecipe: number;
  recipeGenerated: boolean;
}

export default function GetRecipe({
  generateRecipe,
  loading,
  remainingForRecipe,
  recipeGenerated,
}: GetRecipeProps) {
  const insufficientIngredients = remainingForRecipe > 0;
  const disabled = insufficientIngredients || loading || recipeGenerated;

  const disabledReason = recipeGenerated
    ? "Start a new recipe to generate again"
    : insufficientIngredients
      ? "Add at least 3 items"
      : undefined;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border border-orange-600 bg-orange-50 rounded-xl px-8 py-6 tracking-wide">
      <div className="flex flex-col gap-2">
        <span className="font-serif text-2xl font-medium tracking-tight">
          Ready for the recipe?
        </span>
        <span className="text-[#6B7280] text-sm">
          Generate a recipe from your list of ingredients.
        </span>
      </div>
      <span title={disabledReason} className="shrink-0">
        <button
          className="bg-orange-600 text-white text-sm font-medium h-10 px-6 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-600"
          onClick={generateRecipe}
          disabled={disabled}
        >
          {loading ? "Cooking🍲" : "Make me something delicious"}
        </button>
      </span>
    </div>
  );
}
