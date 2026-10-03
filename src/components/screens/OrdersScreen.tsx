import React from 'react';
import { ScreenId, Dish } from '../../types';
import { DISHES } from '../../data/mockData';

interface OrdersScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onReorderDish?: (dish: Dish) => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ onNavigate, onReorderDish }) => {
  const pastMissions = [
    {
      id: 'DS-8821',
      date: 'Today, 19:04',
      status: 'IN TRANSIT (LIVE)',
      statusType: 'live',
      itemsCount: 2,
      total: 810,
      isDualZone: true,
      restaurants: ['Bawarchi Cyber Dum Lab', 'Pista House Haleem Forge'],
      dishes: [DISHES[0], DISHES[1]]
    },
    {
      id: 'DS-7419',
      date: 'Yesterday, 21:15',
      status: 'DELIVERED & VERIFIED',
      statusType: 'delivered',
      itemsCount: 1,
      total: 390,
      isDualZone: false,
      restaurants: ['Hotel Shadab Royal Deg'],
      dishes: [DISHES[2] || DISHES[0]]
    },
    {
      id: 'DS-6102',
      date: '28 Sep, 13:30',
      status: 'DELIVERED & VERIFIED',
      statusType: 'delivered',
      itemsCount: 3,
      total: 420,
      isDualZone: false,
      restaurants: ['Babai Tiffins Gachibowli'],
      dishes: [DISHES[3] || DISHES[0]]
    }
  ];

  return (
    <div className="min-h-screen pb-24 pt-20 px-4 max-w-[480px] mx-auto w-full space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#F5F8FF] font-space">MISSION LOG</h2>
        <p className="text-xs text-[#869396]">Historical and ongoing Hyderabad culinary dispatches</p>
      </div>

      <div className="space-y-3">
        {pastMissions.map((mission) => {
          const isLive = mission.statusType === 'live';
          return (
            <div
              key={mission.id}
              className={`p-4 rounded-2xl bg-[#10182A]/80 border transition-all ${
                isLive ? 'border-[#63e6ff]/40 shadow-xl' : 'border-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isLive && <span className="w-2 h-2 rounded-full bg-[#75f5a6] animate-ping" />}
                  <span className="text-xs font-bold font-space text-[#F5F8FF]">
                    MISSION #{mission.id}
                  </span>
                  {mission.isDualZone && (
                    <span className="text-[9px] font-space font-bold px-1.5 py-0.5 rounded bg-[#63e6ff]/20 text-[#63e6ff]">
                      DUO-ZONE
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-space font-bold px-2 py-0.5 rounded ${
                    isLive
                      ? 'bg-[#75f5a6]/20 text-[#75f5a6] border border-[#75f5a6]/30'
                      : 'bg-white/5 text-[#869396]'
                  }`}
                >
                  {mission.status}
                </span>
              </div>

              <div className="text-[11px] text-[#869396] font-space mb-2">
                {mission.restaurants.join(' + ')} • {mission.date}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-sm font-bold text-[#ffd86b] font-space tabular-nums">
                  ₹{mission.total}
                </span>

                <div className="flex items-center gap-2">
                  {isLive ? (
                    <button
                      onClick={() => onNavigate('tracking')}
                      className="px-3 py-1.5 rounded-xl bg-[#63e6ff] text-black font-space font-bold text-xs cursor-pointer hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">navigation</span>
                      TRACK LIVE
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => onNavigate('rate-order')}
                        className="px-2.5 py-1.5 rounded-xl bg-[#181B27] border border-white/10 text-xs font-space text-[#869396] hover:text-[#63e6ff] cursor-pointer"
                      >
                        REVIEW
                      </button>
                      {onReorderDish && mission.dishes[0] && (
                        <button
                          onClick={() => onReorderDish(mission.dishes[0])}
                          className="px-3 py-1.5 rounded-xl bg-[#181B27] border border-[#63e6ff]/30 text-xs font-space font-bold text-[#63e6ff] hover:bg-[#63e6ff] hover:text-black transition-all cursor-pointer"
                        >
                          RE-SYNTHESIZE
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
