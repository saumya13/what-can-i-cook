import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../drizzle/db";
import { recipes } from "../../drizzle/schema";
import { deleteRecipeImage } from "../lib/supabaseStorage";

export const recipesRouter = Router();

// Get all saved recipes to show
recipesRouter.get("/", async (req, res) => {
  const allRecipes = await db.select().from(recipes);
  res.json(allRecipes);
});

// Get a specific recipe
recipesRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid recipe id" });
    return;
  }

  const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));

  if (!recipe) {
    res.status(404).json({ error: "Recipe not found" });
    return;
  }

  res.json(recipe);
});

// Save a recipe to the cookbook
recipesRouter.post("/", async (req, res) => {
  const recipe = req.body;

  try {
    const [savedRecipe] = await db
      .insert(recipes)
      .values({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        description: recipe.description,
        cuisine: recipe.cuisine,
        servings: recipe.servings,
        cookTime: recipe.cookTime,
        imageUrl: recipe.imageURL || null,
      })
      .returning();

    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Failed to save the recipe", error);
    res.status(500).json({ error: "Unable to save the recipe" });
  }
});

// Delete a recipe from the cookbook
recipesRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid recipe id" });
    return;
  }

  const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));

  if (!recipe) {
    res.status(404).json({ error: "Recipe not found" });
    return;
  }

  if (recipe.imageUrl) {
    await deleteRecipeImage(recipe.imageUrl);
  }

  try {
    await db.delete(recipes).where(eq(recipes.id, id));
    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete the recipe", error);
    res.status(500).json({ error: "Unable to delete the recipe" });
  }
});
