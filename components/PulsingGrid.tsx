"use client";

import { useEffect, useState, ReactNode, useMemo } from "react";
import clsx from "clsx";

const GRID_ROWS = 12;
const GRID_COLS = 32;

interface PulsingGridProps {
  children?: ReactNode;
  /** Animation speed in milliseconds (default: 300) */
  animationSpeed?: number;
  /** Probability of a cell being active on each tick (default: 0.05) */
  pulseChance?: number;
  /** Custom grid dimensions */
  rows?: number;
  cols?: number;
  /** Grid cell size (default: 12px) */
  cellSize?: number;
  /** Gap between cells (default: 6px) */
  gap?: number;
  /** Disable animation */
  paused?: boolean;
}

export default function PulsingGrid({ 
  children,
  animationSpeed = 300,
  pulseChance = 0.05,
  rows = GRID_ROWS,
  cols = GRID_COLS,
  cellSize = 12,
  gap = 6,
  paused = false
}: PulsingGridProps) {
  const [activeMap, setActiveMap] = useState<boolean[][]>(() =>
    Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false))
  );

  const gridStyle = useMemo(() => ({
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: `${gap}px`,
  }), [cols, gap]);

  const cellStyle = useMemo(() => ({
    width: `${cellSize}px`,
    height: `${cellSize}px`,
  }), [cellSize]);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setActiveMap((prev) =>
        prev.map((row) => 
          row.map(() => Math.random() < pulseChance)
        )
      );
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [animationSpeed, pulseChance, paused]);

  // Reset grid when dimensions change
  useEffect(() => {
    setActiveMap(
      Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(false))
    );
  }, [rows, cols]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-60">
        <div
          className="grid"
          style={gridStyle}
          role="presentation"
          aria-hidden="true"
        >
          {activeMap.map((row, rowIndex) =>
            row.map((active, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={clsx(
                  "rounded-sm transition-all duration-500 ease-out",
                  // Enhanced light/dark mode support with better contrast
                  active
                    ? [
                        // Light mode - active state
                        "bg-slate-400/30 shadow-sm",
                        // Dark mode - active state  
                        "dark:bg-slate-300/25 dark:shadow-slate-400/20"
                      ]
                    : [
                        // Light mode - inactive state
                        "bg-slate-300/15",
                        // Dark mode - inactive state
                        "dark:bg-slate-500/10"
                      ]
                )}
                style={cellStyle}
              />
            ))
          )}
        </div>
      </div>

      {/* Subtle overlay gradient for depth */}
      <div 
        className="pointer-events-none absolute inset-0 z-5 bg-gradient-to-br from-transparent via-transparent to-white/5 dark:to-black/10"
        aria-hidden="true"
      />

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}