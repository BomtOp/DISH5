import React, { useState } from 'react';
import { Dish, Restaurant, ScreenId, HyderabadAreaId } from '../../types';
import { DISHES, RESTAURANTS, HYDERABAD_AREAS } from '../../data/mockData';
import { FloatingDish3D } from '../FloatingDish3D';
import { VegBadge } from '../common/VegBadge';
import { NutritionSummaryBadge } from '../common/NutritionSummaryBadge';
import { TiltCard } from '../common/TiltCard';
import { QuickAddButton } from '../common/QuickAddButton';

interface HomeScreenProps {
  onSelectDish: (dish: Dish) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onAddToCart: (dish: Dish) => void;
  activeAreaId: HyderabadAreaId;
  onSelectArea: (areaId: HyderabadAreaId) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectDish,
  onSelectRestaurant,
  onAddToCart,
  activeAreaId,
  onSelectArea,
  onNavigate
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentArea =
    HYDERABAD_AREAS.find((a) => a.id === activeAreaId) || HYDERABAD_AREAS[0];

  const heroDish =
    DISHES.find((d) => d.id === currentArea.recommendedDishId) || DISHES[0];

  const categories = [
    { id: 'all', label: 'ALL DECCANI' },
    { id: 'protein', label: 'BIO-PROTEIN (30g+)' },
    { id: 'dum', label: 'DUM BIRYANI & HALEEM' },
    { id: 'veg', label: 'PURE VEG TIFFINS' },
    { id: 'bakery', label: 'IRANI CHAI & BAKERY' },
    { id: 'quick', label: 'SPEED DISPATCH' }
  ];

  const filteredDishes = DISHES.filter((dish) => {
    const isVeg = dish.badgeType === 'veg' || dish.tags.includes('PURE VEG');
    if (activeCategory === 'protein') return dish.protein >= 30;
    if (activeCategory === 'dum')
      return (
        dish.tags.includes('DUM BIRYANI') ||
        dish.tags.includes('GI-TAGGED') ||
        dish.name.toLowerCase().includes('biryani') ||
        dish.name.toLowerCase().includes('haleem')
      );
    if (activeCategory === 'veg') return isVeg;
    if (activeCategory === 'bakery')
      return (
        dish.tags.includes('AUTHENTIC CHAI') ||
        dish.tags.includes('BAKED HOURLY') ||
        dish.category === 'DRINKS' ||
        dish.name.toLowerCase().includes('chai') ||
        dish.name.toLowerCase().includes('biscuit') ||
        dish.name.toLowerCase().includes('meetha')
      );
    if (activeCategory === 'quick') return dish.prepTimeMinutes <= 12;
    return true;
  });

  const handleAddWithFeedback = (dish: Dish, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onAddToCart(dish);
    setToastMessage(`Added "${dish.name}" to DISHØ Dock`);
    setTimeout(() => setToastMessage(null), 2200);
  };

  return (
    <div className="min-h-screen pb-28 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#10182A] border border-[#63e6ff] text-[#F5F8FF] px-4 py-2 rounded-xl shadow-2xl font-space text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[16px] text-[#75f5a6]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hyderabad Sector Ambient Selector */}
      <div className="relative rounded-2xl p-4 bg-gradient-to-b from-[#10182A] to-[#0A0E19] border border-white/10 shadow-2xl overflow-hidden">
        <div
          className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-700"
          style={{ backgroundColor: currentArea.primaryColor }}
        />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: currentArea.primaryColor }}
            />
            <span className="font-space text-[11px] font-bold tracking-widest text-[#869396] uppercase">
              {currentArea.code}
            </span>
          </div>
          <span
            className="text-[10px] font-space font-extrabold px-2 py-0.5 rounded-full border shadow-sm uppercase tracking-wide"
            style={{
              borderColor: currentArea.primaryColor,
              color: currentArea.primaryColor,
              backgroundColor: 'rgba(0,0,0,0.4)'
            }}
          >
            {currentArea.dialectBadge}
          </span>
        </div>

        <h2 className="text-lg font-bold text-[#F5F8FF] leading-snug mb-1">
          {currentArea.greeting}
        </h2>
        <p className="text-xs text-[#869396] mb-3">
          {currentArea.tagline}
        </p>

        {/* Area Chips Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {HYDERABAD_AREAS.map((area) => {
            const isSelected = area.id === activeAreaId;
            return (
              <button
                key={area.id}
                onClick={() => onSelectArea(area.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-space font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#181B27] text-white shadow-lg'
                    : 'bg-[#10131E]/60 text-[#869396] hover:text-white border-white/5'
                }`}
                style={{
                  borderColor: isSelected ? area.primaryColor : undefined,
                  boxShadow: isSelected ? `0 0 12px ${area.primaryColor}40` : undefined
                }}
              >
                {area.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero 3D Floating Dish of the Sector */}
      <div className="relative rounded-3xl p-5 bg-[#10182A]/90 border border-[#63e6ff]/20 shadow-[0_12px_40px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-space font-bold tracking-widest text-[#63e6ff] uppercase flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
            TODAY'S SECTOR DROP
          </span>
          <span className="text-xs font-space font-bold text-[#ffd86b] bg-[#ffd86b]/10 px-2 py-0.5 rounded-md">
            ₹{heroDish.price}
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-[#F5F8FF] font-space tracking-tight mb-1">
          {heroDish.name}
        </h3>
        <p className="text-xs text-[#869396] line-clamp-2 mb-3">
          {heroDish.description}
        </p>

        {/* 3D Visual Floating Display */}
        <div className="h-60 my-2">
          <FloatingDish3D
            imageUrl={heroDish.imageUrl}
            imageAlt={heroDish.name}
            hotspots={heroDish.hotspots}
          />
        </div>

        {/* Nutritional Synthesis Summary on Hero */}
        <div className="my-3">
          <NutritionSummaryBadge
            calories={heroDish.calories}
            protein={heroDish.protein}
            carbs={heroDish.carbs}
            fat={heroDish.fat}
            variant="detailed"
          />
        </div>

        {/* Action Bottom */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#75f5a6] font-space">
              {heroDish.prepTimeMinutes} MIN DISPATCH
            </span>
            <span className="text-[10px] text-[#869396]">• {heroDish.servesText}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectDish(heroDish)}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold font-space text-[#F5F8FF] border border-white/10"
            >
              DETAILS
            </button>
            <button
              onClick={(e) => handleAddWithFeedback(heroDish, e)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ba027b] to-[#63e6ff] text-xs font-bold font-space text-[#060914] shadow-[0_0_20px_rgba(99,230,255,0.4)] hover:brightness-110 active:scale-95 transition-all"
            >
              ADD TO DOCK
            </button>
          </div>
        </div>
      </div>

      {/* Verified Restaurant Hubs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#75f5a6]"></span>
            <h3 className="font-space text-sm font-bold tracking-wider uppercase text-[#F5F8FF]">
              VERIFIED RESTAURANT NODES
            </h3>
          </div>
          <span className="text-[11px] text-[#63e6ff] font-space cursor-pointer" onClick={() => onNavigate('explore')}>
            ALL ({RESTAURANTS.length})
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {RESTAURANTS.slice(0, 3).map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => onSelectRestaurant(restaurant)}
              className="p-3.5 rounded-2xl bg-[#10182A]/70 border border-white/10 hover:border-[#63e6ff]/40 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#181B27] shrink-0 border border-white/10">
                    <img
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-space font-bold text-[#75f5a6] uppercase tracking-wider">
                      {restaurant.statusBadge}
                    </span>
                    <h4 className="font-space text-sm font-bold text-[#F5F8FF] group-hover:text-[#63e6ff] transition-colors leading-snug">
                      {restaurant.name}
                    </h4>
                    <p className="text-[11px] text-[#869396] line-clamp-1">
                      {restaurant.cuisines.join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-0.5 text-xs font-space font-bold text-[#ffd86b]">
                    ★ {restaurant.rating}
                  </span>
                  <span className="block text-[10px] text-[#869396] font-space">
                    {restaurant.distanceKm} km
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-[11px]">
                <span className="text-[#869396]">{restaurant.hub}</span>
                <span className="text-[#ffd86b] font-space font-semibold text-[10px]">
                  {restaurant.prepTimeMinutes} MIN CO-ROUTE
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-space text-sm font-bold tracking-wider uppercase text-[#F5F8FF]">
            HYDERABAD MENU DISPATCH
          </h3>
          <span className="text-[11px] text-[#869396] font-space">
            {filteredDishes.length} ITEMS
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-space font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ba027b] to-[#63e6ff] text-[#060914] border-transparent shadow-[0_0_15px_rgba(99,230,255,0.3)]'
                    : 'bg-[#10182A] text-[#869396] hover:text-[#F5F8FF] border-white/5'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dishes List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredDishes.map((dish) => (
          <TiltCard
            key={dish.id}
            tiltIntensity={7}
            elevationScale={1.02}
            className="rounded-2xl"
          >
            <div
              onClick={() => onSelectDish(dish)}
              className="p-3.5 rounded-2xl bg-[#10182A]/80 border border-white/10 hover:border-[#63e6ff]/40 transition-all cursor-pointer group shadow-lg flex items-center justify-between gap-3.5"
            >
              <div className="flex-1 min-w-0 pr-1 space-y-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <VegBadge isVeg={dish.badgeType === 'veg' || dish.tags.includes('PURE VEG')} size="sm" />
                  <span className="text-[10px] font-space text-[#869396] uppercase tracking-wider truncate">
                    {dish.restaurantName}
                  </span>
                </div>

                <h4 className="font-space text-sm font-bold text-[#F5F8FF] group-hover:text-[#63e6ff] transition-colors leading-snug truncate">
                  {dish.name}
                </h4>
                <p className="text-[11px] text-[#869396] line-clamp-1">
                  {dish.description}
                </p>

                {/* Visual Nutrition Summary Badge */}
                <div className="pt-1.5">
                  <NutritionSummaryBadge
                    calories={dish.calories}
                    protein={dish.protein}
                    carbs={dish.carbs}
                    fat={dish.fat}
                    variant="compact"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-space font-extrabold text-[#ffd86b]">
                    ₹{dish.price}
                  </span>
                  <span className="text-[10px] text-[#869396] font-space font-medium">
                    • {dish.servesText || `${dish.prepTimeMinutes} mins`}
                  </span>
                </div>
              </div>

              <div className="relative w-22 h-22 shrink-0 rounded-2xl overflow-hidden bg-[#181B27] border border-white/10 shadow-sm">
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
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
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
};
