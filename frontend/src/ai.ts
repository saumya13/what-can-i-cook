import { GoogleGenAI } from "@google/genai";
import type { RecipeOptions } from "./types";

export default async function getRecipeFromClaude(
  ingredients: string[],
  options: RecipeOptions,
) {
  const key = import.meta.env.VITE_API_KEY_CLAUDE;
  //console.log("key: ", key);

  const SYSTEM_PROMPT = `You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page. Use proper Markdown syntax:
- Use # for the recipe title
- Use ## for major sections
- Use ### for subsections
- Put each heading on its own line
- Put a blank line between headings and paragraphs
- Put each list item on its own line
- Use --- on its own line for separators
- Do not put multiple Markdown elements on the same line`;

  const preferences = [
    options.vegetarian ? "The recipe must be vegetarian." : "",
    `Spice level: ${options.spiceLevel}.`,
  ]
    .filter(Boolean)
    .join(" ");

  const ai = new GoogleGenAI({ apiKey: key });

  const interaction = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents:
      SYSTEM_PROMPT +
      " Ingredients are: " +
      ingredients +
      ". Preferences: " +
      preferences,
  });

  return interaction.text;
}
