interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}

export function CardContainer({
  children,
  className = "",
  highlight = false,
}: CardContainerProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 ease-in-out dark:border-neutral-700 dark:bg-neutral-800 ${highlight ? "scale-105" : ""} hover:scale-105 hover:shadow-2xl hover:shadow-blue-400/20 dark:hover:shadow-blue-500/10 ${className} `}
    >
      {children}
    </div>
  );
}
