"use client";

interface LanguageTagProps {
  language: string;
}

export function LanguageTag({ language }: LanguageTagProps) {
  const colorMap: Record<string, string> = {
    TypeScript:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    JavaScript:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    Python:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    Rust: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    Go: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    default:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
        colorMap[language] || colorMap.default
      }`}
    >
      {language}
    </span>
  );
} 