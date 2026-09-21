import { pgTable, text, bigint } from "drizzle-orm/pg-core";

export const recipes = pgTable("recipes", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity(),

  name: text("name").notNull(),
  ingredients: text("ingredients").notNull(),
  instructions: text("instructions").notNull(),
  description: text("description"),
  cuisine: text("cuisine"),
  servings: bigint("servings", { mode: "number" }),
  cookTime: text("cook_time"),
  imageUrl: text("image_url"),
});
