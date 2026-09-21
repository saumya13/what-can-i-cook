import type { ParsedRecipe } from "../types";

export class RecipeParseError extends Error {}

// Maps our field names to the JSON keys the AI is asked for (see
// prompts.ts) — only "cookTime" differs, from "cook_time".
const AI_KEY_BY_FIELD: Record<keyof ParsedRecipe, string> = {
  name: "name",
  ingredients: "ingredients",
  instructions: "instructions",
  description: "description",
  cuisine: "cuisine",
  cookTime: "cook_time",
  servings: "servings",
  imagePrompt: "imagePrompt",
};

// Some free-tier models over-escape their JSON string values, leaving
// literal "\n" (backslash + n) instead of real line breaks.
function fixEscapedNewlines(value: string): string {
  return value.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
}

// Some free-tier models append stray text before/after the JSON object, or
// wrap it in a ```json fence. Strip both so JSON.parse doesn't choke.
function extractJsonObject(rawContent: string): string {
  const fenceStripped = rawContent
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "");

  const firstBrace = fenceStripped.indexOf("{");
  const lastBrace = fenceStripped.lastIndexOf("}");
  return firstBrace !== -1 && lastBrace > firstBrace
    ? fenceStripped.slice(firstBrace, lastBrace + 1)
    : fenceStripped;
}

export function parseRecipeResponse(rawContent: string): ParsedRecipe {
  const jsonText = extractJsonObject(rawContent);

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    throw new RecipeParseError(
      `AI response was not valid JSON: ${jsonText}`,
      { cause: err },
    );
  }

  const result = {} as ParsedRecipe;
  for (const field of Object.keys(AI_KEY_BY_FIELD) as (keyof ParsedRecipe)[]) {
    const aiKey = AI_KEY_BY_FIELD[field];
    const value = parsed[aiKey];
    if (typeof value !== "string") {
      throw new RecipeParseError(
        `AI response is missing string field "${aiKey}": ${jsonText}`,
      );
    }
    result[field] = fixEscapedNewlines(value);
  }
  return result;
}
