interface GetRecipeProps {
  generateRecipe: () => void;
}

export default function GetRecipe(props: GetRecipeProps) {
  return (
    <div className="flex flex-row mt-12 bg-[#F0EFEB] rounded-xl ml-48 mr-48 h-28 items-center pl-24 pr-24 gap-10">
      <div className="flex flex-col gap-2">
        <span className="text-lg">Ready for the recipe?</span>
        <span className="text-[#6B7280] text-sm">
          Generate a recipe from your list of ingredients.
        </span>
      </div>
      <div className="flex items-center justify-center p-16">
        <button
          className="bg-orange-600 text-white text-md w-48 h-10 rounded-md hover:bg-orange-700"
          onClick={props.generateRecipe}
        >
          Get a recipe
        </button>
      </div>
    </div>
  );
}
