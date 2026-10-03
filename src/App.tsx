import React, { useState } from 'react';
import {
  ScreenId,
  Dish,
  Restaurant,
  CartItem,
  CustomOrderState,
  Coupon,
  AccessibilitySettings,
  HyderabadAreaId,
  OrderReviewFeedback,
  Address
} from './types';
import {
  DISHES,
  RESTAURANTS,
  INITIAL_COUPONS,
  HYDERABAD_AREAS,
  INITIAL_TRACKING,
  SAVED_ADDRESSES
} from './data/mockData';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { QuickDemoBar } from './components/QuickDemoBar';
import { AiAssistantModal } from './components/modals/AiAssistantModal';

import { HomeScreen } from './components/screens/HomeScreen';
import { ExploreScreen } from './components/screens/ExploreScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { RestaurantScreen } from './components/screens/RestaurantScreen';
import { DishDetailScreen } from './components/screens/DishDetailScreen';
import { CustomizeScreen } from './components/screens/CustomizeScreen';
import { CartScreen } from './components/screens/CartScreen';
import { CheckoutScreen } from './components/screens/CheckoutScreen';
import { PaymentScreen } from './components/screens/PaymentScreen';
import { OrderConfirmedScreen } from './components/screens/OrderConfirmedScreen';
import { TrackingScreen } from './components/screens/TrackingScreen';
import { HandoffScreen } from './components/screens/HandoffScreen';
import { RateOrderScreen } from './components/screens/RateOrderScreen';
import { OrdersScreen } from './components/screens/OrdersScreen';
import { SavedScreen } from './components/screens/SavedScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { SupportScreen } from './components/screens/SupportScreen';
import { AddressesScreen } from './components/screens/AddressesScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [activeAreaId, setActiveAreaId] = useState<HyderabadAreaId>('hitec-city');
  const [selectedSector, setSelectedSector] = useState(HYDERABAD_AREAS[0].code);

  const [selectedDish, setSelectedDish] = useState<Dish>(DISHES[0]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(RESTAURANTS[0]);
  const [selectedAddress, setSelectedAddress] = useState<Address>(SAVED_ADDRESSES[0]);

  // Initial cart with Bawarchi Biryani + Pista House Haleem for Duo-Zone Co-Route demo
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      dish: DISHES[0],
      quantity: 1,
      finalPrice: DISHES[0].price,
      finalCalories: DISHES[0].calories,
      finalProtein: DISHES[0].protein,
      customization: {
        dishId: DISHES[0].id,
        spiceLevel: 'medium',
        promptText: 'Double salan, extra birista onions',
        portionGrams: DISHES[0].defaultPortionGrams || 500,
        portionUnit: 'g',
        modifiers: {
          grilledPaneer: 'std',
          yogurtDrizzle: 'included',
          spinachRice: 'rice',
          crispyGarlic: true
        }
      }
    },
    {
      id: 'cart-init-2',
      dish: DISHES[1] || DISHES[0],
      quantity: 1,
      finalPrice: DISHES[1]?.price || 380,
      finalCalories: DISHES[1]?.calories || 610,
      finalProtein: DISHES[1]?.protein || 38,
      customization: {
        dishId: (DISHES[1] || DISHES[0]).id,
        spiceLevel: 'spicy',
        promptText: 'Pure desi ghee float, fried cashew topping',
        portionGrams: 450,
        portionUnit: 'g',
        modifiers: {
          grilledPaneer: 'std',
          yogurtDrizzle: 'included',
          spinachRice: 'rice',
          crispyGarlic: true
        }
      }
    }
  ]);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(INITIAL_COUPONS[0]);

  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    textSize: 'default',
    hapticFeedback: true,
    soundEffects: false
  });

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');

  // Cart operations
  const handleAddToCart = (dish: Dish, customState?: CustomOrderState, customPrice?: number) => {
    setCart((prev) => {
      if (!customState) {
        const existing = prev.find((item) => item.dish.id === dish.id && !item.customization);
        if (existing) {
          return prev.map((item) =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          dish,
          quantity: 1,
          finalPrice: customPrice ?? dish.price,
          finalCalories: dish.calories,
          finalProtein: dish.protein,
          customization: customState
        }
      ];
    });
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleSaveCustomization = (customOrder: CustomOrderState) => {
    setCart((prev) => [
      ...prev,
      {
        id: `cart-custom-${Date.now()}`,
        dish: selectedDish,
        quantity: 1,
        finalPrice: selectedDish.price,
        finalCalories: selectedDish.calories,
        finalProtein: selectedDish.protein,
        customization: customOrder
      }
    ]);
    setCurrentScreen('cart');
  };

  const handleOpenAiAssistant = (prompt?: string) => {
    setAiInitialPrompt(prompt || '');
    setIsAiModalOpen(true);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div
      className={`min-h-screen bg-[#0a0e19] text-[#e0e1f2] font-sans antialiased selection:bg-[#63e6ff] selection:text-[#00363e] relative flex flex-col ${
        accessibilitySettings.highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* Top Demo Bar */}
      <QuickDemoBar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onSelectDish={(d) => {
          setSelectedDish(d);
          setCurrentScreen('dish-detail');
        }}
        onSelectRestaurant={(r) => {
          setSelectedRestaurant(r);
          setCurrentScreen('restaurant-detail');
        }}
        onResetDemo={() => {
          setCurrentScreen('home');
          setActiveAreaId('hitec-city');
        }}
      />

      {/* Top App Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        cartCount={cartCount}
        selectedSector={selectedSector}
        onSelectSector={setSelectedSector}
        activeAreaId={activeAreaId}
        onSelectArea={setActiveAreaId}
      />

      {/* Main Dynamic View Routing */}
      <main className="flex-1 w-full max-w-[480px] mx-auto">
        {currentScreen === 'home' && (
          <HomeScreen
            onSelectDish={(dish) => {
              setSelectedDish(dish);
              setCurrentScreen('dish-detail');
            }}
            onSelectRestaurant={(restaurant) => {
              setSelectedRestaurant(restaurant);
              setCurrentScreen('restaurant-detail');
            }}
            onAddToCart={handleAddToCart}
            activeAreaId={activeAreaId}
            onSelectArea={setActiveAreaId}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'explore' && (
          <ExploreScreen
            onSelectDish={(dish) => {
              setSelectedDish(dish);
              setCurrentScreen('dish-detail');
            }}
            onSelectRestaurant={(restaurant) => {
              setSelectedRestaurant(restaurant);
              setCurrentScreen('restaurant-detail');
            }}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentScreen === 'search' && (
          <SearchScreen
            onSelectDish={(dish) => {
              setSelectedDish(dish);
              setCurrentScreen('dish-detail');
            }}
            onSelectRestaurant={(restaurant) => {
              setSelectedRestaurant(restaurant);
              setCurrentScreen('restaurant-detail');
            }}
            onAddToCart={handleAddToCart}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'restaurant-detail' && (
          <RestaurantScreen
            restaurant={selectedRestaurant}
            onSelectDish={(dish) => {
              setSelectedDish(dish);
              setCurrentScreen('dish-detail');
            }}
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentScreen('home')}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'dish-detail' && (
          <DishDetailScreen
            dish={selectedDish}
            onAddToCart={(d) => {
              handleAddToCart(d);
              setCurrentScreen('cart');
            }}
            onCustomize={(d) => {
              setSelectedDish(d);
              setCurrentScreen('customize');
            }}
            onBack={() => setCurrentScreen('home')}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}

        {currentScreen === 'customize' && (
          <CustomizeScreen
            dish={selectedDish}
            onSaveCustomization={handleSaveCustomization}
            onBack={() => setCurrentScreen('dish-detail')}
          />
        )}

        {currentScreen === 'cart' && (
          <CartScreen
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onProceedToCheckout={() => setCurrentScreen('checkout')}
            onNavigate={setCurrentScreen}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={setAppliedCoupon}
          />
        )}

        {currentScreen === 'checkout' && (
          <CheckoutScreen
            cart={cart}
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
            onProceedToPayment={() => setCurrentScreen('payment')}
            onBack={() => setCurrentScreen('cart')}
            onNavigate={setCurrentScreen}
            appliedCoupon={appliedCoupon}
          />
        )}

        {currentScreen === 'payment' && (
          <PaymentScreen
            cart={cart}
            selectedAddress={selectedAddress}
            appliedCoupon={appliedCoupon}
            onPlaceOrder={(_pmId) => setCurrentScreen('order-confirmed')}
            onBack={() => setCurrentScreen('checkout')}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'order-confirmed' && (
          <OrderConfirmedScreen
            orderId="DS-8821"
            onTrackOrder={() => setCurrentScreen('tracking')}
            onBackToHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'tracking' && (
          <TrackingScreen
            onNavigate={setCurrentScreen}
            orderTracking={INITIAL_TRACKING}
            cart={cart}
            restaurant={selectedRestaurant}
          />
        )}

        {currentScreen === 'handoff' && (
          <HandoffScreen
            onCompleteHandoff={() => setCurrentScreen('rate-order')}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen === 'rate-order' && (
          <RateOrderScreen
            onSubmitReview={(_fb: OrderReviewFeedback) => {
              // review saved
            }}
            onBackToHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'orders' && (
          <OrdersScreen
            onNavigate={setCurrentScreen}
            onReorderDish={(d) => {
              handleAddToCart(d);
              setCurrentScreen('cart');
            }}
          />
        )}

        {currentScreen === 'saved' && (
          <SavedScreen
            onSelectDish={(dish) => {
              setSelectedDish(dish);
              setCurrentScreen('dish-detail');
            }}
            onAddToCart={handleAddToCart}
            onSelectRestaurant={(restaurant) => {
              setSelectedRestaurant(restaurant);
              setCurrentScreen('restaurant-detail');
            }}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            onNavigate={setCurrentScreen}
            accessibilitySettings={accessibilitySettings}
            onUpdateAccessibility={setAccessibilitySettings}
          />
        )}

        {currentScreen === 'notifications' && (
          <NotificationsScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'support' && (
          <SupportScreen onBack={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'addresses' && (
          <AddressesScreen onNavigate={setCurrentScreen} />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenAiAssistant={() => handleOpenAiAssistant()}
      />

      {/* Ask DISHØ AI Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        activeDish={selectedDish}
        initialPrompt={aiInitialPrompt}
      />
    </div>
  );
}
