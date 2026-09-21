import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  openrouter: {
    apiKey: requireEnv("OPENROUTER_API_KEY"),
    recipeModel: "google/gemini-3.8-flash",
    imageModel: "google/gemini-3.1-flash-image",
    imageEndpoint: "https://openrouter.ai/api/v1/images",
    imageGenerationTimeoutMs: 30_000,
  },
  supabase: {
    url: requireEnv("SUPABASE_URL"),
    serviceRoleKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    recipeImageBucket: "recipes",
  },
} as const;
