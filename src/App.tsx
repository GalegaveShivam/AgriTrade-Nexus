import React, { useState, useEffect } from 'react';
import { CropLot, MandiPriceItem, PurchaseOrder, User, UserRole } from './types';
import {
  INITIAL_BUYER_USER,
  INITIAL_CROPS,
  INITIAL_FARMER_USER,
  INITIAL_MANDI_PRICES,
  INITIAL_ORDERS,
} from './data/initialData';
import {
  seedInitialDataIfEmpty,
  subscribeToCrops,
  subscribeToOrders,
  saveCropLotToFirestore,
  updateCropPriceInFirestore,
  deleteCropFromFirestore,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
} from './lib/firebase';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { BuyerDashboard } from './components/BuyerDashboard';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AuthModal } from './components/AuthModal';
import { LoginScreen } from './components/LoginScreen';
import { OrderModal } from './components/OrderModal';
import { CallFarmerModal } from './components/CallFarmerModal';
import { AddCropModal } from './components/AddCropModal';
import { PilotCohortModal } from './components/PilotCohortModal';
import { Footer } from './components/Footer';

export default function App() {
  // App state
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'buyer' | 'farmer' | 'login'>('landing');
  const [activeTab, setActiveTab] = useState<string>('marketplace');
  
  // Data state
  const [crops, setCrops] = useState<CropLot[]>(INITIAL_CROPS);
  const [orders, setOrders] = useState<PurchaseOrder[]>(INITIAL_ORDERS);
  const [mandiPrices] = useState<MandiPriceItem[]>(INITIAL_MANDI_PRICES);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<UserRole>('buyer');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedCropForOrder, setSelectedCropForOrder] = useState<CropLot | null>(null);
  const [defaultOrderQuantity, setDefaultOrderQuantity] = useState<number | undefined>(undefined);

  const [isCallFarmerOpen, setIsCallFarmerOpen] = useState(false);
  const [selectedCropForCall, setSelectedCropForCall] = useState<CropLot | null>(null);

  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [isPilotCohortOpen, setIsPilotCohortOpen] = useState(false);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Real-time Firestore synchronization & backend initial fetch
  useEffect(() => {
    // Seed Firestore collections if freshly provisioned and empty
    seedInitialDataIfEmpty();

    // Subscribe to real-time updates from Firebase Firestore
    const unsubscribeCrops = subscribeToCrops((liveCrops) => {
      if (Array.isArray(liveCrops) && liveCrops.length > 0) {
        setCrops(liveCrops);
      }
    });

    const unsubscribeOrders = subscribeToOrders((liveOrders) => {
      if (Array.isArray(liveOrders) && liveOrders.length > 0) {
        setOrders(liveOrders);
      }
    });

    // Also query backend API for fallback / server cache
    fetch('/api/crops')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCrops((prev) => (prev.length === 0 ? data : prev));
        }
      })
      .catch(() => {});

    fetch('/api/orders')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders((prev) => (prev.length === 0 ? data : prev));
        }
      })
      .catch(() => {});

    return () => {
      unsubscribeCrops();
      unsubscribeOrders();
    };
  }, []);

  // Authentication handlers
  const handleOpenAuth = (role: UserRole = 'buyer') => {
    setAuthRole(role);
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthOpen(false);
    if (loggedInUser.role === 'farmer') {
      setCurrentView('farmer');
      setActiveTab('farmer-inventory');
      showToast(`Namaste & Welcome, ${loggedInUser.name}! Kisan & FPO Terminal ready.`);
    } else {
      setCurrentView('buyer');
      setActiveTab('marketplace');
      showToast(`Welcome back, ${loggedInUser.name}! Commercial Procurement Hub active.`);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
    setActiveTab('landing');
    showToast('Signed out successfully.');
  };

  const handleSwitchRole = () => {
    if (!user || user.role === 'buyer') {
      const switchedFarmer: User = INITIAL_FARMER_USER;
      setUser(switchedFarmer);
      setCurrentView('farmer');
      setActiveTab('farmer-inventory');
      showToast(`Switched view to Farmer / FPO: ${switchedFarmer.name}`);
    } else {
      const switchedBuyer: User = INITIAL_BUYER_USER;
      setUser(switchedBuyer);
      setCurrentView('buyer');
      setActiveTab('marketplace');
      showToast(`Switched view to Buyer: ${switchedBuyer.name}`);
    }
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'landing') {
      setCurrentView('landing');
    } else if (tab === 'farmer-inventory' || tab === 'incoming-orders') {
      setCurrentView('farmer');
    } else {
      setCurrentView('buyer');
    }
  };

  // Farmer Actions: Add Crop
  const handleAddCrop = async (newCrop: CropLot) => {
    // Optimistic local update
    setCrops((prev) => [newCrop, ...prev]);

    // Persist to Firebase Firestore
    try {
      await saveCropLotToFirestore(newCrop);
    } catch (err) {
      console.warn('Firestore write error, falling back to server API', err);
    }

    // Persist to backend server API
    try {
      await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCrop),
      });
    } catch {
      // Handled
    }
    showToast(`Lot "${newCrop.title}" successfully assayed and listed on Mandi Grid!`);
  };

  // Farmer Actions: Remove Crop
  const handleRemoveCrop = async (cropId: string) => {
    setCrops((prev) => prev.filter((c) => c.id !== cropId));

    try {
      await deleteCropFromFirestore(cropId);
    } catch (err) {
      console.warn('Firestore delete error', err);
    }

    try {
      await fetch(`/api/crops/${cropId}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    showToast('Crop lot removed from marketplace.');
  };

  // Farmer Actions: Update Crop Price
  const handleUpdateCropPrice = async (cropId: string, newPrice: number) => {
    setCrops((prev) =>
      prev.map((c) => (c.id === cropId ? { ...c, pricePerQtl: newPrice } : c))
    );

    try {
      await updateCropPriceInFirestore(cropId, newPrice);
    } catch (err) {
      console.warn('Firestore price update error', err);
    }

    try {
      await fetch(`/api/crops/${cropId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricePerQtl: newPrice }),
      });
    } catch {
      // ignore
    }
    showToast(`Asking price updated to ₹${newPrice.toLocaleString()}/Qtl.`);
  };

  // Farmer Actions: Confirm Dispatch
  const handleConfirmDispatch = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'weighbridge_verified' } : o
      )
    );

    try {
      await updateOrderStatusInFirestore(orderId, 'weighbridge_verified');
    } catch (err) {
      console.warn('Firestore order update error', err);
    }

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'weighbridge_verified' }),
      });
    } catch {
      // ignore
    }
    showToast('Weighbridge gross/tare verified! Payout release initiated via RTGS.');
  };

  // Buyer Actions: Buy Now (Trigger Order Modal)
  const handleSelectCropForOrder = (crop: CropLot, quantity?: number) => {
    if (!user) {
      handleOpenAuth('buyer');
      return;
    }
    setSelectedCropForOrder(crop);
    setDefaultOrderQuantity(quantity);
    setIsOrderModalOpen(true);
  };

  // Buyer Actions: Call Farmer Modal
  const handleCallFarmer = (crop: CropLot) => {
    setSelectedCropForOrder(crop);
    setSelectedCropForCall(crop);
    setIsCallFarmerOpen(true);
  };

  // Buyer Actions: Confirm & Place Order
  const handleConfirmOrder = async (orderData: {
    crop: CropLot;
    quantity: number;
    destinationMandi: string;
    totalAmount: number;
    grossAmount: number;
    mandiTax: number;
  }) => {
    const { crop, quantity, destinationMandi, totalAmount, grossAmount, mandiTax } = orderData;

    const newOrder: PurchaseOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      lotId: crop.id,
      cropTitle: crop.title,
      cropCategory: crop.cropCategory,
      quantityQtl: quantity,
      pricePerQtl: crop.pricePerQtl,
      grossAmount,
      mandiTax,
      totalAmount,
      buyerId: user?.id || 'buyer-01',
      buyerName: user?.name || 'AgroCore Foods Ltd.',
      farmerName: crop.farmerName,
      fpoName: crop.fpoName,
      farmerPhone: crop.farmerPhone,
      status: 'escrow_locked',
      createdAt: new Date().toISOString().split('T')[0],
      transitPassNo: `MP-TP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      destinationMandi,
      weighbridgeWeightQtl: quantity,
    };

    // 1. Optimistic update
    setOrders((prev) => [newOrder, ...prev]);

    // 2. Persist to Firebase Firestore
    try {
      await saveOrderToFirestore(newOrder);
    } catch (err) {
      console.warn('Firestore save order error', err);
    }

    // 3. Persist to backend server API
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
    } catch {
      // Handled
    }

    // Decrement local crop quantity and update Firestore
    const remaining = Math.max(0, crop.batchQuantityQtl - quantity);
    setCrops((prev) =>
      prev.map((c) => {
        if (c.id === crop.id) {
          return {
            ...c,
            batchQuantityQtl: remaining,
            status: remaining === 0 ? 'reserved' : 'available',
          };
        }
        return c;
      })
    );

    try {
      await saveCropLotToFirestore({
        ...crop,
        batchQuantityQtl: remaining,
        status: remaining === 0 ? 'reserved' : 'available',
      });
    } catch (err) {
      console.warn('Firestore crop quantity update error', err);
    }

    // Update buyer balance
    if (user && user.escrowBalance) {
      setUser({
        ...user,
        escrowBalance: Math.max(0, user.escrowBalance - totalAmount),
      });
    }

    showToast(
      `Purchase Order placed! ₹${totalAmount.toLocaleString()} safely secured in tripartite bank escrow.`
    );
  };

  // Dedicated full-page institutional login terminal screen
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-[#f8f9fc] text-[#131b2e] font-sans flex flex-col selection:bg-[#c1ecd4] selection:text-[#002114]">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#063b28] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-[#1b4332] animate-bounce">
            <span className="material-symbols-outlined text-[20px] text-[#c1ecd4]">verified</span>
            <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          </div>
        )}
        <LoginScreen
          initialRole={authRole}
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setCurrentView('landing')}
          onRequestAccess={() => setIsPilotCohortOpen(true)}
        />
        <PilotCohortModal
          isOpen={isPilotCohortOpen}
          onClose={() => setIsPilotCohortOpen(false)}
          onSubmitSuccess={(cohortData) => {
            setIsPilotCohortOpen(false);
            showToast(`Priority application confirmed for ${cohortData.fpoName}. Terminal allocation active.`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] font-sans flex flex-col selection:bg-[#c1ecd4] selection:text-[#002114]">
      {/* Universal Fixed Header */}
      <Header
        user={user}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onOpenAddProduce={() => {
          if (!user || user.role !== 'farmer') {
            setUser(INITIAL_FARMER_USER);
            setCurrentView('farmer');
            setActiveTab('farmer-inventory');
          }
          setIsAddCropOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 mt-20">
        {currentView === 'landing' && (
          <LandingPage
            onSelectRole={(role) => {
              handleOpenAuth(role);
            }}
            onBrowseMarketplace={() => {
              if (!user) {
                handleOpenAuth('buyer');
              } else {
                setCurrentView('buyer');
                setActiveTab('marketplace');
              }
            }}
            onOpenPilotCohort={() => setIsPilotCohortOpen(true)}
            onOpenAddProduce={() => {
              if (!user || user.role !== 'farmer') {
                setUser(INITIAL_FARMER_USER);
                setCurrentView('farmer');
                setActiveTab('farmer-inventory');
              }
              setIsAddCropOpen(true);
            }}
            onAcceptBidDemo={() => {
              showToast('Commercial Bid Accepted: ₹2,410/Qtl! Escrow pre-lock contract issued.');
            }}
          />
        )}

        {currentView === 'buyer' && (
          <div className="pt-2 pb-16">
            <BuyerDashboard
              buyer={user}
              crops={crops}
              orders={orders}
              mandiPrices={mandiPrices}
              onSelectCropForOrder={handleSelectCropForOrder}
              onCallFarmer={handleCallFarmer}
              activeBuyerTab={activeTab}
            />
          </div>
        )}

        {currentView === 'farmer' && (
          <div className="pt-2 pb-16">
            <FarmerDashboard
              farmer={user}
              crops={crops}
              orders={orders}
              mandiPrices={mandiPrices}
              onOpenAddCropModal={() => setIsAddCropOpen(true)}
              onRemoveCrop={handleRemoveCrop}
              onUpdateCropPrice={handleUpdateCropPrice}
              onConfirmDispatch={handleConfirmDispatch}
              activeFarmerTab={activeTab}
              onSwitchRole={handleSwitchRole}
              onSelectTab={handleSelectTab}
              onAddCrop={handleAddCrop}
            />
          </div>
        )}
      </main>

      {/* Institutional Multi-Column Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={authRole}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        crop={selectedCropForOrder}
        buyer={user}
        defaultQuantity={defaultOrderQuantity}
        onConfirmOrder={handleConfirmOrder}
      />

      <CallFarmerModal
        isOpen={isCallFarmerOpen}
        onClose={() => setIsCallFarmerOpen(false)}
        crop={selectedCropForCall}
      />

      <AddCropModal
        isOpen={isAddCropOpen}
        onClose={() => setIsAddCropOpen(false)}
        farmer={user}
        onAddCrop={handleAddCrop}
      />

      <PilotCohortModal
        isOpen={isPilotCohortOpen}
        onClose={() => setIsPilotCohortOpen(false)}
        onSubmitSuccess={(details) => {
          showToast(`Pilot registration received for ${details.fpoName}! Our team is reviewing.`);
        }}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#063b28] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#1b4332] flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[#86af99] text-[22px] flex-shrink-0">
            verified
          </span>
          <span className="text-xs font-semibold leading-snug flex-1">
            {toastMessage}
          </span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white"
            aria-label="Close notification"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
