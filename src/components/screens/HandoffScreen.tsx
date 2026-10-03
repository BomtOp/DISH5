import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { INITIAL_TRACKING } from '../../data/mockData';

interface HandoffScreenProps {
  onCompleteHandoff: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const HandoffScreen: React.FC<HandoffScreenProps> = ({
  onCompleteHandoff,
  onNavigate
}) => {
  const [sealChecked, setSealChecked] = useState(true);
  const [foodReceived, setFoodReceived] = useState(false);

  const handleConfirmReceived = () => {
    setFoodReceived(true);
    setTimeout(() => {
      onCompleteHandoff();
    }, 800);
  };

  return (
    <div className="min-h-screen pb-32 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('tracking')}
          className="w-9 h-9 rounded-xl bg-[#10182A] border border-white/10 text-white flex items-center justify-center cursor-pointer hover:border-white/30"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="text-center">
          <span className="text-[10px] font-space font-extrabold text-[#75f5a6] bg-[#75f5a6]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            STEP 3 OF 3 • FOOD HANDOVER
          </span>
          <h2 className="text-sm font-extrabold text-[#F5F8FF] font-space mt-0.5">
            Collect Your Food
          </h2>
        </div>
        <div className="w-9" />
      </div>

      {/* Big Friendly OTP Card */}
      <div className="p-6 rounded-3xl bg-[#10182A] border-2 border-[#60B246] shadow-[0_0_30px_rgba(96,178,70,0.25)] text-center space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-space font-extrabold text-[#75f5a6] tracking-widest uppercase">
            YOUR DELIVERY CODE
          </span>
          <p className="text-xs text-[#869396]">
            Tell this 4-digit code to Mohammed Imran when he arrives:
          </p>
        </div>

        {/* 4 Large OTP Digits */}
        <div className="flex items-center justify-center gap-3 py-2">
          {INITIAL_TRACKING.otpCode.split('').map((digit, i) => (
            <div
              key={i}
              className="w-14 h-16 rounded-2xl bg-[#060914] border-2 border-[#ffd86b] text-[#ffd86b] font-mono font-black text-3xl flex items-center justify-center shadow-inner"
            >
              {digit}
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[#869396] font-space">
          🔒 Only share this code after seeing your food package
        </p>
      </div>

      {/* Delivery Partner info reminder */}
      <div className="p-4 rounded-3xl bg-[#10182A] border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={INITIAL_TRACKING.rider.avatarUrl}
            alt="Mohammed Imran"
            className="w-12 h-12 rounded-2xl object-cover border border-[#60B246]"
          />
          <div>
            <div className="text-xs font-bold text-[#F5F8FF]">Mohammed Imran</div>
            <div className="text-[10px] text-[#869396] font-space">
              Delivery Partner · Motorcycle TS-09-EX-4192
            </div>
          </div>
        </div>

        <a
          href="tel:+919849041920"
          className="px-3 py-2 rounded-xl bg-[#60B246]/15 border border-[#60B246]/40 text-[#60B246] font-space text-xs font-bold flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">call</span>
          <span>Call</span>
        </a>
      </div>

      {/* Simple Checklist for Food Receiver */}
      <div className="p-4 rounded-3xl bg-[#10182A] border border-white/10 space-y-3">
        <span className="text-xs font-extrabold text-[#F5F8FF] font-space uppercase tracking-wider block">
          Before taking food, please check:
        </span>

        <label className="flex items-center gap-3 p-2.5 rounded-xl bg-[#060914] border border-white/5 cursor-pointer">
          <input
            type="checkbox"
            checked={sealChecked}
            onChange={(e) => setSealChecked(e.target.checked)}
            className="w-5 h-5 accent-[#60B246] cursor-pointer"
          />
          <div className="text-xs text-[#e0e1f2]">
            <span className="font-bold">Restaurant Safety Seal is unbroken</span>
            <p className="text-[10px] text-[#869396]">Clay pot lid and thermal packaging are tightly sealed</p>
          </div>
        </label>
      </div>

      {/* Floating Bottom Confirm Button */}
      <div className="fixed bottom-16 inset-x-0 p-3 bg-[#10182A]/95 backdrop-blur-xl border-t border-white/10 max-w-[480px] mx-auto z-40">
        <button
          onClick={handleConfirmReceived}
          disabled={foodReceived}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#60B246] to-[#00DF89] text-black font-space font-extrabold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(96,178,70,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">
            {foodReceived ? 'check_circle' : 'thumb_up'}
          </span>
          <span>
            {foodReceived ? 'FOOD RECEIVED! OPENING FEEDBACK...' : 'I HAVE RECEIVED MY FOOD'}
          </span>
        </button>
      </div>
    </div>
  );
};
