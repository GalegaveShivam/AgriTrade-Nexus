import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { BRAND_LOGO_URL } from '../data/initialData';

interface HeaderProps {
  user: User | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: (defaultRole?: UserRole) => void;
  onLogout: () => void;
  onSwitchRole: () => void;
  onOpenAddProduce?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeTab,
  onSelectTab,
  onOpenAuth,
  onLogout,
  onSwitchRole,
  onOpenAddProduce,
  unreadNotificationsCount = 2,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleScrollToSection = (sectionId: string) => {
    onSelectTab('landing');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleListProduceClick = () => {
    if (!user) {
      onOpenAuth('farmer');
    } else if (user.role === 'farmer') {
      if (onOpenAddProduce) {
        onOpenAddProduce();
      } else {
        onSelectTab('farmer-inventory');
      }
    } else {
      // User is logged in as buyer, switch to farmer role or prompt
      onSwitchRole();
      if (onOpenAddProduce) {
        setTimeout(() => onOpenAddProduce(), 300);
      }
    }
  };

  const isBuyer = user?.role === 'buyer';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Top Live Ticker Bar (Exact as in screenshots) */}
      <div className="w-full bg-[#0a1f18] text-[#a7d7c5] px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] font-medium border-b border-[#13322b] flex items-center justify-between">
        {isBuyer ? (
          <>
            <div className="flex items-center gap-2 overflow-hidden truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
              <span className="font-bold text-white uppercase tracking-wider text-[10px]">LIVE MARKET TICKER</span>
              <span className="text-gray-500">|</span>
              <span className="truncate">RABI SEASON • APMC MANDI RATES SYNCED • DIRECT ESCROW PAYMENT ACTIVE</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[10px] uppercase font-bold text-emerald-300 flex-shrink-0">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                NATIONAL MANDI GRID CONNECTED
              </span>
              <span className="text-gray-600">•</span>
              <span>ISO 22000 ASSAYED</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 overflow-hidden truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
              <span className="truncate">
                <strong className="text-white">Ujjain-Indore Agri Zone:</strong> 29°C Clear Skies • Mandi Benchmark: Durum Wheat ₹2,350/Qtl (+₹90 over MSP) • Direct Escrow Active (Zero Default Guarantee) • Mandi Feed: LIVE (Rabi Rabi-25)
              </span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-[10px] uppercase font-bold text-emerald-300 flex-shrink-0">
              <span>RABI-25 ACTIVE</span>
              <span className="text-gray-600">•</span>
              <span>ICICI ESCROW SECURED</span>
            </div>
          </>
        )}
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <div
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            title="AgriTrade Nexus Home"
          >
            <img
              src={BRAND_LOGO_URL}
              alt="AgriTrade Nexus Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-headline text-[18px] sm:text-[19px] font-bold text-[#131b2e] leading-none tracking-tight">
                AgriTrade Nexus
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">
                {isBuyer ? 'Buyer Hub' : 'B2B AGRI-TRADE EXCHANGE'}
              </span>
            </div>
          </div>

          {!isBuyer && (
            /* Pilot Program Pill */
            <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] text-[11px] font-bold tracking-tight select-none">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
              <span>PILOT PROGRAM ACTIVE • RABI SEASON</span>
            </div>
          )}
        </div>

        {/* Center Navigation Links tailored by role */}
        {isBuyer ? (
          /* Buyer Navigation (Screenshot 7 & 1) */
          <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold text-gray-700">
            <button
              onClick={() => onSelectTab('marketplace')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-[#13322b] text-white shadow-xs'
                  : 'bg-transparent text-[#131b2e] hover:bg-gray-100'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => onSelectTab('my-orders')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'my-orders'
                  ? 'bg-[#13322b] text-white shadow-xs'
                  : 'text-[#414844] hover:text-[#131b2e] hover:bg-gray-100'
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => onSelectTab('contracts')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'contracts'
                  ? 'bg-[#13322b] text-white shadow-xs'
                  : 'text-[#414844] hover:text-[#131b2e] hover:bg-gray-100'
              }`}
            >
              Contracts &amp; Payments
            </button>
            <button
              onClick={() => onSelectTab('quality-reports')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'quality-reports'
                  ? 'bg-[#13322b] text-white shadow-xs'
                  : 'text-[#414844] hover:text-[#131b2e] hover:bg-gray-100'
              }`}
            >
              Quality Reports
            </button>
            <button
              onClick={() => onSelectTab('market-prices')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'market-prices'
                  ? 'bg-[#13322b] text-white shadow-xs'
                  : 'text-[#414844] hover:text-[#131b2e] hover:bg-gray-100'
              }`}
            >
              Market Prices
            </button>
          </nav>
        ) : (
          /* Farmer / General Navigation (Screenshot 3) */
          <nav className="hidden xl:flex items-center gap-2 text-xs font-semibold text-gray-700">
            <button
              onClick={() => onSelectTab('marketplace')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-[#eef0fc] text-[#131b2e] font-bold shadow-xs'
                  : 'bg-[#f4f5fa] hover:bg-[#eef0fc] text-[#131b2e]'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => handleScrollToSection('how-it-works-section')}
              className="px-2.5 py-2 hover:text-[#131b2e] hover:bg-gray-100 rounded-lg transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => handleScrollToSection('trust-verification-section')}
              className="px-2.5 py-2 hover:text-[#131b2e] hover:bg-gray-100 rounded-lg transition-colors"
            >
              Trust &amp; Verification
            </button>
            <button
              onClick={() => {
                if (user && user.role === 'farmer') {
                  onSelectTab('farmer-inventory');
                } else if (user && user.role === 'buyer') {
                  onSwitchRole();
                } else {
                  onOpenAuth('farmer');
                }
              }}
              className="px-3 py-1.5 border border-dashed border-blue-400/80 text-[#1e293b] hover:border-blue-600 hover:text-blue-800 rounded-lg transition-colors"
            >
              For FPOs &amp; Farmers
            </button>
            <button
              onClick={() => {
                if (user && user.role === 'buyer') {
                  onSelectTab('marketplace');
                } else if (user && user.role === 'farmer') {
                  onSwitchRole();
                } else {
                  onOpenAuth('buyer');
                }
              }}
              className="px-3 py-1.5 border border-dashed border-blue-400/80 text-[#1e293b] hover:border-blue-600 hover:text-blue-800 rounded-lg transition-colors"
            >
              For Bulk Buyers
            </button>
            <button
              onClick={() => handleScrollToSection('faq-section')}
              className="px-2.5 py-2 hover:text-[#131b2e] hover:bg-gray-100 rounded-lg transition-colors"
            >
              FAQ
            </button>
          </nav>
        )}

        {/* Right Action Elements */}
        <div className="flex items-center gap-3">
          {isBuyer ? (
            /* Buyer Right: Escrow Balance pill + User Org + Notifications */
            <>
              <div className="hidden sm:flex flex-col items-end px-3 py-1 bg-[#f8f9fa] rounded-xl border border-gray-200">
                <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Escrow Balance</span>
                <span className="font-mono text-xs font-bold text-[#1b4332]">
                  ₹{(user?.escrowBalance || 4500000).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-[#131b2e]">{user?.name || 'AgroCore Foods Ltd.'}</span>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  VERIFIED BUYER
                </span>
              </div>

              {/* Notification Bell */}
              <button
                className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                title="Procurement Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
              </button>
            </>
          ) : (
            /* Farmer Right: Buyer Portal Login + List Produce */
            <>
              <button
                onClick={() => {
                  if (user && user.role === 'buyer') {
                    onSelectTab('marketplace');
                  } else {
                    onSwitchRole();
                  }
                }}
                className="hidden sm:inline-flex px-3 py-1.5 border border-dashed border-blue-400/80 text-[#a35d1e] font-bold hover:text-[#8e4e16] hover:border-amber-500 rounded-lg transition-colors text-xs"
              >
                Buyer Portal Login
              </button>

              <button
                id="listProduceBtn"
                onClick={handleListProduceClick}
                className="px-4 py-2 bg-[#063b28] hover:bg-[#0b4d32] text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">add_box</span>
                <span>List Produce (FPO/Farmer)</span>
              </button>
            </>
          )}

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-9 h-9 rounded-full bg-[#063b28] text-white flex items-center justify-center hover:bg-[#0b4d32] transition-colors border border-gray-200"
              title={user ? `${user.name} (${user.role})` : 'Account & Demo Switcher'}
              aria-label="User profile menu"
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 z-50 animate-fade-in text-xs">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 capitalize">
                        {user.role === 'buyer' ? 'Commercial Buyer' : 'FPO / Farmer Producer'}
                      </p>
                      {user.role === 'buyer' && (
                        <p className="text-[11px] font-mono font-bold text-[#063b28] mt-1">
                          Escrow: ₹{(user.escrowBalance || 4500000).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        onSwitchRole();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px] text-gray-500">swap_horiz</span>
                      <span>Switch to {user.role === 'buyer' ? 'Farmer' : 'Buyer'} View</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab('landing');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px] text-gray-500">home</span>
                      <span>Back to Landing Page</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-bold text-gray-900">Guest Visitor</p>
                      <p className="text-[11px] text-gray-500">Select a role to test interactive terminal</p>
                    </div>
                    <button
                      onClick={() => {
                        onOpenAuth('buyer');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-[#a35d1e] font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">storefront</span>
                      <span>Login as Commercial Buyer</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenAuth('farmer');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-[#063b28] font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">agriculture</span>
                      <span>Login as Farmer / FPO</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          {/* Mobile menu button and quick action */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => onSelectTab('marketplace')}
              className="px-3 py-1.5 bg-[#eef0fc] text-[#131b2e] rounded-lg text-xs font-bold"
            >
              Marketplace
            </button>
            <button
              onClick={handleListProduceClick}
              className="px-3 py-1.5 bg-[#063b28] text-white rounded-lg text-xs font-bold"
            >
              List Produce
            </button>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-8 h-8 rounded-full bg-[#063b28] text-white flex items-center justify-center"
              aria-label="Toggle user menu"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

