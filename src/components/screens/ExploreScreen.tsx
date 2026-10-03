import React, { useState, useMemo } from 'react';
import { Dish, Restaurant } from '../../types';
import { DISHES, RESTAURANTS } from '../../data/mockData';
import { VegBadge } from '../common/VegBadge';
import { NutritionSummaryBadge } from '../common/NutritionSummaryBadge';
import { DietaryOption, DietaryFilterBar, matchesDietaryFilter } from '../common/DietaryFilterBar';
import { QuickAddButton } from '../common/QuickAddButton';
import { TiltCard } from '../common/TiltCard';

interface ExploreScreenProps {
  onSelectDish: (dish: Dish) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onAddToCart: (dish: Dish) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSelectDish,
  onSelectRestaurant,
  onAddToCart
}) => {
  const [activeDietary, setActiveDietary] = useState<DietaryOption>('ALL');
  const [activeHeritage, setActiveHeritage] = useState<'ALL' | 'DUM' | 'SPICY' | 'TIFFINS' | 'BAKERY'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredDishes = useMemo(() => {
    return DISHES.filter((dish) => {
      // 1. Dietary filter check (Vegan, Keto, High-Protein, Gluten-Free, Pure Veg, Low-Cal)
      if (!matchesDietaryFilter(dish, activeDietary)) return false;

      // 2. Heritage Category check
      if (activeHeritage === 'DUM') {
        return (
          dish.tags.includes('DUM BIRYANI') ||
          dish.tags.includes('GI-TAGGED') ||
          dish.name.toLowerCase().includes('biryani') ||
          dish.name.toLowerCase().includes('haleem')
        );
      }
      if (activeHeritage === 'SPICY') {
        return (
          dish.tags.includes('SPICY MATRIX') ||
          dish.tags.includes('DECCAN SPICE') ||
          dish.name.toLowerCase().includes('guntur') ||
          dish.name.toLowerCase().includes('mirchi')
        );
      }
      if (activeHeritage === 'TIFFINS') {
        return (
          dish.name.toLowerCase().includes('idli') ||
          dish.name.toLowerCase().includes('dosa') ||
          dish.name.toLowerCase().includes('vada') ||
          dish.name.toLowerCase().includes('upma')
        );
      }
      if (activeHeritage === 'BAKERY') {
        return (
          dish.name.toLowerCase().includes('chai') ||
          dish.name.toLowerCase().includes('biscuit') ||
          dish.name.toLowerCase().includes('meetha') ||
          dish.name.toLowerCase().includes('cake')
        );
      }

      return true;
    });
  }, [activeDietary, activeHeritage]);

  const handleAddWithFeedback = (dish: Dish, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(dish);
    setToastMessage(`Added "${dish.name}" to Dock`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="min-h-screen pb-28 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#10182A] border border-[#63e6ff] text-[#F5F8FF] px-4 py-2 rounded-xl shadow-2xl font-space text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[16px] text-[#75f5a6]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-[#F5F8FF] font-space tracking-tight">
          DECCANI CULINARY EXPLORER
        </h2>
        <p className="text-xs text-[#869396]">
          Filter by dietary macros, Nizami dum traditions, and spice matrices
        </p>
      </div>

      {/* Dietary Preference Filter Bar */}
      <div className="p-3.5 rounded-2xl bg-[#10182A]/90 border border-white/10 shadow-lg space-y-3">
        <DietaryFilterBar
          activeFilter={activeDietary}
          onSelectFilter={setActiveDietary}
          resultCount={filteredDishes.length}
        />

        {/* Heritage Sub-Pills */}
        <div className="pt-2 border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-space font-bold text-[#869396] uppercase shrink-0">
            CULINARY:
          </span>
          {[
            { id: 'ALL', label: 'All Cuisines' },
            { id: 'DUM', label: '🔥 Dum Biryani & Haleem' },
            { id: 'SPICY', label: '🌶 Spicy Guntur' },
            { id: 'TIFFINS', label: '🥞 Deccan Tiffins' },
            { id: 'BAKERY', label: '☕ Irani Chai & Bake' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveHeritage(item.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-space font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeHeritage === item.id
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-black/30 text-[#869396] hover:text-white border border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="space-y-2">
        {filteredDishes.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-[#10182A]/60 border border-white/5 space-y-3">
            <span className="material-symbols-outlined text-4xl text-[#869396]">
              no_meals
            </span>
            <p className="text-xs text-[#869396] font-space">
              No dishes match your selected dietary preference ({activeDietary}).
            </p>
            <button
              onClick={() => {
                setActiveDietary('ALL');
                setActiveHeritage('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-[#63e6ff] text-black font-space font-bold text-xs uppercase cursor-pointer shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredDishes.map((dish) => {
              const isVeg = dish.badgeType === 'veg' || dish.tags.includes('PURE VEG');
              return (
                <TiltCard
                  key={dish.id}
                  tiltIntensity={10}
                  elevationScale={1.03}
                  className="rounded-2xl"
                >
                  <div className="relative p-3 rounded-2xl bg-[#10182A]/85 border border-white/10 hover:border-[#63e6ff]/40 flex flex-col justify-between group shadow-lg transition-all h-full">
                    <div onClick={() => onSelectDish(dish)} className="cursor-pointer">
                      <div className="relative rounded-xl overflow-hidden mb-2 bg-[#060914] aspect-square border border-white/5">
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <VegBadge isVeg={isVeg} size="sm" />
                          {dish.isBestseller && (
                            <span className="text-[8px] font-space font-extrabold px-1.5 py-0.5 rounded bg-black/80 text-[#ffd86b] border border-[#ffd86b]/40">
                              ★ BESTSELLER
                            </span>
                          )}
                        </div>

                        {/* Floating Action Button (FAB) directly on the bottom-right of image */}
                        <div className="absolute bottom-2 right-2">
                          <QuickAddButton
                            dish={dish}
                            onAddToCart={onAddToCart}
                            variant="mini-fab"
                            onAddedFeedback={(name) => {
                              setToastMessage(`Added "${name}" to Dock`);
                              setTimeout(() => setToastMessage(null), 2000);
                            }}
                          />
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-[#F5F8FF] line-clamp-1 group-hover:text-[#63e6ff] transition-colors">
                        {dish.name}
                      </h4>
                      <p className="text-[10px] text-[#869396] truncate mt-0.5">
                        {dish.restaurantName}
                      </p>

                      {/* Visual Nutrition Summary Badge with subtle pulse */}
                      <div className="mt-1.5 mb-1">
                        <NutritionSummaryBadge
                          calories={dish.calories}
                          protein={dish.protein}
                          carbs={dish.carbs}
                          fat={dish.fat}
                          variant="compact"
                        />
                      </div>
                    </div>

                    {/* Card Bottom Row with Price and Quick Add */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                      <span className="text-xs font-bold text-[#ffd86b] font-space">
                        ₹{dish.price}
                      </span>
                      <QuickAddButton
                        dish={dish}
                        onAddToCart={onAddToCart}
                        variant="fab"
                        onAddedFeedback={(name) => {
                          setToastMessage(`Added "${name}" to Dock`);
                          setTimeout(() => setToastMessage(null), 2000);
                        }}
                      />
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Featured Hyderabad Hubs Section */}
      <div className="pt-4">
        <h3 className="text-xs font-bold text-[#F5F8FF] font-space tracking-wider uppercase mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#75f5a6]" />
          <span>VERIFIED RESTAURANT NODES</span>
        </h3>
        <div className="space-y-3">
          {RESTAURANTS.map((rest) => (
            <div
              key={rest.id}
              onClick={() => onSelectRestaurant(rest)}
              className="p-3.5 rounded-2xl bg-[#10182A]/70 border border-white/10 hover:border-[#63e6ff]/40 flex items-center gap-3.5 cursor-pointer group shadow-lg transition-all"
            >
              <img
                src={rest.imageUrl}
                alt={rest.name}
                className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#F5F8FF] truncate group-hover:text-[#63e6ff] transition-colors">
                    {rest.name}
                  </h4>
                  <span className="text-[10px] font-bold text-[#ffd86b] bg-[#ffd86b]/10 px-1.5 py-0.5 rounded">
                    ★ {rest.rating}
                  </span>
                </div>
                <p className="text-[10px] text-[#869396] truncate mt-0.5">
                  {rest.cuisines.join(' • ')}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[10px] font-space text-[#869396]">
                  <span>📍 {rest.distanceKm} km</span>
                  <span>⏱ {rest.prepTimeMinutes} mins</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
