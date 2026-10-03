import React, { useState } from 'react';
import { ScreenId, NotificationItem } from '../../types';
import { NOTIFICATIONS } from '../../data/mockData';

interface NotificationsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<NotificationItem[]>(NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  return (
    <div className="min-h-screen pb-24 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F5F8FF] font-space">COMMS & ALERTS</h2>
          <p className="text-xs text-[#869396]">Live dispatch notifications and Hyderabad vouchers</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-[10px] text-[#63e6ff] font-space font-bold hover:underline cursor-pointer"
        >
          MARK READ
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl bg-[#10182A]/80 border transition-all ${
              item.isUnread ? 'border-[#63e6ff]/40 shadow-md' : 'border-white/5'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-[9px] font-space font-bold px-1.5 py-0.5 rounded uppercase ${
                  item.type === 'order'
                    ? 'bg-[#75f5a6]/20 text-[#75f5a6]'
                    : item.type === 'duo'
                    ? 'bg-[#63e6ff]/20 text-[#63e6ff]'
                    : 'bg-[#ffd86b]/20 text-[#ffd86b]'
                }`}
              >
                {item.badgeText}
              </span>
              <span className="text-[10px] text-[#869396] font-space">{item.timeAgo}</span>
            </div>
            <h4 className="text-xs font-bold text-[#F5F8FF] font-space">{item.title}</h4>
            <p className="text-[11px] text-[#869396] mt-1">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
