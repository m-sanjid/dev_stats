interface CardContainerProps {
  
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}

export function CardContainer({ children, className = "", highlight = false }: CardContainerProps) {
  return (
    <div
      className={`
        shadow-lg p-6 rounded-xl 
        border border-slate-200 dark:border-gray-700
        bg-white dark:bg-gray-800
        transition-all duration-300 ease-in-out
        ${highlight ? 'scale-105' : ''}
        hover:shadow-2xl hover:shadow-blue-400/20 dark:hover:shadow-blue-500/10
        hover:scale-105
        ${className}
      `}
    >
      {children}
    </div>
  );
} 