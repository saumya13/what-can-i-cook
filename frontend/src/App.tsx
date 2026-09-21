import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
//import getRecipeFromClaude from "./ai";
import Cookbook from "./components/Cookbook";
import GetRecipe from "./components/GetRecipe";
import Hero from "./components/Hero";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import PreferencesBar from "./components/PreferencesBar";
import QuickAddSuggestions from "./components/QuickAddSuggestions";
import Recipe from "./components/Recipe";
import Search from "./components/SearchSection";
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

  async function fetchSavedRecipes(): Promise<SavedRecipe[]> {
    const response = await fetch("http://localhost:3000/api/recipes");

    if (!response.ok) {
      throw new Error(`Failed to load recipes: ${response.status}`);
    }

    return response.json();
  }

  useEffect(() => {
    async function loadSavedRecipes() {
      const recipes = await fetchSavedRecipes();
      console.log("Res: ", recipes);
      setSavedRecipes(recipes);
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
      const res = await fetch("http://localhost:3000/api/recipe/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: ingredients,
          preferences: options,
        }),
      });
      const output = await res.json();

      if (!res.ok || output?.error) {
        throw new Error(output?.error ?? "Failed to generate a recipe");
      }

      setRecipe({
        name: output.name,
        ingredients: output.ingredients,
        description: output.description,
        instructions: output.instructions,
        cuisine: output.cuisine,
        cookTime: output.cook_time,
        servings: output.servings,
        imageURL: output.imageURL,
      });
      setIngredients([]);
    } catch (error) {
      toast.error("The Claude API is busy...");
      console.error("Something went wrong: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveRecipe(recipe: GeneratedRecipe) {
    try {
      const res = await fetch("http://localhost:3000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to save a recipe: ", data.error);
      }

      toast.success("Recipe saved to your cookbook! ", data);
      const recipes = await fetchSavedRecipes();
      setSavedRecipes(recipes);
    } catch (error) {
      toast.error("Error saving the recipe");
      console.error("Something went wrong: ", error);
    }
  }

  async function deleteRecipe(id: number) {
    try {
      const res = await fetch(`http://localhost:3000/api/recipes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete the recipe");
      }

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
    <div className="flex min-h-screen bg-[#FAFAF8]">
      <Toaster position="bottom-right" />
      <div className="flex-1">
        <NavBar />
        <Hero />
        <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-8 pb-16 flex flex-col gap-8">
          <div
            id="search-section"
            className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 py-12 scroll-mt-20"
          >
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
          <div id="get-recipe-section" className="mx-1 scroll-mt-20">
            <GetRecipe
              generateRecipe={generateRecipe}
              loading={loading}
              remainingForRecipe={remainingForRecipe}
              recipeGenerated={recipe !== null}
            />
          </div>
          <div ref={loadingRef} className="scroll-mt-20">
            {loading ? <Loading /> : null}
          </div>
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
