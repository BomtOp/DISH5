import React from 'react';

interface VegBadgeProps {
  isVeg?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VegBadge: React.FC<VegBadgeProps> = ({
  isVeg = false,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5 p-[2px]',
    md: 'w-4 h-4 p-[2.5px]',
    lg: 'w-5 h-5 p-[3px]'
  };

  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  if (isVeg) {
    return (
      <span
        title="Pure Vegetarian"
        className={`inline-flex items-center justify-center rounded-[4px] border-[1.5px] border-[#60B246] bg-[#60B246]/10 flex-shrink-0 ${sizeClasses[size]} ${className}`}
      >
        <span className={`rounded-full bg-[#60B246] ${dotSize[size]}`} />
      </span>
    );
  }

  return (
    <span
      title="Non-Vegetarian"
      className={`inline-flex items-center justify-center rounded-[4px] border-[1.5px] border-[#E23744] bg-[#E23744]/10 flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <span
        className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-[#E23744]"
      />
    </span>
  );
};
