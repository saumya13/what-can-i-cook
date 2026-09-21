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
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm font-work-sans tracking-wide">
      <div className="relative h-40 w-full shrink-0 overflow-hidden">
        <DishImage src={imageUrl} alt={`Photo of ${name}`} className="h-full w-full" />
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
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        <p className="flex-1 text-sm text-gray-600 font-serif">{description}</p>
        <Link
          to={`/recipes/${id}`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-orange-600 px-4 text-sm font-medium text-white hover:bg-orange-700"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
}
