import React from 'react';
import { ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenAiAssistant: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenAiAssistant
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#10182A]/95 backdrop-blur-xl border-t border-[#63e6ff]/15 pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.85)]">
      <div className="h-16 px-2 flex items-center justify-between max-w-[480px] mx-auto w-full relative">
        {/* Tab 1: DISCOVER */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group cursor-pointer ${
            currentScreen === 'home' ? 'text-[#63e6ff]' : 'text-[#869396] hover:text-[#F5F8FF]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[22px] transition-transform group-hover:-translate-y-0.5"
              style={{ fontVariationSettings: currentScreen === 'home' ? "'FILL' 1" : "'FILL' 0" }}
            >
              explore
            </span>
            {currentScreen === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#63e6ff] shadow-[0_0_8px_#63e6ff]"></span>
            )}
          </div>
          <span className="font-space text-[9px] font-bold tracking-widest uppercase">
            DISCOVER
          </span>
        </button>

        {/* Tab 2: EXPLORE */}
        <button
          onClick={() => onNavigate('explore')}
          className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group cursor-pointer ${
            currentScreen === 'explore' ? 'text-[#63e6ff]' : 'text-[#869396] hover:text-[#F5F8FF]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[22px] transition-transform group-hover:-translate-y-0.5"
              style={{ fontVariationSettings: currentScreen === 'explore' ? "'FILL' 1" : "'FILL' 0" }}
            >
              dashboard
            </span>
            {currentScreen === 'explore' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#63e6ff] shadow-[0_0_8px_#63e6ff]"></span>
            )}
          </div>
          <span className="font-space text-[9px] font-bold tracking-widest uppercase">
            EXPLORE
          </span>
        </button>

        {/* Center: Elevated Plus-One AI Household Orchestrator Orb */}
        <div className="flex-1 flex flex-col items-center justify-center relative -top-3">
          <button
            onClick={onOpenAiAssistant}
            aria-label="Plus-One AI Household Orchestrator"
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ba027b] via-[#9c27b0] to-[#63e6ff] p-[2px] shadow-[0_4px_20px_rgba(99,230,255,0.45)] active:scale-90 transition-transform group cursor-pointer"
          >
            <div className="w-full h-full rounded-2xl bg-[#0D1424] flex items-center justify-center group-hover:bg-[#151D33] transition-colors">
              <span className="material-symbols-outlined text-[22px] text-[#63e6ff] animate-pulse">
                psychology
              </span>
            </div>
          </button>
          <span className="font-space text-[8px] font-extrabold tracking-wider text-[#63e6ff] uppercase mt-0.5">
            PLUS-ONE
          </span>
        </div>

        {/* Tab 4: ORDERS */}
        <button
          onClick={() => onNavigate('orders')}
          className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group cursor-pointer ${
            currentScreen === 'orders' ? 'text-[#63e6ff]' : 'text-[#869396] hover:text-[#F5F8FF]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[22px] transition-transform group-hover:-translate-y-0.5"
              style={{ fontVariationSettings: currentScreen === 'orders' ? "'FILL' 1" : "'FILL' 0" }}
            >
              receipt_long
            </span>
            {currentScreen === 'orders' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#63e6ff] shadow-[0_0_8px_#63e6ff]"></span>
            )}
          </div>
          <span className="font-space text-[9px] font-bold tracking-widest uppercase">
            ORDERS
          </span>
        </button>

        {/* Tab 5: SAVED / PROFILE */}
        <button
          onClick={() => onNavigate('saved')}
          className={`flex-1 py-1 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group cursor-pointer ${
            currentScreen === 'saved' ? 'text-[#63e6ff]' : 'text-[#869396] hover:text-[#F5F8FF]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[22px] transition-transform group-hover:-translate-y-0.5"
              style={{ fontVariationSettings: currentScreen === 'saved' ? "'FILL' 1" : "'FILL' 0" }}
            >
              bookmark
            </span>
            {currentScreen === 'saved' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#63e6ff] shadow-[0_0_8px_#63e6ff]"></span>
            )}
          </div>
          <span className="font-space text-[9px] font-bold tracking-widest uppercase">
            SAVED
          </span>
        </button>
      </div>
    </nav>
  );
};
