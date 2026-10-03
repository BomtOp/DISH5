import React, { useState, useMemo } from 'react';
import { Dish, Restaurant, ScreenId } from '../../types';
import { DISHES, RESTAURANTS } from '../../data/mockData';
import { VegBadge } from '../common/VegBadge';
import { NutritionSummaryBadge } from '../common/NutritionSummaryBadge';
import { DietaryOption, DietaryFilterBar, matchesDietaryFilter, DIETARY_FILTERS } from '../common/DietaryFilterBar';
import { QuickAddButton } from '../common/QuickAddButton';
import { TiltCard } from '../common/TiltCard';

interface SearchScreenProps {
  onSelectDish: (dish: Dish) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onAddToCart: (dish: Dish) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onSelectDish,
  onSelectRestaurant,
  onAddToCart,
  onNavigate: _onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [activeDietary, setActiveDietary] = useState<DietaryOption>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const recentSearches = [
    'Dum Biryani with double salan',
    'GI-Tagged Haleem pure desi ghee',
    'Charminar Shahi Nalli Nihari',
    'Guntur Podi Babai Idli',
    'Nimrah Irani Chai & Osmania Biscuits'
  ];

  const matchedDishes = useMemo(() => {
    const baseDishes = query.trim()
      ? DISHES.filter(
          (d) =>
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
            d.description.toLowerCase().includes(query.toLowerCase()) ||
            d.restaurantName.toLowerCase().includes(query.toLowerCase())
        )
      : (activeDietary !== 'ALL' ? DISHES : []);

    return baseDishes.filter((dish) => matchesDietaryFilter(dish, activeDietary));
  }, [query, activeDietary]);

  const matchedRestaurants = useMemo(() => {
    if (!query.trim()) return [];
    return RESTAURANTS.filter(
      (r) =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisines.some((c: string) => c.toLowerCase().includes(query.toLowerCase())) ||
        r.hub.toLowerCase().includes(query.toLowerCase()) ||
        r.sector.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleAddWithFeedback = (dish: Dish, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(dish);
    setToastMessage(`Added "${dish.name}" to Dock`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="min-h-screen pb-28 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#10182A] border border-[#63e6ff] text-[#F5F8FF] px-4 py-2 rounded-xl shadow-2xl font-space text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[16px] text-[#75f5a6]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#63e6ff] text-[20px]">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH DISHES, MACROS, KITCHENS..."
          autoFocus
          className="w-full bg-[#10182A] border border-[#63e6ff]/30 rounded-2xl pl-11 pr-10 py-3 text-xs font-space text-[#F5F8FF] uppercase placeholder:text-[#869396]/60 focus:outline-none focus:border-[#63e6ff] focus:ring-1 focus:ring-[#63e6ff] shadow-lg"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#869396] hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Dietary Preference Filter Bar */}
      <div className="p-3 rounded-2xl bg-[#10182A]/90 border border-white/10 shadow-md">
        <DietaryFilterBar
          activeFilter={activeDietary}
          onSelectFilter={setActiveDietary}
          resultCount={query.trim() || activeDietary !== 'ALL' ? matchedDishes.length : undefined}
        />
      </div>

      {/* Landing suggestions when query is empty and no dietary filter is selected */}
      {!query && activeDietary === 'ALL' ? (
        <div className="space-y-4 pt-1">
          {/* Recent Searches */}
          <div>
            <span className="text-[10px] font-space font-bold tracking-widest text-[#869396] uppercase">
              RECENT HYDERABAD SEARCHES
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-xl bg-[#10182A] border border-white/5 hover:border-[#63e6ff]/30 text-xs text-[#e0e1f2] font-space flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#63e6ff]">history</span>
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Dietary Discovery Grid */}
          <div>
            <span className="text-[10px] font-space font-bold tracking-widest text-[#869396] uppercase">
              EXPLORE BY DIETARY PROFILE
            </span>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {DIETARY_FILTERS.filter((f) => f.id !== 'ALL').map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveDietary(f.id)}
                  className="p-3 rounded-xl bg-[#10182A]/70 border border-white/5 hover:border-[#63e6ff]/30 text-left transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ color: f.activeColor }}
                    >
                      {f.icon}
                    </span>
                    <span className="text-xs font-bold text-[#F5F8FF] font-space group-hover:text-[#63e6ff] transition-colors">
                      {f.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#869396] mt-1 line-clamp-1">
                    Filter {f.shortLabel}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Results Section */
        <div className="space-y-4 pt-1">
          {/* Matched Dishes */}
          {matchedDishes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-space font-bold tracking-widest text-[#63e6ff] uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#63e6ff] animate-pulse" />
                  DISHES FOUND ({matchedDishes.length})
                </span>
                {activeDietary !== 'ALL' && (
                  <span className="text-[9px] font-space font-bold text-[#75f5a6] bg-[#75f5a6]/10 px-2 py-0.5 rounded-full">
                    FILTER: {activeDietary}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {matchedDishes.map((dish) => (
                  <TiltCard
                    key={dish.id}
                    tiltIntensity={7}
                    elevationScale={1.02}
                    className="rounded-2xl"
                  >
                    <div className="relative p-3.5 rounded-2xl bg-[#10182A]/85 border border-white/10 hover:border-[#63e6ff]/40 flex items-start gap-3 transition-all group shadow-lg">
                      {/* Thumbnail with floating mini-FAB button */}
                      <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-[#060914] border border-white/10 shrink-0">
                        <div
                          onClick={() => onSelectDish(dish)}
                          className="w-full h-full cursor-pointer"
                        >
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="absolute bottom-1 right-1">
                          <QuickAddButton
                            dish={dish}
                            onAddToCart={onAddToCart}
                            variant="mini-fab"
                            className="!w-6 !h-6"
                            onAddedFeedback={(name) => {
                              setToastMessage(`Added "${name}" to Dock`);
                              setTimeout(() => setToastMessage(null), 2000);
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div
                          onClick={() => onSelectDish(dish)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <VegBadge
                              isVeg={dish.isVeg ?? (dish.badgeType === 'veg' || dish.tags.includes('PURE VEG'))}
                              size="sm"
                            />
                            <h4 className="text-xs font-bold text-[#F5F8FF] truncate group-hover:text-[#63e6ff] transition-colors">
                              {dish.name}
                            </h4>
                          </div>
                          <p className="text-[10px] text-[#869396] truncate">
                            {dish.restaurantName}
                          </p>
                        </div>

                        {/* Visual Nutrition Summary Badge with subtle pulse */}
                        <NutritionSummaryBadge
                          calories={dish.calories}
                          protein={dish.protein}
                          carbs={dish.carbs}
                          fat={dish.fat}
                          variant="compact"
                        />

                        {/* Card Bottom Row with Price and Quick Add FAB */}
                        <div className="flex items-center justify-between pt-1">
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
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          )}

          {/* Matched Restaurants */}
          {matchedRestaurants.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-space font-bold tracking-widest text-[#ffd86b] uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd86b]" />
                HYDERABAD HUBS FOUND ({matchedRestaurants.length})
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {matchedRestaurants.map((rest) => (
                  <div
                    key={rest.id}
                    onClick={() => onSelectRestaurant(rest)}
                    className="p-3.5 rounded-2xl bg-[#10182A]/80 border border-white/10 hover:border-[#ffd86b]/40 flex items-center gap-3 transition-all cursor-pointer group shadow-lg"
                  >
                    <img
                      src={rest.imageUrl}
                      alt={rest.name}
                      className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#F5F8FF] truncate group-hover:text-[#ffd86b] transition-colors">
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
          )}

          {/* Empty State */}
          {matchedDishes.length === 0 && matchedRestaurants.length === 0 && (
            <div className="py-12 text-center rounded-2xl bg-[#10182A]/50 border border-white/5 space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#869396]">
                search_off
              </span>
              <p className="text-xs text-[#869396] font-space max-w-xs mx-auto">
                No matching dishes or hubs found for "{query}" with {activeDietary} filter.
              </p>
              <button
                onClick={() => {
                  setQuery('');
                  setActiveDietary('ALL');
                }}
                className="px-4 py-2 rounded-xl bg-[#63e6ff] text-black font-space font-bold text-xs uppercase cursor-pointer shadow-md"
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
