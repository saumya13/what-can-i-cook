import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import DishImage from "../components/DishImage";
import NavBar from "../components/NavBar";
import * as api from "../lib/api";
import { RECIPE_PROSE_CLASSNAME } from "../constants";
import type { SavedRecipe } from "../types";

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<SavedRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadRecipe() {
      setLoading(true);
      setNotFound(false);
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      try {
        setRecipe(await api.getSavedRecipe(id));
      } catch (error) {
        console.error("Something went wrong: ", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6EF]">
        <NavBar />
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-8">
          <p className="text-lg text-gray-700">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (notFound || !recipe) {
    return (
      <div className="min-h-screen bg-[#F7F6EF]">
        <NavBar />
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-8">
          <p className="text-lg text-gray-700">Recipe not found.</p>
          <Link
            to="/"
            className="mt-4 inline-block text-orange-600 hover:underline"
          >
            Back to ChefMate
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6EF]">
      <NavBar />
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-8 sm:px-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} />
          Back to ChefMate
        </Link>

        <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-2 border-b border-gray-300 pb-5">
            <span className="text-sm text-gray-500">From your cookbook:</span>
            <h1 className="font-serif text-4xl font-medium tracking-tight text-orange-700">
              {recipe.name}
            </h1>
            {recipe.description ? (
              <p className="text-base text-gray-600">{recipe.description}</p>
            ) : null}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {recipe.cuisine ? (
                <span className="text-gray-500">
                  Cuisine:{" "}
                  <span className="text-orange-600">{recipe.cuisine}</span>
                </span>
              ) : null}
              {recipe.cookTime ? (
                <span className="text-gray-500">
                  Cook time:{" "}
                  <span className="text-orange-600">{recipe.cookTime}</span>
                </span>
              ) : null}
              {recipe.servings ? (
                <span className="text-gray-500">
                  Servings:{" "}
                  <span className="text-orange-600">{recipe.servings}</span>
                </span>
              ) : null}
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
                alt={`Photo of ${recipe.name}`}
                className="h-full min-h-40 w-full"
              />
            </div>
          </div>

          <div className={`${RECIPE_PROSE_CLASSNAME} max-w-none`}>
            <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
