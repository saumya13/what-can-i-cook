export interface RecipeOptions {
  vegetarian: boolean;
  spiceLevel: "mild" | "medium" | "hot";
}

export const DEFAULT_RECIPE_OPTIONS: RecipeOptions = {
  vegetarian: false,
  spiceLevel: "medium",
};

export interface SavedRecipe {
  id: number;
  name: string;
  description: string;
  ingredients: string;
  instructions: string;
  cuisine: string;
  servings: number;
  cookTime: string;
  imageUrl: string | null;
}

export interface GeneratedRecipe {
  name: string;
  ingredients: string;
  description: string;
  instructions: string;
  cuisine: string;
  cookTime: string;
  servings: string;
  imageURL: string;
}
