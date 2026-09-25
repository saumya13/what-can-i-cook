import { useEffect, useRef, useState, type CSSProperties } from "react";

interface Ingredient {
  emoji: string;
  size: string;
  idle: { top: string; left: string };
  bowl?: { top: string; left: string };
  duration: number;
  delay: number;
  floatX: string;
  floatY: string;
  floatRotate: string;
}

// Idle positions are hand-jittered off a coarse grid so coverage stays even
// across the panel without looking like a tidy, repeating pattern.
const INGREDIENTS: Ingredient[] = [
  {
    emoji: "🍅",
    size: "text-[2.6rem]",
    idle: { top: "15%", left: "28%" },
    bowl: { top: "62%", left: "23%" },
    duration: 5.5,
    delay: 0,
    floatX: "8px",
    floatY: "-12px",
    floatRotate: "8deg",
  },
  {
    emoji: "🥑",
    size: "text-[2.6rem]",
    idle: { top: "31%", left: "15%" },
    bowl: { top: "58%", left: "37%" },
    duration: 5.8,
    delay: 0.6,
    floatX: "9px",
    floatY: "8px",
    floatRotate: "7deg",
  },
  {
    emoji: "🥒",
    size: "text-5xl",
    idle: { top: "65%", left: "16%" },
    bowl: { top: "68%", left: "45%" },
    duration: 6.2,
    delay: 0.4,
    floatX: "-7px",
    floatY: "-9px",
    floatRotate: "-6deg",
  },
  {
    emoji: "🧅",
    size: "text-[2.6rem]",
    idle: { top: "49%", left: "31%" },
    bowl: { top: "72%", left: "27%" },
    duration: 6.4,
    delay: 0.9,
    floatX: "-8px",
    floatY: "9px",
    floatRotate: "-5deg",
  },
  {
    emoji: "🥕",
    size: "text-5xl",
    idle: { top: "67%", left: "42%" },
    bowl: { top: "66%", left: "39%" },
    duration: 5.6,
    delay: 1.1,
    floatX: "9px",
    floatY: "-7px",
    floatRotate: "6deg",
  },
  {
    emoji: "🥦",
    size: "text-[2.6rem]",
    idle: { top: "81%", left: "27%" },
    bowl: { top: "78%", left: "33%" },
    duration: 6.7,
    delay: 0.45,
    floatX: "-6px",
    floatY: "-11px",
    floatRotate: "-6deg",
  },
  // Background ingredients — float around but never join the bowl.
  {
    emoji: "🍋",
    size: "text-5xl",
    idle: { top: "14%", left: "57%" },
    duration: 5,
    delay: 0.8,
    floatX: "6px",
    floatY: "10px",
    floatRotate: "10deg",
  },
  {
    emoji: "🥬",
    size: "text-[2.6rem]",
    idle: { top: "31%", left: "71%" },
    duration: 6.8,
    delay: 0.2,
    floatX: "-8px",
    floatY: "-11px",
    floatRotate: "-8deg",
  },
  {
    emoji: "🍓",
    size: "text-5xl",
    idle: { top: "16%", left: "86%" },
    duration: 6,
    delay: 1,
    floatX: "-6px",
    floatY: "12px",
    floatRotate: "-9deg",
  },
  {
    emoji: "🍌",
    size: "text-5xl",
    idle: { top: "48%", left: "87%" },
    duration: 6.5,
    delay: 0.3,
    floatX: "7px",
    floatY: "-9px",
    floatRotate: "5deg",
  },
  {
    emoji: "🌶️",
    size: "text-5xl",
    idle: { top: "65%", left: "71%" },
    duration: 5.3,
    delay: 0.7,
    floatX: "-9px",
    floatY: "10px",
    floatRotate: "-7deg",
  },
  {
    emoji: "🧄",
    size: "text-5xl",
    idle: { top: "81%", left: "55%" },
    duration: 5.9,
    delay: 0.5,
    floatX: "6px",
    floatY: "-8px",
    floatRotate: "9deg",
  },
  {
    emoji: "🌽",
    size: "text-[2.6rem]",
    idle: { top: "50%", left: "56%" },
    duration: 6.1,
    delay: 0.15,
    floatX: "-7px",
    floatY: "-10px",
    floatRotate: "-8deg",
  },
  {
    emoji: "🥝",
    size: "text-5xl",
    idle: { top: "28%", left: "35%" },
    duration: 5.4,
    delay: 0.65,
    floatX: "8px",
    floatY: "9px",
    floatRotate: "7deg",
  },
  {
    emoji: "🥚",
    size: "text-5xl",
    idle: { top: "80%", left: "80%" },
    duration: 5.7,
    delay: 0.35,
    floatX: "7px",
    floatY: "-10px",
    floatRotate: "-7deg",
  },
];

const RECIPES = [
  { emoji: "🍝", label: "Date Night Pasta" },
  { emoji: "🥗", label: "Farmers' Market Salad" },
  { emoji: "🍛", label: "Cozy Sunday Curry" },
  { emoji: "🍜", label: "Midnight Noodle Soup" },
  { emoji: "🌮", label: "Taco Tuesday" },
  { emoji: "🍕", label: "Friday Night Pizza" },
  { emoji: "🥘", label: "One-pan Wonder" },
  { emoji: "🍲", label: "Grandma's Comfort Stew" },
  { emoji: "🍣", label: "Sushi Night-In" },
  { emoji: "🥪", label: "Better-than-takeout Lunch" },
];

const CONVERGE_DELAY_STEP = 0.08;
const CONVERGE_DURATION = 1.3;
const CYCLE_INTERVAL_MS = 1300;

type Phase = "idle" | "assembled" | "cycling";

function nextRecipeIndex(current: number) {
  if (RECIPES.length <= 1) return 0;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * RECIPES.length);
  }
  return next;
}

type FloatStyle = CSSProperties & {
  "--float-x"?: string;
  "--float-y"?: string;
  "--float-rot"?: string;
};

function ingredientStyle(
  item: Ingredient,
  phase: Phase,
  staggerIndex: number,
): FloatStyle {
  if (item.bowl && phase !== "idle") {
    const delay = staggerIndex * CONVERGE_DELAY_STEP;
    return {
      top: item.bowl.top,
      left: item.bowl.left,
      transform: "translate(-50%, -50%) scale(0.8)",
      transition: `top ${CONVERGE_DURATION}s cubic-bezier(0.22,1,0.36,1) ${delay}s, left ${CONVERGE_DURATION}s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 1s ease ${delay}s`,
      animation: "none",
    };
  }
  return {
    top: item.idle.top,
    left: item.idle.left,
    transition: "top 1.2s ease, left 1.2s ease",
    animation: `ingredient-float ${item.duration}s ease-in-out infinite`,
    animationDelay: `${item.delay}s`,
    "--float-x": item.floatX,
    "--float-y": item.floatY,
    "--float-rot": item.floatRotate,
  };
}

export default function IngredientBowl() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [recipeIndex, setRecipeIndex] = useState(0);
  const cycleTimer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    return () => clearInterval(cycleTimer.current);
  }, []);

  function handleMouseEnter() {
    if (phase === "idle") setPhase("assembled");
  }

  function handleClick() {
    clearInterval(cycleTimer.current);
    setRecipeIndex((prev) => nextRecipeIndex(prev));
    setPhase("cycling");
    cycleTimer.current = setInterval(() => {
      setRecipeIndex((prev) => nextRecipeIndex(prev));
    }, CYCLE_INTERVAL_MS);
  }

  function handleMouseLeave() {
    clearInterval(cycleTimer.current);
    setPhase("idle");
  }

  const recipe = RECIPES[recipeIndex];
  let assembleIndex = 0;

  return (
    <div
      className="relative hidden aspect-square w-full max-w-md shrink-0 cursor-pointer overflow-hidden bg-[#A7C492]/20 lg:block"
      style={{ borderRadius: "12rem 3rem 12rem 3rem" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Bowl */}
      <span
        className="absolute text-8xl transition-all duration-700 ease-out"
        style={{
          top: "76%",
          left: "33%",
          transform:
            phase !== "idle"
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -50%) scale(0.7)",
          opacity: phase === "assembled" ? 1 : 0,
          transitionDelay: phase === "assembled" ? "0.9s" : "0s",
        }}
      >
        🥣
      </span>

      {/* Recipe reveal */}
      <span
        className="absolute text-9xl transition-all duration-700 ease-out"
        style={{
          top: "76%",
          left: "33%",
          transform:
            phase === "cycling"
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -50%) scale(0.7)",
          opacity: phase === "cycling" ? 1 : 0,
        }}
      >
        {recipe.emoji}
      </span>

      {INGREDIENTS.map((item, i) => {
        const isAssembler = Boolean(item.bowl);
        const staggerIndex = isAssembler ? assembleIndex++ : 0;
        const dimmed = isAssembler ? phase === "cycling" : phase !== "idle";
        return (
          <span
            key={i}
            className={`absolute select-none transition-opacity duration-500 ${item.size}`}
            style={{
              ...ingredientStyle(item, phase, staggerIndex),
              opacity: dimmed ? (isAssembler ? 0 : 0.35) : 1,
            }}
          >
            {item.emoji}
          </span>
        );
      })}

      {/* Recipe reveal card */}
      <div
        className="absolute flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-md transition-all duration-700 ease-out"
        style={{
          top: "48%",
          left: "33%",
          transform:
            phase === "cycling"
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -50%) scale(0.85)",
          opacity: phase === "cycling" ? 1 : 0,
        }}
      >
        <span className="text-lg">{recipe.emoji}</span>
        {recipe.label}
      </div>

      {/* Hints — first invite the hover, then the click */}
      <span
        className="absolute bottom-6 left-[36%] -translate-x-1/2 whitespace-nowrap font-mono text-xs tracking-[0.15em] text-gray-500 transition-opacity duration-300"
        style={{ opacity: phase === "idle" ? 1 : 0 }}
      >
        HOVER TO ASSEMBLE
      </span>
      <span
        className="absolute bottom-6 left-[36%] -translate-x-1/2 whitespace-nowrap font-mono text-xs tracking-[0.15em] text-gray-500 transition-opacity duration-300"
        style={{ opacity: phase === "assembled" ? 1 : 0 }}
      >
        CLICK TO MAKE A RECIPE
      </span>
    </div>
  );
}
