import React, { useState } from 'react';
import { Dish } from '../../types';

interface QuickAddButtonProps {
  dish: Dish;
  onAddToCart: (dish: Dish) => void;
  variant?: 'fab' | 'pill' | 'mini-fab';
  className?: string;
  onAddedFeedback?: (dishName: string) => void;
}

export const QuickAddButton: React.FC<QuickAddButtonProps> = ({
  dish,
  onAddToCart,
  variant = 'fab',
  className = '',
  onAddedFeedback
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(dish);
    setJustAdded(true);
    if (onAddedFeedback) {
      onAddedFeedback(dish.name);
    }
    setTimeout(() => {
      setJustAdded(false);
    }, 1200);
  };

  if (variant === 'mini-fab') {
    return (
      <button
        onClick={handleClick}
        title={`Quick Add ${dish.name}`}
        className={`w-8 h-8 rounded-full bg-gradient-to-tr from-[#FC8019] via-[#ba027b] to-[#63e6ff] text-white flex items-center justify-center shadow-lg shadow-[#FC8019]/40 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer z-10 border border-white/20 group/fab ${
          justAdded ? 'scale-110 !from-[#60B246] !to-[#75f5a6]' : ''
        } ${className}`}
      >
        {justAdded ? (
          <span className="material-symbols-outlined text-[16px] text-black font-bold animate-in zoom-in">
            check
          </span>
        ) : (
          <span className="material-symbols-outlined text-[18px] text-black font-extrabold group-hover/fab:rotate-90 transition-transform">
            add
          </span>
        )}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        onClick={handleClick}
        title={`Quick Add ${dish.name}`}
        className={`px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FC8019] via-[#ba027b] to-[#63e6ff] text-black font-space text-[10px] font-black uppercase tracking-wider shadow-lg shadow-[#FC8019]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer border border-white/10 ${
          justAdded ? '!from-[#60B246] !to-[#75f5a6]' : ''
        } ${className}`}
      >
        {justAdded ? (
          <>
            <span className="material-symbols-outlined text-[14px]">check</span>
            <span>ADDED</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[14px]">add</span>
            <span>QUICK ADD</span>
          </>
        )}
      </button>
    );
  }

  // Default 'fab' variant: Floating Action Button with icon and live badge
  return (
    <button
      onClick={handleClick}
      title={`Quick Add ${dish.name}`}
      className={`h-7 px-2.5 rounded-full bg-gradient-to-r from-[#FC8019] via-[#ba027b] to-[#63e6ff] text-black font-space font-extrabold text-[10px] uppercase flex items-center justify-center gap-1 shadow-md shadow-[#FC8019]/30 hover:shadow-lg hover:shadow-[#63e6ff]/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20 z-10 ${
        justAdded ? '!from-[#60B246] !to-[#75f5a6]' : ''
      } ${className}`}
    >
      {justAdded ? (
        <>
          <span className="material-symbols-outlined text-[14px] text-black font-bold animate-in zoom-in">
            check
          </span>
          <span className="text-[9px] font-black tracking-wide">ADDED</span>
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[15px] text-black font-black">
            add
          </span>
          <span className="tracking-wide">QUICK ADD</span>
        </>
      )}
    </button>
  );
};
