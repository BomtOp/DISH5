import React, { useState, useMemo } from 'react';
import { Restaurant, Dish, CartItem, ScreenId, CustomOrderState } from '../../types';
import { DISHES } from '../../data/mockData';
import { VegBadge } from '../common/VegBadge';
import { NutritionSummaryBadge } from '../common/NutritionSummaryBadge';
import { ItemCustomizeModal } from '../modals/ItemCustomizeModal';

interface RestaurantScreenProps {
  restaurant: Restaurant;
  onSelectDish: (dish: Dish) => void;
  onAddToCart: (dish: Dish, customState?: CustomOrderState, customPrice?: number) => void;
  onBack: () => void;
  cart?: CartItem[];
  onUpdateQuantity?: (cartItemId: string, delta: number) => void;
  onNavigate?: (screen: ScreenId) => void;
}

export const RestaurantScreen: React.FC<RestaurantScreenProps> = ({
  restaurant,
  onSelectDish,
  onAddToCart,
  onBack,
  cart = [],
  onUpdateQuantity,
  onNavigate
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [modalDish, setModalDish] = useState<Dish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedDishIds, setExpandedDishIds] = useState<string[]>([]);

  // Get dishes belonging to this restaurant
  const rawDishes = useMemo(() => {
    const matched = DISHES.filter(
      (d) => d.restaurantId === restaurant.id || d.restaurantName === restaurant.name
    );
    return matched.length > 0 ? matched : DISHES.slice(0, 5);
  }, [restaurant]);

  // Extract distinct subcategories
  const subCategories = useMemo(() => {
    const set = new Set<string>();
    rawDishes.forEach((d) => {
      if (d.subCategory) set.add(d.subCategory);
    });
    return ['All', ...Array.from(set)];
  }, [rawDishes]);

  // Filtered dishes based on search and toggles
  const displayDishes = useMemo(() => {
    return rawDishes.filter((dish) => {
      const isVeg = dish.isVeg ?? (dish.badgeType === 'veg' || dish.tags.includes('PURE VEG'));
      if (vegOnly && !isVeg) return false;
      if (bestsellerOnly && !dish.isBestseller) return false;
      if (selectedSubCategory !== 'All' && dish.subCategory !== selectedSubCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesTag = dish.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }
      return true;
    });
  }, [rawDishes, vegOnly, bestsellerOnly, selectedSubCategory, searchQuery]);

  // Cart calculation for this restaurant & overall
  const cartItemsForRestaurant = cart.filter((i) => i.dish.restaurantId === restaurant.id);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartAmount = cart.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);

  // Helper to get quantity of dish in cart
  const getDishQuantityInCart = (dishId: string) => {
    const items = cart.filter((i) => i.dish.id === dishId);
    return items.reduce((acc, i) => acc + i.quantity, 0);
  };

  const getFirstCartItemId = (dishId: string) => {
    const item = cart.find((i) => i.dish.id === dishId);
    return item ? item.id : null;
  };

  const handleAddClick = (dish: Dish, e: React.MouseEvent) => {
    e.stopPropagation();
    if (dish.isCustomizable) {
      setModalDish(dish);
      setIsModalOpen(true);
    } else {
      onAddToCart(dish);
      showToast(`Added "${dish.name}" to cart`);
    }
  };

  const handleCustomModalConfirm = (dish: Dish, customState: CustomOrderState, finalPrice: number) => {
    onAddToCart(dish, customState, finalPrice);
    showToast(`Added "${dish.name}" with custom specs`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const toggleExpand = (dishId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDishIds((prev) =>
      prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]
    );
  };

  return (
    <div className="min-h-screen pb-36 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#10182A] border border-[#63e6ff] text-[#F5F8FF] px-4 py-2 rounded-xl shadow-2xl font-space text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[16px] text-[#75f5a6]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Restaurant Header Banner (Swiggy / Zomato Hero Card) */}
      <div className="relative rounded-3xl overflow-hidden bg-[#10182A] border border-white/10 shadow-2xl">
        <div className="h-44 relative">
          <img
            src={restaurant.heroBanner || restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#10182A] via-[#10182A]/70 to-black/40" />

          {/* Top Actions */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-black/60 backdrop-blur-md text-white flex items-center justify-center cursor-pointer border border-white/15 hover:bg-black transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="flex items-center gap-1.5">
              <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 text-xs font-bold text-[#ffd86b] font-space flex items-center gap-1">
                ★ {restaurant.rating}
                <span className="text-[10px] text-[#869396] font-normal">
                  ({restaurant.reviewCount || '10k+'})
                </span>
              </span>
            </div>
          </div>

          {/* Restaurant Details on Banner */}
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[9px] font-space font-extrabold text-[#75f5a6] uppercase tracking-wider bg-black/70 px-2 py-0.5 rounded border border-[#75f5a6]/30">
              {restaurant.statusBadge}
            </span>
            <h2 className="text-xl font-extrabold text-[#F5F8FF] font-space mt-1 leading-tight">
              {restaurant.name}
            </h2>
            <p className="text-[11px] text-[#869396] line-clamp-1 mt-0.5">
              {restaurant.address}
            </p>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="p-3 bg-[#0D1322] border-t border-white/5 grid grid-cols-3 gap-2 text-center text-xs font-space">
          <div className="border-r border-white/5">
            <span className="text-[10px] text-[#869396] block">DISPATCH</span>
            <span className="font-bold text-[#75f5a6]">{restaurant.prepTimeMinutes} MINS</span>
          </div>
          <div className="border-r border-white/5">
            <span className="text-[10px] text-[#869396] block">AVG COST</span>
            <span className="font-bold text-[#ffd86b]">₹{restaurant.avgPrice} FOR TWO</span>
          </div>
          <div>
            <span className="text-[10px] text-[#869396] block">MULTI-ZONE</span>
            <span className="font-bold text-[#63e6ff]">CO-ROUTE ON</span>
          </div>
        </div>
      </div>

      {/* Offers & Duo Route Special Bar */}
      {restaurant.offerTag && (
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#ffd86b]/15 via-[#63e6ff]/15 to-[#ff4fb3]/15 border border-[#ffd86b]/30 flex items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#ffd86b] animate-bounce">
              redeem
            </span>
            <span className="text-xs font-space font-bold text-[#F5F8FF] leading-snug">
              {restaurant.offerTag}
            </span>
          </div>
          <span className="text-[9px] font-space font-extrabold bg-[#ffd86b] text-[#060914] px-2 py-0.5 rounded-full shrink-0">
            AUTO-APPLY
          </span>
        </div>
      )}

      {/* In-Menu Search & Toggles Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#869396]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes in this kitchen..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#10182A] border border-white/10 text-xs font-space text-[#F5F8FF] placeholder-[#869396] focus:outline-none focus:border-[#63e6ff]/50 transition-all"
            />
          </div>

          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-space font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              vegOnly
                ? 'bg-[#75f5a6]/20 border-[#75f5a6] text-[#75f5a6] shadow-[0_0_12px_rgba(117,245,166,0.3)]'
                : 'bg-[#10182A] border-white/10 text-[#869396] hover:text-[#F5F8FF]'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-sm border border-[#75f5a6] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#75f5a6]" />
            </div>
            VEG
          </button>
        </div>

        {/* Subcategories Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {subCategories.map((cat) => {
            const isActive = selectedSubCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedSubCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-space font-semibold whitespace-nowrap border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#63e6ff] text-[#060914] font-bold border-transparent shadow-[0_0_12px_rgba(99,230,255,0.4)]'
                    : 'bg-[#10182A] text-[#869396] hover:text-[#F5F8FF] border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dishes List */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs font-space text-[#869396] px-1">
          <span>{displayDishes.length} DISHES READY TO DUM</span>
          <span>LIVE CHARCOAL STEAM</span>
        </div>

        {displayDishes.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#10182A]/50 border border-white/5 space-y-2">
            <span className="material-symbols-outlined text-3xl text-[#869396]">restaurant</span>
            <p className="text-xs text-[#869396] font-space">No dishes match your filter query.</p>
          </div>
        ) : (
          displayDishes.map((dish) => {
            const quantityInCart = getDishQuantityInCart(dish.id);
            const isExpanded = expandedDishIds.includes(dish.id);
            const isPureVeg = dish.isVeg ?? (dish.badgeType === 'veg' || dish.tags.includes('PURE VEG'));

            return (
              <div
                key={dish.id}
                onClick={() => onSelectDish(dish)}
                className="p-4 rounded-2xl bg-[#10182A]/85 border border-white/10 hover:border-[#63e6ff]/40 transition-all cursor-pointer group shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left Side: Dish Details */}
                  <div className="flex-1 min-w-0 pr-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <VegBadge isVeg={isPureVeg} size="sm" />
                      {dish.isBestseller && (
                        <span className="text-[9px] font-space font-extrabold bg-[#ffd86b]/15 text-[#ffd86b] px-1.5 py-0.5 rounded border border-[#ffd86b]/30">
                          BESTSELLER
                        </span>
                      )}
                      {dish.isCustomizable && (
                        <span className="text-[9px] font-space font-bold text-[#63e6ff]">
                          • CUSTOMIZABLE
                        </span>
                      )}
                    </div>

                    <h4 className="font-space text-base font-bold text-[#F5F8FF] group-hover:text-[#63e6ff] transition-colors leading-snug">
                      {dish.name}
                    </h4>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-space font-extrabold text-[#ffd86b]">
                        ₹{dish.price}
                      </span>
                      <span className="text-[11px] font-space text-[#75f5a6]">
                        ★ {dish.rating} ({dish.reviewsCount || '1.2k'})
                      </span>
                    </div>

                    <p className={`text-xs text-[#869396] transition-all ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {dish.description}
                    </p>

                    {dish.description && dish.description.length > 90 && (
                      <button
                        onClick={(e) => toggleExpand(dish.id, e)}
                        className="text-[10px] font-space text-[#63e6ff] hover:underline"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>

                  {/* Right Side: Dish Image & ADD / Counter Button */}
                  <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-[#181B27] border border-white/10 shadow-md">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Add / Counter CTA Button */}
                    <div className="absolute bottom-1.5 inset-x-2 flex justify-center">
                      {quantityInCart > 0 ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-between w-full bg-[#060914] border border-[#75f5a6] rounded-xl py-0.5 px-2 text-[#75f5a6] font-space text-xs font-extrabold shadow-lg"
                        >
                          <button
                            onClick={() => {
                              const cartItemId = getFirstCartItemId(dish.id);
                              if (cartItemId && onUpdateQuantity) {
                                onUpdateQuantity(cartItemId, -1);
                              }
                            }}
                            className="w-5 h-5 flex items-center justify-center text-base hover:text-white"
                          >
                            -
                          </button>
                          <span>{quantityInCart}</span>
                          <button
                            onClick={() => {
                              const cartItemId = getFirstCartItemId(dish.id);
                              if (cartItemId && onUpdateQuantity) {
                                onUpdateQuantity(cartItemId, 1);
                              } else {
                                onAddToCart(dish);
                              }
                            }}
                            className="w-5 h-5 flex items-center justify-center text-base hover:text-white"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleAddClick(dish, e)}
                          className="w-full py-1 rounded-xl bg-gradient-to-r from-[#ba027b] to-[#63e6ff] text-[#060914] text-xs font-space font-extrabold shadow-[0_0_15px_rgba(99,230,255,0.4)] hover:brightness-110 active:scale-95 transition-all uppercase tracking-wider"
                        >
                          ADD {dish.isCustomizable ? '+' : ''}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Macro Nutrients Strip with NutritionSummaryBadge */}
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <NutritionSummaryBadge
                    calories={dish.calories}
                    protein={dish.protein}
                    carbs={dish.carbs}
                    fat={dish.fat}
                    variant="compact"
                  />
                  <div className="flex items-center justify-between text-[10px] font-space text-[#869396] pt-0.5">
                    <span>⏱ {dish.prepTimeMinutes}M PREP</span>
                    <span className="text-[#ffd86b]">{dish.servesText || 'Serves 1-2'}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating View Dock Bar when cart has items */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-20 inset-x-4 max-w-[448px] mx-auto z-40 animate-in slide-in-from-bottom-5">
          <div
            onClick={() => onNavigate && onNavigate('cart')}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-[#ba027b] via-[#63e6ff] to-[#75f5a6] text-[#060914] shadow-[0_12px_32px_rgba(99,230,255,0.5)] flex items-center justify-between cursor-pointer hover:brightness-105 active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#060914] text-[#63e6ff] text-xs font-space font-bold flex items-center justify-center">
                {totalCartCount}
              </span>
              <div>
                <span className="font-space font-extrabold text-sm block leading-tight">
                  ₹{totalCartAmount} IN DISHØ DOCK
                </span>
                <span className="text-[10px] font-space font-medium opacity-90 block">
                  {cartItemsForRestaurant.length} items from {restaurant.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 font-space font-extrabold text-xs">
              <span>VIEW DOCK</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>
        </div>
      )}

      {/* Item Customization Modal */}
      <ItemCustomizeModal
        isOpen={isModalOpen}
        dish={modalDish}
        onClose={() => setIsModalOpen(false)}
        onConfirmCustomization={handleCustomModalConfirm}
      />
    </div>
  );
};
