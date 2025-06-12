"use client";

import { useEffect, useState, ReactNode } from "react";
import clsx from "clsx";

const GRID_ROWS = 12;
const GRID_COLS = 32;

interface PulsingGridProps {
  children?: ReactNode;
}

export default function PulsingGrid({ children }: PulsingGridProps) {
  const [activeMap, setActiveMap] = useState<boolean[][]>(
    Array(GRID_ROWS)
      .fill(null)
      .map(() => Array(GRID_COLS).fill(false))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMap(prev =>
        prev.map(row => row.map(() => Math.random() < 0.05))
      );
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gap: "6px",
          }}
        >
          {activeMap.map((row, rowIndex) =>
            row.map((active, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={clsx(
                  "w-3 h-3 rounded-sm transition-opacity duration-500",
                  // Tailwind dark mode classes
                  active
                    ? "bg-neutral-300/20 dark:bg-white/20 opacity-40"
                    : "bg-neutral-300/10 dark:bg-white/10 opacity-10"
                )}
              />
            ))
          )}
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
