import { Leaf } from "lucide-react";
import type { RecipeOptions } from "../types";

interface PreferencesBarProps {
  options: RecipeOptions;
  onChange: (options: RecipeOptions) => void;
}

const SPICE_OPTIONS: {
  level: RecipeOptions["spiceLevel"];
  label: string;
  chilies: string;
}[] = [
  { level: "mild", label: "Mild", chilies: "🌶" },
  { level: "medium", label: "Medium", chilies: "🌶🌶" },
  { level: "hot", label: "Hot", chilies: "🌶🌶🌶" },
];

export default function PreferencesBar({
  options,
  onChange,
}: PreferencesBarProps) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <label className="flex h-9 items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 hover:border-[#A7C492] hover:bg-[#A7C492]/15">
          <input
            type="checkbox"
            checked={options.vegetarian}
            onChange={(e) =>
              onChange({ ...options, vegetarian: e.target.checked })
            }
            className="h-4 w-4 accent-[#A7C492]"
          />
          <Leaf size={16} className="text-[#6f9a58]" aria-hidden="true" />
          Vegetarian
        </label>

        {SPICE_OPTIONS.map((opt) => {
          const active = options.spiceLevel === opt.level;
          return (
            <button
              key={opt.level}
              type="button"
              onClick={() => onChange({ ...options, spiceLevel: opt.level })}
              aria-pressed={active}
              className={
                active
                  ? "inline-flex h-9 items-center gap-1.5 rounded-xl border border-orange-300 bg-orange-50 px-3 text-sm font-medium text-orange-700"
                  : "inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              }
            >
              <span>{opt.chilies}</span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
