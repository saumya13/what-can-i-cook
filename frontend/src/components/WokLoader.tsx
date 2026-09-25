// A wok whose lid lifts open, lets steam curl out, then settles shut again.
// Purely decorative — pair it with a `role="status"`/`aria-live` wrapper and
// visible caption for a11y. Keyframes live in index.css (wok-lid, wok-steam).
export default function WokLoader() {
  return (
    <svg
      viewBox="0 0 160 120"
      className="h-24 w-32"
      fill="none"
      aria-hidden="true"
    >
      {/* Steam */}
      {[
        { d: "M58 56 q-7 -9 0 -18 t0 -18", delay: "0s" },
        { d: "M80 54 q-7 -9 0 -18 t0 -18", delay: "0.35s" },
        { d: "M102 56 q-7 -9 0 -18 t0 -18", delay: "0.7s" },
      ].map((wisp) => (
        <path
          key={wisp.d}
          d={wisp.d}
          stroke="#f97316"
          strokeOpacity="0.55"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="wok-steam"
          style={{ animationDelay: wisp.delay }}
        />
      ))}

      {/* Handles */}
      <path
        d="M32 72 L6 62"
        stroke="#8a5a3c"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M128 72 L140 70"
        stroke="#8a5a3c"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Wok body */}
      <path d="M26 64 Q26 106 80 106 Q134 106 134 64 Z" fill="#44403c" />
      <path
        d="M40 84 Q48 98 66 101"
        stroke="#78716c"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <ellipse cx="80" cy="64" rx="54" ry="7" fill="#57534e" />
      <ellipse cx="80" cy="64" rx="49" ry="4.5" fill="#f97316" opacity="0.35" />

      {/* Lid — hinged on the right so it swings open from the left */}
      <g className="wok-lid">
        <path d="M32 62 Q80 14 128 62 Z" fill="#d6d3d1" />
        <path
          d="M46 56 Q64 32 88 26"
          stroke="#fafaf9"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        <rect x="32" y="60" width="96" height="4" rx="2" fill="#a8a29e" />
        <circle cx="80" cy="35" r="5" fill="#8a5a3c" />
      </g>
    </svg>
  );
}
