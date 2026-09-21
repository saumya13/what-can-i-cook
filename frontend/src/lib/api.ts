import type {
  GeneratedRecipe,
  GenerateRecipeRequest,
  SavedRecipe,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const body = isJson ? await response.json() : undefined;

  if (!response.ok) {
    throw new Error(body?.error ?? `Request failed: ${response.status}`);
  }

  return body as T;
}

function asJsonRequest(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export function getSavedRecipes(): Promise<SavedRecipe[]> {
  return apiFetch("/api/recipes");
}

export function getSavedRecipe(id: string): Promise<SavedRecipe> {
  return apiFetch(`/api/recipes/${id}`);
}

// The backend's JSON wire format doesn't quite match our app-side types
// (snake_case "cook_time", and "imageURL" instead of "imageUrl") — that
// translation happens here, once, rather than in every caller.
interface GenerateRecipeResponseBody {
  name: string;
  ingredients: string;
  instructions: string;
  cuisine: string;
  cook_time: string;
  servings: string;
  description: string;
  imageURL: string;
}

export async function generateRecipe(
  request: GenerateRecipeRequest,
): Promise<GeneratedRecipe> {
  const body = await apiFetch<GenerateRecipeResponseBody>(
    "/api/recipe/generate",
    asJsonRequest("POST", request),
  );
  return {
    name: body.name,
    ingredients: body.ingredients,
    instructions: body.instructions,
    cuisine: body.cuisine,
    cookTime: body.cook_time,
    servings: body.servings,
    description: body.description,
    imageUrl: body.imageURL,
  };
}

export function saveRecipe(recipe: GeneratedRecipe): Promise<SavedRecipe> {
  return apiFetch(
    "/api/recipes",
    asJsonRequest("POST", {
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      description: recipe.description,
      cuisine: recipe.cuisine,
      servings: recipe.servings,
      cookTime: recipe.cookTime,
      imageURL: recipe.imageUrl,
    }),
  );
}

export function deleteRecipe(id: number): Promise<void> {
  return apiFetch(`/api/recipes/${id}`, { method: "DELETE" });
}
