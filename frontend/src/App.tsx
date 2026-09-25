import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Cookbook from "./components/Cookbook";
import GetRecipe from "./components/GetRecipe";
import Hero from "./components/Hero";
import IngredientBubbles from "./components/IngredientBubbles";
import NavBar from "./components/NavBar";
import PreferencesBar from "./components/PreferencesBar";
import QuickAddSuggestions from "./components/QuickAddSuggestions";
import Recipe from "./components/Recipe";
import RecipeSkeleton from "./components/RecipeSkeleton";
import Search from "./components/SearchSection";
import * as api from "./lib/api";
import {
  DEFAULT_RECIPE_OPTIONS,
  type SavedRecipe,
  type GeneratedRecipe,
} from "./types";

const MIN_INGREDIENTS_FOR_RECIPE = 3;

function App() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(DEFAULT_RECIPE_OPTIONS);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadSavedRecipes() {
      try {
        setSavedRecipes(await api.getSavedRecipes());
      } catch (error) {
        toast.error("Couldn't load your cookbook");
        console.error("Something went wrong: ", error);
      }
    }
    loadSavedRecipes();
  }, []);

  useEffect(() => {
    if (loading) {
      loadingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [loading]);

  async function generateRecipe() {
    setLoading(true);
    try {
      setRecipe(await api.generateRecipe({ ingredients, preferences: options }));
      setIngredients([]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate a recipe",
      );
      console.error("Something went wrong: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveRecipe(recipeToSave: GeneratedRecipe) {
    try {
      await api.saveRecipe(recipeToSave);
      toast.success("Recipe saved to your cookbook!");
      setSavedRecipes(await api.getSavedRecipes());
    } catch (error) {
      toast.error("Error saving the recipe");
      console.error("Something went wrong: ", error);
    }
  }

  async function deleteRecipe(id: number) {
    try {
      await api.deleteRecipe(id);
      setSavedRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
      toast.success("Recipe removed from your cookbook");
    } catch (error) {
      toast.error("Error deleting the recipe");
      console.error("Something went wrong: ", error);
    }
  }

  const remainingForRecipe = Math.max(
    0,
    MIN_INGREDIENTS_FOR_RECIPE - ingredients.length,
  );

  function removeIngredient(indexToRemove: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== indexToRemove));
  }

  function addIngredient(ingredient: string) {
    setIngredients((prev) => [...prev, ingredient]);
  }

  function generateNewRecipe() {
    setRecipe(null);
    setIngredients([]);
    document
      .getElementById("search-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearAllIngredients() {
    setIngredients([]);
  }

  return (
    <div className="flex min-h-screen bg-[#F7F6EF]">
      <Toaster position="bottom-right" />
      <div className="flex-1">
        <NavBar />
        <Hero />
        <div
          id="search-section"
          className="relative flex min-h-screen w-full flex-col items-center justify-center gap-16 px-6 py-16 sm:px-8"
        >
          <IngredientBubbles />
          <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center gap-4">
            <Search
              ingredients={ingredients}
              setIngredients={setIngredients}
              onRemove={removeIngredient}
              onClearAll={clearAllIngredients}
              remainingForRecipe={remainingForRecipe}
            />
            <PreferencesBar options={options} onChange={setOptions} />
            <QuickAddSuggestions onQuickAdd={addIngredient} />
          </div>
          <div
            id="get-recipe-section"
            className="relative z-10 mx-1 w-full max-w-2xl scroll-mt-20"
          >
            <GetRecipe
              generateRecipe={generateRecipe}
              loading={loading}
              remainingForRecipe={remainingForRecipe}
              recipeGenerated={recipe !== null}
            />
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 sm:px-8 pb-16 flex flex-col gap-8">
          {loading ? (
            <div ref={loadingRef} className="mx-1 w-full scroll-mt-20">
              <RecipeSkeleton />
            </div>
          ) : null}
          {recipe ? (
            <div className="mx-1 flex w-full flex-col gap-4">
              <Recipe recipe={recipe} onSave={saveRecipe} />
              <div className="flex justify-center mt-5">
                <button
                  type="button"
                  onClick={generateNewRecipe}
                  title="All ingredients will be deleted"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-orange-600 px-6 text-sm font-medium text-white hover:bg-orange-700"
                >
                  <RotateCcw size={16} />
                  Generate New Recipe
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <Cookbook savedRecipes={savedRecipes} onDelete={deleteRecipe} />
      </div>
    </div>
  );
}

export default App;
