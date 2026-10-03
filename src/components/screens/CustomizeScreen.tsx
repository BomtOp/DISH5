import React, { useState } from 'react';
import { Dish, SpiceLevel, CustomOrderState } from '../../types';

interface CustomizeScreenProps {
  dish: Dish;
  onSaveCustomization: (customOrder: CustomOrderState) => void;
  onBack: () => void;
}

export const CustomizeScreen: React.FC<CustomizeScreenProps> = ({
  dish,
  onSaveCustomization,
  onBack
}) => {
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('medium');
  const [portionScale, setPortionScale] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const hyderabadAddons = [
    { id: 'salan', name: 'Extra Mirchi Ka Salan (Charcoal Simmered)', price: 35, calories: 45, protein: 2 },
    { id: 'raita', name: 'Thick Burani Garlic Raita', price: 30, calories: 40, protein: 3 },
    { id: 'biryani-masala', name: 'Extra Handi Dum Masala Layer', price: 25, calories: 20, protein: 1 },
    { id: 'cashews-onions', name: 'Ghee Fried Birista Onions & Cashews', price: 40, calories: 95, protein: 4 }
  ];

  const handleToggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const addonTotal = selectedAddons.reduce((sum, id) => {
    const addon = hyderabadAddons.find((a) => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const basePrice = Math.round(dish.price * portionScale) + addonTotal;

  const currentCalories = Math.round(
    dish.calories * portionScale +
      selectedAddons.reduce((sum, id) => {
        const addon = hyderabadAddons.find((a) => a.id === id);
        return sum + (addon ? addon.calories : 0);
      }, 0)
  );

  const currentProtein = Math.round(
    dish.protein * portionScale +
      selectedAddons.reduce((sum, id) => {
        const addon = hyderabadAddons.find((a) => a.id === id);
        return sum + (addon ? addon.protein : 0);
      }, 0)
  );

  const handleConfirm = () => {
    const customState: CustomOrderState = {
      dishId: dish.id,
      spiceLevel,
      promptText: notes || `Customized portion ${portionScale}x with ${selectedAddons.join(', ')}`,
      portionGrams: Math.round((dish.defaultPortionGrams || 500) * portionScale),
      portionUnit: 'g',
      modifiers: {
        grilledPaneer: 'std',
        yogurtDrizzle: 'included',
        spinachRice: 'rice',
        crispyGarlic: true
      },
      customNotes: notes
    };
    onSaveCustomization(customState);
  };

  return (
    <div className="min-h-screen pb-32 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-[#10182A] border border-white/10 text-white flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="text-center">
          <h2 className="text-base font-extrabold text-[#F5F8FF] font-space uppercase">
            CUSTOMIZE SPECS
          </h2>
          <p className="text-[10px] text-[#63e6ff]">{dish.name}</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Live Macro Recalculator Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#181b27] via-[#10182A] to-[#121c33] border border-[#63e6ff]/30 grid grid-cols-3 gap-2 text-center font-space">
        <div>
          <div className="text-[9px] text-[#869396] uppercase">Active Price</div>
          <div className="text-base font-bold text-[#ffd86b] tabular-nums">₹{basePrice}</div>
        </div>
        <div>
          <div className="text-[9px] text-[#869396] uppercase">Total Energy</div>
          <div className="text-base font-bold text-[#63e6ff] tabular-nums">{currentCalories} kcal</div>
        </div>
        <div>
          <div className="text-[9px] text-[#869396] uppercase">Bio-Protein</div>
          <div className="text-base font-bold text-[#75f5a6] tabular-nums">{currentProtein}g</div>
        </div>
      </div>

      {/* Portion Matrix */}
      <div className="p-4 rounded-2xl bg-[#10182A]/80 border border-white/5 space-y-3">
        <span className="text-xs font-bold text-[#F5F8FF] font-space tracking-wider uppercase">
          PORTION CALIBRATION
        </span>
        <div className="grid grid-cols-3 gap-2 font-space">
          {[
            { label: 'SOLO POD', scale: 0.8, desc: 'Compact Portion' },
            { label: 'STANDARD', scale: 1.0, desc: 'Original Chef Spec' },
            { label: 'DAAWAT FEAST', scale: 1.5, desc: 'Large 1.5x Feast' }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setPortionScale(item.scale)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                portionScale === item.scale
                  ? 'bg-[#63e6ff]/20 text-[#63e6ff] border-[#63e6ff]'
                  : 'bg-[#060914] text-[#869396] border-white/10'
              }`}
            >
              <div className="text-xs font-bold">{item.label}</div>
              <div className="text-[9px] opacity-70 mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Deccani Spice Tolerance */}
      <div className="p-4 rounded-2xl bg-[#10182A]/80 border border-white/5 space-y-3">
        <span className="text-xs font-bold text-[#F5F8FF] font-space tracking-wider uppercase">
          DECCANI SPICE MATRIX
        </span>
        <div className="grid grid-cols-4 gap-2 font-space">
          {(['mild', 'medium', 'spicy', 'mecha'] as SpiceLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSpiceLevel(lvl)}
              className={`p-2 rounded-xl border text-center transition-all cursor-pointer uppercase ${
                spiceLevel === lvl
                  ? lvl === 'mecha'
                    ? 'bg-[#ff4fb3]/20 text-[#ff4fb3] border-[#ff4fb3]'
                    : 'bg-[#ffd86b]/20 text-[#ffd86b] border-[#ffd86b]'
                  : 'bg-[#060914] text-[#869396] border-white/10'
              }`}
            >
              <div className="text-xs font-bold">{lvl}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Hyderabad Add-ons */}
      <div className="p-4 rounded-2xl bg-[#10182A]/80 border border-white/5 space-y-3">
        <span className="text-xs font-bold text-[#F5F8FF] font-space tracking-wider uppercase">
          HYDERABAD CULINARY ADD-ONS
        </span>
        <div className="space-y-2">
          {hyderabadAddons.map((addon) => {
            const isSelected = selectedAddons.includes(addon.id);
            return (
              <div
                key={addon.id}
                onClick={() => handleToggleAddon(addon.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#63e6ff]/10 border-[#63e6ff]/50'
                    : 'bg-[#060914] border-white/5'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-[#F5F8FF]">{addon.name}</div>
                  <div className="text-[10px] text-[#869396] font-space">
                    +{addon.calories} kcal • +{addon.protein}g protein
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#ffd86b] font-space">+₹{addon.price}</span>
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                      isSelected ? 'bg-[#63e6ff] text-black font-bold' : 'bg-white/10 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Kitchen Notes */}
      <div className="p-4 rounded-2xl bg-[#10182A]/80 border border-white/5 space-y-2">
        <span className="text-xs font-bold text-[#F5F8FF] font-space tracking-wider uppercase">
          CHEF INSTRUCTIONS / ALLERGIES
        </span>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="E.g. No dairy, separate salan pod, extra crispy onions..."
          className="w-full bg-[#060914] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5F8FF] focus:outline-none focus:border-[#63e6ff]"
        />
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-16 inset-x-0 p-4 bg-[#10182A]/90 backdrop-blur-xl border-t border-white/10 max-w-[480px] mx-auto z-40">
        <button
          onClick={handleConfirm}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ba027b] to-[#63e6ff] text-black font-space font-extrabold text-sm uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-between px-5 cursor-pointer"
        >
          <span>CONFIRM SPEC & ADD TO CART</span>
          <span className="text-base font-bold tabular-nums">₹{basePrice}</span>
        </button>
      </div>
    </div>
  );
};
