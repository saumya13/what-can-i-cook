import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import DishImage from "./DishImage";

interface RecipeCardProps {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  onDelete: (id: number) => void;
}

export default function RecipeCard({
  id,
  name,
  description,
  imageUrl,
  onDelete,
}: RecipeCardProps) {
  function handleDelete() {
    if (window.confirm(`Delete "${name}" from your cookbook?`)) {
      onDelete(id);
    }
  }

  return (
    <div className="group flex flex-col rounded-2xl border-1 border-[#E7E4D0] bg-[#F7F6EF] p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-[#A7C492]/12 ">
        <DishImage
          src={imageUrl}
          alt={`Photo of ${name}`}
          className="h-full w-full"
        />
        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Delete ${name}`}
          title="Delete recipe"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm transition-colors hover:bg-white hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 pt-4">
        <h3 className="font-serif text-xl font-normal tracking-tight text-gray-800">
          {name}
        </h3>
        <p className="flex-1 text-sm text-gray-500">{description}</p>
        <Link
          to={`/recipes/${id}`}
          className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#A7C492]/60 bg-[#A7C492]/20 text-sm font-semibold text-[#4f6f3c] transition-colors hover:bg-orange-200 hover:border-orange-300 group-hover:border-orange-200 group-hover:bg-orange-100 group-hover:text-orange-700"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
}
