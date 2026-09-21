import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

// Storage writes happen only from this trusted backend, so we use the
// service role key (bypasses row-level security) instead of the publishable
// key, which is subject to RLS policies on storage.objects.
const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
);

function extensionForMediaType(mediaType: string): string {
  const subtype = mediaType.split("/")[1] ?? "png";
  return subtype === "jpeg" ? "jpg" : subtype;
}

export async function uploadRecipeImage(
  base64Data: string,
  mediaType: string,
): Promise<string | null> {
  const imageBuffer = Buffer.from(base64Data, "base64");
  const imageName = `${crypto.randomUUID()}.${extensionForMediaType(mediaType)}`;

  const { error } = await supabase.storage
    .from(config.supabase.recipeImageBucket)
    .upload(imageName, imageBuffer, { contentType: mediaType });

  if (error) {
    console.error("Error uploading the image:", error);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(config.supabase.recipeImageBucket)
    .getPublicUrl(imageName);
  return publicUrl;
}

export async function deleteRecipeImage(imageUrl: string): Promise<void> {
  const imageName = imageUrl.split("/").pop();
  if (!imageName) {
    return;
  }

  const { error } = await supabase.storage
    .from(config.supabase.recipeImageBucket)
    .remove([imageName]);

  if (error) {
    console.error("Failed to delete recipe image from storage:", error);
  }
}
