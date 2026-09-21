import { useEffect, useState } from "react";

const ROTATING_WORDS = ["ingredients.", "AI chef.", "next meal."];
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
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col items-center justify-center gap-8 px-6 text-center sm:px-8 font-work-sans">
      <h1 className="font-serif text-4xl leading-tight text-gray-900 sm:whitespace-nowrap sm:text-7xl">
        Your{" "}
        <span
          key={index}
          className="inline-block text-orange-600 [animation:word-fade_0.4s_ease-out]"
        >
          {ROTATING_WORDS[index]}
        </span>
      </h1>
      <p className="max-w-2xl text-xl text-gray-600 sm:text-2xl font-thin">
        Not sure what to cook? Tell me what ingredients you have, and I’ll turn
        them into a delicious recipe.
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => scrollToId("search-section")}
          className="h-14 rounded-md bg-orange-600 px-10 text-lg font-medium text-white hover:bg-orange-700 tracking-wide"
        >
          Start Cooking
        </button>
        <button
          type="button"
          onClick={() => scrollToId("recipes-section")}
          className="h-14 rounded-md border border-orange-600 px-10 text-lg font-medium text-orange-600 hover:bg-orange-50 tracking-wide"
        >
          See Recipes
        </button>
      </div>
    </div>
  );
}
