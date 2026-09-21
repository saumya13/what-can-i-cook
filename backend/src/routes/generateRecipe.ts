import { Router } from "express";
import { generateRecipeImage, generateRecipeText } from "../lib/openrouter";
import { parseRecipeResponse } from "../lib/recipeParser";
import { uploadRecipeImage } from "../lib/supabaseStorage";
import type { RecipePreferences } from "../types";

export const generateRecipeRouter = Router();

function isValidPreferences(value: unknown): value is RecipePreferences {
  return typeof value === "object" && value !== null;
}

// Create a new recipe from a list of ingredients
generateRecipeRouter.post("/generate", async (req, res) => {
  const { ingredients, preferences } = req.body;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    res.status(400).json({ error: "ingredients must be a non-empty array" });
    return;
  }
  if (!isValidPreferences(preferences)) {
    res.status(400).json({ error: "preferences is required" });
    return;
  }

  let rawContent: string;
  try {
    rawContent = await generateRecipeText(ingredients, preferences);
  } catch (err) {
    console.error("Recipe generation request failed:", err);
    res.status(502).json({ error: "Failed to generate a recipe" });
    return;
  }

  let recipe;
  try {
    recipe = parseRecipeResponse(rawContent);
  } catch (err) {
    console.error("Failed to parse AI generated recipe:", err);
    res.status(502).json({ error: "Failed to parse AI response" });
    return;
  }

  // A failed image generation shouldn't block returning the recipe text —
  // the frontend falls back to a placeholder when imageURL is empty.
  let imageURL = "";
  try {
    const image = await generateRecipeImage(recipe.imagePrompt);
    if (image) {
      imageURL =
        (await uploadRecipeImage(
          image.b64_json,
          image.media_type ?? "image/png",
        )) ?? "";
    }
  } catch (err) {
    console.error("Error generating the image for this dish:", err);
  }

  res.json({
    name: recipe.name,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    cuisine: recipe.cuisine,
    cook_time: recipe.cookTime,
    servings: recipe.servings,
    description: recipe.description,
    imageURL,
  });
});
