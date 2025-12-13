import type { SuggestionCardProps } from "../types";

export function SuggestionCard({
  icon,
  title,
  description,
  accent,
  onClick,
}: SuggestionCardProps) {
  return (
    <button
      className={`flex w-full cursor-pointer items-start rounded-2xl border-l-4 bg-white p-4 text-left shadow-sm transition duration-150 hover:shadow-lg ${accent}`}
      onClick={onClick}
      type="button"
    >
      <div className="mr-3 text-xl">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </button>
  );
}
