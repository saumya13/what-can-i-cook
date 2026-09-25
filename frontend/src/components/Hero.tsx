import { useEffect, useState } from "react";
import IngredientBowl from "./IngredientBowl";

const ROTATING_WORDS = ["INGREDIENTS.", "AI CHEF.", "NEXT MEAL."];
const ROTATE_INTERVAL_MS = 2200;

function scrollToId(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col items-center gap-12 px-6 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
      <div className="flex w-full max-w-xl flex-col items-start gap-6 text-left">
        <span className="font-mono text-sm tracking-[0.2em] text-gray-900">
          YOUR{" "}
          <span
            key={index}
            className="inline-block text-orange-600 [animation:word-fade_0.4s_ease-out]"
          >
            {ROTATING_WORDS[index]}
          </span>
        </span>
        <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight text-gray-900 sm:text-6xl">
          Create delicious recipes
        </h1>
        <p
          className="max-w-lg text-lg font-thin"
          style={{ lineHeight: 1.5, color: "#666666" }}
        >
          Not sure what to cook? Tell me what ingredients you have, and I’ll
          turn them into a delicious recipe.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => scrollToId("search-section")}
            className="h-14 rounded-md bg-orange-600 px-10 text-lg font-medium text-white hover:bg-orange-700"
          >
            Start Cooking
          </button>
          <button
            type="button"
            onClick={() => scrollToId("recipes-section")}
            className="h-14 rounded-md border border-orange-600 px-10 text-lg font-medium text-orange-600 hover:bg-orange-50"
          >
            See Recipes
          </button>
        </div>
      </div>

      <IngredientBowl />
    </div>
  );
}
