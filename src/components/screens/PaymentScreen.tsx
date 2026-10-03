import React, { useState } from 'react';
import { CartItem, Coupon, ScreenId, Address, PaymentMethod } from '../../types';
import { PAYMENT_METHODS } from '../../data/mockData';

interface PaymentScreenProps {
  cart: CartItem[];
  selectedAddress: Address;
  appliedCoupon: Coupon | null;
  onPlaceOrder: (paymentMethodId: string) => void;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  cart,
  selectedAddress,
  appliedCoupon,
  onPlaceOrder,
  onBack
}) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string>('pm-gpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const itemTotal = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  const isDualZone = new Set(cart.map((i) => i.dish.restaurantId)).size > 1;
  const deliveryFee = isDualZone ? 50 : 35;
  const packagingFee = 25;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, itemTotal + deliveryFee + packagingFee - discount);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onPlaceOrder(selectedMethodId);
    }, 1000);
  };

  const paymentOptions: Array<{
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    badge?: string;
    popular?: boolean;
  }> = [
    {
      id: 'pm-gpay',
      title: 'Google Pay / PhonePe (UPI)',
      subtitle: 'Fastest payment • Pay directly from bank account',
      icon: 'account_balance_wallet',
      badge: 'RECOMMENDED',
      popular: true
    },
    {
      id: 'pm-cod',
      title: 'Cash on Delivery (Pay When Food Arrives)',
      subtitle: 'Pay cash or UPI directly to delivery partner at your door',
      icon: 'payments',
      badge: 'NO ONLINE PAYMENT NEEDED',
      popular: true
    },
    {
      id: 'pm-card',
      title: 'Credit / Debit Card (Visa, RuPay, MasterCard)',
      subtitle: '•••• •••• •••• 4192 (HDFC Titanium)',
      icon: 'credit_card'
    },
    {
      id: 'pm-paytm',
      title: 'Paytm Wallet / Net Banking',
      subtitle: 'HDFC, SBI, ICICI, Axis and 40+ banks',
      icon: 'account_balance'
    }
  ];

  return (
    <div className="min-h-screen pb-32 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-4">
      {/* Header with Step Indicator */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-[#10182A] border border-white/10 text-white flex items-center justify-center cursor-pointer hover:border-white/30"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="text-center">
          <span className="text-[10px] font-space font-extrabold text-[#60B246] bg-[#60B246]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            STEP 2 OF 2 • PAYMENT
          </span>
          <h2 className="text-base font-extrabold text-[#F5F8FF] font-space mt-1">
            Choose Payment Method
          </h2>
        </div>
        <div className="w-9" />
      </div>

      {/* Delivery Summary Pill */}
      <div className="p-3 rounded-2xl bg-[#10182A] border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-[#63e6ff]/20 text-[#63e6ff] flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
          </span>
          <div>
            <div className="text-xs font-bold text-[#F5F8FF]">
              Delivering to {selectedAddress.label}
            </div>
            <div className="text-[10px] text-[#869396] truncate max-w-[240px]">
              {selectedAddress.line1}
            </div>
          </div>
        </div>
        <button
          onClick={onBack}
          className="text-[11px] font-space text-[#63e6ff] font-bold hover:underline cursor-pointer"
        >
          Change
        </button>
      </div>

      {/* Payment Options List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-space">
          <span className="font-extrabold text-[#F5F8FF] tracking-wider uppercase">
            PAYMENT OPTIONS
          </span>
          <span className="text-[10px] text-[#75f5a6]">100% SECURE & VERIFIED</span>
        </div>

        {paymentOptions.map((opt) => {
          const isSelected = selectedMethodId === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => setSelectedMethodId(opt.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#10182A] border-[#60B246] shadow-[0_0_15px_rgba(96,178,70,0.25)]'
                  : 'bg-[#10182A]/70 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-[#60B246] text-black font-bold' : 'bg-[#181B27] text-[#869396]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-[#F5F8FF] font-space">{opt.title}</h4>
                      {opt.badge && (
                        <span className="text-[9px] font-space font-extrabold px-1.5 py-0.5 rounded bg-[#60B246]/15 text-[#60B246]">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#869396] mt-0.5 leading-snug">{opt.subtitle}</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                    isSelected ? 'border-[#60B246] bg-[#60B246]' : 'border-white/20'
                  }`}
                >
                  {isSelected && <span className="text-black font-extrabold text-[11px]">✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plain, Friendly Bill Summary */}
      <div className="p-4 rounded-2xl bg-[#10182A] border border-white/5 space-y-2 text-xs font-space">
        <div className="font-extrabold text-[#F5F8FF] uppercase tracking-wider text-xs pb-1 border-b border-white/5">
          Bill Details
        </div>
        <div className="flex items-center justify-between text-[#869396]">
          <span>Item Total</span>
          <span className="text-[#F5F8FF] font-bold">₹{itemTotal}</span>
        </div>
        <div className="flex items-center justify-between text-[#869396]">
          <span>Delivery Partner Fee</span>
          <span className="text-[#F5F8FF]">₹{deliveryFee}</span>
        </div>
        <div className="flex items-center justify-between text-[#869396]">
          <span>Restaurant Packaging & Taxes</span>
          <span className="text-[#F5F8FF]">₹{packagingFee}</span>
        </div>
        {discount > 0 && (
          <div className="flex items-center justify-between text-[#60B246] font-bold">
            <span>Coupon Discount ({appliedCoupon?.code})</span>
            <span>-₹{discount}</span>
          </div>
        )}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm font-bold text-[#F5F8FF]">
          <span>To Pay</span>
          <span className="text-base text-[#ffd86b] font-extrabold tabular-nums">₹{grandTotal}</span>
        </div>
      </div>

      {/* Safety Assurance */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#60B246]/10 border border-[#60B246]/20 text-[11px] text-[#60B246] font-space">
        <span className="material-symbols-outlined text-[18px]">verified_user</span>
        <span>Safe & Contactless Delivery Guaranteed · Clay deg sealed hot</span>
      </div>

      {/* Floating Bottom Pay Button */}
      <div className="fixed bottom-16 inset-x-0 p-3 bg-[#10182A]/95 backdrop-blur-xl border-t border-white/10 max-w-[480px] mx-auto z-40">
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#60B246] to-[#00DF89] text-black font-space font-extrabold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(96,178,70,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-between cursor-pointer disabled:opacity-50"
        >
          <div className="text-left">
            <div className="text-[10px] font-bold opacity-80">TOTAL AMOUNT</div>
            <div className="text-base font-black leading-tight">₹{grandTotal}</div>
          </div>

          <div className="flex items-center gap-1.5 font-black">
            <span>{isProcessing ? 'PLACING ORDER...' : 'PLACE ORDER'}</span>
            <span className="material-symbols-outlined text-[20px]">
              {isProcessing ? 'hourglass_top' : 'arrow_forward'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
