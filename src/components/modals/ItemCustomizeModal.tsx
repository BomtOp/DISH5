import React, { useState } from 'react';
import { Dish, SpiceLevel, CustomOrderState } from '../../types';
import { VegBadge } from '../common/VegBadge';

interface ItemCustomizeModalProps {
  isOpen: boolean;
  dish: Dish | null;
  onClose: () => void;
  onConfirmCustomization: (dish: Dish, customState: CustomOrderState, finalPrice: number) => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  isOpen,
  dish,
  onClose,
  onConfirmCustomization
}) => {
  if (!isOpen || !dish) return null;

  const isVeg = dish.isVeg ?? (dish.badgeType === 'veg' || dish.tags.includes('PURE VEG'));

  // Portion Options
  const portionOptions = [
    {
      id: 'solo',
      name: 'Solo Pod',
      subtext: 'Single hunger • ~350g',
      priceDelta: -40,
      scale: 0.75
    },
    {
      id: 'regular',
      name: 'Standard Daawat (Recommended)',
      subtext: 'Full hearty portion • ~550g',
      priceDelta: 0,
      scale: 1.0
    },
    {
      id: 'jumbo',
      name: 'Grand Family Feast',
      subtext: 'Double portion for 2-3 pilots • ~950g',
      priceDelta: Math.round(dish.price * 0.65),
      scale: 1.7
    }
  ];

  // Spice Levels
  const spiceOptions: { level: SpiceLevel; label: string; desc: string; icon: string; color: string }[] = [
    { level: 'mild', label: 'Mild Dum', desc: 'Aromatic, subtle cardamom, gentle warmth', icon: 'spa', color: '#75f5a6' },
    { level: 'medium', label: 'Classic Deccan', desc: 'Standard authentic Hyderabad balance', icon: 'local_fire_department', color: '#ffd86b' },
    { level: 'spicy', label: 'Shahi Teekha', desc: 'Fiery green chili & roasted cloves', icon: 'whatshot', color: '#ff9f43' },
    { level: 'mecha', label: 'Cyber Fiery 14k', desc: 'Extreme capsaicin Deccan heat matrix', icon: 'bolt', color: '#ff6b7a' }
  ];

  // Addons tailored to dish category
  const addonList = [
    { id: 'salan', name: 'Extra Mirchi Ka Salan (Clay Jar)', price: 35, cal: 45, prot: 2 },
    { id: 'raita', name: 'Thick Burani Garlic Raita', price: 30, cal: 40, prot: 3 },
    { id: 'birista', name: 'Ghee-Crisped Birista Onions & Cashews', price: 35, cal: 90, prot: 3 },
    { id: 'egg', name: 'Boiled Farm Egg with Masala Roast', price: 25, cal: 75, prot: 6 },
    { id: 'roti', name: 'Tandoori Rumali Roti (1 pc)', price: 25, cal: 120, prot: 3 },
    { id: 'ghee', name: 'Extra Pure Cultured Desi Ghee Float (20ml)', price: 40, cal: 110, prot: 0 }
  ];

  const [selectedPortionId, setSelectedPortionId] = useState<string>('regular');
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel>('medium');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [cookingInstructions, setCookingInstructions] = useState<string>('');

  const currentPortion = portionOptions.find((p) => p.id === selectedPortionId) || portionOptions[1];

  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const item = addonList.find((a) => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const basePriceWithPortion = Math.max(50, dish.price + currentPortion.priceDelta);
  const finalCalculatedPrice = basePriceWithPortion + addonsTotal;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const customState: CustomOrderState = {
      dishId: dish.id,
      spiceLevel: selectedSpice,
      promptText: `${currentPortion.name}, ${selectedSpice.toUpperCase()} spice${
        selectedAddons.length > 0 ? `, +${selectedAddons.length} addons` : ''
      }`,
      portionGrams: Math.round((dish.defaultPortionGrams || 500) * currentPortion.scale),
      portionUnit: 'g',
      selectedPortionName: currentPortion.name,
      selectedAddonNames: selectedAddons.map((id) => addonList.find((a) => a.id === id)?.name || id),
      cookingInstructions: cookingInstructions.trim(),
      modifiers: {
        grilledPaneer: 'std',
        yogurtDrizzle: 'included',
        spinachRice: 'rice',
        crispyGarlic: true
      },
      customNotes: cookingInstructions.trim()
    };

    onConfirmCustomization(dish, customState, finalCalculatedPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Bottom Sheet Card */}
      <div className="relative w-full max-w-[480px] max-h-[85vh] bg-[#10182A] border-t sm:border border-[#63e6ff]/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom duration-300">
        {/* Drag handle */}
        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mt-3 mb-1 sm:hidden" />

        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-start gap-3 bg-[#0c1222]">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-16 h-16 rounded-xl object-cover border border-white/15 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <VegBadge isVeg={isVeg} size="sm" />
              <span className="text-[10px] font-space font-bold text-[#63e6ff] uppercase tracking-wider">
                CUSTOMISABLE
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-[#F5F8FF] truncate font-space mt-0.5">
              {dish.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs font-space">
              <span className="font-extrabold text-[#ffd86b]">₹{dish.price}</span>
              <span className="text-[#869396]">·</span>
              <span className="text-[#75f5a6] text-[11px]">{dish.protein}g protein</span>
              <span className="text-[#869396]">·</span>
              <span className="text-[#869396] text-[11px]">{dish.calories} kcal</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 cursor-pointer flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scrollable Customization Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-[#e0e1f2]">
          {/* Section 1: Portion Size */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-space font-bold text-xs uppercase tracking-wider text-[#F5F8FF] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#63e6ff]">scale</span>
                1. SELECT PORTION SIZE
              </span>
              <span className="text-[10px] font-space text-[#ffd86b] bg-[#ffd86b]/10 px-2 py-0.5 rounded font-bold">
                REQUIRED
              </span>
            </div>

            <div className="space-y-2">
              {portionOptions.map((portion) => {
                const isSelected = selectedPortionId === portion.id;
                return (
                  <label
                    key={portion.id}
                    onClick={() => setSelectedPortionId(portion.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#63e6ff]/10 border-[#63e6ff] shadow-sm'
                        : 'bg-[#060914] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#63e6ff]' : 'border-white/30'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#63e6ff]" />}
                      </div>
                      <div>
                        <div className="font-bold text-[#F5F8FF] font-space">{portion.name}</div>
                        <div className="text-[10px] text-[#869396]">{portion.subtext}</div>
                      </div>
                    </div>
                    <span className="font-space font-extrabold text-xs text-[#ffd86b]">
                      {portion.priceDelta === 0
                        ? '₹' + dish.price
                        : portion.priceDelta > 0
                        ? `+₹${portion.priceDelta}`
                        : `-₹${Math.abs(portion.priceDelta)}`}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 2: Spice Level Matrix */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-space font-bold text-xs uppercase tracking-wider text-[#F5F8FF] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ff6b7a]">local_fire_department</span>
                2. DECCAN SPICE MATRIX
              </span>
              <span className="text-[10px] font-space text-[#75f5a6] bg-[#75f5a6]/10 px-2 py-0.5 rounded font-bold">
                CUSTOMISABLE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {spiceOptions.map((opt) => {
                const isSelected = selectedSpice === opt.level;
                return (
                  <div
                    key={opt.level}
                    onClick={() => setSelectedSpice(opt.level)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white/10 border-[#ffd86b] shadow-sm'
                        : 'bg-[#060914] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-space font-bold text-xs" style={{ color: opt.color }}>
                        {opt.label}
                      </span>
                      <span className="material-symbols-outlined text-[16px]" style={{ color: opt.color }}>
                        {opt.icon}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#869396] mt-1 leading-snug">{opt.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Addons & Accompaniments */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-space font-bold text-xs uppercase tracking-wider text-[#F5F8FF] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ffd86b]">restaurant</span>
                3. HYDERABAD ACCOMPANIMENTS
              </span>
              <span className="text-[10px] text-[#869396] font-space">OPTIONAL</span>
            </div>

            <div className="space-y-2">
              {addonList.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-[#75f5a6]/10 border-[#75f5a6]'
                        : 'bg-[#060914] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-[#75f5a6] border-[#75f5a6] text-black font-bold text-[10px]' : 'border-white/30'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#F5F8FF]">{addon.name}</div>
                        <div className="text-[10px] text-[#869396] font-space">
                          +{addon.cal} kcal · +{addon.prot}g protein
                        </div>
                      </div>
                    </div>
                    <span className="font-space font-extrabold text-xs text-[#ffd86b]">+₹{addon.price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Cooking Instructions */}
          <div className="space-y-2">
            <span className="font-space font-bold text-xs uppercase tracking-wider text-[#F5F8FF] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#63e6ff]">edit_note</span>
              4. SPECIAL COOKING INSTRUCTIONS
            </span>
            <input
              type="text"
              value={cookingInstructions}
              onChange={(e) => setCookingInstructions(e.target.value)}
              placeholder="e.g. Keep salan spicy, less oil, extra mint leaves..."
              className="w-full bg-[#060914] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F5F8FF] placeholder:text-[#869396]/50 focus:outline-none focus:border-[#63e6ff]"
            />
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-4 bg-[#0c1222] border-t border-white/10 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-space text-[#869396] uppercase">TOTAL ITEM PRICE</div>
            <div className="text-xl font-extrabold font-space text-[#ffd86b] tabular-nums">
              ₹{finalCalculatedPrice}
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#ba027b] to-[#63e6ff] text-black font-space font-extrabold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span>ADD ITEM TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
};
