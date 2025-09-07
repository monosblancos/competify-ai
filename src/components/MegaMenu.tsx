import React from 'react';
import { ChevronDown } from 'lucide-react';

interface MegaMenuProps {
  trigger: string;
  children: React.ReactNode;
  isActive?: boolean;
  onToggle?: () => void;
  badge?: string;
  analytics?: string;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  trigger,
  children,
  isActive = false,
  onToggle,
  badge,
  analytics
}) => {
  return (
    <div className="relative group" onMouseLeave={() => onToggle?.()}>
      <button
        className={`flex items-center gap-1 text-sm hover:text-foreground transition-colors ${
          isActive ? 'text-primary font-medium' : 'text-muted-foreground'
        }`}
        onMouseEnter={() => onToggle?.()}
        data-analytics={analytics}
      >
        <span>{trigger}</span>
        {badge && (
          <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
            {badge}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isActive ? 'rotate-180' : ''}`} />
      </button>

      {/* Mega Menu Content */}
      <div
        className={`absolute left-0 top-full z-50 transition-all duration-200 ${
          isActive
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-2'
        }`}
      >
        <div className="mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};