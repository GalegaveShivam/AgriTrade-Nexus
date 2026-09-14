import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { BRAND_LOGO_URL } from '../data/initialData';
import { useLanguage, LANGUAGES } from '../i18n';

interface HeaderProps {
  user: User | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: (defaultRole?: UserRole) => void;
  onLogout: () => void;
  onSwitchRole: () => void;
  onOpenAddProduce?: () => void;
  onOpenWhyChooseUs?: () => void;
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
  onOpenWhyChooseUs,
  unreadNotificationsCount = 2,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];


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
              <span className="truncate">TRENDING COMMODITIES • APMC MANDI RATES SYNCED • DIRECT ESCROW PAYMENT ACTIVE</span>
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
                <strong className="text-white">Trending Now:</strong> Premium Sharbati Wheat (₹3,850/Qtl, ▲+4.2%) & Yellow Mustard (₹5,420/Qtl, ▲+3.1%) leading spot institutional demand • Mandi Benchmark synced
              </span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-[10px] uppercase font-bold text-emerald-300 flex-shrink-0">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                SPOT DEMAND SURGE
              </span>
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
              {isBuyer && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">
                  Buyer Hub
                </span>
              )}
            </div>
          </div>

          {!isBuyer && (
            /* Subtly blended trending pill next to logo */
            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200/80 text-xs text-gray-600">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Trending:
              </span>
              <span className="text-gray-600 font-normal truncate max-w-[260px]">
                Sharbati Wheat &amp; Yellow Mustard (Spot +18%)
              </span>
            </div>
          )}
        </div>

        {/* Center Navigation Links tailored by role */}
        {isBuyer ? (
          /* Buyer Navigation */
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-gray-600">
            <button
              onClick={() => onSelectTab('marketplace')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'marketplace'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t('marketplace', 'Marketplace')}
            </button>
            <button
              onClick={() => onSelectTab('my-orders')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'my-orders'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t('myOrders', 'My Orders')}
            </button>
            <button
              onClick={() => onSelectTab('contracts')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'contracts'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t('contractsPayments', 'Contracts & Payments')}
            </button>
            <button
              onClick={() => onSelectTab('quality-reports')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'quality-reports'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t('qualityReports', 'Quality Reports')}
            </button>
            <button
              onClick={() => onSelectTab('market-prices')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'market-prices'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t('marketPrices', 'Market Prices')}
            </button>
          </nav>
        ) : (
          /* Farmer / General Navigation */
          <nav className="hidden xl:flex items-center gap-1 text-xs font-medium text-gray-600">
            <button
              onClick={() => onSelectTab('marketplace')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'marketplace'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t('marketplace', 'Marketplace')}
            </button>
            <button
              onClick={() => handleScrollToSection('how-it-works-section')}
              className="px-3 py-1.5 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {t('howItWorks', 'How It Works')}
            </button>
            <button
              onClick={() => handleScrollToSection('net-profit-calculator-section')}
              className="px-3 py-1.5 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1 font-semibold text-emerald-800"
            >
              <span className="material-symbols-outlined text-[15px] text-emerald-600">calculate</span>
              <span>{t('openCalculator', 'Profit Calculator')}</span>
            </button>
            <button
              onClick={() => handleScrollToSection('escrow-simulator-section')}
              className="px-3 py-1.5 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px] text-teal-600">shield_lock</span>
              <span>{t('escrowFlow', 'Escrow Flow')}</span>
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
              className="px-3 py-1.5 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {t('forFpoFarmers', 'For FPOs & Farmers')}
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
              className="px-3 py-1.5 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {t('forBulkBuyers', 'For Bulk Buyers')}
            </button>
            <button
              onClick={() => handleScrollToSection('faq-section')}
              className="px-3 py-1.5 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {t('faq', 'FAQ')}
            </button>
          </nav>
        )}

        {/* Right Action Elements */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="h-9 px-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center gap-1.5 transition-colors border border-gray-200 btn-press shadow-2xs text-xs font-semibold"
              title="Select Agricultural Mandi Language (11 Regional Hubs)"
              aria-label="Language selector"
            >
              <span className="text-[14px]">{currentLangObj.flag}</span>
              <span className="inline font-bold text-[11px] sm:text-xs text-gray-800">
                <span className="sm:hidden">{currentLangObj.shortLabel}</span>
                <span className="hidden sm:inline">{currentLangObj.nativeLabel}</span>
              </span>
              <span className="material-symbols-outlined text-[16px] text-gray-400">arrow_drop_down</span>
            </button>

            {isLangMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 sm:w-80 max-h-[440px] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200 py-1.5 z-50 animate-fade-in text-xs divide-y divide-gray-50">
                  <div className="sticky top-0 bg-white/95 backdrop-blur-xs px-3.5 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 flex items-center justify-between z-10">
                    <span>{t('selectLanguage', 'Select Language')}</span>
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold font-mono text-[10px]">
                      {LANGUAGES.length} Mandi Belts
                    </span>
                  </div>
                  <div className="py-1">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 flex items-start justify-between hover:bg-emerald-50/80 transition-colors ${
                          language === lang.code ? 'font-bold text-[#063b28] bg-emerald-50/70 border-l-3 border-emerald-600' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0 pr-2">
                          <span className="text-[16px] mt-0.5 shrink-0">{lang.flag}</span>
                          <div className="flex flex-col text-left min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-gray-900">{lang.nativeLabel}</span>
                              <span className="text-[10px] text-gray-400">({lang.label})</span>
                            </div>
                            <span className="text-[10px] text-emerald-700 font-medium truncate">{lang.region}</span>
                            <span className="text-[9.5px] text-gray-500 truncate">{lang.majorCrops}</span>
                          </div>
                        </div>
                        {language === lang.code && (
                          <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {isBuyer ? (
            /* Buyer Right: Escrow Balance pill + User Org + Notifications */
            <>
              <div className="hidden sm:flex flex-col items-end px-3 py-1 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">
                  {t('escrowBalance', 'Escrow Balance')}
                </span>
                <span className="font-mono text-xs font-bold text-[#1b4332]">
                  ₹{(user?.escrowBalance || 4500000).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-[#131b2e]">{user?.name || 'AgroCore Foods Ltd.'}</span>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {t('verifiedBuyer', 'VERIFIED BUYER')}
                </span>
              </div>

              {/* Notification Bell */}
              <button
                className="h-9 w-9 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center relative btn-press shadow-2xs"
                title="Procurement Notifications"
              >
                <span className="material-symbols-outlined text-[19px]">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>
              </button>
            </>
          ) : (
            /* Farmer / General Right: Why You Choose Us + List Produce */
            <>
              <button
                id="whyYouChooseUsBtn"
                onClick={() => {
                  if (onOpenWhyChooseUs) {
                    onOpenWhyChooseUs();
                  } else {
                    handleScrollToSection('why-choose-us-section');
                  }
                }}
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold text-xs transition-colors shadow-2xs btn-press"
                title="Why Choose AgriTrade Nexus"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-700">verified</span>
                <span>{t('whyChooseUs', 'Why You Choose Us')}</span>
              </button>

              <button
                id="listProduceBtn"
                onClick={handleListProduceClick}
                className="h-9 px-4 rounded-xl bg-[#063b28] hover:bg-[#0b4d32] text-white font-semibold text-xs transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 btn-press btn-shine"
              >
                <span className="material-symbols-outlined text-[18px]">add_box</span>
                <span>{t('listProduce', 'List Produce')}</span>
              </button>
            </>
          )}

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-colors border border-gray-200 btn-press shadow-2xs"
              title={user ? `${user.name} (${user.role})` : 'Account & Demo Switcher'}
              aria-label="User profile menu"
            >
              <span className="material-symbols-outlined text-[19px]">person</span>
            </button>

            {isProfileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 z-50 animate-fade-in text-xs">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-500 capitalize">
                          {user.role === 'buyer' ? t('buyerHub', 'Commercial Buyer') : t('farmerHub', 'FPO / Farmer Producer')}
                        </p>
                        {user.role === 'buyer' && (
                          <p className="text-[11px] font-mono font-bold text-[#063b28] mt-1">
                            {t('escrowBalance', 'Escrow')}: ₹{(user.escrowBalance || 4500000).toLocaleString()}
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
                        <span>{user.role === 'buyer' ? t('switchToFarmer', 'Switch to Farmer View') : t('switchToBuyer', 'Switch to Buyer View')}</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectTab('landing');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-semibold"
                      >
                        <span className="material-symbols-outlined text-[18px] text-gray-500">home</span>
                        <span>{t('backToHome', 'Back to Landing Page')}</span>
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
                        <span>{t('signOut', 'Sign Out')}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-bold text-gray-900">{t('guestVisitor', 'Guest Visitor')}</p>
                        <p className="text-[11px] text-gray-500">{t('guestDesc', 'Select a role to test interactive terminal')}</p>
                      </div>
                      <button
                        onClick={() => {
                          onOpenAuth('buyer');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-[#a35d1e] font-semibold"
                      >
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                        <span>{t('loginAsBuyer', 'Login as Commercial Buyer')}</span>
                      </button>
                      <button
                        onClick={() => {
                          onOpenAuth('farmer');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-[#063b28] font-semibold"
                      >
                        <span className="material-symbols-outlined text-[18px]">agriculture</span>
                        <span>{t('loginAsFarmer', 'Login as Farmer / FPO')}</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          {/* Mobile menu button and quick action */}
          <div className="flex xl:hidden items-center gap-1.5">
            <button
              onClick={() => onSelectTab('marketplace')}
              className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition-colors"
            >
              {t('marketplace', 'Marketplace')}
            </button>
            <button
              onClick={handleListProduceClick}
              className="px-2.5 py-1.5 bg-[#063b28] hover:bg-[#0b4d32] text-white rounded-lg text-xs font-semibold transition-colors"
            >
              {t('listProduce', 'List Produce')}
            </button>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 flex items-center justify-center transition-colors"
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

