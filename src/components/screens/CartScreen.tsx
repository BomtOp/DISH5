import React, { useState } from 'react';
import { CartItem, Coupon, ScreenId } from '../../types';
import { INITIAL_COUPONS } from '../../data/mockData';

interface CartScreenProps {
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  onNavigate: (screen: ScreenId) => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem: _onRemoveItem,
  onProceedToCheckout,
  onNavigate,
  appliedCoupon,
  onApplyCoupon
}) => {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const restaurantKeys = Array.from(new Set(cart.map((item) => item.dish.restaurantId)));
  const isDualZone = restaurantKeys.length > 1;

  const itemTotal = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? (isDualZone ? 55 : 35) : 0;
  const platformFee = cart.length > 0 ? 10 : 0;
  const packagingFee = cart.length > 0 ? 25 : 0;

  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  const grandTotal = Math.max(0, itemTotal + deliveryFee + platformFee + packagingFee - discount);

  const handleApplyCode = () => {
    setCouponError('');
    const code = couponCodeInput.trim().toUpperCase();
    const match = INITIAL_COUPONS.find((c) => c.code === code);
    if (!match) {
      setCouponError('Invalid voucher code. Try KIRRAK50 or DURGAMDUO');
      return;
    }
    if (itemTotal < match.minSpend) {
      setCouponError(`Min order ₹${match.minSpend} required for this coupon`);
      return;
    }
    onApplyCoupon(match);
    setCouponCodeInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pb-24 pt-24 px-4 max-w-[480px] mx-auto w-full flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#10182A] border border-white/10 flex items-center justify-center text-[#869396] mb-4">
          <span className="material-symbols-outlined text-[36px]">production_quantity_limits</span>
        </div>
        <h2 className="text-xl font-bold text-[#F5F8FF] font-space mb-2">YOUR DISHØ DOCK IS EMPTY</h2>
        <p className="text-xs text-[#869396] max-w-xs mb-6">
          Initialize telemetry synthesis by adding dishes from Hyderabad's premier culinary nodes.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-3 rounded-xl bg-[#63e6ff] text-black font-space font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          DISCOVER HYDERABAD DISHES
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-5">
      {/* Dual Zone Route HUD */}
      {isDualZone && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#181b27] via-[#10182A] to-[#121c33] border border-[#63e6ff]/30 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-space font-extrabold text-[#63e6ff] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#63e6ff] animate-ping" />
              DUAL-ZONE CO-ROUTE ACTIVE
            </span>
            <span className="text-[9px] font-space font-bold px-2 py-0.5 rounded bg-[#75f5a6]/20 text-[#75f5a6]">
              1.8 KM SEPARATION (≤ 3.0 KM RULE)
            </span>
          </div>

          <div className="relative flex flex-col gap-3">
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[#060914] border border-[#63e6ff]/30 flex items-center justify-center text-xs font-bold text-[#63e6ff]">
                01
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-[#F5F8FF]">Bawarchi Cyber Dum Lab</div>
                <div className="text-[10px] text-[#869396]">Madhapur Cyber Hub • Dum Pot 04</div>
              </div>
              <span className="text-[10px] text-[#75f5a6] font-space font-bold">READY FIRST</span>
            </div>

            <div className="ml-5 border-l-2 border-dashed border-[#63e6ff]/30 h-4" />

            <div className="flex items-start gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[#060914] border border-[#ffd86b]/30 flex items-center justify-center text-xs font-bold text-[#ffd86b]">
                02
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-[#F5F8FF]">Pista House Haleem Forge</div>
                <div className="text-[10px] text-[#869396]">Kondapur Arterial • Copper Deg 01</div>
              </div>
              <span className="text-[10px] text-[#ffd86b] font-space font-bold">CO-ROUTE PICKUP</span>
            </div>
          </div>
          <p className="text-[10px] text-[#869396] mt-3 pt-2 border-t border-white/5">
            Single courier assigned via Durgam Cheruvu Cable Bridge. Guaranteed temperature preservation.
          </p>
        </div>
      )}

      {/* Cart Items List */}
      <div className="space-y-3">
        <h3 className="font-space font-bold text-xs text-[#869396] tracking-wider uppercase">
          COMMITTED ITEMS ({cart.reduce((a, b) => a + b.quantity, 0)})
        </h3>

        {cart.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-[#10182A]/80 border border-white/5 flex items-center gap-3.5 shadow-sm"
          >
            <img
              src={item.dish.imageUrl}
              alt={item.dish.name}
              className="w-16 h-16 rounded-xl object-cover border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#F5F8FF] truncate">{item.dish.name}</h4>
              <p className="text-[10px] text-[#869396] truncate mt-0.5">
                {item.customization?.spiceLevel?.toUpperCase()} • {item.dish.restaurantName}
              </p>
              <div className="text-xs font-bold text-[#ffd86b] font-space mt-1">
                ₹{item.finalPrice * item.quantity}
              </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 bg-[#060914] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="w-6 h-6 rounded-lg bg-[#181B27] flex items-center justify-center text-xs text-[#F5F8FF] hover:text-[#ff6b7a] cursor-pointer"
              >
                -
              </button>
              <span className="text-xs font-bold text-[#63e6ff] px-1 font-space tabular-nums">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="w-6 h-6 rounded-lg bg-[#181B27] flex items-center justify-center text-xs text-[#F5F8FF] hover:text-[#75f5a6] cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vouchers & Coupons */}
      <div className="p-4 rounded-2xl bg-[#10182A]/70 border border-white/5 space-y-3">
        <span className="text-xs font-bold text-[#F5F8FF] font-space flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#ffd86b]">confirmation_number</span>
          HYDERABAD DISPATCH VOUCHERS
        </span>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={couponCodeInput}
            onChange={(e) => setCouponCodeInput(e.target.value)}
            placeholder="ENTER CODE (E.G. KIRRAK50)"
            className="flex-1 bg-[#060914] border border-white/10 rounded-xl px-3 py-2 text-xs font-space text-[#F5F8FF] uppercase placeholder:text-[#869396]/60 focus:outline-none focus:border-[#63e6ff]"
          />
          <button
            onClick={handleApplyCode}
            className="px-4 py-2 rounded-xl bg-[#63e6ff] text-black font-space font-bold text-xs cursor-pointer hover:brightness-110 active:scale-95 transition-all"
          >
            APPLY
          </button>
        </div>

        {couponError && <p className="text-[11px] text-[#ff6b7a] font-space">{couponError}</p>}

        {appliedCoupon ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#75f5a6]/10 border border-[#75f5a6]/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#75f5a6] text-[18px]">verified</span>
              <div>
                <div className="text-xs font-bold text-[#75f5a6] font-space">{appliedCoupon.code} APPLIED</div>
                <div className="text-[10px] text-[#869396]">{appliedCoupon.description}</div>
              </div>
            </div>
            <button
              onClick={() => onApplyCoupon(null)}
              className="text-[10px] text-[#ff6b7a] font-space font-bold hover:underline cursor-pointer"
            >
              REMOVE
            </button>
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
            {INITIAL_COUPONS.map((c) => (
              <button
                key={c.code}
                onClick={() => onApplyCoupon(c)}
                className="px-2.5 py-1.5 rounded-lg bg-[#060914] border border-white/10 hover:border-[#63e6ff]/40 text-left whitespace-nowrap cursor-pointer transition-all flex-shrink-0"
              >
                <div className="text-[11px] font-bold text-[#63e6ff] font-space">{c.code}</div>
                <div className="text-[9px] text-[#869396]">₹{c.discountAmount} OFF</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bill Summary */}
      <div className="p-4 rounded-2xl bg-[#10182A]/70 border border-white/5 space-y-2 text-xs font-space">
        <div className="flex items-center justify-between text-[#869396]">
          <span>Item Total</span>
          <span className="text-[#F5F8FF] tabular-nums">₹{itemTotal}</span>
        </div>
        <div className="flex items-center justify-between text-[#869396]">
          <span>Hyper-Local Delivery ({isDualZone ? 'Dual Route' : 'Direct'})</span>
          <span className="text-[#F5F8FF] tabular-nums">₹{deliveryFee}</span>
        </div>
        <div className="flex items-center justify-between text-[#869396]">
          <span>Thermal Packaging Pods</span>
          <span className="text-[#F5F8FF] tabular-nums">₹{packagingFee}</span>
        </div>
        <div className="flex items-center justify-between text-[#869396]">
          <span>Platform Protocol Fee</span>
          <span className="text-[#F5F8FF] tabular-nums">₹{platformFee}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-[#75f5a6] font-bold">
            <span>Voucher Savings</span>
            <span className="tabular-nums">-₹{discount}</span>
          </div>
        )}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm font-bold text-[#F5F8FF]">
          <span>TO PAY</span>
          <span className="text-[#ffd86b] text-base tabular-nums">₹{grandTotal}</span>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="fixed bottom-16 inset-x-0 p-4 bg-[#10182A]/90 backdrop-blur-xl border-t border-white/10 max-w-[480px] mx-auto z-40">
        <button
          onClick={onProceedToCheckout}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ba027b] to-[#63e6ff] text-black font-space font-extrabold text-sm uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-between px-5 cursor-pointer"
        >
          <div className="text-left">
            <div className="text-[10px] opacity-70">TOTAL PAYABLE</div>
            <div className="text-base leading-none font-bold">₹{grandTotal}</div>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>NEXT: SELECT DELIVERY ADDRESS</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </div>
        </button>
      </div>
    </div>
  );
};
