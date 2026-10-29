import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs text-[#795A63] ${className}`}>
      <button
        onClick={() => onNavigate('/')}
        className="hover:text-[#9F2343] transition-colors flex items-center gap-1 cursor-pointer"
        aria-label="Home"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </button>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-[#E88AA4] shrink-0" />
            {isLast || !item.path ? (
              <span className="font-semibold text-[#3B2028] truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => onNavigate(item.path!)}
                className="hover:text-[#9F2343] transition-colors cursor-pointer truncate max-w-[150px] sm:max-w-none"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
