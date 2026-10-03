import React, { useState } from 'react';
import { CartItem, Coupon, ScreenId, Address } from '../../types';
import { SAVED_ADDRESSES } from '../../data/mockData';

interface CheckoutScreenProps {
  cart: CartItem[];
  selectedAddress: Address;
  onSelectAddress: (addr: Address) => void;
  onProceedToPayment: () => void;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  appliedCoupon: Coupon | null;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cart,
  selectedAddress,
  onSelectAddress,
  onProceedToPayment,
  onBack
}) => {
  const [addresses, setAddresses] = useState<Address[]>(SAVED_ADDRESSES);
  const [selectedInstruction, setSelectedInstruction] = useState<string>('Leave at door');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState<'Home' | 'Work' | 'Sector Hub'>('Home');
  const [newLine1, setNewLine1] = useState('');
  const [newSector, setNewSector] = useState('Hitec City • Sector 04');

  const itemTotal = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  const restaurantName = cart[0]?.dish.restaurantName || 'Bawarchi Cyber Dum Lab';

  const instructions = [
    { id: 'door', label: 'Leave at door', icon: 'door_front' },
    { id: 'bell', label: 'Ring bell', icon: 'notifications' },
    { id: 'quiet', label: 'Avoid calling', icon: 'volume_off' },
    { id: 'guard', label: 'Leave with guard', icon: 'shield_person' }
  ];

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLine1.trim()) return;
    const created: Address = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      line1: newLine1.trim(),
      sector: newSector,
      city: 'Hyderabad 500081',
      notes: selectedInstruction,
      isDefault: false
    };
    setAddresses((prev) => [created, ...prev]);
    onSelectAddress(created);
    setIsAddingNew(false);
    setNewLine1('');
  };

  return (
    <div className="min-h-screen pb-32 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-[#10182A] border border-white/10 text-white flex items-center justify-center cursor-pointer hover:border-white/30"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="text-center">
          <span className="text-[10px] font-space font-extrabold text-[#63e6ff] bg-[#63e6ff]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            STEP 1 OF 2 • ADDRESS
          </span>
          <h2 className="text-base font-extrabold text-[#F5F8FF] font-space mt-1">
            Where should we deliver?
          </h2>
        </div>
        <div className="w-9" />
      </div>

      {/* Selected Restaurant & Delivery Time Preview */}
      <div className="p-3.5 rounded-2xl bg-[#10182A] border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#FF8000]/20 text-[#FF8000] flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">restaurant</span>
          </div>
          <div>
            <div className="text-xs font-bold text-[#F5F8FF]">{restaurantName}</div>
            <div className="text-[10px] text-[#869396] font-space">
              {cart.reduce((a, b) => a + b.quantity, 0)} items · Estimated 20-25 mins
            </div>
          </div>
        </div>
        <span className="text-[11px] font-space text-[#75f5a6] font-bold bg-[#75f5a6]/10 px-2 py-1 rounded-lg">
          HOT DUM FRESH
        </span>
      </div>

      {/* Address Selection Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-space">
          <span className="font-extrabold text-[#F5F8FF] tracking-wider uppercase">
            CHOOSE DELIVERY ADDRESS
          </span>
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="text-[11px] text-[#63e6ff] font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            <span>Add New</span>
          </button>
        </div>

        {/* Add New Address Form Modal/Drawer */}
        {isAddingNew && (
          <form
            onSubmit={handleAddNew}
            className="p-4 rounded-2xl bg-[#181B27] border border-[#63e6ff]/40 space-y-3 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F5F8FF] font-space uppercase">
                Add New Delivery Location
              </span>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-xs text-[#869396] hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="flex gap-2">
              {(['Home', 'Work', 'Sector Hub'] as const).map((lbl) => (
                <button
                  type="button"
                  key={lbl}
                  onClick={() => setNewLabel(lbl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-space font-bold border ${
                    newLabel === lbl
                      ? 'bg-[#63e6ff] text-black border-[#63e6ff]'
                      : 'bg-[#10182A] text-[#869396] border-white/10'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>

            <input
              type="text"
              required
              value={newLine1}
              onChange={(e) => setNewLine1(e.target.value)}
              placeholder="House / Flat No., Apartment, Street name"
              className="w-full bg-[#060914] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5F8FF] placeholder:text-[#869396]/60 focus:outline-none focus:border-[#63e6ff]"
            />

            <input
              type="text"
              value={newSector}
              onChange={(e) => setNewSector(e.target.value)}
              placeholder="Area / Sector (e.g. Hitec City, Madhapur)"
              className="w-full bg-[#060914] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5F8FF] placeholder:text-[#869396]/60 focus:outline-none focus:border-[#63e6ff]"
            />

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#63e6ff] text-black font-space font-bold text-xs uppercase cursor-pointer hover:brightness-110"
            >
              Save & Deliver Here
            </button>
          </form>
        )}

        {/* Existing Saved Addresses */}
        {addresses.map((addr) => {
          const isSelected = selectedAddress.id === addr.id;
          const getIcon = () => {
            if (addr.label === 'Home') return 'home';
            if (addr.label === 'Work') return 'apartment';
            return 'location_on';
          };

          return (
            <div
              key={addr.id}
              onClick={() => onSelectAddress(addr)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#10182A] border-[#63e6ff] shadow-[0_0_15px_rgba(99,230,255,0.2)]'
                  : 'bg-[#10182A]/70 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-[#63e6ff] text-black font-bold' : 'bg-[#181B27] text-[#869396]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{getIcon()}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#F5F8FF] font-space">{addr.label}</h4>
                      {addr.isDefault && (
                        <span className="text-[9px] font-space font-extrabold px-1.5 py-0.2 rounded bg-white/10 text-[#869396]">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#e0e1f2] mt-0.5 font-medium leading-snug">
                      {addr.line1}
                    </p>
                    <p className="text-[11px] text-[#869396] font-space mt-0.5">
                      {addr.sector}, {addr.city}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                    isSelected ? 'border-[#63e6ff] bg-[#63e6ff]' : 'border-white/20'
                  }`}
                >
                  {isSelected && <span className="text-black font-extrabold text-[11px]">✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delivery Instructions Chips */}
      <div className="p-4 rounded-2xl bg-[#10182A] border border-white/5 space-y-2.5">
        <span className="font-extrabold text-xs text-[#F5F8FF] font-space uppercase tracking-wider block">
          Delivery Instructions for Mohammed Imran
        </span>
        <p className="text-[11px] text-[#869396]">
          Tap any note to tell the rider how to hand over your food:
        </p>

        <div className="grid grid-cols-2 gap-2">
          {instructions.map((inst) => {
            const isSelected = selectedInstruction === inst.label;
            return (
              <button
                key={inst.id}
                type="button"
                onClick={() => setSelectedInstruction(inst.label)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#63e6ff]/15 border-[#63e6ff] text-[#63e6ff]'
                    : 'bg-[#060914] border-white/5 text-[#869396] hover:text-[#e0e1f2]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{inst.icon}</span>
                <span className="text-xs font-space font-bold truncate">{inst.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-16 inset-x-0 p-3 bg-[#10182A]/95 backdrop-blur-xl border-t border-white/10 max-w-[480px] mx-auto z-40">
        <button
          onClick={onProceedToPayment}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#ba027b] to-[#63e6ff] text-black font-space font-extrabold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(99,230,255,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-between cursor-pointer"
        >
          <div className="text-left">
            <div className="text-[10px] font-bold opacity-80">DELIVER TO</div>
            <div className="text-sm font-black truncate max-w-[180px]">
              {selectedAddress.label} • {selectedAddress.line1.slice(0, 20)}...
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-black text-xs">
            <span>PROCEED TO PAYMENT</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </div>
        </button>
      </div>
    </div>
  );
};
