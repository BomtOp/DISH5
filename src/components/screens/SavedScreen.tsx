import React, { useState } from 'react';
import { Dish, Restaurant } from '../../types';
import { DISHES, RESTAURANTS } from '../../data/mockData';

interface SavedScreenProps {
  onSelectDish: (dish: Dish) => void;
  onAddToCart: (dish: Dish) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  onSelectDish,
  onAddToCart,
  onSelectRestaurant
}) => {
  const [tab, setTab] = useState<'dishes' | 'hubs'>('dishes');

  const savedDishes = DISHES.slice(0, 4);
  const savedHubs = RESTAURANTS.slice(0, 3);

  return (
    <div className="min-h-screen pb-24 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#F5F8FF] font-space">SAVED ARCHIVE</h2>
        <p className="text-xs text-[#869396]">Bookmarked Hyderabad dishes & culinary nodes</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('dishes')}
          className={`flex-1 py-2 rounded-xl text-xs font-space font-bold transition-all cursor-pointer ${
            tab === 'dishes'
              ? 'bg-[#63e6ff] text-black shadow-md'
              : 'bg-[#10182A] text-[#869396] border border-white/5'
          }`}
        >
          SAVED DISHES ({savedDishes.length})
        </button>
        <button
          onClick={() => setTab('hubs')}
          className={`flex-1 py-2 rounded-xl text-xs font-space font-bold transition-all cursor-pointer ${
            tab === 'hubs'
              ? 'bg-[#63e6ff] text-black shadow-md'
              : 'bg-[#10182A] text-[#869396] border border-white/5'
          }`}
        >
          FAVORITE HUBS ({savedHubs.length})
        </button>
      </div>

      {tab === 'dishes' ? (
        <div className="space-y-3">
          {savedDishes.map((dish) => (
            <div
              key={dish.id}
              className="p-3.5 rounded-2xl bg-[#10182A]/80 border border-white/5 flex items-center gap-3.5 group shadow-sm"
            >
              <img
                src={dish.imageUrl}
                alt={dish.name}
                onClick={() => onSelectDish(dish)}
                className="w-16 h-16 rounded-xl object-cover border border-white/10 cursor-pointer"
              />
              <div className="flex-1 min-w-0" onClick={() => onSelectDish(dish)}>
                <h4 className="text-xs font-bold text-[#F5F8FF] truncate group-hover:text-[#63e6ff] cursor-pointer">
                  {dish.name}
                </h4>
                <p className="text-[10px] text-[#869396] truncate">{dish.restaurantName}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-space">
                  <span className="text-[#ffd86b] font-bold">₹{dish.price}</span>
                  <span className="text-[#75f5a6]">{dish.protein}g P</span>
                  <span className="text-[#869396]">{dish.calories} kcal</span>
                </div>
              </div>
              <button
                onClick={() => onAddToCart(dish)}
                className="px-3 py-1.5 rounded-xl bg-[#181B27] border border-[#63e6ff]/30 text-[#63e6ff] hover:bg-[#63e6ff] hover:text-black font-space text-[10px] font-bold transition-all cursor-pointer"
              >
                ADD +
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {savedHubs.map((rest) => (
            <div
              key={rest.id}
              onClick={() => onSelectRestaurant(rest)}
              className="p-3.5 rounded-2xl bg-[#10182A]/80 border border-white/5 flex items-center gap-3.5 cursor-pointer group shadow-sm"
            >
              <img
                src={rest.imageUrl}
                alt={rest.name}
                className="w-16 h-16 rounded-xl object-cover border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#F5F8FF] truncate group-hover:text-[#63e6ff]">
                    {rest.name}
                  </h4>
                  <span className="text-[10px] font-bold text-[#ffd86b]">★ {rest.rating}</span>
                </div>
                <p className="text-[10px] text-[#869396] truncate">{rest.cuisines.join(' • ')}</p>
                <div className="flex items-center gap-3 mt-1 text-[10px] font-space text-[#869396]">
                  <span>📍 {rest.distanceKm} km</span>
                  <span>⏱ {rest.prepTimeMinutes} mins</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
