import React, { useState } from 'react';
import { Dish, DishHotspot } from '../../types';
import { FloatingDish3D } from '../FloatingDish3D';
import { VegBadge } from '../common/VegBadge';
import { NutritionMacroChart } from '../common/NutritionMacroChart';

interface DishDetailScreenProps {
  dish: Dish;
  onAddToCart: (dish: Dish) => void;
  onCustomize: (dish: Dish) => void;
  onBack: () => void;
  onOpenAiAssistant?: (prompt?: string) => void;
}

export const DishDetailScreen: React.FC<DishDetailScreenProps> = ({
  dish,
  onAddToCart,
  onCustomize,
  onBack,
  onOpenAiAssistant
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<DishHotspot | null>(
    dish.hotspots?.[0] || null
  );

  const isVeg = dish.badgeType === 'veg' || dish.tags.includes('PURE VEG');

  return (
    <div className="min-h-screen pb-32 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-5">
      {/* 3D Levitating Stage Card */}
      <div className="relative rounded-3xl p-5 bg-[#10182A] border border-[#63e6ff]/30 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-[#060914] border border-white/10 text-white flex items-center justify-center cursor-pointer hover:border-[#63e6ff]/40"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            <VegBadge isVeg={isVeg} size="sm" />
            {dish.isBestseller && (
              <span className="text-[9px] font-space font-extrabold px-1.5 py-0.5 rounded bg-[#ffd86b]/15 text-[#ffd86b] border border-[#ffd86b]/30">
                ★ BESTSELLER
              </span>
            )}
            <span className="text-[10px] font-space font-extrabold text-[#63e6ff] uppercase tracking-wider">
              {dish.restaurantName}
            </span>
          </div>
        </div>

        {/* 3D Levitating Model Component */}
        <div className="relative my-1 flex items-center justify-center">
          <FloatingDish3D
            imageUrl={dish.imageUrl}
            imageAlt={dish.name}
            heightClass="h-[250px]"
            hotspots={dish.hotspots}
            onSelectHotspot={(hotspot) => setSelectedHotspot(hotspot)}
          />
        </div>

        {/* Selected Hotspot Detail Radar */}
        {selectedHotspot && (
          <div className="mt-2 p-3 rounded-2xl bg-[#060914]/90 border border-[#63e6ff]/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#63e6ff]/20 text-[#63e6ff] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">biotech</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F5F8FF] font-space">
                  {selectedHotspot.title}
                </span>
                <span className="text-[9px] font-space font-bold px-1.5 py-0.5 rounded bg-[#ffd86b]/20 text-[#ffd86b]">
                  {selectedHotspot.icon || 'AUTHENTIC DUM'}
                </span>
              </div>
              <p className="text-[10px] text-[#869396] mt-0.5 leading-snug">
                {selectedHotspot.subtitle}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dish Name & Metadata */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-[#F5F8FF] font-space tracking-tight">
              {dish.name}
            </h2>
            <p className="text-xs text-[#869396] mt-1">{dish.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-xl font-extrabold text-[#ffd86b] font-space tabular-nums">
              ₹{dish.price}
            </span>
            <div className="text-[10px] font-space text-[#75f5a6]">Tax Inclusive</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {dish.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-space font-bold px-2 py-0.5 rounded-full bg-[#181B27] border border-white/10 text-[#63e6ff] uppercase"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Macro HUD Breakdown */}
      <div className="p-4 rounded-2xl bg-[#10182A]/70 border border-white/5 space-y-3">
        <span className="text-xs font-bold text-[#F5F8FF] font-space tracking-wider uppercase flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-[#75f5a6]">monitor_heart</span>
          NUTRITIONAL TELEMETRY MATRIX
        </span>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-xl bg-[#060914] border border-white/5">
            <div className="text-[9px] font-space text-[#869396] uppercase">Energy</div>
            <div className="text-sm font-bold text-[#63e6ff] font-space tabular-nums">{dish.calories}</div>
            <div className="text-[9px] text-[#869396]">kcal</div>
          </div>
          <div className="p-2 rounded-xl bg-[#060914] border border-white/5">
            <div className="text-[9px] font-space text-[#869396] uppercase">Protein</div>
            <div className="text-sm font-bold text-[#75f5a6] font-space tabular-nums">{dish.protein}g</div>
            <div className="text-[9px] text-[#75f5a6]">Bio-Active</div>
          </div>
          <div className="p-2 rounded-xl bg-[#060914] border border-white/5">
            <div className="text-[9px] font-space text-[#869396] uppercase">Carbs</div>
            <div className="text-sm font-bold text-[#ffd86b] font-space tabular-nums">{dish.carbs}g</div>
            <div className="text-[9px] text-[#869396]">Basmati</div>
          </div>
          <div className="p-2 rounded-xl bg-[#060914] border border-white/5">
            <div className="text-[9px] font-space text-[#869396] uppercase">Lipids</div>
            <div className="text-sm font-bold text-[#ff6b7a] font-space tabular-nums">{dish.fat}g</div>
            <div className="text-[9px] text-[#869396]">Pure Ghee</div>
          </div>
        </div>

        {/* AI Query Chip */}
        {onOpenAiAssistant && (
          <button
            onClick={() => onOpenAiAssistant(`What is the nutritional verification for ${dish.name}?`)}
            className="w-full py-2 px-3 rounded-xl bg-[#181B27] border border-[#63e6ff]/30 text-xs font-space text-[#63e6ff] flex items-center justify-between hover:bg-[#63e6ff]/10 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              Ask AI about {dish.name} ingredients & macros
            </span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        )}
      </div>

      {/* Recharts Nutrition Macro Breakdown vs Daily Intake */}
      <NutritionMacroChart
        calories={dish.calories}
        protein={dish.protein}
        fat={dish.fat}
        carbs={dish.carbs}
        dishName={dish.name}
      />

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-16 inset-x-0 p-4 bg-[#10182A]/90 backdrop-blur-xl border-t border-white/10 max-w-[480px] mx-auto flex items-center gap-3 z-40">
        <button
          onClick={() => onCustomize(dish)}
          className="flex-1 py-3 px-4 rounded-xl bg-[#181B27] border border-[#63e6ff]/40 text-[#63e6ff] hover:bg-[#63e6ff] hover:text-black font-space font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          CUSTOMIZE
        </button>
        <button
          onClick={() => onAddToCart(dish)}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ba027b] to-[#63e6ff] text-black font-space font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
          ADD TO CART (₹{dish.price})
        </button>
      </div>
    </div>
  );
};
