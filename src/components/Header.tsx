import React from 'react';
import { ASSET_URLS, HYDERABAD_AREAS } from '../data/mockData';
import { ScreenId, HyderabadAreaId } from '../types';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  cartCount: number;
  selectedSector: string;
  onSelectSector: (sector: string) => void;
  activeAreaId?: HyderabadAreaId;
  onSelectArea?: (areaId: HyderabadAreaId) => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  cartCount,
  selectedSector,
  onSelectSector,
  activeAreaId = 'hitec-city',
  onSelectArea,
  title
}) => {
  const [showSectorDropdown, setShowSectorDropdown] = React.useState(false);
  const currentArea = HYDERABAD_AREAS.find((a) => a.id === activeAreaId || a.code === selectedSector) || HYDERABAD_AREAS[0];

  const isHome = currentScreen === 'home';

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-safe bg-[#10182A]/90 backdrop-blur-xl border-b border-[#63e6ff]/15 shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
      <div className="h-16 px-4 flex items-center justify-between gap-3 max-w-[480px] mx-auto w-full">
        {/* Left Section: Back button or Logo */}
        <div className="flex items-center gap-2 shrink-0">
          {!isHome ? (
            <button
              onClick={() => onNavigate('home')}
              aria-label="Go Back"
              className="w-9 h-9 rounded-xl bg-[#181B27] border border-white/10 flex items-center justify-center text-[#F5F8FF] hover:text-[#63e6ff] active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 focus:outline-none group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#181B27] border border-white/15 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src={ASSET_URLS.logo}
                  alt="DISHØ Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <span className="font-space font-extrabold text-sm tracking-widest text-[#F5F8FF] group-hover:text-[#63e6ff] transition-colors">
                DISHØ
              </span>
            </button>
          )}
        </div>

        {/* Center Section: Hyderabad Area Sector Switcher or Screen Title */}
        <div className="flex-1 flex justify-center min-w-0 px-1">
          {isHome ? (
            <div className="relative">
              <button
                onClick={() => setShowSectorDropdown(!showSectorDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181B27] border text-[#F5F8FF] hover:bg-[#1E2333] transition-all shadow-sm cursor-pointer max-w-[170px]"
                style={{ borderColor: `${currentArea.primaryColor}60` }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 animate-pulse"
                  style={{
                    backgroundColor: currentArea.primaryColor,
                    boxShadow: `0 0 8px ${currentArea.primaryColor}`
                  }}
                ></span>
                <span className="font-space text-[11px] font-bold tracking-wider uppercase truncate">
                  {currentArea.code}
                </span>
                <span
                  className="material-symbols-outlined text-[16px] shrink-0"
                  style={{ color: currentArea.primaryColor }}
                >
                  {showSectorDropdown ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {showSectorDropdown && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 bg-[#10182A] border border-white/15 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.9)] p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#869396] uppercase tracking-widest border-b border-white/5 flex items-center justify-between">
                    <span>HYDERABAD SECTORS</span>
                    <span className="text-[#ffd86b] font-mono">5 ZONES</span>
                  </div>
                  <div className="space-y-1 mt-1 max-h-64 overflow-y-auto">
                    {HYDERABAD_AREAS.map((area) => {
                      const isSelected = area.id === activeAreaId || area.code === selectedSector;
                      return (
                        <button
                          key={area.id}
                          onClick={() => {
                            onSelectSector(area.code);
                            if (onSelectArea) onSelectArea(area.id);
                            setShowSectorDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-[#181B27] transition-all cursor-pointer ${
                            isSelected ? 'bg-[#181B27] border' : 'border border-transparent'
                          }`}
                          style={{
                            borderColor: isSelected ? `${area.primaryColor}60` : 'transparent'
                          }}
                        >
                          <div className="flex items-center gap-2.5 truncate pr-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{
                                backgroundColor: area.primaryColor,
                                boxShadow: isSelected ? `0 0 8px ${area.primaryColor}` : 'none'
                              }}
                            ></span>
                            <div className="truncate">
                              <span
                                className="block font-space text-xs font-bold truncate"
                                style={{ color: isSelected ? area.primaryColor : '#F5F8FF' }}
                              >
                                {area.name}
                              </span>
                              <span className="block text-[10px] text-[#869396] font-normal truncate">
                                {area.tagline}
                              </span>
                            </div>
                          </div>
                          <span
                            className="font-space text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0"
                            style={{
                              backgroundColor: `${area.primaryColor}20`,
                              color: area.primaryColor
                            }}
                          >
                            {area.dialectBadge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <h1 className="font-space text-[14px] font-extrabold text-[#F5F8FF] tracking-wider uppercase truncate text-center">
              {title || 'DISHØ'}
            </h1>
          )}
        </div>

        {/* Right Section: Search, Cart Badge & Profile */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('search')}
            aria-label="Open Search"
            className="w-9 h-9 rounded-xl bg-[#181B27] border border-white/10 flex items-center justify-center text-[#869396] hover:text-[#63e6ff] active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
          </button>

          <button
            onClick={() => onNavigate('cart')}
            aria-label="Open Dock"
            className="w-9 h-9 rounded-xl bg-[#181B27] border border-white/10 flex items-center justify-center text-[#869396] hover:text-[#63e6ff] relative active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff4fb3] text-[#F5F8FF] text-[9px] font-bold flex items-center justify-center shadow-[0_0_8px_#ff4fb3]">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('profile')}
            aria-label="View Profile"
            className="w-9 h-9 rounded-xl bg-[#181B27] border border-white/10 flex items-center justify-center text-[#869396] hover:text-[#63e6ff] active:scale-95 transition-all overflow-hidden cursor-pointer shadow-sm"
          >
            <img
              src={ASSET_URLS.userAvatar}
              alt="User"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
