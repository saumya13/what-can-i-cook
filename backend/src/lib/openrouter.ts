import { OpenRouter } from "@openrouter/sdk";
import { config } from "../config";
import { SYSTEM_PROMPT } from "../prompts";
import type {
  GeneratedImage,
  OpenRouterImageResponse,
  RecipePreferences,
} from "../types";

const client = new OpenRouter({ apiKey: config.openrouter.apiKey });

export class RecipeGenerationError extends Error {}

function buildPreferencesText(preferences: RecipePreferences): string {
  return [
    preferences.vegetarian ? "The recipe must be vegetarian." : "",
    `Spice level: ${preferences.spiceLevel}.`,
  ]
    .filter(Boolean)
    .join(" ");
}

// Calls the recipe LLM and returns its raw text response (still needs
// JSON parsing/cleanup — see recipeParser.ts).
export async function generateRecipeText(
  ingredients: string[],
  preferences: RecipePreferences,
): Promise<string> {
  const prompt =
    SYSTEM_PROMPT +
    " Ingredients: " +
    ingredients.join(",") +
    " Preferences: " +
    buildPreferencesText(preferences);

  let aiResponse;
  try {
    aiResponse = await client.chat.send({
      chatRequest: {
        model: config.openrouter.recipeModel,
        messages: [{ role: "user", content: prompt }],
      },
    });
  } catch (err) {
    throw new RecipeGenerationError("Recipe generation request failed", {
      cause: err,
    });
  }

  if (aiResponse instanceof ReadableStream) {
    throw new RecipeGenerationError(
      "Expected a non-streaming response but got a stream",
    );
  }

  const choice = aiResponse.choices?.[0];
  if (!choice) {
    throw new RecipeGenerationError("AI response had no choices");
  }

  const messageContent = choice.message.content ?? "";
  return typeof messageContent === "string"
    ? messageContent
    : messageContent.map((item) => ("text" in item ? item.text : "")).join("");
}

// Generates an image for the dish. Returns null (rather than throwing) on
// failure, since a missing image shouldn't block returning the recipe text.
export async function generateRecipeImage(
  imagePrompt: string,
): Promise<GeneratedImage | null> {
  const response = await fetch(config.openrouter.imageEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openrouter.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.openrouter.imageModel,
      prompt: imagePrompt,
    }),
    signal: AbortSignal.timeout(config.openrouter.imageGenerationTimeoutMs),
  });

  if (!response.ok) {
    console.error(
      `Image generation failed (${response.status}):`,
      await response.text(),
    );
    return null;
  }

  const result = (await response.json()) as OpenRouterImageResponse;
  const [image] = result.data ?? [];
  if (!image?.b64_json) {
    console.error("Image generation returned no image data:", result);
    return null;
  }
  return image;
}
