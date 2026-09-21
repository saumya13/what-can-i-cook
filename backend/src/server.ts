import express from "express";
import cors from "cors";
import { config } from "./config";
import { recipesRouter } from "./routes/recipes";
import { generateRecipeRouter } from "./routes/generateRecipe";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/recipes", recipesRouter);
app.use("/api/recipe", generateRecipeRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Running backend on port ${config.port}`);
});
