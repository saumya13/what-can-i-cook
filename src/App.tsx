import getRecipeFromClaude from "./ai";
import GetRecipe from "./components/GetRecipe";
import IngredientsList from "./components/IngredientsList";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Recipe from "./components/Recipe";
import Search from "./components/SearchSection";
import { useState } from "react";

function App() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  //const [recipeShown, setRecipeShown] = useState(false);
  const [recipeText, setRecipeText] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateRecipe() {
    setLoading(true);
    try {
      const output = (await getRecipeFromClaude(ingredients)) ?? "";
      if (output) {
        setRecipeText(output);
        console.log("Received a response: ", output);
      }
    } catch (error) {
      console.error("Something went wrong: ", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex bg-gray-100 min-h-screen p-1 font-sans">
      <div className="flex-1 bg-[#FAFAF8] rounded-lg">
        <NavBar />
        <Search ingredients={ingredients} setIngredients={setIngredients} />
        {ingredients.length > 0 && (
          <IngredientsList ingredients={ingredients} />
        )}
        <GetRecipe generateRecipe={generateRecipe} />
        {loading ? <Loading /> : null}
        {recipeText.length > 0 ? <Recipe recipeText={recipeText} /> : null}
      </div>
    </div>
  );
}

export default App;
