import React, { useState, useEffect } from 'react';
import { CropLot, MandiPriceItem, PurchaseOrder, User, UserRole } from './types';
import {
  INITIAL_BUYER_USER,
  INITIAL_CROPS,
  INITIAL_FARMER_USER,
  INITIAL_MANDI_PRICES,
  INITIAL_ORDERS,
} from './data/initialData';
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
import { WhyChooseUsModal } from './components/WhyChooseUsModal';
import { AssayReportModal } from './components/AssayReportModal';
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
  const [isWhyChooseUsOpen, setIsWhyChooseUsOpen] = useState(false);

  // Assay Modal State
  const [isAssayModalOpen, setIsAssayModalOpen] = useState(false);
  const [selectedCropForAssay, setSelectedCropForAssay] = useState<CropLot | null>(null);

  const handleViewAssayReport = (crop?: CropLot) => {
    if (crop) {
      setSelectedCropForAssay(crop);
      setIsAssayModalOpen(true);
    } else if (crops.length > 0) {
      setSelectedCropForAssay(crops[0]);
      setIsAssayModalOpen(true);
    }
  };

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Fetch initial crops and orders from backend
  useEffect(() => {
    fetch('/api/crops')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch crops');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCrops(data);
        }
      })
      .catch((err) => console.log('Using initial crops fallback', err));

    fetch('/api/orders')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch orders');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
        }
      })
      .catch((err) => console.log('Using initial orders fallback', err));
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
    if (!user) {
      handleOpenAuth('farmer');
      return;
    }
    if (user.role === 'buyer') {
      const switchedFarmer: User = {
        ...user,
        role: 'farmer',
        memberCount: user.memberCount || 500,
      };
      setUser(switchedFarmer);
      setCurrentView('farmer');
      setActiveTab('farmer-inventory');
      showToast(`Switched view to Farmer: ${switchedFarmer.name}`);
    } else {
      const switchedBuyer: User = {
        ...user,
        role: 'buyer',
        escrowBalance: user.escrowBalance || 4500000,
      };
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
    // Send to backend
    try {
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCrop),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.crop) {
          setCrops((prev) => [json.crop, ...prev]);
        } else {
          setCrops((prev) => [newCrop, ...prev]);
        }
      } else {
        setCrops((prev) => [newCrop, ...prev]);
      }
    } catch {
      setCrops((prev) => [newCrop, ...prev]);
    }
    showToast(`Lot "${newCrop.title}" successfully assayed and listed on Mandi Grid!`);
  };

  // Farmer Actions: Remove Crop
  const handleRemoveCrop = async (cropId: string) => {
    try {
      await fetch(`/api/crops/${cropId}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    setCrops((prev) => prev.filter((c) => c.id !== cropId));
    showToast('Crop lot removed from marketplace.');
  };

  // Farmer Actions: Update Crop Price
  const handleUpdateCropPrice = async (cropId: string, newPrice: number) => {
    try {
      await fetch(`/api/crops/${cropId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricePerQtl: newPrice }),
      });
    } catch {
      // ignore
    }
    setCrops((prev) =>
      prev.map((c) => (c.id === cropId ? { ...c, pricePerQtl: newPrice } : c))
    );
    showToast(`Asking price updated to ₹${newPrice.toLocaleString()}/Qtl.`);
  };

  // Farmer Actions: Confirm Dispatch
  const handleConfirmDispatch = async (orderId: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'weighbridge_verified' }),
      });
    } catch {
      // ignore
    }
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'weighbridge_verified' } : o
      )
    );
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

    const newOrderPayload = {
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
      destinationMandi,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderPayload),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.order) {
          setOrders((prev) => [json.order, ...prev]);
        }
      }
    } catch {
      const fallbackOrder: PurchaseOrder = {
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
      };
      setOrders((prev) => [fallbackOrder, ...prev]);
    }

    // Decrement local crop quantity
    setCrops((prev) =>
      prev.map((c) => {
        if (c.id === crop.id) {
          const remaining = Math.max(0, c.batchQuantityQtl - quantity);
          return {
            ...c,
            batchQuantityQtl: remaining,
            status: remaining === 0 ? 'reserved' : 'available',
          };
        }
        return c;
      })
    );

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
        onOpenWhyChooseUs={() => setIsWhyChooseUsOpen(true)}
        onOpenAddProduce={() => {
          if (!user) {
            handleOpenAuth('farmer');
            return;
          }
          if (user.role !== 'farmer') {
            showToast('Please sign in with a Farmer / FPO account to list produce.');
            handleOpenAuth('farmer');
            return;
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
              if (!user) {
                handleOpenAuth('farmer');
                return;
              }
              if (user.role !== 'farmer') {
                showToast('Please sign in with a Farmer / FPO account to list produce.');
                handleOpenAuth('farmer');
                return;
              }
              setIsAddCropOpen(true);
            }}
            onAcceptBidDemo={() => {
              showToast('Commercial Bid Accepted: ₹2,410/Qtl! Escrow pre-lock contract issued.');
            }}
            onViewAssayReport={handleViewAssayReport}
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
              onViewAssayReport={handleViewAssayReport}
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

      <WhyChooseUsModal
        isOpen={isWhyChooseUsOpen}
        onClose={() => setIsWhyChooseUsOpen(false)}
        onExploreMarketplace={() => {
          setIsWhyChooseUsOpen(false);
          if (!user) {
            handleOpenAuth('buyer');
          } else {
            setCurrentView('buyer');
            setActiveTab('marketplace');
          }
        }}
        onListProduce={() => {
          setIsWhyChooseUsOpen(false);
          if (!user) {
            handleOpenAuth('farmer');
            return;
          }
          if (user.role !== 'farmer') {
            showToast('Please sign in with a Farmer / FPO account to list produce.');
            handleOpenAuth('farmer');
            return;
          }
          setIsAddCropOpen(true);
        }}
      />

      <AssayReportModal
        isOpen={isAssayModalOpen}
        crop={selectedCropForAssay}
        onClose={() => setIsAssayModalOpen(false)}
        onBuyNow={(crop) => {
          setIsAssayModalOpen(false);
          handleSelectCropForOrder(crop);
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
