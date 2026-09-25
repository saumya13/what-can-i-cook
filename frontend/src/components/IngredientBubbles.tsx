import type { CSSProperties } from "react";

interface Bubble {
  emoji: string;
  size: number;
  // 0–1 position inside the gutter, measured on the bubble's own top-left
  // after accounting for its size, so it can never poke outside the gutter.
  x: number;
  y: number;
  tint: "orange" | "green";
}

const EMOJIS = [
  "🍅", "🥕", "🥑", "🧅", "🥦", "🍓", "🍋", "🌶️", "🥬", "🌽", "🍆",
  "🧄", "🍌", "🥔", "🍎", "🍇", "🥒", "🍑", "🫑", "🍍", "🥝", "🍊", "🍒",
  "🧀", "🥚", "🍞", "🥩", "🫐", "🍐",
];

// Small deterministic PRNG so the scatter looks random but is identical on
// every render and reload.
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Nominal gutter proportions used only to keep bubbles from overlapping.
const NOMINAL_W = 320;
const NOMINAL_H = 720;

function scatter(count: number, seed: number, emojis: string[]): Bubble[] {
  const rand = mulberry32(seed);
  const points: { x: number; y: number }[] = [];
  let minDist = 130;
  while (points.length < count) {
    let placed = false;
    for (let attempt = 0; attempt < 60 && !placed; attempt++) {
      const x = rand();
      const y = rand();
      const clear = points.every(
        (p) =>
          Math.hypot((p.x - x) * NOMINAL_W, (p.y - y) * NOMINAL_H) >= minDist,
      );
      if (clear) {
        points.push({ x, y });
        placed = true;
      }
    }
    // Crowded — relax the spacing rather than looping forever.
    if (!placed) minDist *= 0.92;
  }
  return points.map((point, i) => ({
    ...point,
    emoji: emojis[i % emojis.length],
    size: Math.round(46 + rand() * 24),
    tint: rand() < 0.5 ? "orange" : "green",
  }));
}

// Different counts and seeds per side so the two gutters don't mirror or line
// up in tidy rows.
const SHUFFLED = shuffle(EMOJIS, mulberry32(7));
const LEFT_BUBBLES = scatter(7, 21, SHUFFLED.slice(0, 14));
const RIGHT_BUBBLES = scatter(6, 84, SHUFFLED.slice(14));

const TINTS: Record<Bubble["tint"], { glow: string; ring: string }> = {
  orange: {
    glow: "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.95), rgba(255,255,255,0.35) 42%, rgba(234,88,12,0.18) 100%)",
    ring: "rgba(234,88,12,0.18)",
  },
  green: {
    glow: "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.95), rgba(255,255,255,0.35) 42%, rgba(167,196,146,0.35) 100%)",
    ring: "rgba(127,169,104,0.3)",
  },
};

type BubbleStyle = CSSProperties & {
  "--float-x"?: string;
  "--float-y"?: string;
  "--bubble-duration"?: string;
  "--bubble-delay"?: string;
};

function renderBubbles(bubbles: Bubble[], side: "left" | "right", offset: number) {
  return bubbles.map((bubble, i) => {
    const n = i + offset;
    const dir = n % 2 === 0 ? 1 : -1;
    const { glow, ring } = TINTS[bubble.tint];
    // Right-hand bubbles are measured from the outer (right) edge so both
    // gutters stay symmetric about the form.
    const xProp = side === "left" ? "left" : "right";
    const style: BubbleStyle = {
      top: `calc((100% - ${bubble.size}px) * ${bubble.y.toFixed(3)})`,
      [xProp]: `calc((100% - ${bubble.size}px) * ${bubble.x.toFixed(3)})`,
      width: bubble.size,
      height: bubble.size,
      fontSize: bubble.size * 0.46,
      background: glow,
      boxShadow: `0 10px 24px rgba(0,0,0,0.07), inset 0 2px 5px rgba(255,255,255,0.7), inset 0 -6px 10px ${ring}`,
      "--float-x": `${dir * (8 + (n % 3) * 2)}px`,
      "--float-y": `${-dir * (9 + (n % 4) * 2)}px`,
      "--bubble-duration": `${6.2 + (n % 5) * 0.55}s`,
      "--bubble-delay": `${(n % 6) * 0.35}s`,
    };
    return (
      <span
        key={`${side}-${i}`}
        className="ingredient-bubble pointer-events-auto absolute flex cursor-default items-center justify-center rounded-full border border-white/60 select-none"
        style={style}
      >
        {bubble.emoji}
      </span>
    );
  });
}

// Each gutter spans from the section edge to the form column (max-w-2xl,
// 42rem), minus a margin on the outer edge (2rem) and next to the form
// (4rem) so bubbles never hug either.
const GUTTER = "w-[calc((100%-42rem)/2-6rem)]";

export default function IngredientBubbles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 hidden xl:block"
      aria-hidden="true"
    >
      <div className={`absolute inset-y-12 left-8 ${GUTTER}`}>
        {renderBubbles(LEFT_BUBBLES, "left", 0)}
      </div>
      <div className={`absolute inset-y-12 right-8 ${GUTTER}`}>
        {renderBubbles(RIGHT_BUBBLES, "right", LEFT_BUBBLES.length)}
      </div>
    </div>
  );
}
