import React from 'react';

export type DietaryOption =
  | 'ALL'
  | 'HIGH_PROTEIN'
  | 'KETO'
  | 'VEGAN'
  | 'PURE_VEG'
  | 'GLUTEN_FREE'
  | 'LOW_CAL';

export interface DietaryFilterItem {
  id: DietaryOption;
  label: string;
  shortLabel: string;
  icon: string;
  badgeColor: string;
  activeColor: string;
}

export const DIETARY_FILTERS: DietaryFilterItem[] = [
  {
    id: 'ALL',
    label: 'All Dishes',
    shortLabel: 'ALL',
    icon: 'restaurant_menu',
    badgeColor: '#F5F8FF',
    activeColor: '#63e6ff'
  },
  {
    id: 'HIGH_PROTEIN',
    label: 'High-Protein (30g+)',
    shortLabel: '💪 30g+ PROTEIN',
    icon: 'fitness_center',
    badgeColor: '#75f5a6',
    activeColor: '#75f5a6'
  },
  {
    id: 'KETO',
    label: 'Keto / Low-Carb (<25g C)',
    shortLabel: '🥑 KETO',
    icon: 'nutrition',
    badgeColor: '#ffd86b',
    activeColor: '#ffd86b'
  },
  {
    id: 'VEGAN',
    label: 'Vegan / 100% Plant',
    shortLabel: '🌿 VEGAN',
    icon: 'eco',
    badgeColor: '#7bfbac',
    activeColor: '#7bfbac'
  },
  {
    id: 'PURE_VEG',
    label: 'Pure Vegetarian',
    shortLabel: '🟢 PURE VEG',
    icon: 'spa',
    badgeColor: '#60B246',
    activeColor: '#60B246'
  },
  {
    id: 'GLUTEN_FREE',
    label: 'Gluten-Free Grain',
    shortLabel: '🌾 GLUTEN-FREE',
    icon: 'grass',
    badgeColor: '#ff9e2c',
    activeColor: '#ff9e2c'
  },
  {
    id: 'LOW_CAL',
    label: 'Low-Calorie (<500 kcal)',
    shortLabel: '⚡ <500 KCAL',
    icon: 'bolt',
    badgeColor: '#ff4fb3',
    activeColor: '#ff4fb3'
  }
];

export function matchesDietaryFilter(dish: any, filter: DietaryOption): boolean {
  if (filter === 'ALL') return true;

  const isVeg =
    dish.isVeg === true ||
    dish.badgeType === 'veg' ||
    dish.tags?.some((t: string) => t.toUpperCase().includes('VEG') && !t.toUpperCase().includes('NON'));

  const nameLower = (dish.name || '').toLowerCase();
  const descLower = (dish.description || '').toLowerCase();
  const tagsUpper = (dish.tags || []).map((t: string) => t.toUpperCase());

  if (filter === 'HIGH_PROTEIN') {
    return dish.protein >= 30 || tagsUpper.includes('HIGH PROTEIN') || tagsUpper.includes('PROTEIN');
  }

  if (filter === 'KETO') {
    // Low carb, moderate to high fat
    return (
      (dish.carbs <= 28 && dish.fat >= 12) ||
      tagsUpper.includes('KETO') ||
      tagsUpper.includes('LOW CARB') ||
      nameLower.includes('kebab') ||
      nameLower.includes('tikka') ||
      nameLower.includes('tandoori') ||
      nameLower.includes('pathar ka gosht')
    );
  }

  if (filter === 'VEGAN') {
    if (!isVeg) return false;
    // Exclude dairy items like paneer, butter, ghee, curd, raita, khoya, malai, chai with milk
    const hasDairy =
      nameLower.includes('paneer') ||
      nameLower.includes('butter') ||
      nameLower.includes('ghee') ||
      nameLower.includes('curd') ||
      nameLower.includes('raita') ||
      nameLower.includes('khoya') ||
      nameLower.includes('malai') ||
      nameLower.includes('cream') ||
      nameLower.includes('chai') ||
      nameLower.includes('lassi') ||
      nameLower.includes('meetha') ||
      descLower.includes('butter') ||
      descLower.includes('paneer') ||
      descLower.includes('cream');
    return !hasDairy || tagsUpper.includes('VEGAN') || tagsUpper.includes('PLANT-BASED');
  }

  if (filter === 'PURE_VEG') {
    return isVeg;
  }

  if (filter === 'GLUTEN_FREE') {
    // Rice based, lentils, kebabs without wheat flour
    const hasGluten =
      nameLower.includes('naan') ||
      nameLower.includes('roti') ||
      nameLower.includes('rumali') ||
      nameLower.includes('paratha') ||
      nameLower.includes('luqmi') ||
      nameLower.includes('biscuit') ||
      nameLower.includes('bread') ||
      nameLower.includes('shahi tukda') ||
      nameLower.includes('rusk') ||
      descLower.includes('flour') ||
      descLower.includes('wheat');
    return !hasGluten || tagsUpper.includes('GLUTEN-FREE');
  }

  if (filter === 'LOW_CAL') {
    return dish.calories <= 500;
  }

  return true;
}

interface DietaryFilterBarProps {
  activeFilter: DietaryOption;
  onSelectFilter: (filter: DietaryOption) => void;
  resultCount?: number;
  className?: string;
}

export const DietaryFilterBar: React.FC<DietaryFilterBarProps> = ({
  activeFilter,
  onSelectFilter,
  resultCount,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs font-space">
        <span className="text-[10px] font-bold text-[#869396] uppercase tracking-wider flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-[#63e6ff]">tune</span>
          DIETARY PREFERENCES
        </span>
        {resultCount !== undefined && (
          <span className="text-[10px] text-[#ffd86b] font-bold">
            {resultCount} DISHES
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {DIETARY_FILTERS.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-space font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm ${
                isActive
                  ? 'bg-[#181B27] text-white shadow-lg'
                  : 'bg-[#10182A] text-[#869396] hover:text-[#F5F8FF] border-white/5'
              }`}
              style={{
                borderColor: isActive ? f.activeColor : undefined,
                color: isActive ? f.activeColor : undefined,
                boxShadow: isActive ? `0 0 12px ${f.activeColor}40` : undefined
              }}
            >
              <span>{f.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
