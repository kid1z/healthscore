import { CheckCircle } from "lucide-react";

export function NoSuggestions() {
  return (
    <div className="flex items-center justify-center rounded-xl bg-white p-8 text-gray-600 shadow-sm">
      <CheckCircle className="mr-2 text-green-500" />
      <p>No emergency tips. Everything is stable!</p>
    </div>
  );
}
