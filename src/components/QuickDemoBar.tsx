import React, { useState } from 'react';
import { Dish, Restaurant, ScreenId } from '../types';
import { DISHES, RESTAURANTS } from '../data/mockData';

interface QuickDemoBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onSelectDish: (dish: Dish) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onResetDemo?: () => void;
}

export const QuickDemoBar: React.FC<QuickDemoBarProps> = ({
  currentScreen,
  onNavigate,
  onSelectDish,
  onSelectRestaurant,
  onResetDemo
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const workflowSteps = [
    {
      id: 'step-1',
      screen: 'home' as ScreenId,
      stepNum: 1,
      title: 'App Open & Discovery',
      subtext: 'Hyderabad Area Radar & Hero Drop',
      action: () => onNavigate('home')
    },
    {
      id: 'step-2',
      screen: 'restaurant-detail' as ScreenId,
      stepNum: 2,
      title: 'Restaurant Hub',
      subtext: 'Bawarchi Cyber Dum Lab Menu',
      action: () => {
        onSelectRestaurant(RESTAURANTS[0]);
        onNavigate('restaurant-detail');
      }
    },
    {
      id: 'step-3',
      screen: 'dish-detail' as ScreenId,
      stepNum: 3,
      title: '3D Dish Inspection',
      subtext: 'Nawabi Dum Biryani & Hotspots',
      action: () => {
        onSelectDish(DISHES[0]);
        onNavigate('dish-detail');
      }
    },
    {
      id: 'step-4',
      screen: 'customize' as ScreenId,
      stepNum: 4,
      title: 'Portion & Spice Customization',
      subtext: 'Daawat Scale & Mirchi Salan Addons',
      action: () => {
        onSelectDish(DISHES[0]);
        onNavigate('customize');
      }
    },
    {
      id: 'step-5',
      screen: 'cart' as ScreenId,
      stepNum: 5,
      title: 'Duo-Zone Co-Route Cart',
      subtext: 'Bawarchi + Pista House in 1 Bill',
      action: () => onNavigate('cart')
    },
    {
      id: 'step-6',
      screen: 'checkout' as ScreenId,
      stepNum: 6,
      title: 'Step 1: Delivery Address',
      subtext: 'Select Home, Work & Notes',
      action: () => onNavigate('checkout')
    },
    {
      id: 'step-7',
      screen: 'payment' as ScreenId,
      stepNum: 7,
      title: 'Step 2: Choose Payment',
      subtext: 'UPI, Cash on Delivery, Card',
      action: () => onNavigate('payment')
    },
    {
      id: 'step-8',
      screen: 'order-confirmed' as ScreenId,
      stepNum: 8,
      title: 'Order Placed & Kitchen Status',
      subtext: 'Clay Seal Locked & Kitchen Cooking',
      action: () => onNavigate('order-confirmed')
    },
    {
      id: 'step-9',
      screen: 'tracking' as ScreenId,
      stepNum: 9,
      title: 'Live Rider Map Tracking',
      subtext: 'Mohammed Imran on Motorcycle',
      action: () => onNavigate('tracking')
    },
    {
      id: 'step-10',
      screen: 'handoff' as ScreenId,
      stepNum: 10,
      title: 'Delivery Handover & OTP',
      subtext: 'OTP 4192 & Safety Seal Check',
      action: () => onNavigate('handoff')
    },
    {
      id: 'step-11',
      screen: 'rate-order' as ScreenId,
      stepNum: 11,
      title: 'Rate Food & Delivery',
      subtext: '5-Star Ratings & Compliments',
      action: () => onNavigate('rate-order')
    }
  ];

  // Find current step index
  const currentStepIndex = workflowSteps.findIndex((s) => s.screen === currentScreen);
  const activeStep = currentStepIndex !== -1 ? currentStepIndex + 1 : 1;

  const handleNextStep = () => {
    if (currentStepIndex < workflowSteps.length - 1) {
      workflowSteps[currentStepIndex + 1].action();
    } else {
      workflowSteps[0].action();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      workflowSteps[currentStepIndex - 1].action();
    }
  };

  return (
    <div className="w-full bg-[#060914] border-b border-[#63e6ff]/20 text-[#e0e1f2] z-30 sticky top-0">
      <div className="max-w-[480px] mx-auto px-4 py-2 flex items-center justify-between text-xs">
        {/* Left: Step counter & Workflow label */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#63e6ff] animate-pulse" />
          <span className="font-space text-[10px] font-bold text-[#63e6ff] uppercase tracking-wider">
            WORKFLOW {activeStep}/{workflowSteps.length}
          </span>
          <span className="text-[10px] text-[#869396] hidden sm:inline">
            {workflowSteps[currentStepIndex !== -1 ? currentStepIndex : 0]?.title}
          </span>
        </div>

        {/* Right: Step controls & Quick Switcher Drawer */}
        <div className="flex items-center gap-1.5 font-space">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex <= 0}
            className="p-1 rounded bg-[#10182A] border border-white/10 text-white/80 hover:text-[#63e6ff] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Previous Workflow Stage"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          </button>

          <button
            onClick={handleNextStep}
            className="px-2 py-1 rounded bg-[#63e6ff]/20 border border-[#63e6ff]/50 text-[#63e6ff] hover:bg-[#63e6ff] hover:text-black font-bold text-[10px] uppercase flex items-center gap-1 transition-all cursor-pointer"
            title="Advance to Next Workflow Stage"
          >
            <span>NEXT STAGE</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2 py-1 rounded bg-[#10182A] border border-white/10 text-[10px] text-[#869396] hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <span>ALL (10)</span>
            <span className="material-symbols-outlined text-[14px]">
              {isExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-[#10182A] h-[2px]">
        <div
          className="bg-gradient-to-r from-[#ba027b] to-[#63e6ff] h-full transition-all duration-300"
          style={{ width: `${(activeStep / workflowSteps.length) * 100}%` }}
        />
      </div>

      {/* Expanded Workflow Timeline Drawer */}
      {isExpanded && (
        <div className="bg-[#10182A] border-b border-[#63e6ff]/20 p-3 max-w-[480px] mx-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-space text-[10px] font-bold text-[#869396] uppercase tracking-wider">
              END-TO-END WORKFLOW STAGES
            </span>
            {onResetDemo && (
              <button
                onClick={() => {
                  onResetDemo();
                  setIsExpanded(false);
                }}
                className="text-[10px] font-space text-[#ff6b7a] hover:underline cursor-pointer"
              >
                RESET TO START
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 font-space text-[10px]">
            {workflowSteps.map((step) => {
              const isCurrent = step.screen === currentScreen;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    step.action();
                    setIsExpanded(false);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2 ${
                    isCurrent
                      ? 'bg-[#63e6ff]/20 border-[#63e6ff] text-white shadow-sm'
                      : 'bg-[#060914] border-white/5 text-[#869396] hover:text-[#F5F8FF] hover:border-white/20'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5 ${
                      isCurrent ? 'bg-[#63e6ff] text-black' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {step.stepNum}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-[#F5F8FF] truncate">{step.title}</div>
                    <div className="text-[9px] text-[#869396] truncate">{step.subtext}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
