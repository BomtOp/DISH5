import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScreenId, OrderTrackingState, CartItem, Restaurant } from '../../types';
import { INITIAL_TRACKING } from '../../data/mockData';
import { DroneDeliveryHeatmapD3 } from '../common/DroneDeliveryHeatmapD3';
import { VegBadge } from '../common/VegBadge';

interface TrackingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  orderTracking?: OrderTrackingState;
  cart?: CartItem[];
  restaurant?: Restaurant | null;
}

export interface TelemetryNotification {
  id: string;
  type: 'CHEF_PLATING' | 'DRONE_DISPATCH' | 'THERMAL_SEAL' | 'TRAFFIC_CORRIDOR' | 'GEOFENCE_APPROACH' | 'OTP_READY';
  title: string;
  description: string;
  icon: string;
  badgeColor: string;
  badgeBg: string;
  timestamp: string;
}

const TELEMETRY_PRESETS: TelemetryNotification[] = [
  {
    id: 'evt-1',
    type: 'CHEF_PLATING',
    title: 'Chef Plating Complete',
    description: 'Dum handi deg sealed with pure saffron ghee at 104°C in Bawarchi kitchen.',
    icon: 'soup_kitchen',
    badgeColor: '#ffd86b',
    badgeBg: 'rgba(255, 216, 107, 0.15)',
    timestamp: 'Just now'
  },
  {
    id: 'evt-2',
    type: 'DRONE_DISPATCH',
    title: 'Drone & EV Departure',
    description: 'Autonomous dispatch unlocked • Mohammed Imran departed on Vida Electric TS-09-EX-4192.',
    icon: 'flight_takeoff',
    badgeColor: '#63e6ff',
    badgeBg: 'rgba(99, 230, 255, 0.15)',
    timestamp: 'Just now'
  },
  {
    id: 'evt-3',
    type: 'THERMAL_SEAL',
    title: 'Thermal Insulation Verified',
    description: 'Carrier compartment heat-sensor reporting 71.4°C • Freshness seal intact.',
    icon: 'local_fire_department',
    badgeColor: '#ff6b7a',
    badgeBg: 'rgba(255, 107, 122, 0.15)',
    timestamp: 'Just now'
  },
  {
    id: 'evt-4',
    type: 'TRAFFIC_CORRIDOR',
    title: 'Green Corridor Traffic Sync',
    description: 'Smart signal clearance engaged on Durgam Cable Bridge • Speed optimal at 42 km/h.',
    icon: 'traffic',
    badgeColor: '#75f5a6',
    badgeBg: 'rgba(117, 245, 166, 0.15)',
    timestamp: 'Just now'
  },
  {
    id: 'evt-5',
    type: 'GEOFENCE_APPROACH',
    title: 'Geofence Perimeter Entry',
    description: 'Imran is 250m away from Skyview Residences • Approaching Gate 2.',
    icon: 'home_pin',
    badgeColor: '#60B246',
    badgeBg: 'rgba(96, 178, 70, 0.15)',
    timestamp: 'Just now'
  },
  {
    id: 'evt-6',
    type: 'OTP_READY',
    title: 'Contactless OTP Armed',
    description: 'Delivery validation code #4192 ready • QR security token synchronized.',
    icon: 'verified_user',
    badgeColor: '#ba027b',
    badgeBg: 'rgba(186, 2, 123, 0.15)',
    timestamp: 'Just now'
  }
];

export const TrackingScreen: React.FC<TrackingScreenProps> = ({
  onNavigate,
  orderTracking = INITIAL_TRACKING,
  cart = [],
  restaurant = null
}) => {
  // Live second-to-second countdown timer (starts at ~12m 45s = 765s)
  const [secondsRemaining, setSecondsRemaining] = useState(765);
  const [activeStage, setActiveStage] = useState(orderTracking.currentStageIndex || 3);
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  
  // Real-time live telemetry data points
  const [riderSpeed, setRiderSpeed] = useState(38); // km/h
  const [riderDistanceKm, setRiderDistanceKm] = useState(1.85); // km
  const [bagTempCelsius, setBagTempCelsius] = useState(71.4); // °C
  const [evBattery, setEvBattery] = useState(88); // %
  const [trafficStatus, setTrafficStatus] = useState<'CLEAR' | 'MODERATE' | 'SMOOTH'>('SMOOTH');
  const [mapMode, setMapMode] = useState<'neon' | 'satellite'>('neon');
  const [mapFocus, setMapFocus] = useState<'rider' | 'route' | 'home'>('route');

  // Fallback demo items if cart was empty
  const orderItems = cart.length > 0 ? cart : [
    {
      id: 'demo-1',
      dish: {
        id: 'd-1',
        restaurantId: 'r-1',
        restaurantName: 'Bawarchi Cyber Dum Lab',
        name: 'Shahi Gosht Dum Biryani (Double Salan)',
        descriptor: 'Slow-cooked in sealed clay handi',
        price: 380,
        calories: 720,
        protein: 42,
        carbs: 65,
        fat: 28,
        prepTimeMinutes: 20,
        rating: 4.95,
        reviewsCount: '3.2k',
        isVeg: false,
        tags: ['BESTSELLER', 'HYDERABAD SPECIAL'],
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
        imageAlt: 'Biryani',
        matchScore: '98%',
        description: 'Traditional slow-cooked dum biryani.',
        ingredients: [],
        culinaryTelemetry: 'Clay sealed at 104°C',
        defaultPortionGrams: 550
      },
      quantity: 1,
      finalPrice: 380,
      finalCalories: 720,
      finalProtein: 42
    },
    {
      id: 'demo-2',
      dish: {
        id: 'd-2',
        restaurantId: 'r-1',
        restaurantName: 'Bawarchi Cyber Dum Lab',
        name: 'Charminar Shahi Nalli Nihari',
        descriptor: 'Bone marrow slow-simmered',
        price: 420,
        calories: 680,
        protein: 48,
        carbs: 32,
        fat: 36,
        prepTimeMinutes: 25,
        rating: 4.92,
        reviewsCount: '2.8k',
        isVeg: false,
        tags: ['ROYAL NIZAMI'],
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
        imageAlt: 'Nihari',
        matchScore: '96%',
        description: 'Simmered shank in rich aromatic gravy.',
        ingredients: [],
        culinaryTelemetry: 'Slow simmered 12 hrs',
        defaultPortionGrams: 450
      },
      quantity: 1,
      finalPrice: 420,
      finalCalories: 680,
      finalProtein: 48
    },
    {
      id: 'demo-3',
      dish: {
        id: 'd-3',
        restaurantId: 'r-1',
        restaurantName: 'Bawarchi Cyber Dum Lab',
        name: 'Nimrah Irani Chai & Osmania Biscuits (Set of 2)',
        descriptor: 'Authentic Charminar blend',
        price: 160,
        calories: 210,
        protein: 6,
        carbs: 34,
        fat: 8,
        prepTimeMinutes: 5,
        rating: 4.98,
        reviewsCount: '4.1k',
        isVeg: true,
        tags: ['PURE VEG', 'HYDERABAD ICON'],
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
        imageAlt: 'Irani Chai',
        matchScore: '99%',
        description: 'Kadak Irani chai paired with crumbly Osmania biscuits.',
        ingredients: [],
        culinaryTelemetry: 'Freshly brewed',
        defaultPortionGrams: 200
      },
      quantity: 2,
      finalPrice: 160,
      finalCalories: 210,
      finalProtein: 6
    }
  ];

  const restaurantName = restaurant?.name || orderItems[0]?.dish.restaurantName || 'Bawarchi Cyber Dum Lab';
  const restaurantSector = restaurant?.sector || restaurant?.hub || 'HITEC City Cyber Corridor';
  const totalItemsCount = orderItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalOrderAmount = orderItems.reduce((acc, item) => acc + (item.finalPrice || (item.dish.price * item.quantity)), 0);
  const expectedDeliveryTime = new Date(Date.now() + secondsRemaining * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Live Toast Notifications System
  const [activeToast, setActiveToast] = useState<TelemetryNotification | null>(TELEMETRY_PRESETS[0]);
  const [toastHistory, setToastHistory] = useState<TelemetryNotification[]>([TELEMETRY_PRESETS[0]]);
  const [toastEventIndex, setToastEventIndex] = useState(0);
  const [showNotificationFeed, setShowNotificationFeed] = useState(false);

  // Interactive Modals & States
  const [isCopied, setIsCopied] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'rider', text: 'Namaste! I have collected your sealed food from Bawarchi Cyber Dum Lab. On my way on my electric bike!', time: 'Just now' },
    { sender: 'user', text: 'Thanks Imran bhai, please take Gate 2 entrance at Skyview.', time: '1m ago' }
  ]);
  const [selectedInstruction, setSelectedInstruction] = useState<string>('gate2');
  const [riderTip, setRiderTip] = useState<number | null>(null);
  const [tipSuccessMessage, setTipSuccessMessage] = useState<string | null>(null);
  const [audioFeedbackOn, setAudioFeedbackOn] = useState(true);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Trigger telemetry event helper
  const triggerTelemetryEvent = (preset: TelemetryNotification) => {
    const newEvent = {
      ...preset,
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setActiveToast(newEvent);
    setToastHistory((prev) => [newEvent, ...prev.slice(0, 8)]);
  };

  // Automated telemetry event scheduler (triggers a live notification every 8 seconds)
  useEffect(() => {
    const notificationTimer = setInterval(() => {
      setToastEventIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % TELEMETRY_PRESETS.length;
        triggerTelemetryEvent(TELEMETRY_PRESETS[nextIndex]);
        return nextIndex;
      });
    }, 8500);

    return () => clearInterval(notificationTimer);
  }, []);

  // Second-to-second live simulation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setActiveStage(4); // Arrived
          return 0;
        }
        return prev - 1;
      });

      // Fluctuate live telemetry smoothly
      setRiderSpeed((prev) => {
        const delta = (Math.random() - 0.48) * 3;
        const newSpeed = Math.round(Math.max(22, Math.min(48, prev + delta)));
        return newSpeed;
      });

      setRiderDistanceKm((prev) => {
        if (prev <= 0.05) return 0.02;
        return Number((prev - 0.0025).toFixed(2));
      });

      setBagTempCelsius((prev) => {
        const delta = (Math.random() - 0.5) * 0.1;
        return Number((Math.max(68.0, Math.min(74.0, prev + delta))).toFixed(1));
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Call duration timer
  useEffect(() => {
    let callTimer: any;
    if (callModalOpen) {
      callTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(callTimer);
  }, [callModalOpen]);

  // Format seconds to mm:ss
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleCopyOtp = () => {
    navigator.clipboard?.writeText(orderTracking.otpCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAdvanceStage = () => {
    setActiveStage((prev) => {
      const next = prev < stagesList.length - 1 ? prev + 1 : prev;
      if (next === stagesList.length - 1) {
        setSecondsRemaining(25);
        setRiderDistanceKm(0.05);
        triggerTelemetryEvent(TELEMETRY_PRESETS[4]); // Geofence entry
      } else {
        triggerTelemetryEvent(TELEMETRY_PRESETS[next]);
      }
      return next;
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const msg = chatMessage.trim();
    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: msg, time: 'Just now' }
    ]);
    setChatMessage('');

    setTimeout(() => {
      const replies = [
        'Got it! Taking note of your delivery instructions.',
        'Ji bhai, will ring bell once reached flat 1402.',
        'Understood, entering Skyview gate 2 now.',
        'Food is securely kept in thermal carrier. Arriving in 2 mins!'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setChatHistory((prev) => [
        ...prev,
        { sender: 'rider', text: randomReply, time: 'Just now' }
      ]);
    }, 900);
  };

  const handleQuickTip = (amount: number) => {
    setRiderTip(amount);
    setTipSuccessMessage(`₹${amount} tip added for Mohammed Imran! 💚`);
    setTimeout(() => setTipSuccessMessage(null), 3000);
  };

  // 5 comprehensive stages with custom icons & telemetry tags
  const stagesList = [
    {
      id: 'stg-1',
      title: 'Order Confirmed',
      stageName: 'ORDER SYNC',
      desc: 'Bawarchi kitchen accepted order token #DS-8821',
      time: '14:20 PM',
      icon: 'receipt_long',
      telemetry: 'Deg Handi #4 Assigned',
      color: '#60B246'
    },
    {
      id: 'stg-2',
      title: 'Kitchen Preparation',
      stageName: 'PREPARATION',
      desc: 'Sealing aromatic saffron clay handi deg at 104°C',
      time: '14:26 PM',
      icon: 'soup_kitchen',
      telemetry: 'Clay Dum Simmer Active',
      color: '#ffd86b'
    },
    {
      id: 'stg-3',
      title: 'Quality Check & Bagged',
      stageName: 'HEAT SEAL',
      desc: 'Tamper-proof insulated carrier bag #4192 locked',
      time: '14:31 PM',
      icon: 'lock_clock',
      telemetry: 'Thermal Verified 71.4°C',
      color: '#ff6b7a'
    },
    {
      id: 'stg-4',
      title: 'Out for Delivery',
      stageName: 'OUT FOR DELIVERY',
      desc: 'Mohammed Imran in transit on Hero Vida EV (Crossing Cable Bridge)',
      time: '14:36 PM',
      icon: 'two_wheeler',
      telemetry: 'Speed 38 km/h • 1.85 km away',
      color: '#63e6ff'
    },
    {
      id: 'stg-5',
      title: 'Arrived at Gate 2',
      stageName: 'HANDOFF READY',
      desc: 'Delivery partner at Skyview Gate 2 • OTP 4192 armed',
      time: '14:42 PM',
      icon: 'home_pin',
      telemetry: 'Geofence Verified',
      color: '#ba027b'
    }
  ];

  // Rider position interpolation coordinates along route
  const progressRatio = Math.max(0, Math.min(1, 1 - secondsRemaining / 765));
  
  // Calculate rider map percentage
  const riderMapX = 18 + progressRatio * (84 - 18);
  const riderMapY = 28 + Math.sin(progressRatio * Math.PI) * 42 + progressRatio * 38;

  const isArrived = activeStage >= stagesList.length - 1 || secondsRemaining <= 10;

  return (
    <div className="min-h-screen pb-36 pt-18 px-4 max-w-[480px] mx-auto w-full space-y-3.5">
      {/* Dynamic Island / Live Activity Pill */}
      <div className="p-2.5 rounded-2xl bg-[#0b1220]/95 border border-[#63e6ff]/40 shadow-xl flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <span className="w-3 h-3 rounded-full bg-[#60B246] block animate-ping absolute inset-0" />
            <span className="w-3 h-3 rounded-full bg-[#60B246] block relative" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-space font-extrabold text-[#63e6ff] uppercase tracking-wider">
                LIVE TELEMETRY
              </span>
              <span className="text-[9px] font-mono text-[#869396]">
                • {riderSpeed} KM/H
              </span>
              <span className="text-[9px] font-mono text-[#75f5a6]">
                • {riderDistanceKm} KM AWAY
              </span>
            </div>
            <div className="text-xs font-bold text-[#F5F8FF] font-space">
              {isArrived ? 'Imran has arrived at your gate!' : `Arriving in ${formatTime(secondsRemaining)}`}
            </div>
          </div>
        </div>

        <button
          onClick={() => setAudioFeedbackOn(!audioFeedbackOn)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${
            audioFeedbackOn ? 'bg-[#63e6ff]/20 text-[#63e6ff]' : 'bg-white/5 text-[#869396]'
          }`}
          title="Toggle Audio Radar"
        >
          <span className="material-symbols-outlined text-[15px]">
            {audioFeedbackOn ? 'volume_up' : 'volume_off'}
          </span>
        </button>
      </div>

      {/* Floating Live Telemetry Toast Alert */}
      <AnimatePresence mode="wait">
        {activeToast && (
          <motion.div
            key={activeToast.id}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative p-3 rounded-2xl bg-[#0f172a]/95 border shadow-2xl backdrop-blur-xl flex items-start gap-3 overflow-hidden z-30"
            style={{ borderColor: activeToast.badgeColor }}
          >
            {/* Pulsing indicator icon */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md"
              style={{ backgroundColor: activeToast.badgeBg, color: activeToast.badgeColor }}
            >
              <span className="material-symbols-outlined text-[18px] animate-pulse">
                {activeToast.icon}
              </span>
            </div>

            <div className="flex-1 min-w-0 pr-5">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[9px] font-space font-black px-1.5 py-0.2 rounded uppercase tracking-wider"
                  style={{ backgroundColor: activeToast.badgeBg, color: activeToast.badgeColor }}
                >
                  LIVE EVENT
                </span>
                <h4 className="text-xs font-bold text-[#F5F8FF] font-space truncate">
                  {activeToast.title}
                </h4>
              </div>
              <p className="text-[11px] text-[#cbd5e1] mt-0.5 leading-snug">
                {activeToast.description}
              </p>
              <span className="text-[9px] font-mono text-[#869396] block mt-1">
                ⏱ {activeToast.timestamp}
              </span>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => setActiveToast(null)}
              className="absolute top-2.5 right-2.5 text-[#869396] hover:text-white cursor-pointer p-0.5"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="w-9 h-9 rounded-xl bg-[#10182A] border border-white/10 text-white flex items-center justify-center cursor-pointer hover:border-white/30 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="text-center">
          <span className="text-[10px] font-space font-extrabold text-[#75f5a6] bg-[#75f5a6]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#75f5a6]/20">
            SWIGGY HYPER-TRACK
          </span>
          <h2 className="text-sm font-extrabold text-[#F5F8FF] font-space mt-0.5">
            Order #{orderTracking.orderId}
          </h2>
        </div>
        <button
          onClick={() => setShowNotificationFeed(!showNotificationFeed)}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
            showNotificationFeed
              ? 'bg-[#63e6ff] text-black border-[#63e6ff]'
              : 'bg-[#10182A] border-white/10 text-[#63e6ff] hover:border-[#63e6ff]/40'
          }`}
          title="Telemetry Events Feed"
        >
          <span className="material-symbols-outlined text-[18px]">notifications_active</span>
        </button>
      </div>

      {/* Expandable Live Notifications Feed Log */}
      {showNotificationFeed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-3.5 rounded-2xl bg-[#10182A] border border-[#63e6ff]/30 shadow-xl space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F5F8FF] font-space flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#63e6ff]">timeline</span>
              REAL-TIME TELEMETRY LOG ({toastHistory.length})
            </span>
            <span className="text-[10px] text-[#869396] font-mono">Auto-Updating</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {toastHistory.map((item, idx) => (
              <div
                key={item.id + idx}
                className="p-2 rounded-xl bg-[#060914] border border-white/5 flex items-start gap-2.5"
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: item.badgeBg, color: item.badgeColor }}
                >
                  <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#F5F8FF] font-space truncate">
                      {item.title}
                    </span>
                    <span className="text-[9px] font-mono text-[#869396]">{item.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-[#869396] mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Trigger Simulation Buttons */}
          <div className="pt-2 border-t border-white/5 space-y-1.5">
            <span className="text-[10px] text-[#869396] font-space uppercase block">
              Simulate Live Event Trigger:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => triggerTelemetryEvent(TELEMETRY_PRESETS[0])}
                className="py-1 px-1.5 rounded-lg bg-[#ffd86b]/15 text-[#ffd86b] border border-[#ffd86b]/30 font-space text-[9px] font-bold truncate hover:bg-[#ffd86b] hover:text-black cursor-pointer"
              >
                🍳 Chef Plated
              </button>
              <button
                onClick={() => triggerTelemetryEvent(TELEMETRY_PRESETS[1])}
                className="py-1 px-1.5 rounded-lg bg-[#63e6ff]/15 text-[#63e6ff] border border-[#63e6ff]/30 font-space text-[9px] font-bold truncate hover:bg-[#63e6ff] hover:text-black cursor-pointer"
              >
                🚀 Drone Depart
              </button>
              <button
                onClick={() => triggerTelemetryEvent(TELEMETRY_PRESETS[4])}
                className="py-1 px-1.5 rounded-lg bg-[#60B246]/15 text-[#60B246] border border-[#60B246]/30 font-space text-[9px] font-bold truncate hover:bg-[#60B246] hover:text-black cursor-pointer"
              >
                🏠 Geofence
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Order Details & Items Summary Card */}
      <div className="p-4 rounded-3xl bg-[#10182A] border border-[#ffd86b]/30 shadow-xl space-y-3 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#ffd86b]/15 text-[#ffd86b] flex items-center justify-center border border-[#ffd86b]/30 shrink-0">
              <span className="material-symbols-outlined text-[20px]">restaurant</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-[#F5F8FF] font-space tracking-wide">
                  {restaurantName}
                </h3>
                <span className="text-[9px] font-space font-bold text-[#60B246] bg-[#60B246]/15 px-1.5 py-0.2 rounded">
                  VERIFIED
                </span>
              </div>
              <p className="text-[10px] text-[#869396] font-space mt-0.5">
                📍 {restaurantSector} • Order #{orderTracking.orderId}
              </p>
            </div>
          </div>

          {/* Expected Delivery Time Badge */}
          <div className="text-right">
            <span className="text-[9px] font-space text-[#869396] uppercase block font-bold">
              EXPECTED BY
            </span>
            <span className="text-xs font-mono font-black text-[#ffd86b] bg-[#ffd86b]/10 px-2 py-0.5 rounded-md border border-[#ffd86b]/30 inline-block mt-0.5">
              ⏱ {expectedDeliveryTime}
            </span>
          </div>
        </div>

        {/* Expandable / Collapsible Items List with Quantities */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowOrderSummary(!showOrderSummary)}
              className="text-[11px] font-space font-bold text-[#63e6ff] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{totalItemsCount} Ordered Items</span>
              <span className="material-symbols-outlined text-[14px]">
                {showOrderSummary ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            <span className="text-xs font-mono font-extrabold text-[#75f5a6]">
              ₹{totalOrderAmount} (Paid)
            </span>
          </div>

          {showOrderSummary && (
            <div className="space-y-2 pt-1 animate-in fade-in">
              {orderItems.map((item, idx) => {
                const isVeg = item.dish.isVeg ?? (item.dish.badgeType === 'veg' || item.dish.tags.includes('PURE VEG'));
                return (
                  <div
                    key={item.id || idx}
                    className="p-2.5 rounded-xl bg-[#060914] border border-white/5 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-md bg-white/10 text-white font-mono font-black text-[10px] flex items-center justify-center shrink-0">
                        {item.quantity}x
                      </div>
                      <VegBadge isVeg={isVeg} size="sm" />
                      <div className="min-w-0">
                        <h5 className="text-[11px] font-bold text-[#F5F8FF] truncate">
                          {item.dish.name}
                        </h5>
                        {item.customization && (
                          <span className="text-[9px] text-[#869396] block truncate">
                            {item.customization.spiceLevel.toUpperCase()} • {item.customization.portionGrams}g
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#ffd86b] shrink-0">
                      ₹{item.finalPrice || (item.dish.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Primary ETA Banner & Second-by-Second Counter */}
      <div className="p-4 rounded-3xl bg-[#10182A] border border-[#63e6ff]/30 shadow-2xl relative overflow-hidden space-y-3">
        {/* Background glow sheen */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#63e6ff]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] text-[#869396] font-space uppercase font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffd86b] animate-pulse" />
              <span>{isArrived ? 'CURRENT STATUS' : 'LIVE COUNTDOWN ETA'}</span>
            </div>
            <div className="text-3xl font-black text-[#F5F8FF] font-space tracking-tight mt-0.5 tabular-nums">
              {isArrived ? (
                <span className="text-[#75f5a6] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[28px]">verified</span>
                  RIDER ARRIVED!
                </span>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F8FF] via-[#ffd86b] to-[#75f5a6]">
                  {formatTime(secondsRemaining)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#869396] font-space mt-0.5 flex items-center gap-1">
              <span className="text-[#63e6ff]">📍</span>
              {stagesList[activeStage]?.desc}
            </p>
          </div>

          {/* OTP Quick Access Box */}
          <div className="text-right flex flex-col items-end">
            <span className="text-[9px] font-space text-[#869396] uppercase font-bold block">
              DELIVERY OTP
            </span>
            <button
              onClick={handleCopyOtp}
              className="text-lg font-mono font-black text-[#ffd86b] bg-[#060914] px-3 py-1.5 rounded-xl border border-[#ffd86b]/40 hover:border-[#ffd86b] transition-all flex items-center gap-1.5 cursor-pointer mt-0.5 shadow-lg active:scale-95"
              title="Click to copy OTP"
            >
              <span>{orderTracking.otpCode}</span>
              <span className="material-symbols-outlined text-[14px] text-[#869396]">
                {isCopied ? 'check' : 'content_copy'}
              </span>
            </button>
            <button
              onClick={() => setQrModalOpen(true)}
              className="text-[9px] font-space text-[#63e6ff] hover:underline mt-1 flex items-center gap-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[11px]">qr_code_2</span>
              Show QR Code
            </button>
          </div>
        </div>

        {/* Live Interactive Map Simulation */}
        <div className="relative h-56 rounded-2xl bg-[#060914] border border-white/10 overflow-hidden shadow-inner">
          {/* Map Grid Texture */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              mapMode === 'neon'
                ? 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-70'
                : 'bg-gradient-to-b from-[#09101d] to-[#040810] opacity-90'
            }`}
          />

          {/* Map controls */}
          <div className="absolute top-2.5 right-2.5 z-30 flex flex-col gap-1.5">
            <button
              onClick={() => setMapMode(mapMode === 'neon' ? 'satellite' : 'neon')}
              className="p-1.5 rounded-lg bg-[#10182A]/90 border border-white/15 text-[#63e6ff] text-[10px] font-space font-bold flex items-center gap-1 hover:bg-[#10182A] cursor-pointer"
              title="Toggle Map Style"
            >
              <span className="material-symbols-outlined text-[14px]">
                {mapMode === 'neon' ? 'satellite_alt' : 'map'}
              </span>
              <span>{mapMode === 'neon' ? 'HUD' : 'VEC'}</span>
            </button>
            <button
              onClick={() => setMapFocus(mapFocus === 'rider' ? 'route' : 'rider')}
              className="p-1.5 rounded-lg bg-[#10182A]/90 border border-white/15 text-[#75f5a6] text-[10px] font-space font-bold flex items-center gap-1 hover:bg-[#10182A] cursor-pointer"
              title="Recenter Map"
            >
              <span className="material-symbols-outlined text-[14px]">my_location</span>
            </button>
          </div>

          {/* Live Street Network Graphic (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Background Secondary Streets */}
            <path
              d="M 20 180 L 140 160 L 260 190 L 420 160 M 80 20 L 120 120 L 200 200 M 300 20 L 320 140 L 400 220"
              fill="none"
              stroke="#1a2333"
              strokeWidth="2"
            />

            {/* Durgam Cheruvu Lake Contour */}
            <path
              d="M 180 90 Q 230 40 280 90 T 310 160 Q 240 180 180 90 Z"
              fill="rgba(99, 230, 255, 0.04)"
              stroke="#63e6ff"
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />

            {/* Primary Delivery Route (Curved Road) */}
            <path
              d="M 60 60 Q 140 30 220 80 T 390 140"
              fill="none"
              stroke="#283548"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Active GPS Animated Line */}
            <path
              d="M 60 60 Q 140 30 220 80 T 390 140"
              fill="none"
              stroke="#63e6ff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="6 4"
              className="animate-pulse"
            />

            {/* Traveled portion highlight */}
            <circle cx="60" cy="60" r="7" fill="#FF8000" stroke="#fff" strokeWidth="1.5" />
            <circle cx="220" cy="80" r="5" fill="#ffd86b" />
            <circle cx="390" cy="140" r="8" fill="#60B246" stroke="#fff" strokeWidth="2" />
          </svg>

          {/* Waypoint Badges */}
          <div className="absolute top-3 left-3 bg-[#10182A]/90 px-2 py-0.5 rounded-md text-[9px] font-space font-bold text-[#FF8000] border border-[#FF8000]/30 shadow-md">
            🍴 Bawarchi Kitchen
          </div>

          <div className="absolute top-[60px] left-[150px] bg-[#10182A]/90 px-2 py-0.5 rounded-md text-[8px] font-space font-bold text-[#ffd86b] border border-[#ffd86b]/30 shadow-md">
            🌉 Durgam Cable Bridge ({trafficStatus})
          </div>

          <div className="absolute bottom-3 right-3 bg-[#10182A]/90 px-2 py-0.5 rounded-md text-[9px] font-space font-bold text-[#60B246] border border-[#60B246]/30 shadow-md">
            🏠 Skyview Flat 1402
          </div>

          {/* Real-time Moving Delivery Rider Marker with Pulse Ring */}
          <div
            className="absolute transition-all duration-1000 ease-linear -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: `${riderMapX}%`, top: `${riderMapY}%` }}
          >
            <div className="relative group cursor-pointer">
              {/* Radar pulse aura */}
              <span className="w-10 h-10 -left-2.5 -top-2.5 rounded-full bg-[#60B246]/30 block animate-ping absolute" />
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#60B246] to-[#75f5a6] text-black px-2.5 py-1 rounded-full shadow-[0_0_20px_rgba(96,178,70,0.9)] font-space text-[10px] font-black border border-white">
                <span className="material-symbols-outlined text-[15px] animate-bounce">
                  two_wheeler
                </span>
                <span>Imran ({riderSpeed} km/h)</span>
              </div>
            </div>
          </div>

          {/* Live Telemetry Overlay Strip */}
          <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 bg-[#060914]/90 px-2.5 py-1 rounded-xl border border-white/10 text-[9px] font-mono text-[#869396]">
            <span className="text-[#75f5a6]">⚡ EV {evBattery}%</span>
            <span>•</span>
            <span className="text-[#ffd86b]">🌡 DEG {bagTempCelsius}°C</span>
            <span>•</span>
            <span className="text-[#63e6ff]">🛰 5G GPS ACTIVE</span>
          </div>
        </div>

        {/* Live Step Simulation Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs font-space">
          <span className="text-[10px] text-[#869396]">Advance delivery pipeline:</span>
          <button
            onClick={handleAdvanceStage}
            className="px-3 py-1.5 rounded-xl bg-[#63e6ff]/15 border border-[#63e6ff]/30 text-[#63e6ff] hover:bg-[#63e6ff] hover:text-black font-bold text-[10px] cursor-pointer transition-all active:scale-95"
          >
            NEXT CHECKPOINT ▶
          </button>
        </div>
      </div>

      {/* Food Thermal & Freshness Telemetry Card */}
      <div className="p-3.5 rounded-2xl bg-[#10182A]/85 border border-white/10 shadow-md space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FF8000]/15 text-[#FF8000] flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#F5F8FF] font-space">
                HOT-SEAL PACKAGING MONITOR
              </h4>
              <p className="text-[10px] text-[#869396]">
                Clay handi deg insulated thermal telemetry
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-extrabold font-mono text-[#75f5a6]">
              {bagTempCelsius}°C (OPTIMAL)
            </span>
            <div className="text-[9px] font-space text-[#869396]">Tamper Seal #4192 Locked</div>
          </div>
        </div>

        {/* Co-Route Agent Sync Badge */}
        <div className="p-2 rounded-xl bg-[#060914] border border-[#63e6ff]/20 flex items-center gap-2 text-[10px] font-space text-[#63e6ff]">
          <span className="material-symbols-outlined text-[15px] text-[#63e6ff]">hub</span>
          <span>
            <strong>Plus-One Orchestrator Sync:</strong> Food (Bawarchi) & Instamart drinks co-routed in single courier run.
          </span>
        </div>
      </div>

      {/* D3 Drone Delivery Flight Paths Heatmap Mini-Map */}
      <DroneDeliveryHeatmapD3 cityName="Hyderabad Cyber Corridor" />

      {/* Delivery Partner Profile Card */}
      <div className="p-4 rounded-3xl bg-[#10182A] border border-white/10 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={orderTracking.rider.avatarUrl}
                alt={orderTracking.rider.name}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-[#60B246] shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#60B246] text-black flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-extrabold text-[#F5F8FF]">Mohammed Imran</h4>
                <span className="text-[10px] font-bold text-[#ffd86b] bg-[#ffd86b]/10 px-1.5 py-0.2 rounded font-space">
                  ★ 4.98 (4,890+ drops)
                </span>
              </div>
              <p className="text-[11px] text-[#869396] font-space mt-0.5">
                Hero Vida Electric TS-09-EX-4192
              </p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-[#75f5a6] font-space">
                <span>🛡 Covid Vaccinated</span>
                <span>•</span>
                <span>🌡 Temp 98.4°F</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Phone & Chat */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCallModalOpen(true)}
              className="w-11 h-11 rounded-2xl bg-[#60B246]/15 border border-[#60B246]/40 text-[#60B246] flex items-center justify-center hover:bg-[#60B246] hover:text-black transition-all cursor-pointer shadow-md active:scale-95"
              title="Call Delivery Partner"
            >
              <span className="material-symbols-outlined text-[22px]">call</span>
            </button>
            <button
              onClick={() => setChatModalOpen(true)}
              className="w-11 h-11 rounded-2xl bg-[#63e6ff]/15 border border-[#63e6ff]/40 text-[#63e6ff] flex items-center justify-center hover:bg-[#63e6ff] hover:text-black transition-all cursor-pointer shadow-md active:scale-95"
              title="Message Delivery Partner"
            >
              <span className="material-symbols-outlined text-[22px]">chat</span>
            </button>
          </div>
        </div>

        {/* Quick Tipping for Rider */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-space">
            <span className="text-[#869396]">Send partner a token of appreciation:</span>
            {tipSuccessMessage && (
              <span className="text-[#75f5a6] font-bold animate-in fade-in">
                {tipSuccessMessage}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {[20, 30, 50, 100].map((amt) => (
              <button
                key={amt}
                onClick={() => handleQuickTip(amt)}
                className={`flex-1 py-1.5 rounded-xl font-space font-bold text-xs transition-all cursor-pointer border ${
                  riderTip === amt
                    ? 'bg-[#60B246] text-black border-[#60B246] shadow-md'
                    : 'bg-[#060914] text-[#F5F8FF] border-white/10 hover:border-[#60B246]/40'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery Instructions Selection */}
      <div className="p-4 rounded-3xl bg-[#10182A] border border-white/10 space-y-2.5">
        <span className="font-space font-bold text-xs text-[#F5F8FF] uppercase tracking-wider block">
          One-Tap Delivery Instructions
        </span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'gate2', label: 'Enter via Gate 2', icon: 'door_sliding' },
            { id: 'nobell', label: "Don't ring bell 🔕", icon: 'notifications_off' },
            { id: 'leaveguard', label: 'Leave at security', icon: 'local_police' },
            { id: 'liftcall', label: 'Call at lift lobby', icon: 'elevator' }
          ].map((ins) => (
            <button
              key={ins.id}
              onClick={() => setSelectedInstruction(ins.id)}
              className={`p-2.5 rounded-xl border text-left font-space text-[11px] transition-all cursor-pointer flex items-center gap-2 ${
                selectedInstruction === ins.id
                  ? 'bg-[#63e6ff]/15 border-[#63e6ff] text-[#63e6ff] font-bold'
                  : 'bg-[#060914] border-white/10 text-[#869396] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{ins.icon}</span>
              <span className="truncate">{ins.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Vertical Progress Timeline with Glowing Path Indicator */}
      <div className="p-4 rounded-3xl bg-[#10182A] border border-[#63e6ff]/30 shadow-2xl space-y-4 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#63e6ff]/15 text-[#63e6ff] flex items-center justify-center border border-[#63e6ff]/30">
              <span className="material-symbols-outlined text-[18px]">route</span>
            </div>
            <div>
              <span className="font-space font-extrabold text-xs text-[#F5F8FF] uppercase tracking-wider block">
                ORDER JOURNEY TIMELINE
              </span>
              <p className="text-[10px] text-[#869396] font-space">
                Preparation to Out for Delivery & Arrival
              </p>
            </div>
          </div>
          <span className="text-[10px] font-space font-bold text-[#75f5a6] bg-[#75f5a6]/10 px-2 py-0.5 rounded-full border border-[#75f5a6]/20">
            Stage {activeStage + 1} of {stagesList.length}
          </span>
        </div>

        {/* Vertical Timeline Track with Glowing Path */}
        <div className="relative pl-2 pr-1 py-1 space-y-5">
          {/* Base Background Track Groove */}
          <div className="absolute left-6 top-4 bottom-4 w-1 bg-white/10 rounded-full" />

          {/* Glowing Animated Path Indicator Fill */}
          <div
            className="absolute left-6 top-4 w-1 rounded-full bg-gradient-to-b from-[#60B246] via-[#ffd86b] via-[#63e6ff] to-[#ba027b] shadow-[0_0_14px_rgba(99,230,255,0.9)] transition-all duration-700 ease-out z-0"
            style={{
              height: `${(activeStage / (stagesList.length - 1)) * 100}%`,
              maxHeight: 'calc(100% - 24px)'
            }}
          >
            {/* Animated Laser Pulse traveling down the path */}
            <div className="w-full h-10 bg-white rounded-full blur-[2px] animate-pulse" />
          </div>

          {stagesList.map((stg, idx) => {
            const isCompleted = idx < activeStage;
            const isCurrent = idx === activeStage;
            const isQueued = idx > activeStage;

            return (
              <div
                key={stg.id || stg.title}
                onClick={() => setActiveStage(idx)}
                className={`flex items-start gap-4 relative z-10 cursor-pointer group transition-all rounded-2xl p-2 -ml-2 ${
                  isCurrent ? 'bg-white/[0.04] border border-[#63e6ff]/30 shadow-lg' : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Node Icon Container with Glow */}
                <div className="relative shrink-0">
                  {/* Active node pulsing halo aura */}
                  {isCurrent && (
                    <span
                      className="absolute -inset-1.5 rounded-2xl opacity-75 blur-[4px] animate-pulse"
                      style={{ backgroundColor: stg.color }}
                    />
                  )}

                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all relative z-10 border ${
                      isCurrent
                        ? 'text-black font-black shadow-lg scale-105'
                        : isCompleted
                        ? 'bg-[#60B246] text-black border-[#60B246] shadow-[0_0_10px_rgba(96,178,70,0.6)] font-bold'
                        : 'bg-[#060914] text-[#869396] border-white/15'
                    }`}
                    style={
                      isCurrent
                        ? { backgroundColor: stg.color, borderColor: '#fff' }
                        : {}
                    }
                  >
                    {isCompleted ? (
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">{stg.icon}</span>
                    )}
                  </div>
                </div>

                {/* Stage Text & Telemetry Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-xs font-bold font-space ${
                          isCurrent
                            ? 'text-white font-extrabold'
                            : isCompleted
                            ? 'text-[#F5F8FF]'
                            : 'text-[#869396]'
                        }`}
                      >
                        {stg.title}
                      </h4>
                      {isCurrent && (
                        <span className="text-[8px] font-space font-black px-1.5 py-0.2 rounded uppercase bg-[#63e6ff] text-black animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-[#869396] shrink-0">
                      {stg.time}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#869396] mt-0.5 leading-snug">
                    {stg.desc}
                  </p>

                  {/* Stage Telemetry Micro-Badge */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                        isCurrent
                          ? 'bg-[#63e6ff]/15 text-[#63e6ff] border-[#63e6ff]/40 font-bold'
                          : isCompleted
                          ? 'bg-[#60B246]/15 text-[#75f5a6] border-[#60B246]/30'
                          : 'bg-[#060914] text-[#64748b] border-white/5'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[11px]">
                        {isCompleted ? 'verified' : isCurrent ? 'sensors' : 'schedule'}
                      </span>
                      <span>{stg.telemetry}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated Audio Call Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#10182A] border border-[#60B246]/40 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl">
            <div className="relative mx-auto w-20 h-20">
              <span className="w-20 h-20 rounded-full bg-[#60B246]/20 block animate-ping absolute inset-0" />
              <img
                src={orderTracking.rider.avatarUrl}
                alt="Rider"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#60B246] relative z-10"
              />
            </div>

            <div>
              <h3 className="font-extrabold text-[#F5F8FF] font-space text-base">Mohammed Imran</h3>
              <p className="text-xs text-[#869396] mt-0.5">+91 98490 41920 • Swiggy Delivery Partner</p>
              <p className="text-xs font-mono text-[#75f5a6] mt-2 font-bold">
                Call in progress • {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
              </p>
            </div>

            {/* Audio Waveform visualization */}
            <div className="flex items-center justify-center gap-1 h-6">
              {[8, 16, 24, 12, 20, 28, 14, 22, 10].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-[#60B246] rounded-full animate-pulse"
                  style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>

            {/* In-Call Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsCallMuted(!isCallMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  isCallMuted ? 'bg-red-500/20 text-red-400 border border-red-500' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Mute Call"
              >
                <span className="material-symbols-outlined text-[22px]">
                  {isCallMuted ? 'mic_off' : 'mic'}
                </span>
              </button>

              <button
                onClick={() => setCallModalOpen(false)}
                className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 shadow-lg shadow-red-600/50 active:scale-95 cursor-pointer"
                title="End Call"
              >
                <span className="material-symbols-outlined text-[26px]">call_end</span>
              </button>

              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  isSpeakerOn ? 'bg-[#63e6ff]/20 text-[#63e6ff] border border-[#63e6ff]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Speaker"
              >
                <span className="material-symbols-outlined text-[22px]">
                  {isSpeakerOn ? 'volume_up' : 'volume_down'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Rider Modal */}
      {chatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#10182A] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-4 max-w-sm w-full space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#60B246] animate-ping" />
                <span className="text-xs font-bold text-[#F5F8FF] font-space">
                  Chat with Mohammed Imran (Rider)
                </span>
              </div>
              <button
                onClick={() => setChatModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 text-[#869396] hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="h-48 overflow-y-auto space-y-2 p-1 text-xs">
              {chatHistory.map((c, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-2xl max-w-[85%] ${
                    c.sender === 'user'
                      ? 'ml-auto bg-[#63e6ff]/20 text-[#63e6ff] rounded-br-none border border-[#63e6ff]/30'
                      : 'mr-auto bg-[#181B27] text-[#e0e1f2] rounded-bl-none border border-white/10'
                  }`}
                >
                  <p>{c.text}</p>
                  <span className="text-[9px] text-[#869396] block mt-1 text-right">
                    {c.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick preset chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px]">
              {['Please leave at door', 'Ring bell once', 'I will come down'].map((txt) => (
                <button
                  key={txt}
                  onClick={() => setChatMessage(txt)}
                  className="px-2 py-1 rounded-lg bg-[#060914] text-[#869396] border border-white/10 whitespace-nowrap hover:text-white hover:border-[#63e6ff] cursor-pointer"
                >
                  {txt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type note for Mohammed..."
                className="flex-1 bg-[#060914] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F5F8FF] focus:outline-none focus:border-[#63e6ff]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#63e6ff] text-black font-space font-bold text-xs shadow-md cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal for Contactless Handoff */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#10182A] border border-[#63e6ff]/40 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F5F8FF] font-space">
                CONTACTLESS SCAN OTP
              </span>
              <button
                onClick={() => setQrModalOpen(false)}
                className="text-xs text-[#869396] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Stylized QR placeholder */}
            <div className="p-4 bg-white rounded-2xl mx-auto w-48 h-48 flex items-center justify-center shadow-lg">
              <div className="w-full h-full border-4 border-black p-2 flex flex-col items-center justify-between font-mono text-black">
                <div className="flex justify-between w-full">
                  <div className="w-8 h-8 bg-black" />
                  <div className="w-8 h-8 bg-black" />
                </div>
                <div className="text-xl font-black tracking-widest">{orderTracking.otpCode}</div>
                <div className="flex justify-between w-full">
                  <div className="w-8 h-8 bg-black" />
                  <div className="w-4 h-4 bg-black" />
                </div>
              </div>
            </div>

            <div className="text-xs text-[#869396] font-space">
              Show this QR to Mohammed Imran for instant verification
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-16 inset-x-0 p-3 bg-[#10182A]/95 backdrop-blur-xl border-t border-white/10 max-w-[480px] mx-auto z-40">
        <button
          onClick={() => onNavigate('handoff')}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#FC8019] via-[#ba027b] to-[#63e6ff] text-black font-space font-black text-sm uppercase tracking-wider shadow-[0_0_24px_rgba(99,230,255,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">verified_user</span>
          <span>
            {isArrived
              ? 'RIDER ARRIVED • COMPLETE HANDOFF (OTP 4192)'
              : 'VIEW DELIVERY OTP & LIVE HANDOFF (4192)'}
          </span>
        </button>
      </div>
    </div>
  );
};
