import React from 'react';

interface OrderConfirmedScreenProps {
  orderId?: string;
  onTrackOrder: () => void;
  onBackToHome: () => void;
}

export const OrderConfirmedScreen: React.FC<OrderConfirmedScreenProps> = ({
  orderId = 'DS-8821',
  onTrackOrder,
  onBackToHome
}) => {
  return (
    <div className="min-h-screen pb-24 pt-20 px-4 max-w-[480px] mx-auto w-full flex flex-col justify-between space-y-6">
      <div className="space-y-6 pt-4 text-center">
        {/* Animated Celebration Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="w-24 h-24 rounded-full bg-[#60B246]/20 border-2 border-[#60B246] flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(96,178,70,0.4)]">
            <span className="material-symbols-outlined text-[48px] text-[#60B246]">
              check_circle
            </span>
          </div>
          <span className="absolute -top-1 -right-1 text-2xl">🎉</span>
        </div>

        {/* Friendly Order Placed Message */}
        <div className="space-y-1">
          <span className="text-[11px] font-space font-extrabold text-[#60B246] tracking-widest uppercase">
            ORDER PLACED SUCCESSFULLY
          </span>
          <h2 className="text-2xl font-extrabold text-[#F5F8FF] font-space">
            Your Food is Being Cooked!
          </h2>
          <p className="text-xs text-[#869396] font-space">
            Order ID: <span className="text-[#ffd86b] font-bold">#{orderId}</span>
          </p>
        </div>

        {/* Live Kitchen Status Card (Authentic Swiggy/Zomato style) */}
        <div className="p-4 rounded-3xl bg-[#10182A] border border-white/10 space-y-4 text-left shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <div className="text-[10px] text-[#869396] font-space uppercase">ESTIMATED DELIVERY</div>
              <div className="text-xl font-extrabold text-[#ffd86b] font-space">18 - 22 mins</div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#60B246]/15 border border-[#60B246]/30 flex items-center justify-center text-[#60B246]">
              <span className="material-symbols-outlined text-[24px]">soup_kitchen</span>
            </div>
          </div>

          {/* 3 Step Progress Flow */}
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#60B246] text-black font-bold flex items-center justify-center text-xs flex-shrink-0">
                ✓
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[#F5F8FF]">Order Accepted by Restaurant</div>
                <div className="text-[10px] text-[#869396]">Bawarchi Cyber Dum Lab confirmed order</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#ffd86b] text-black font-bold flex items-center justify-center text-xs flex-shrink-0 animate-pulse">
                🍳
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[#ffd86b]">Chef is Preparing Your Food</div>
                <div className="text-[10px] text-[#869396]">Sealing aromatic clay dum at 104°C</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#181B27] border border-white/20 text-[#63e6ff] flex items-center justify-center text-xs flex-shrink-0">
                🚴
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-[#F5F8FF]">Delivery Partner Assigned</div>
                <div className="text-[10px] text-[#869396]">Mohammed Imran will pick up your bag</div>
              </div>
            </div>
          </div>
        </div>

        {/* Deliver to note */}
        <div className="p-3 rounded-2xl bg-[#060914] border border-white/5 flex items-center justify-between text-xs font-space text-left">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#63e6ff]">home</span>
            <div>
              <div className="font-bold text-[#F5F8FF]">Delivering to Home</div>
              <div className="text-[10px] text-[#869396]">Flat 1402, The Skyview Residences</div>
            </div>
          </div>
          <span className="text-[10px] text-[#75f5a6] font-bold">OTP: 4192</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={onTrackOrder}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ba027b] to-[#63e6ff] text-black font-space font-extrabold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(99,230,255,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
          <span>TRACK DELIVERY PARTNER ON MAP</span>
        </button>

        <button
          onClick={onBackToHome}
          className="w-full py-3 rounded-2xl bg-[#181B27] border border-white/10 text-xs font-space font-bold text-[#869396] hover:text-white transition-all cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
