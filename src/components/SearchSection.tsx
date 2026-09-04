import { Plus } from "lucide-react";

interface SearchProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Search({ ingredients, setIngredients }: SearchProps) {
  function addIngredient(formData: FormData) {
    const ingredient = formData.get("ingredient") as string;
    console.log("form submitted: ", ingredient);

    setIngredients(() => [...ingredients, ingredient]);
  }

  return (
    <div className="flex w-full h-30 items-center justify-center">
      <form action={addIngredient} className="flex gap-3">
        <input
          className="w-96 h-10 items-center rounded-md bg-white pl-3  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 text-gray-900 focus:outline-indigo-400 shadow-sm text-sm"
          aria-label="Add Ingredient"
          type="text"
          placeholder="e.g. oregano"
          name="ingredient"
        />
        <button className="flex flex-row w-48 h-10 text-lg rounded-md border border-orange-600 text-orange-600 hover:border-transparent hover:bg-orange-600 hover:text-white font-sans items-center justify-center gap-1">
          <Plus size={18} />
          <span className="text-[14px]">Add Ingredient</span>
        </button>
      </form>
    </div>
  );
}
