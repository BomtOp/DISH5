export { ASSET_URLS } from './assets';
import { ASSET_URLS } from './assets';
import { ALL_RESTAURANT_DISHES } from './restaurantDishes';

import { Dish, Restaurant, Coupon, OrderTrackingState, Address, PaymentMethod, NotificationItem, HyderabadArea } from '../types';

export const HYDERABAD_AREAS: HyderabadArea[] = [
  {
    id: 'hitec-city',
    name: 'Hitec City & Madhapur',
    code: 'HITEC CITY • SEC 04',
    tagline: 'Cyberabad Tech Corridor • 24/7 Dum Dispatch',
    greeting: 'Kya bolte, Pilot? Ready for late-night code fuel?',
    dialectBadge: 'KIRRAK SPEED',
    landmarks: ['Cyber Towers Flyover', 'Mindspace Concourse', 'Durgam Cheruvu Cable Bridge', 'T-Hub 2.0'],
    primaryColor: '#00F0FF',
    accentColor: '#FFB800',
    glowColor: 'rgba(0, 240, 255, 0.4)',
    gradient: 'from-[#00F0FF]/25 via-[#10182A] to-[#060914]',
    coordinates: { lat: 17.4435, lng: 78.3772 },
    recommendedDishId: 'nawabi-dum-biryani'
  },
  {
    id: 'charminar',
    name: 'Charminar & Old City',
    code: 'CHARMINAR • HERITAGE',
    tagline: 'Asaf Jahi Dynasty Charcoal Dum & Irani Chai',
    greeting: 'Adaab Janab! Royal Nizami Daawat at your doorstep',
    dialectBadge: 'ASLI DECCANI',
    landmarks: ['Charminar Four Minarets', 'Madina Circle', 'High Court Arterial', 'Shah Ali Banda'],
    primaryColor: '#00DF89',
    accentColor: '#FFD700',
    glowColor: 'rgba(0, 223, 137, 0.4)',
    gradient: 'from-[#00DF89]/25 via-[#10182A] to-[#060914]',
    coordinates: { lat: 17.3616, lng: 78.4747 },
    recommendedDishId: 'charminar-shahi-nihari'
  },
  {
    id: 'gachibowli',
    name: 'Gachibowli Financial Hub',
    code: 'GACHIBOWLI • SEC 02',
    tagline: 'Silicon Valley of Deccan • High-Energy Tiffins',
    greeting: 'Namaskaram! Ghee podi tiffins & high protein bowls',
    dialectBadge: 'POWER MACROS',
    landmarks: ['Wipro Circle Junction', 'Waverock Concourse', 'Google & Microsoft Corridor', 'Nanakramguda'],
    primaryColor: '#38EF7D',
    accentColor: '#11998E',
    glowColor: 'rgba(56, 239, 125, 0.4)',
    gradient: 'from-[#38EF7D]/25 via-[#10182A] to-[#060914]',
    coordinates: { lat: 17.4225, lng: 78.3490 },
    recommendedDishId: 'guntur-mech-idli'
  },
  {
    id: 'jubilee-hills',
    name: 'Jubilee & Banjara Hills',
    code: 'JUBILEE HILLS • SEC 36',
    tagline: 'Upscale Culinary Lounges & Royal Fusion',
    greeting: 'Shandar vibes! Craft dining & artisanal desserts',
    dialectBadge: 'ROYAL LUXURY',
    landmarks: ['Road No. 36 Concourse', 'Road No. 10 Banjara', 'Durgam Lake View Deck', 'KBR Park Perimeter'],
    primaryColor: '#FF3366',
    accentColor: '#B388FF',
    glowColor: 'rgba(255, 51, 102, 0.4)',
    gradient: 'from-[#FF3366]/25 via-[#10182A] to-[#060914]',
    coordinates: { lat: 17.4319, lng: 78.4073 },
    recommendedDishId: 'grand-nizam-thali'
  },
  {
    id: 'secunderabad',
    name: 'Secunderabad Cantonment',
    code: 'SECUNDERABAD • CLOCK TOWER',
    tagline: 'Twin City Vintage Legacy & Classic 1953 Biryani',
    greeting: 'Welcome to the Twin City! Timeless Cantonment flavours',
    dialectBadge: 'CANTONMENT 1953',
    landmarks: ['Clock Tower Square', 'Paradise Circle', 'Sardar Patel Road', 'Blue Sea Station'],
    primaryColor: '#FF9F43',
    accentColor: '#54A0FF',
    glowColor: 'rgba(255, 159, 67, 0.4)',
    gradient: 'from-[#FF9F43]/25 via-[#10182A] to-[#060914]',
    coordinates: { lat: 17.4399, lng: 78.4983 },
    recommendedDishId: 'classic-paradise-biryani'
  }
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'bawarchi-cyber',
    name: 'Bawarchi Cyber Dum Lab',
    sector: 'Sector 04',
    hub: 'Hitec City Mindspace Hub',
    rating: 4.94,
    reviewCount: '18.4k',
    distanceKm: 1.2,
    prepTimeMinutes: 18,
    avgPrice: 420,
    statusBadge: 'CLAY DUM SEAL ACTIVE',
    supportsMultiOrder: true,
    imageUrl: ASSET_URLS.restaurantBawarchi,
    heroBanner: ASSET_URLS.biryaniClayPot,
    cuisines: ['Hyderabadi Dum', 'Kacchi Biryani', 'Nizami Curries', 'Mirchi Ka Salan'],
    hours: '11:00 - 02:00 (Late Night Dum Active)',
    address: 'Plot 12, Mindspace Cyber Concourse, Hitec City, Hyderabad 500081',
    coordinates: { lat: 17.4435, lng: 78.3772 },
    offerTag: 'Free Mirchi Ka Salan & Double Raita with every pot'
  },
  {
    id: 'pista-house-forge',
    name: 'Pista House Haleem Forge',
    sector: 'Alley 09',
    hub: 'Madhapur • Durgam Cable Deck',
    rating: 4.92,
    reviewCount: '14.2k',
    distanceKm: 1.8,
    prepTimeMinutes: 14,
    avgPrice: 340,
    statusBadge: 'GI-TAGGED HALEEM READY',
    supportsMultiOrder: true,
    imageUrl: ASSET_URLS.restaurantPistaHouse,
    heroBanner: ASSET_URLS.haleem,
    cuisines: ['GI-Tagged Haleem', 'Shahi Luqmi', 'Double Ka Meetha', 'Bakery'],
    hours: '12:00 - 03:00 (Open Late Night)',
    address: 'Near Durgam Cheruvu Cable Bridge Entry, Madhapur, Hyderabad 500081',
    coordinates: { lat: 17.4385, lng: 78.3892 },
    offerTag: 'Zero Added Delivery Surcharge with Bawarchi (Duo Co-Route)'
  },
  {
    id: 'shadab-heritage',
    name: 'Hotel Shadab Royal Node',
    sector: 'Heritage Sector',
    hub: 'Charminar • Madina Circle',
    rating: 4.96,
    reviewCount: '26.8k',
    distanceKm: 2.3,
    prepTimeMinutes: 22,
    avgPrice: 460,
    statusBadge: 'OVERNIGHT SLOW COAL DUM',
    supportsMultiOrder: true,
    imageUrl: ASSET_URLS.restaurantShadab,
    heroBanner: ASSET_URLS.nihari,
    cuisines: ['Old City Nihari', 'Pathar Ka Gosht', 'Zaffrani Biryani', 'Qubani Ka Meetha'],
    hours: '05:30 - 01:30 (Nihari Morning & Midnight Dum)',
    address: 'High Court Road, Madina Circle, Near Charminar, Old City, Hyderabad 500002',
    coordinates: { lat: 17.3616, lng: 78.4747 },
    offerTag: 'Authentic 1890 Asaf Jahi Dynasty Recipe'
  },
  {
    id: 'chutneys-deccan',
    name: 'Chutneys Modern Tiffin Hub',
    sector: 'Sector 02',
    hub: 'Gachibowli Financial Hub',
    rating: 4.88,
    reviewCount: '8.6k',
    distanceKm: 2.1,
    prepTimeMinutes: 12,
    avgPrice: 280,
    statusBadge: '7 CHUTNEYS PIPING HOT',
    supportsMultiOrder: true,
    imageUrl: ASSET_URLS.restaurantChutneys,
    heroBanner: ASSET_URLS.masalaDosa,
    cuisines: ['Deccan Tiffins', 'Guntur Podi Babai Idli', 'Rayalaseema Ragi Sangati', 'Babai Idli'],
    hours: '07:00 - 23:30 (Breakfast to Dinner)',
    address: 'Wipro Circle Junction, Financial District, Gachibowli, Hyderabad 500032',
    coordinates: { lat: 17.4225, lng: 78.3490 },
    offerTag: 'Extra Ghee Roast Podi Included with Every Order'
  },
  {
    id: 'nimrah-bakery',
    name: 'Nimrah Irani Chai & Osmania Vault',
    sector: 'Heritage Sector',
    hub: 'Charminar Clock Facade',
    rating: 4.97,
    reviewCount: '31.2k',
    distanceKm: 2.5,
    prepTimeMinutes: 8,
    avgPrice: 180,
    statusBadge: 'STEAMING DUM CHAI KEG',
    supportsMultiOrder: true,
    imageUrl: ASSET_URLS.restaurantNimrah,
    heroBanner: ASSET_URLS.iraniChai,
    cuisines: ['Irani Dum Chai', 'Osmania Biscuits', 'Tie Biscuit', 'Zaffrani Khoya Chai'],
    hours: '04:00 - 01:00 (Always Steaming)',
    address: 'Directly Facing Charminar Clock Tower, Old City, Hyderabad 500002',
    coordinates: { lat: 17.3614, lng: 78.4744 },
    offerTag: 'Free 4x Crisp Osmania Biscuits with 2 Chai Flasks'
  },
  {
    id: 'paradise-cantonment',
    name: 'Paradise Legacy Dum Hub',
    sector: 'Cantonment Sector',
    hub: 'Secunderabad Clock Tower',
    rating: 4.86,
    reviewCount: '21.5k',
    distanceKm: 3.4,
    prepTimeMinutes: 20,
    avgPrice: 440,
    statusBadge: 'ESTD 1953 RECIPE LOCK',
    supportsMultiOrder: false,
    imageUrl: ASSET_URLS.paneerBowl,
    heroBanner: ASSET_URLS.grandThali,
    cuisines: ['Classic Paradise Dum', 'Reshmi Kebab', 'Mutton Biryani', 'Double Ka Meetha'],
    hours: '11:00 - 00:30 (Open Daily)',
    address: 'Sardar Patel Road, Near Clock Tower, Secunderabad, Hyderabad 500003',
    coordinates: { lat: 17.4399, lng: 78.4983 },
    offerTag: 'Classic 1953 Heritage Dum Guarantee'
  },
  {
    id: 'shah-ghouse-deg',
    name: 'Shah Ghouse Splendid Deg',
    sector: 'Tolichowki Corridor',
    hub: 'Tolichowki Main Flyover',
    rating: 4.91,
    reviewCount: '19.8k',
    distanceKm: 2.7,
    prepTimeMinutes: 19,
    avgPrice: 410,
    statusBadge: 'ZAFRANI HANDI SIZZLE',
    supportsMultiOrder: true,
    imageUrl: ASSET_URLS.biryaniPlatter,
    heroBanner: ASSET_URLS.biryaniClayPot,
    cuisines: ['Special Zafrani Dum', 'Talawa Gosht', 'Tangdi Kebab', 'Khubani Cream'],
    hours: '11:30 - 02:30 (Late Night Sizzle)',
    address: 'Tolichowki Cross Roads, Mehdipatnam Road, Hyderabad 500008',
    coordinates: { lat: 17.4042, lng: 78.4116 },
    offerTag: 'Includes Charcoal Smoked Dalcha & Gravy Pod'
  },
  {
    id: 'subhan-bakery-nampally',
    name: 'Subhan Heritage Dum Bakery',
    sector: 'Nampally Station Node',
    hub: 'Nampally Heritage Concourse',
    rating: 4.95,
    reviewCount: '16.7k',
    distanceKm: 2.9,
    prepTimeMinutes: 10,
    avgPrice: 220,
    statusBadge: 'FRESH OVEN HEAT (BATCH #14)',
    supportsMultiOrder: true,
    imageUrl: ASSET_URLS.osmaniaBiscuits,
    heroBanner: ASSET_URLS.osmaniaBiscuits,
    cuisines: ['Artisanal Osmania', 'Chand Biscuit', 'Plum Dum Cake', 'Fine Rusks'],
    hours: '08:00 - 23:00 (Fresh Batches Hourly)',
    address: 'Opposite Gandhi Bhavan, Nampally, Hyderabad 500001',
    coordinates: { lat: 17.3871, lng: 78.4682 },
    offerTag: 'Warm Tin Seal Guarantee with Zero Trans-Fat'
  }
];

export const DISHES: Dish[] = ALL_RESTAURANT_DISHES;

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'KIRRAK50',
    title: 'Kirrak Hyderabad First Order',
    discountAmount: 50,
    minSpend: 299,
    description: 'Flat ₹50 discount across all verified Hyderabad restaurant nodes',
    isEligible: true,
    expiryLabel: 'Expires in 4 days'
  },
  {
    code: 'DURGAMDUO',
    title: 'Durgam Cheruvu Duo Co-Route',
    discountAmount: 45,
    minSpend: 499,
    description: 'Special ₹45 discount when ordering from 2 restaurants in 1 order',
    isEligible: true,
    expiryLabel: 'Active for Multi-Order'
  },
  {
    code: 'NIZAMI70',
    title: 'Royal Nizami Daawat Savings',
    discountAmount: 70,
    minSpend: 699,
    description: 'Flat ₹70 discount on orders above ₹699',
    isEligible: true,
    expiryLabel: 'Festive Season Offer'
  },
  {
    code: 'IRANICHAI',
    title: 'Free Nimrah Irani Chai & Osmania',
    discountAmount: 40,
    minSpend: 250,
    description: '₹40 off towards Irani Chai & Bakery items',
    isEligible: true,
    expiryLabel: 'Valid 24/7'
  },
  {
    code: 'HYD100',
    title: 'Hyderabad VIP Super Feast',
    discountAmount: 100,
    minSpend: 899,
    description: 'Flat ₹100 instant discount on royal banquet orders',
    isEligible: true,
    expiryLabel: 'Weekend Special'
  }
];

export const SAVED_ADDRESSES: Address[] = [
  {
    id: 'addr-skyview',
    label: 'Home',
    line1: 'Tower 3, Flat 1402, The Skyview Residences',
    sector: 'Hitec City • Sector 04',
    city: 'Hyderabad 500081',
    notes: 'Smart Pod 14. Scan QR code or leave with concierge at Gate 2',
    isDefault: true
  },
  {
    id: 'addr-mindspace',
    label: 'Work',
    line1: 'Building 12B, 6th Floor, Mindspace Tech Park',
    sector: 'Hitec City • Sector 04',
    city: 'Hyderabad 500081',
    notes: 'Reception desk drop box. Call on arrival',
    isDefault: false
  },
  {
    id: 'addr-waverock',
    label: 'Sector Hub',
    line1: 'Tower 2, Waverock SEZ, Nanakramguda',
    sector: 'Gachibowli • Sector 02',
    city: 'Hyderabad 500032',
    notes: 'Access via Main Express Gate 1',
    isDefault: false
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-gpay',
    type: 'upi',
    title: 'Google Pay UPI',
    subtitle: 'rohit@okhdfcbank • Instant Telemetry Sync',
    icon: 'account_balance_wallet',
    isDefault: true
  },
  {
    id: 'pm-phonepe',
    type: 'upi',
    title: 'PhonePe UPI',
    subtitle: '9849004192@ybl • 1-Click Payment',
    icon: 'bolt',
    isDefault: false
  },
  {
    id: 'pm-paytm',
    type: 'upi',
    title: 'Paytm UPI',
    subtitle: 'Fast UPI Gateway Protocol',
    icon: 'qr_code_scanner',
    isDefault: false
  },
  {
    id: 'pm-card',
    type: 'card',
    title: 'HDFC Cyber Titanium Card',
    subtitle: '•••• •••• •••• 4192 • Exp 09/28',
    icon: 'credit_card',
    isDefault: false
  },
  {
    id: 'pm-cod',
    type: 'cod',
    title: 'Cash on Handoff',
    subtitle: 'Pay exact currency at your smart pod lock',
    icon: 'payments',
    isDefault: false
  }
];

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'Pot Clay Seal Verified: Bawarchi Dum Lab',
    message: 'Your Nawabi Cyber Dum Biryani is sealed in clay deg at 104°C. Courier Mohammed Imran has arrived at kitchen pod.',
    timeAgo: '2m ago',
    isUnread: true,
    badgeText: 'TELEMETRY LIVE'
  },
  {
    id: 'notif-2',
    type: 'duo',
    title: 'Duo-Zone Co-Route Synchronized',
    message: 'Waypoint 2 (Pista House Haleem Forge) added to route. Zero added delivery surcharge applied across Durgam Cable Bridge.',
    timeAgo: '8m ago',
    isUnread: true,
    badgeText: 'DUO-ZONE ROUTE'
  },
  {
    id: 'notif-3',
    type: 'coupon',
    title: 'Kirrak Voucher Added: KIRRAK50',
    message: 'Enjoy ₹50 flat savings across all Hyderabad sectors. Valid for today’s lunch and dinner drops.',
    timeAgo: '1h ago',
    isUnread: false,
    badgeText: 'HYDERABAD OFFER'
  }
];

export const INITIAL_TRACKING: OrderTrackingState = {
  orderId: 'DS-8821',
  status: 'in_transit',
  currentStageIndex: 3,
  etaWindow: '14-18 MINS',
  distanceRemainingKm: 2.1,
  confidenceScore: 99.4,
  otpCode: '4192',
  delayReason: undefined,
  stages: [
    {
      id: 'stg-1',
      name: 'Order Protocol Initialized',
      subtext: 'Bawarchi Cyber Dum Lab accepted mission',
      timestamp: '19:04:12',
      status: 'complete',
      icon: 'receipt'
    },
    {
      id: 'stg-2',
      name: 'Airtight Dum Pot Clay Sealed',
      subtext: 'Pressure locked at 104°C • Saffron steam intact',
      timestamp: '19:09:45',
      status: 'complete',
      icon: 'lock'
    },
    {
      id: 'stg-3',
      name: 'Courier Picked Up at Node 01 & 02',
      subtext: 'Consolidated into insulated thermal pod pod #04',
      timestamp: '19:14:02',
      status: 'complete',
      icon: 'backpack'
    },
    {
      id: 'stg-4',
      name: 'Transiting Durgam Cheruvu Cable Bridge',
      subtext: 'Cruise vector at 42 km/h • Zero arterial congestion',
      timestamp: '19:16:30',
      status: 'active',
      icon: 'two_wheeler'
    },
    {
      id: 'stg-5',
      name: 'Arriving at Destination Gate 2',
      subtext: 'Smart Lock OTP handoff ready: 4192',
      timestamp: 'Estimated 19:22',
      status: 'queued',
      icon: 'pin_drop'
    }
  ],
  rider: {
    name: 'Mohammed "Takeshi Bhai" Imran',
    vehicle: 'Cyber-Motorcycle (TS-09-EX-4192)',
    unit: 'Cyberabad Fleet Unit 41',
    missionsCount: '4,892 Completed',
    rating: 4.98,
    avatarUrl: ASSET_URLS.courierTakeshi,
    phone: '+91 98490 41920'
  },
  kitchens: [
    {
      restaurantId: 'bawarchi-cyber',
      name: 'Bawarchi Cyber Dum Lab',
      stage: 'Clay Dum Sealed',
      podId: 'Pod #04 (Madhapur)',
      distance: '1.2 km',
      isReady: true
    },
    {
      restaurantId: 'pista-house-forge',
      name: 'Pista House Haleem Forge',
      stage: 'Copper Deg Ladled',
      podId: 'Deg #01 (Durgam Deck)',
      distance: '1.8 km',
      isReady: true
    }
  ],
  prepTime: 18,
  handoffTime: 3,
  transitTime: 12
};
