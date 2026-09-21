export interface RecipePreferences {
  vegetarian: boolean;
  spiceLevel: "mild" | "medium" | "hot";
}

export interface GenerateRecipeRequestBody {
  ingredients: string[];
  preferences: RecipePreferences;
}

export interface ParsedRecipe {
  name: string;
  ingredients: string;
  instructions: string;
  description: string;
  cuisine: string;
  cookTime: string;
  servings: string;
  imagePrompt: string;
}

export interface GeneratedImage {
  b64_json: string;
  media_type?: string;
}

export interface OpenRouterImageResponse {
  data?: GeneratedImage[];
}
