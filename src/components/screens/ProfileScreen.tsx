import React from 'react';
import { ScreenId, AccessibilitySettings } from '../../types';
import { ASSET_URLS } from '../../data/mockData';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenId) => void;
  accessibilitySettings: AccessibilitySettings;
  onUpdateAccessibility: (settings: AccessibilitySettings) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigate,
  accessibilitySettings,
  onUpdateAccessibility
}) => {
  return (
    <div className="min-h-screen pb-28 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-5">
      {/* Profile Header Card */}
      <div className="p-4 rounded-3xl bg-[#10182A] border border-[#63e6ff]/20 shadow-2xl flex items-center gap-4">
        <img
          src={ASSET_URLS.userAvatar}
          alt="User Avatar"
          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#63e6ff] shadow-[0_0_16px_rgba(99,230,255,0.3)]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-[#F5F8FF] font-space truncate">
              Rohit Pranav
            </h3>
            <span className="text-[9px] font-space font-bold px-1.5 py-0.5 rounded bg-[#ffd86b]/20 text-[#ffd86b]">
              GOLD VIP
            </span>
          </div>
          <p className="text-xs text-[#869396] font-space mt-0.5">
            +91 98490 • Cyberabad Sector 04
          </p>
          <div className="flex items-center gap-3 mt-2 text-[10px] font-space text-[#75f5a6]">
            <span>⚡ 42 Missions</span>
            <span>🪙 1,450 DISHØ Cred</span>
          </div>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="p-2 rounded-2xl bg-[#10182A]/70 border border-white/5 space-y-1">
        {[
          { id: 'addresses', label: 'Hyderabad Delivery Zones', icon: 'pin_drop', desc: '5 Active Drop Pods' },
          { id: 'orders', label: 'Order Mission Log', icon: 'receipt_long', desc: 'History & Re-order' },
          { id: 'notifications', label: 'Comms & Alerts Stream', icon: 'notifications', desc: 'Live Telemetry updates' },
          { id: 'support', label: 'Culinary Support Pod', icon: 'support_agent', desc: '24/7 Deccani Concierge' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ScreenId)}
            className="w-full p-3 rounded-xl hover:bg-[#181b27] transition-all flex items-center justify-between text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-[#63e6ff] group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <div>
                <div className="text-xs font-bold text-[#F5F8FF] font-space">{item.label}</div>
                <div className="text-[10px] text-[#869396]">{item.desc}</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#869396] group-hover:text-[#63e6ff] text-[18px]">
              chevron_right
            </span>
          </button>
        ))}
      </div>

      {/* Accessibility & UX Settings */}
      <div className="p-4 rounded-2xl bg-[#10182A]/70 border border-white/5 space-y-4">
        <span className="text-xs font-bold text-[#F5F8FF] font-space tracking-wider uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#63e6ff]">accessibility_new</span>
          ACCESSIBILITY & TELEMETRY CONTROLS
        </span>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#F5F8FF]">Reduced Motion</div>
              <div className="text-[10px] text-[#869396]">Disables 3D dish levitation spin</div>
            </div>
            <input
              type="checkbox"
              checked={accessibilitySettings.reducedMotion}
              onChange={(e) =>
                onUpdateAccessibility({
                  ...accessibilitySettings,
                  reducedMotion: e.target.checked
                })
              }
              className="accent-[#63e6ff] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#F5F8FF]">High Contrast HUD</div>
              <div className="text-[10px] text-[#869396]">Enhances borders and text radiance</div>
            </div>
            <input
              type="checkbox"
              checked={accessibilitySettings.highContrast}
              onChange={(e) =>
                onUpdateAccessibility({
                  ...accessibilitySettings,
                  highContrast: e.target.checked
                })
              }
              className="accent-[#63e6ff] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#F5F8FF]">Haptic Sensory Cues</div>
              <div className="text-[10px] text-[#869396]">Vibrate on dish hotspot touch</div>
            </div>
            <input
              type="checkbox"
              checked={accessibilitySettings.hapticFeedback}
              onChange={(e) =>
                onUpdateAccessibility({
                  ...accessibilitySettings,
                  hapticFeedback: e.target.checked
                })
              }
              className="accent-[#63e6ff] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Applet Version & Telemetry Info */}
      <div className="text-center font-space text-[10px] text-[#869396] pt-2">
        <p>DISHØ Food-Tech Operating System • Version 2.4.0</p>
        <p className="text-white/30">Cyberabad Sector 04 • Hitec City & Hyderabad Deccani Node</p>
      </div>
    </div>
  );
};
