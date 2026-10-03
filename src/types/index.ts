export type ScreenId =
  | 'home'
  | 'explore'
  | 'search'
  | 'restaurant-detail'
  | 'dish-detail'
  | 'customize'
  | 'cart'
  | 'checkout'
  | 'payment'
  | 'order-confirmed'
  | 'tracking'
  | 'handoff'
  | 'rate-order'
  | 'orders'
  | 'saved'
  | 'profile'
  | 'notifications'
  | 'support'
  | 'addresses';

export type SpiceLevel = 'mild' | 'medium' | 'spicy' | 'mecha';

export type HyderabadAreaId =
  | 'hitec-city'
  | 'charminar'
  | 'gachibowli'
  | 'jubilee-hills'
  | 'secunderabad';

export interface HyderabadArea {
  id: HyderabadAreaId;
  name: string;
  code: string;
  tagline: string;
  greeting: string;
  dialectBadge: string;
  landmarks: string[];
  primaryColor: string; // Hex code for primary theme glow
  accentColor: string;  // Hex code for secondary accent
  glowColor: string;    // CSS rgba glow
  gradient: string;     // Tailwind gradient classes
  coordinates: {
    lat: number;
    lng: number;
  };
  recommendedDishId: string;
}

export interface Ingredient {
  id: string;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
  allergenNote?: string;
  isCustomizable?: boolean;
  dataSource?: 'restaurant-verified' | 'chef-standard' | 'estimated';
}

export interface DishHotspot {
  id: string;
  title: string;
  subtitle: string;
  xPercent: number; // 0-100
  yPercent: number; // 0-100
  color: string;
  icon?: string;
}

export interface Dish {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  descriptor: string;
  category?: 'MAINS' | 'POPULAR' | 'SIDES' | 'DRINKS' | 'SPECIALS';
  subCategory?: string;
  series?: string;
  price: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
  prepTimeMinutes: number;
  rating: number;
  reviewsCount: string;
  badge?: string;
  badgeType?: 'veg' | 'non-veg' | 'omega-3' | 'high-prot' | 'dairy' | 'crisp' | 'chef-spec';
  isVeg?: boolean;
  isBestseller?: boolean;
  isCustomizable?: boolean;
  servesText?: string;
  tags: string[];
  imageUrl: string;
  imageAlt: string;
  matchScore: string;
  description: string;
  ingredients: Ingredient[];
  hotspots?: DishHotspot[];
  culinaryTelemetry: string;
  defaultPortionGrams: number;
}

export interface Restaurant {
  id: string;
  name: string;
  sector: string;
  hub: string;
  rating: number;
  reviewCount?: string;
  distanceKm: number;
  prepTimeMinutes: number;
  avgPrice: number;
  statusBadge: string;
  supportsMultiOrder: boolean;
  imageUrl: string;
  heroBanner?: string;
  cuisines: string[];
  hours?: string;
  address?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  offerTag?: string;
}

export interface CustomModifierItem {
  id: string;
  name: string;
  detail: string;
  priceDelta: number;
  calDelta: number;
  proDelta: number;
  status: 'std' | 'extra' | 'removed' | 'swapped' | 'added';
  options?: { label: string; priceDelta: number; id: string }[];
}

export interface CustomOrderState {
  dishId: string;
  spiceLevel: SpiceLevel;
  promptText: string;
  portionGrams: number;
  portionUnit: 'g' | 'ml' | 'serving';
  selectedPortionName?: string;
  selectedAddonNames?: string[];
  cookingInstructions?: string;
  modifiers: {
    grilledPaneer: 'std' | 'extra';
    yogurtDrizzle: 'included' | 'removed';
    spinachRice: 'rice' | 'quinoa';
    crispyGarlic: boolean;
    sauceSide?: boolean;
    extraCrunch?: boolean;
  };
  customNotes?: string;
}

export interface CartItem {
  id: string;
  dish: Dish;
  quantity: number;
  customization?: CustomOrderState;
  finalPrice: number;
  finalCalories: number;
  finalProtein: number;
  podNumber?: string;
  thermalSeal?: string;
}

export interface Coupon {
  code: string;
  title: string;
  discountAmount: number;
  minSpend: number;
  description: string;
  isEligible: boolean;
  eligibleRestaurants?: string[];
  expiryLabel?: string;
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Sector Hub';
  line1: string;
  sector: string;
  city: string;
  notes: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'wallet' | 'cod';
  title: string;
  subtitle: string;
  icon: string;
  balance?: number;
  isDefault: boolean;
}

export interface TrackingStage {
  id: string;
  name: string;
  subtext: string;
  timestamp: string;
  status: 'complete' | 'active' | 'queued';
  icon: string;
}

export interface OrderTrackingState {
  orderId: string;
  status: 'accepted' | 'synthesis' | 'quality_seal' | 'in_transit' | 'delivered';
  currentStageIndex: number; // 0 to 7
  stages: TrackingStage[];
  etaWindow: string;
  distanceRemainingKm: number;
  confidenceScore: number;
  otpCode: string;
  delayReason?: {
    cause: string;
    actionTaken: string;
    impactMinutes: number;
  };
  rider: {
    name: string;
    vehicle: string;
    unit: string;
    missionsCount: string;
    rating: number;
    avatarUrl: string;
    phone: string;
  };
  kitchens: {
    restaurantId: string;
    name: string;
    stage: string;
    podId: string;
    distance: string;
    isReady: boolean;
  }[];
  prepTime: number;
  handoffTime: number;
  transitTime: number;
}

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  textSize: 'default' | 'large' | 'huge';
  hapticFeedback: boolean;
  soundEffects: boolean;
}

export interface OrderReviewFeedback {
  orderId: string;
  overallRating: number;
  foodQualityRating: number;
  deliveryRating: number;
  selectedTags: string[];
  comment: string;
}

export interface NotificationItem {
  id: string;
  type: 'order' | 'duo' | 'coupon' | 'alert';
  title: string;
  message: string;
  timeAgo: string;
  isUnread: boolean;
  badgeText: string;
}
