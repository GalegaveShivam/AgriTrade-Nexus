import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, CropLot } from '../types';
import { NetProfitCalculator } from './NetProfitCalculator';
import { EscrowSimulator } from './EscrowSimulator';
import { useLanguage } from '../i18n';
import { audioAssistant } from '../utils/audioAssistant';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  onBrowseMarketplace: () => void;
  onOpenPilotCohort: () => void;
  onOpenAddProduce: () => void;
  onAcceptBidDemo?: () => void;
  onViewAssayReport?: (crop?: CropLot) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onBrowseMarketplace,
  onOpenPilotCohort,
  onOpenAddProduce,
  onAcceptBidDemo,
  onViewAssayReport,
}) => {
  const { t, language } = useLanguage();
  // Interactive state for Mockups & Accordion
  const [scrollY, setScrollY] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeNavSection, setActiveNavSection] = useState<string>('hero');

  // Sub-tabs for granular interactivity as the user scrolls
  const [receiptsSubTab, setReceiptsSubTab] = useState<'summary' | 'deductions' | 'reality'>('summary');
  const [frictionFilter, setFrictionFilter] = useState<'all' | 'deductions' | 'settlement' | 'inspection'>('all');
  const [stage1Tab, setStage1Tab] = useState<'parameters' | 'nabl'>('parameters');
  const [stage2Tab, setStage2Tab] = useState<'bids' | 'orderbook'>('bids');
  const [stage3Tab, setStage3Tab] = useState<'escrow' | 'rules'>('escrow');
  const [stage4Tab, setStage4Tab] = useState<'telemetry' | 'rtgs'>('telemetry');
  const [advisoryFilter, setAdvisoryFilter] = useState<'all' | 'economists' | 'fpos' | 'processors'>('all');
  const [faqCategory, setFaqCategory] = useState<'all' | 'escrow' | 'quality' | 'platform'>('all');

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeHighestBidAccepted, setActiveHighestBidAccepted] = useState(false);
  const [isCounterOfferOpen, setIsCounterOfferOpen] = useState(false);
  const [counterPrice, setCounterPrice] = useState('2430');
  const [counterSubmitted, setCounterSubmitted] = useState(false);

  // Scroll listener for reading progress bar and active section detection
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrollY(current);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (current / total) * 100)));
      }

      const sections = [
        { id: 'hero-section', name: 'hero' },
        { id: 'tale-of-two-receipts-section', name: 'receipts' },
        { id: 'why-choose-us-section', name: 'friction' },
        { id: 'net-profit-calculator-section', name: 'calculator' },
        { id: 'how-it-works-section', name: 'workflow' },
        { id: 'escrow-simulator-section', name: 'escrow' },
        { id: 'advisory-section', name: 'advisory' },
        { id: 'faq-section', name: 'faq' },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 260) {
            setActiveNavSection(sections[i].name);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      audioAssistant.playChime('click');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    audioAssistant.playChime('click');
  };

  const handleAudioNarrateReceipts = () => {
    let textToSpeak = '';
    let voiceLang = 'en-IN';

    if (language === 'hi') {
      voiceLang = 'hi-IN';
      textToSpeak =
        'पारंपरिक मंडी में 100 क्विंटल शरबती गेहूँ बेचने पर आढ़त, अनधिकृत काट और तौल में गड़बड़ी से लगभग 18,000 रुपये का नुकसान होता है और पैसे 7 दिन बाद मिलते हैं। एग्रीट्रेड नेक्सस पर सीधी खरीद, डिजिटल लैब जांच और शून्य काट से किसान को पूरे 2,68,000 रुपये उसी दिन बैंक खाते में मिलते हैं।';
    } else if (language === 'mr') {
      voiceLang = 'mr-IN';
      textToSpeak =
        'पारंपारिक बाजार समितीत 100 क्विंटल शरबती गहू विकल्यास अडत, अनधिकृत कपात आणि वजनात सुमारे 18,000 रुपयांचे नुकसान होते. एग्रीट्रेड नेक्ससवर थेट खरेदी, डिजिटल लॅब तपासणी आणि शून्य कपातीमुळे शेतकऱ्याला पूर्ण 2,68,000 रुपये त्याच दिवशी थेट बँक खात्यात मिळतात.';
    } else if (language === 'pa') {
      voiceLang = 'pa-IN';
      textToSpeak =
        'ਰਵਾਇਤੀ ਮੰਡੀ ਵਿੱਚ 100 ਕੁਇੰਟਲ ਸ਼ਰਬਤੀ ਕਣਕ ਵੇਚਣ ਉੱਤੇ ਆੜ੍ਹਤ, ਕਟੌਤੀ ਅਤੇ ਤੁਲਾਈ ਦੇ ਨੁਕਸਾਨ ਨਾਲ ਲਗਭਗ 18,000 ਰੁਪਏ ਦਾ ਘਾਟਾ ਪੈਂਦਾ ਹੈ। ਐਗਰੀਟ੍ਰੇਡ ਨੈਕਸਸ ਉੱਤੇ ਸਿੱਧੀ ਖਰੀਦ ਅਤੇ ਡਿਜੀਟਲ ਲੈਬ ਜਾਂਚ ਨਾਲ ਕਿਸਾਨ ਨੂੰ ਪੂਰੇ 2,68,000 ਰੁਪਏ ਉਸੇ ਦਿਨ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਮਿਲਦੇ ਹਨ।';
    } else {
      voiceLang = 'en-IN';
      textToSpeak =
        'Selling 100 quintals of Sharbati wheat through traditional mandis leads to over ₹18,000 in hidden deductions from broker commission, visual dockage, and scale variance with 7-day payment waits. Through AgriTrade Nexus direct settlement, farmers take home ₹2,68,000 directly into their bank accounts on the same day.';
    }

    audioAssistant.speak(textToSpeak, voiceLang);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleAcceptBid = () => {
    setActiveHighestBidAccepted(true);
    if (onAcceptBidDemo) {
      onAcceptBidDemo();
    }
  };

  const handleCounterOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCounterSubmitted(true);
    setTimeout(() => {
      setIsCounterOfferOpen(false);
      setCounterSubmitted(false);
    }, 1800);
  };

  const faqItems = [
    {
      category: 'escrow',
      tag: 'Tripartite Bank Escrow',
      icon: 'shield',
      question: t('faq1Q', 'How do you verify buyers are genuine and will actually pay?'),
      answer: t(
        'faq1A',
        'Every corporate buyer and processing mill undergoes rigorous multi-tier credentialing including mandatory GSTIN cross-checks, corporate financial underwriting, FSSAI commodity licenses, and warehouse capacity verification. Most importantly, 100% of the contracted trade value must be pre-deposited and locked in our ICICI / State Bank tripartite escrow vault before the FPO is authorized to dispatch trucks. Funds cannot be recalled by the buyer while cargo is in transit.'
      ),
    },
    {
      category: 'quality',
      tag: 'NABL Assaying & Testing',
      icon: 'biotech',
      question: t("faq2Q", "What happens if produce quality doesn't match what was listed?"),
      answer: t(
        'faq2A',
        'Before broadcast, every lot receives a standardized digital assay certificate (moisture, foreign matter, admixture, and grain hardness) recorded with calibrated equipment at the FPO aggregation center. When the truck arrives at the buyer mill, digital weighbridge integration verifies the exact same AGMARK parameters. If variance exceeds statutory tolerance (±0.5%), a designated independent dispute officer is assigned within 2 hours under standardized contractual dispute protocols.'
      ),
    },
    {
      category: 'platform',
      tag: 'Farmer Accessibility',
      icon: 'sms',
      question: t('faq3Q', 'Do I need a smartphone or continuous internet connection to use this?'),
      answer: t(
        'faq3A',
        'No continuous internet or high-end smartphone is required for individual farmers. FPO cluster managers, aggregation center operators, and field coordinators manage digital lot entry, weighbridge slip generation, and telemetry at the village hub. Individual farmers receive automated real-time SMS dispatch, weight confirmation, and bank credit notifications on basic feature phones in 11 Indian regional languages.'
      ),
    },
    {
      category: 'platform',
      tag: 'Direct Trade vs APMC Mandi',
      icon: 'storefront',
      question: t('faq4Q', 'How is this different from selling through my local mandi or existing dealer?'),
      answer: t(
        'faq4A',
        'In traditional mandis, farmers lose 15–20% of their realization through compounding middleman commission cuts (arhtiyas), handling fees, delayed informal payment books (4–7 days or longer), and arbitrary visual "katauti" (weight deductions without lab proof). AgriTrade Nexus bypasses intermediaries entirely: institutional buyers submit firm competitive bids directly to FPOs, payment is settled via RTGS within 24 hours of weighment, and quality is validated scientifically.'
      ),
    },
    {
      category: 'escrow',
      tag: 'Fee Structure & Transparency',
      icon: 'paid',
      question: t('faq5Q', 'Is there a fee for farmers to list their produce?'),
      answer: t(
        'faq5A',
        'Listing and selling produce on AgriTrade Nexus is 100% free for farmers and certified FPOs during the pilot and ongoing operational phases. There are zero listing fees, zero membership dues, and zero commission deductions from farmer payouts. The digital infrastructure and escrow banking protocols are funded entirely by institutional buyers and commercial food processors through a nominal platform facilitation fee.'
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col items-center bg-[#f7faf7] text-[#131b2e] selection:bg-[#c1ecd4] relative">
      {/* 0. Top Reading / Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none bg-transparent">
        <motion.div
          className="h-full bg-gradient-to-r from-[#063b28] via-[#a35d1e] to-emerald-400"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Quick-Section Jump Bar for seamless scrolling experience */}
      <AnimatePresence>
        {scrollY > 340 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-3 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-max bg-white/95 backdrop-blur-md rounded-full px-2 py-1.5 border border-emerald-800/20 shadow-md flex items-center gap-1 text-xs overflow-x-auto no-scrollbar"
          >
            {[
              { id: 'tale-of-two-receipts-section', key: 'receipts', label: 'Receipts', icon: 'receipt_long', color: 'text-stone-700' },
              { id: 'why-choose-us-section', key: 'friction', label: 'Mandi vs Nexus', icon: 'compare_arrows', color: 'text-amber-800' },
              { id: 'net-profit-calculator-section', key: 'calculator', label: 'Profit Engine', icon: 'calculate', color: 'text-emerald-800' },
              { id: 'how-it-works-section', key: 'workflow', label: '4-Step Flow', icon: 'linear_scale', color: 'text-blue-800' },
              { id: 'escrow-simulator-section', key: 'escrow', label: 'Escrow Sim', icon: 'lock_reset', color: 'text-teal-800' },
              { id: 'advisory-section', key: 'advisory', label: 'Advisory', icon: 'verified', color: 'text-stone-700' },
              { id: 'faq-section', key: 'faq', label: 'FAQ', icon: 'help_outline', color: 'text-stone-700' },
            ].map((tab) => {
              const isActive = activeNavSection === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => scrollToSection(tab.id)}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-white bg-[#063b28] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-emerald-50/70'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circular Back-to-Top Button */}
      <AnimatePresence>
        {scrollY > 500 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#063b28] hover:bg-[#0a4d35] text-white shadow-lg border border-white/30 flex items-center justify-center transition-transform hover:scale-105 btn-press cursor-pointer"
            title="Scroll back to top"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_upward</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 1. Hero Section with Atmospheric Agricultural Landscape Background */}
      <section id="hero-section" className="w-full relative overflow-hidden border-b border-gray-200/80">
        {/* Background Image: Lush Terraced Agricultural Fields (Referencing User's Image 1) */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2000&auto=format&fit=crop"
            alt="Sweeping panoramic lush green agricultural terrace fields at sunrise"
            className="w-full h-full object-cover object-center opacity-35 filter saturate-125"
            referrerPolicy="no-referrer"
          />
          {/* Calibrated Multi-Stop Gradient Overlay for Crisp Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fbfdfa]/95 via-[#f6faf5]/90 to-[#edf4ee] backdrop-blur-[1px]" />
          {/* Subtle Organic Field Texture Grid */}
          <div className="absolute inset-0 bg-agri-field-lines opacity-60" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 text-center flex flex-col items-center">
          {/* SCALE pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#063b28] text-[11px] font-bold uppercase tracking-wider mb-5 border border-emerald-800/20 shadow-2xs">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">eco</span>
            <span>{t('heroBadge', "INDIA'S DIRECT FARMGATE-TO-FACTORY NETWORK")}</span>
          </div>

          {/* Main Title */}
          <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#131b2e] tracking-tight leading-[1.15] max-w-4xl">
            {t('heroTitleLine1', 'Sell Direct. Earn More.')}<br />
            <span className="text-[#a35d1e]">{t('heroTitleNoMiddleman', 'No Middlemen')}</span> {t('heroTitleLine2', 'Between Your Harvest and the Buyer.')}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
            {t('heroSubtitle', 'List your harvest directly from the field, receive competitive institutional buyer bids within 24 hours, and get guaranteed bank escrow payouts upon digital weighment.')}
          </p>

          {/* Dual Action Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            {/* Farmer Button */}
            <button
              id="farmerHeroBtn"
              onClick={() => onSelectRole('farmer')}
              className="w-full sm:w-auto flex-1 h-12 px-6 bg-[#063b28] hover:bg-[#0a4d35] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all btn-press btn-shine"
            >
              <span className="material-symbols-outlined text-[20px]">agriculture</span>
              <span>{t('forFpoFarmers', "I'm a Farmer / FPO")}</span>
            </button>

            {/* Buyer Button */}
            <button
              id="buyerHeroBtn"
              onClick={() => onSelectRole('buyer')}
              className="w-full sm:w-auto flex-1 h-12 px-6 bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs transition-all btn-press"
            >
              <span className="material-symbols-outlined text-[20px] text-gray-700">storefront</span>
              <span>{t('forBulkBuyers', "I'm a Verified Buyer")}</span>
            </button>
          </div>

          {/* Photographic Comparison Card (Referencing User's Image 1 & Image 2) */}
          <div className="mt-12 w-full max-w-5xl rounded-3xl overflow-hidden border border-emerald-900/20 shadow-xl relative group bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[360px] sm:min-h-[420px] relative">
              {/* Left Half: Traditional Farmgate Soil Origin (Matching User Reference 2) */}
              <div className="relative h-64 sm:h-full overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=1200&auto=format&fit=crop"
                  alt="Authentic Indian farmer cultivating lush fertile agricultural soil at farmgate"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-lg bg-[#063b28]/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm border border-white/20">
                    <span className="material-symbols-outlined text-[15px] text-emerald-400">agriculture</span>
                    <span>1. FARMGATE SOIL ORIGIN</span>
                  </span>
                </div>
                <div className="absolute bottom-14 left-4 right-4 text-left text-white">
                  <p className="font-headline font-bold text-base sm:text-lg drop-shadow-sm">
                    Grassroots Harvest & Aggregation
                  </p>
                  <p className="text-xs text-emerald-100/90 mt-0.5 max-w-sm drop-shadow-sm">
                    Direct from certified FPO farmgates. Zero arhtiya cuts, zero arbitrary katauti weight loss.
                  </p>
                </div>
              </div>

              {/* Vertical Divider for Split Screen (Desktop) */}
              <div className="hidden sm:flex absolute top-0 bottom-0 left-1/2 w-8 -ml-4 z-20 items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-[#063b28]">
                  <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                </div>
              </div>

              {/* Right Half: Industrial Warehouse Logistics & Escrow Delivery */}
              <div className="relative h-64 sm:h-full overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop"
                  alt="Modern industrial logistics dock with transport trucks, pallets and weighbridge"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-lg bg-[#a35d1e]/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm border border-white/20">
                    <span className="material-symbols-outlined text-[15px] text-amber-300">verified</span>
                    <span>2. VERIFIED BUYER SILO</span>
                  </span>
                </div>
                <div className="absolute bottom-14 left-4 right-4 text-left sm:text-right text-white">
                  <p className="font-headline font-bold text-base sm:text-lg drop-shadow-sm">
                    Electronic Weighbridge & Bank Escrow
                  </p>
                  <p className="text-xs text-amber-100/90 mt-0.5 max-w-sm sm:ml-auto drop-shadow-sm">
                    Food processors & millers with 100% pre-funded escrow vaults settled via RTGS within 24h.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Gradient Bar Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#021f15] via-[#021f15]/90 to-transparent px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 z-20">
              <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-semibold">
                <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
                <span>Connecting FPO Farmgates directly to Industrial Weighbridges & Processing Terminals</span>
              </div>
              <div className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded border border-emerald-400/30 text-emerald-300 text-[10px] font-bold tracking-wider uppercase">
                ZERO INTERMEDIARY LEAKAGE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Quick Blueprint: Humanized Ground Reality & Real-World Flow */}
      <section id="tale-of-two-receipts-section" className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-[#faf8f5] border-b border-stone-200 scroll-mt-16">
        <div className="max-w-[1200px] mx-auto">
          {/* Editorial Section Header with Audio Narration */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#854d0e] uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#854d0e]" />
                <span>{t('taleOfTwoReceipts', 'THE TALE OF TWO RECEIPTS')}</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-600 normal-case font-medium">{t('groundReality', 'Ground Reality on Indian Farmland')}</span>
              </div>
              <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1c1917] tracking-tight leading-tight">
                {t('twoReceiptsHeading', 'Why Indian Farmers Are Replacing the Mandi Parchi with Direct Bank Settlement')}
              </h2>
              <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
                {t('twoReceiptsSub', 'Every harvest season, farmers lose 15% to 20% of their crop value to compounding middleman commissions, visual dockage (katauti), and 7-day payment delays. Here is what happens when verbal mandi slips are replaced by certified NABL assays and bank-locked escrow.')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAudioNarrateReceipts}
              className="self-start md:self-auto h-10 px-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-bold rounded-xl flex items-center gap-2 shadow-2xs transition-all btn-press whitespace-nowrap cursor-pointer"
              title="Listen to comparison story in chosen language"
            >
              <span className="material-symbols-outlined text-[18px] text-[#854d0e]">volume_up</span>
              <span>{t('listenStory', 'Listen to Story')}</span>
            </button>
          </div>

          {/* Interactive Perspective Switcher Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mr-1 hidden sm:inline">
              Perspective:
            </span>
            {[
              { id: 'summary', label: '📋 Comparative Overview', icon: 'splitscreen' },
              { id: 'deductions', label: '🔍 Line-Item Deductions', icon: 'receipt' },
              { id: 'reality', label: '🌾 Ground Mandi Reality', icon: 'agriculture' },
            ].map((tab) => {
              const isActive = receiptsSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setReceiptsSubTab(tab.id as any);
                    audioAssistant.playChime('click');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? 'bg-[#063b28] text-white border-[#063b28] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* The Tale of Two Receipts: Physical Mandi Parchi vs AgriTrade Bank Settlement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
            {/* Left Receipt: The Traditional Mandi "Kachha Parcha" */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-[#fffdf8] rounded-2xl border border-stone-300 shadow-sm p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Top Photographic Header Banner */}
              <div className="relative -mx-6 -mt-6 mb-5 h-28 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1596706972054-06d95fc2e6a3?q=80&w=600&auto=format&fit=crop"
                  alt="Chaotic traditional grain mandi yard with gunny sacks"
                  className="w-full h-full object-cover filter contrast-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fffdf8] via-[#fffdf8]/60 to-black/40" />
                <div className="absolute top-3 left-4">
                  <span className="px-2.5 py-1 rounded bg-red-900/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold tracking-wider uppercase">
                    LEGACY MANDI SLIP
                  </span>
                </div>
                <div className="absolute top-3 right-4 rotate-2 px-2.5 py-0.5 border border-red-400 text-red-700 bg-red-50 text-[10px] font-black uppercase tracking-wider rounded-sm shadow-xs">
                  {t('traditionalMandi', 'TRADITIONAL MANDI')}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-stone-600 text-[20px]">receipt_long</span>
                  <h3 className="font-headline font-bold text-lg text-stone-900">
                    {t('mandiSlipTitle', 'Typical Mandi Slip (कच्चा पर्चा)')}
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mb-4">
                  {t('mandiSlipSub', '100 Quintals Sharbati Wheat • Mandi Yard Transaction')}
                </p>

                {/* Conditional View Based on receiptsSubTab */}
                {receiptsSubTab === 'reality' ? (
                  <div className="bg-red-50/70 p-3.5 rounded-xl border border-red-200 text-xs text-red-900 space-y-2 mb-4">
                    <p className="font-bold flex items-center gap-1 text-red-800">
                      <span className="material-symbols-outlined text-[16px]">warning</span>
                      <span>How Unwritten Cuts Occur at Yard Gate:</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      "When you roll your tractor trolley onto the mandi yard at 4 AM, the local arhtiya dips his hand into the sack, calls it 'kacha daana' without any moisture meter, and deducts 2 kilos per bag right away. If you protest, they threaten to hold your trolley for two more days."
                    </p>
                  </div>
                ) : (
                  /* Line Items of Mandi Deductions */
                  <div className="space-y-2.5 text-xs text-stone-700 border-t border-b border-stone-200 py-4 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">{t('baseMandiPrice', 'Base Mandi Bid Price')}:</span>
                      <span className="font-semibold text-stone-900">₹2,600 / Qtl</span>
                    </div>
                    <div className="flex justify-between items-center text-red-700">
                      <span>{t('arhatiyaCut', '- Arhatiya Commission (आढ़त 2.5%)')}:</span>
                      <span>-₹6,500</span>
                    </div>
                    <div className="flex justify-between items-center text-red-700">
                      <span>{t('katautiCut', '- Visual Dockage / Katauti (काट ~2 kg/bag)')}:</span>
                      <span>-₹5,200</span>
                    </div>
                    <div className="flex justify-between items-center text-red-700">
                      <span>{t('hammaliCut', '- Hammali & Unloading (Farmer borne)')}:</span>
                      <span>-₹3,400</span>
                    </div>
                    <div className="flex justify-between items-center text-red-700">
                      <span>{t('scaleVarianceCut', '- Mechanical Scale Variance (~1.2%)')}:</span>
                      <span>-₹3,120</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-stone-500">{t('totalHiddenLoss', 'Total Hidden Loss')}</span>
                    <p className="font-headline text-2xl font-black text-red-600">-₹18,220 <span className="text-xs font-normal text-stone-500">(~7.0% loss)</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] uppercase font-bold text-stone-500">{t('paymentTimeline', 'Payment Timeline')}</span>
                    <p className="text-xs font-bold text-stone-700">{t('waitTimeline', '4 to 7 Days Wait')}</p>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 italic mt-3 bg-stone-100/70 p-2.5 rounded-lg border border-stone-200">
                  * {t('tradDispute', 'Farmer absorbs 100% of moisture dockage guesswork, uncalibrated scale discrepancies, and delayed cash tokens.')}
                </p>
              </div>
            </motion.div>

            {/* Right Receipt: AgriTrade Direct Bank Settlement Advice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-2xl border-2 border-emerald-800/30 shadow-md p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Top Photographic Header Banner */}
              <div className="relative -mx-6 -mt-6 mb-5 h-28 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=600&auto=format&fit=crop"
                  alt="High tech digital agricultural grain testing and sorting warehouse"
                  className="w-full h-full object-cover filter contrast-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-black/40" />
                <div className="absolute top-3 left-4">
                  <span className="px-2.5 py-1 rounded bg-[#063b28] text-white text-[10px] font-mono font-bold tracking-wider uppercase">
                    DIGITAL NABL ESCROW RECEIPT
                  </span>
                </div>
                <div className="absolute top-3 right-4 -rotate-1 px-2.5 py-0.5 border border-emerald-500 text-emerald-800 bg-emerald-50 text-[10px] font-black uppercase tracking-wider rounded-sm shadow-xs">
                  AGRITRADE NEXUS
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-emerald-700 text-[20px]">verified_user</span>
                  <h3 className="font-headline font-bold text-lg text-emerald-950">
                    {t('directAdviceTitle', 'Direct Bank Settlement Advice')}
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mb-4">
                  {t('directAdviceSub', '100 Quintals Sharbati Wheat • Verified Direct Corporate Purchase')}
                </p>

                {/* Conditional View Based on receiptsSubTab */}
                {receiptsSubTab === 'reality' ? (
                  <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2 mb-4">
                    <p className="font-bold flex items-center gap-1 text-emerald-800">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>How Direct Escrow Guarantees Value:</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      "At the AgriTrade village center, our calibrated digital moisture meter printed a verifiable assay in 3 minutes. The buyer's funds were already pre-locked in ICICI Bank escrow. When the truck was weighed on the certified highway weighbridge, the full ₹2,68,000 hit our FPO bank account within two hours."
                    </p>
                  </div>
                ) : (
                  /* Line Items of AgriTrade Direct Trade */
                  <div className="space-y-2.5 text-xs text-stone-700 border-t border-b border-stone-200 py-4 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">{t('buyerCounterBid', 'Institutional Counter-Bid')}:</span>
                      <span className="font-semibold text-emerald-900">₹2,680 / Qtl</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-800 font-semibold">
                      <span>{t('platformFeeFree', '+ Platform Fee for Farmer/FPO')}:</span>
                      <span className="bg-emerald-100/70 px-1.5 py-0.5 rounded text-emerald-900 font-bold">{t('freeLabel', '₹0 (Free)')}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-800 font-semibold">
                      <span>{t('nablAssayZeroKatauti', '+ NABL Assay (Moisture 11.2%, Foreign 0.8%)')}:</span>
                      <span>{t('zeroKatautiText', 'Zero Katauti')}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-800 font-semibold">
                      <span>{t('electronicWeighment', '+ Electronic Weighbridge Gross - Tare')}:</span>
                      <span>{t('exactWeight', 'Exact 100.00 Qtl')}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-800 font-semibold">
                      <span>{t('escrowPreFunded', '+ Bank Escrow Lock before dispatch')}:</span>
                      <span>{t('preFundedText', '100% Pre-funded')}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-stone-500">{t('netFarmerPayout', 'Net Farmer Payout')}</span>
                    <p className="font-headline text-2xl font-black text-emerald-800">₹2,68,000 <span className="text-xs font-bold text-emerald-700">({t('extraCashInHand', '+₹26,220 in hand')})</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] uppercase font-bold text-stone-500">{t('paymentTimeline', 'Payment Timeline')}</span>
                    <p className="text-xs font-bold text-emerald-800">{t('sameDayRtgs', 'Same-Day RTGS (T+0)')}</p>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200/80 mt-3 font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-700">task_alt</span>
                  <span>Disbursed directly into individual farmer bank accounts upon weighbridge gross-tare confirmation.</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Section Divider with Field Label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-stone-300 flex-1" />
            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest px-3">
              {t('fieldJournalHeading', 'HOW IT WORKS IN THE FIELD • 4-STEP DISPATCH JOURNAL')}
            </span>
            <div className="h-px bg-stone-300 flex-1" />
          </div>

          {/* 4-Step Field Journal Cards with Photographic Depth & Tactile Grounding */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {/* Step 1: Village Harvest Aggregation */}
            <div className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-sm transition-all flex flex-col justify-between group">
              <div className="h-32 w-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=400&auto=format&fit=crop"
                  alt="Farmer harvesting golden wheat field"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#063b28]/90 text-white text-[10px] font-bold font-mono">
                  STAGE 01
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline font-bold text-sm text-stone-900 mt-1">
                    {t('journalStep1Title', 'Aggregation & Batch Tagging')}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {t('journalStep1Desc', 'Growers bring gunny bags directly to the local FPO center. Each lot is logged with GPS origin, crop variety, and digital bag barcodes.')}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-medium text-emerald-800">{t('freeLabel', 'Zero Village Broker Fee')}</span>
                  <span className="material-symbols-outlined text-[16px] text-stone-400">agriculture</span>
                </div>
              </div>
            </div>

            {/* Step 2: 8-Minute NABL Assay */}
            <div className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-sm transition-all flex flex-col justify-between group">
              <div className="h-32 w-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400&auto=format&fit=crop"
                  alt="Laboratory grain test and assay"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-blue-900/90 text-white text-[10px] font-bold font-mono">
                  STAGE 02
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline font-bold text-sm text-stone-900 mt-1">
                    {t('journalStep2Title', '8-Minute Digital Assay')}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {t('journalStep2Desc', 'Replaces arbitrary hand-rubbing dockage. Calibrated sensors test moisture %, hectolitre weight, and foreign matter to create a tamper-proof QR certificate.')}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-medium text-emerald-800">{t('zeroKatautiText', 'Zero Guesswork Katauti')}</span>
                  <span className="material-symbols-outlined text-[16px] text-stone-400">biotech</span>
                </div>
              </div>
            </div>

            {/* Step 3: Bank Escrow Lock */}
            <div className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-sm transition-all flex flex-col justify-between group">
              <div className="h-32 w-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=400&auto=format&fit=crop"
                  alt="Banking vault security and electronic ledger"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-amber-900/90 text-white text-[10px] font-bold font-mono">
                  STAGE 03
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline font-bold text-sm text-stone-900 mt-1">
                    {t('journalStep3Title', 'Buyer Cash Pre-Funded')}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {t('journalStep3Desc', 'Before trucks leave the highway depot, the corporate buyer pre-deposits 100% of the lot value into custodial bank escrow. No verbal credit.')}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-medium text-emerald-800">{t('escrowSecured', 'ICICI / SBI Escrow Vault')}</span>
                  <span className="material-symbols-outlined text-[16px] text-stone-400">shield</span>
                </div>
              </div>
            </div>

            {/* Step 4: Electronic Weighbridge & Payout */}
            <div className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-sm transition-all flex flex-col justify-between group">
              <div className="h-32 w-full overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400&auto=format&fit=crop"
                  alt="Certified electronic weighbridge and transport logistics"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-emerald-900/90 text-white text-[10px] font-bold font-mono">
                  STAGE 04
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline font-bold text-sm text-stone-900 mt-1">
                    {t('journalStep4Title', 'Electronic Tare Payout')}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {t('journalStep4Desc', 'The delivery terminal weighbridge confirms gross and tare weight automatically. Escrow immediately disburses payments to farmer bank accounts in T+0.')}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-medium text-emerald-800">{t('fastPayout', 'Direct Account Credit')}</span>
                  <span className="material-symbols-outlined text-[16px] text-stone-400">payments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ground Impact & Authentic Farmer Voice */}
          <div className="bg-[#f2efe9] rounded-2xl p-6 sm:p-8 border border-stone-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: 4 Ground Numbers */}
              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-b lg:border-b-0 lg:border-r border-stone-300 pb-6 lg:pb-0 lg:pr-8">
                <div>
                  <p className="font-headline text-2xl sm:text-3xl font-extrabold text-stone-900">42</p>
                  <p className="text-xs font-bold text-stone-700 mt-0.5">{t('villageFpos', 'Village FPOs')}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{t('smallholderGrowers', '8,400+ smallholder growers onboard')}</p>
                </div>
                <div>
                  <p className="font-headline text-2xl sm:text-3xl font-extrabold text-stone-900">18,450</p>
                  <p className="text-xs font-bold text-stone-700 mt-0.5">{t('quintalsTraded', 'Quintals Traded')}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{t('wheatMustardLots', 'Wheat, mustard & soybean lots')}</p>
                </div>
                <div>
                  <p className="font-headline text-2xl sm:text-3xl font-extrabold text-emerald-800">+14.8%</p>
                  <p className="text-xs font-bold text-stone-700 mt-0.5">{t('netFarmerPayout', 'Net Realization')}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{t('averageExtraMargin', 'Average extra margin vs mandi')}</p>
                </div>
                <div>
                  <p className="font-headline text-2xl sm:text-3xl font-extrabold text-stone-900">&lt; 3 Hrs</p>
                  <p className="text-xs font-bold text-stone-700 mt-0.5">{t('disbursementLabel', 'Disbursement')}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{t('fromWeighmentToRtgs', 'From weighment to bank RTGS')}</p>
                </div>
              </div>

              {/* Right Column: Authentic Voice from the Farmland */}
              <div className="lg:col-span-5">
                <blockquote className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  {t('farmerVoiceQuote', '"In our local mandi, every tractor trolley lost 40 to 60 kilos in arbitrary Katauti. On AgriTrade Nexus, our FPO got paid for every single kilo at Grade-A rates, right into our farmers\' bank accounts the same day."')}
                </blockquote>
                <div className="mt-3 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                    R
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">{t('farmerVoiceAuthor', 'Rameshwar Dangi')}</p>
                    <p className="text-[10px] text-stone-500">{t('farmerVoiceRole', 'Secretary, Sehore Kisan Samriddhi FPO • Madhya Pradesh')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: "Why You Choose AgriTrade Nexus: Eliminating Structural Friction in Agricultural Procurement" */}
      <section
        id="why-choose-us-section"
        className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-[#f4f7f4] border-t border-emerald-900/10 scroll-mt-20 relative"
      >
        <div id="trust-verification-section" className="max-w-[1200px] mx-auto text-center mb-12 scroll-mt-20">
          <span className="text-xs font-bold text-[#a35d1e] uppercase tracking-widest">
            {t('whyChooseSub', 'WHY YOU CHOOSE AGRI-TRADE NEXUS')}
          </span>
          <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-[#131b2e] mt-2 max-w-3xl mx-auto leading-tight">
            {t('whyChooseTitle', 'Why You Choose AgriTrade Nexus: Eliminating Structural Friction in Agricultural Procurement')}
          </h2>
          <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('whyChooseDesc', 'Compare the entrenched vulnerabilities of legacy mandi corridors against our transparent, bank-settled digital procurement network.')}
          </p>

          {/* Friction Filter Sub-Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {[
              { id: 'all', label: 'All Structural Friction Points', icon: 'splitscreen' },
              { id: 'deductions', label: 'Intermediary Margins (15–20%)', icon: 'payments' },
              { id: 'settlement', label: 'Settlement Delays (4–7 Days)', icon: 'schedule' },
              { id: 'inspection', label: 'Arbitrary Katauti Dockage', icon: 'science' },
            ].map((tab) => {
              const isActive = frictionFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setFrictionFilter(tab.id as any);
                    audioAssistant.playChime('click');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? 'bg-[#063b28] text-white border-[#063b28] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Comparison Box */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Current Mandi System */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-[#fcf7f7] rounded-2xl p-6 sm:p-7 border border-red-100 shadow-xs flex flex-col gap-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-red-200/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-[22px]">cancel</span>
                <h3 className="font-headline text-lg font-bold text-[#131b2e]">{t('traditionalMandi', 'Current Mandi System')}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold uppercase tracking-wider">
                {t('structuralFriction', 'STRUCTURAL FRICTION')}
              </span>
            </div>

            {/* Card 1: 15-20% Intermediary */}
            {(frictionFilter === 'all' || frictionFilter === 'deductions') && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 sm:p-5 border border-red-100 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">trending_down</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#131b2e]">
                      {t('mandiLoss1Title', '15–20% Value Loss to Intermediary Margins')}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {t('mandiLoss1Desc', 'Multi-tiered commission agents (arhtiyas) and unauthorized loaders dilute farmer realization while systematically inflating wholesale procurement expenses.')}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded">
                      <span>Loss on 100 Qtl: ~₹18,000+</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Card 2: 4-7 Days Settlement */}
            {(frictionFilter === 'all' || frictionFilter === 'settlement') && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 sm:p-5 border border-red-100 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">event_busy</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#131b2e]">
                      {t('mandiLoss2Title', '4–7 Days Settlement Delays & Defaults')}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {t('mandiLoss2Desc', 'Informal credit books leave FPOs and farmers vulnerable to deferred cash flows, uncollectible promissory notes, and post-weighment haircuts.')}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded">
                      <span>Informal credit slips with zero bank recourse</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Card 3: Arbitrary Katauti */}
            {(frictionFilter === 'all' || frictionFilter === 'inspection') && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 sm:p-5 border border-red-100 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">balance</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#131b2e]">
                      {t('mandiLoss3Title', 'Arbitrary Quality Deduction (Katauti)')}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {t('mandiLoss3Desc', 'Subjective visual inspection at yard gates enforces unscientific 5-10% weight deductions with no calibrated moisture or foreign matter lab verification.')}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded">
                      <span>Unverified cuts of 1-3 kg per bag</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Column 2: Nexus Mechanism */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-[#f2f8f5] rounded-2xl p-6 sm:p-7 border border-[#c1ecd4] shadow-xs flex flex-col gap-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#a8dfc1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#063b28] text-[22px]">verified</span>
                <h3 className="font-headline text-lg font-bold text-[#063b28]">{t('nexusMechanism', 'Nexus Mechanism')}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#063b28] text-white text-[10px] font-extrabold uppercase tracking-wider">
                {t('automatedTrust', 'AUTOMATED TRUST')}
              </span>
            </div>

            {/* Card 1 */}
            {(frictionFilter === 'all' || frictionFilter === 'deductions') && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 sm:p-5 border border-green-100 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">account_balance</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#131b2e]">
                      {t('nexusGain1Title', 'Direct Farmgate-to-Factory Bidding')}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {t('nexusGain1Desc', 'Firm digital counter-offers from vetted food processors, flour millers, and FMCG exporters bypass local monopolized yard cartels completely.')}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      <span>Zero Arhatiya Cuts • 100% Retained Value</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Card 2 */}
            {(frictionFilter === 'all' || frictionFilter === 'settlement') && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 sm:p-5 border border-green-100 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">lock</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#131b2e]">
                      {t('nexusGain2Title', 'Guaranteed Escrow Settlement in 24h')}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {t('nexusGain2Desc', 'Buyer capital is locked in tripartite bank escrow prior to truck departure and disbursed immediately upon digital weighbridge slip generation.')}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      <span>ICICI Bank Tripartite Escrow • T+0 Direct RTGS</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Card 3 */}
            {(frictionFilter === 'all' || frictionFilter === 'inspection') && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 sm:p-5 border border-green-100 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">science</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#131b2e]">
                      {t('nexusGain3Title', 'Standardized Assay & Digital QA')}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {t('nexusGain3Desc', 'Calibrated moisture testers and NIR refraction at aggregation hubs generate tamper-proof cryptographic lot certificates before dispatch.')}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      <span>NABL-Accredited QA Certificate • Zero Katauti</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Interactive Mandi vs AgriTrade Net Realization Calculator */}
      <section
        id="net-profit-calculator-section"
        className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-[#f3f9f5] via-[#ebf5ef] to-[#f4f7f4] border-t border-emerald-900/10 scroll-mt-20"
      >
        <div className="max-w-[1200px] mx-auto">
          <NetProfitCalculator
            onListProduce={onOpenAddProduce}
            onExploreMarket={onBrowseMarketplace}
          />
        </div>
      </section>

      {/* 4. Section: "Four Steps from Aggregation to Settlement" */}
      <section
        id="how-it-works-section"
        className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-[#fbfdfa] bg-agri-field-lines border-t border-emerald-900/10"
      >
        <div className="max-w-[1200px] mx-auto text-center mb-16">
          <span className="text-xs font-bold text-[#a35d1e] uppercase tracking-widest">
            END-TO-END WORKFLOW
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-[#131b2e] mt-2 max-w-2xl mx-auto leading-tight">
            Four Steps from Aggregation to Settlement
          </h2>
          <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Engineered for operational speed in rural aggregation warehouses and corporate grain processing terminals.
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto space-y-16">
          {/* STAGE 01: Left Text, Right Mockup with Photography & Sub-tabs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#dcfce7] text-[#15803d] text-xs font-bold uppercase tracking-wider">
                <span>STAGE 01</span>
                <span className="text-emerald-300">•</span>
                <span className="text-[11px] lowercase font-normal text-emerald-900">village aggregation</span>
              </div>
              <h3 className="font-headline text-2xl sm:text-3xl font-bold text-[#131b2e]">
                Bulk Lot Listing & Grade Verification
              </h3>
              <p className="text-sm font-semibold text-[#a35d1e]">
                Standardize your harvest in minutes with digital assaying and lot traceability.
              </p>
              <ul className="space-y-3 pt-2 text-xs text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#15803d] text-[18px] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>FPO operators log lot weight, moisture percentage, foreign matter, and crop variety in under 3 minutes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#15803d] text-[18px] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>Instant lot QR generation attaches verifiable AGMARK assay test reports directly to cargo tags.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#15803d] text-[18px] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>Lot automatically broadcasts to 200+ authenticated regional flour mills, feed units, and exporters.</span>
                </li>
              </ul>
            </div>

            {/* Stage 01 Mockup: Terminal Assay Mockup with Interactive Sub-tabs */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              {/* Photo Banner */}
              <div className="relative h-32 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop"
                  alt="Harvested golden grain at village godown"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-white/90 text-stone-900 text-[10px] font-bold font-mono">
                    TERMINAL ASSAY MOCKUP
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="font-bold">Indore Farmers Fed Hub #4</span>
                  <span className="font-mono text-emerald-300 font-bold">LOT #WH-2025-089</span>
                </div>
              </div>

              {/* Stage 1 Sub-tabs */}
              <div className="p-4 sm:p-5 space-y-4">
                <div className="flex gap-2 border-b border-gray-100 pb-3">
                  {[
                    { id: 'parameters', label: '📊 Assay Parameters', icon: 'biotech' },
                    { id: 'nabl', label: '📜 NABL Calibration Standard', icon: 'verified' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setStage1Tab(tab.id as any);
                        audioAssistant.playChime('click');
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        stage1Tab === tab.id
                          ? 'bg-[#063b28] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {stage1Tab === 'parameters' ? (
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Crop & Variety</span>
                      <span className="font-bold text-gray-900">Durum Wheat (Malavraj)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Aggregate Quantity</span>
                      <span className="font-bold text-gray-900">420.00 MT (4,200 Qtl)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Calibrated Moisture</span>
                      <span className="font-bold text-[#063b28]">11.4% (Within AGMARK Grade-1)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Foreign Matter / Admixture</span>
                      <span className="font-bold text-emerald-700">0.72% (&lt; 1.5% Threshold)</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1.5">
                    <p className="font-bold text-stone-900 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-emerald-700">verified</span>
                      <span>NABL-Accredited Testing Chamber:</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Calibrated ISO/IEC 17025 certified near-infrared (NIR) spectrometry and Dickey-John GAC2500 grain analysis. All moisture readings are cryptographically hashed onto the lot ledger.
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="px-3 py-1.5 bg-[#063b28] text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                    <span>Assayed & Broadcasted</span>
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[11px] font-semibold flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    <span>12 Buyers Viewing</span>
                  </span>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (onViewAssayReport) {
                        onViewAssayReport({
                          id: 'wh-2025-01',
                          title: 'Durum Wheat (Malavraj)',
                          cropCategory: 'wheat',
                          batchQuantityQtl: 4200,
                          pricePerQtl: 2410,
                          moisturePct: 11.4,
                          qualityScore: 94,
                          qualityGrade: 'Grade 1',
                          location: 'Indore Farmers Fed Hub #4, MP',
                          fpoName: 'Indore Farmers Fed Hub',
                          farmerName: 'Rameshwar Patidar',
                          harvestDate: '10-Feb-2025',
                          isAssayed: true,
                          imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600&auto=format&fit=crop',
                          bidsCount: 12,
                          highestBid: 2410,
                          storageType: 'WDRA Certified Warehouse',
                        });
                      }
                    }}
                    className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#063b28] border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-emerald-700">biotech</span>
                    <span>Inspect Official NABL Lab Assay &amp; Certificate →</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STAGE 02: Left Mockup, Right Text with Sub-tabs & Photography */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            {/* Stage 02 Mockup: Live Order Book Window */}
            <div className="order-2 lg:order-1 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm space-y-4">
              {/* Photo Banner */}
              <div className="relative h-32 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
                  alt="Corporate commodity trading desk"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-white/90 text-stone-900 text-[10px] font-bold font-mono">
                    LIVE ORDER BOOK WINDOW
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="font-bold">4 Institutional Buyers Active</span>
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">timer</span>
                    <span>Closing in 02:44:19</span>
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3">
                {/* Sub-tabs for Stage 2 */}
                <div className="flex gap-2 border-b border-gray-100 pb-3">
                  {[
                    { id: 'bids', label: '⚡ Top Mill Bids', icon: 'gavel' },
                    { id: 'orderbook', label: '📊 Market Depth', icon: 'bar_chart' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setStage2Tab(tab.id as any);
                        audioAssistant.playChime('click');
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        stage2Tab === tab.id
                          ? 'bg-[#063b28] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {stage2Tab === 'bids' ? (
                  <>
                    {/* Bid 1: AgroCore Foods Ltd. */}
                    <div className={`p-3.5 rounded-xl border transition-all ${activeHighestBidAccepted ? 'bg-[#dcfce7] border-[#86af99]' : 'bg-[#faf8ff] border-gray-200'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs text-gray-900">AgroCore Foods Ltd.</span>
                            <span className="material-symbols-outlined text-[16px] text-blue-600">verified</span>
                          </div>
                          <span className="text-[11px] text-gray-500">Delivery: Ex-Warehouse (Indore Hub)</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm font-extrabold text-[#063b28]">₹2,410 / Qtl</span>
                          <span className="block text-[10px] font-bold text-green-700">+₹135 above MSP</span>
                        </div>
                      </div>
                    </div>

                    {/* Bid 2: Kisan Millers Consortium */}
                    <div className="p-3.5 rounded-xl bg-white border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs text-gray-900">Kisan Millers Consortium</span>
                            <span className="material-symbols-outlined text-[16px] text-blue-600">verified</span>
                          </div>
                          <span className="text-[11px] text-gray-500">Delivery: Ex-Warehouse</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm font-extrabold text-gray-900">₹2,385 / Qtl</span>
                          <span className="block text-[10px] font-bold text-green-700">+₹110 above MSP</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-2 font-mono">
                    <div className="flex justify-between text-stone-500 pb-1 border-b border-stone-200 text-[10px]">
                      <span>BUYER BID ORDER</span>
                      <span>QTY (QTL)</span>
                      <span>PRICE (₹/QTL)</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-bold">
                      <span>AgroCore Foods Ltd.</span>
                      <span>4,200</span>
                      <span>₹2,410</span>
                    </div>
                    <div className="flex justify-between text-stone-700">
                      <span>Kisan Millers Consortium</span>
                      <span>3,500</span>
                      <span>₹2,385</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>Pithampur Roller Mills</span>
                      <span>2,800</span>
                      <span>₹2,360</span>
                    </div>
                  </div>
                )}

                {/* Counter-Offer Mini Form if open */}
                {isCounterOfferOpen && (
                  <form onSubmit={handleCounterOfferSubmit} className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-900">Set Minimum Ask Rate (₹/Qtl)</span>
                      <button type="button" onClick={() => setIsCounterOfferOpen(false)} className="text-gray-500 hover:text-black text-xs">✕</button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={counterPrice}
                        onChange={(e) => setCounterPrice(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-amber-300 bg-white font-mono text-xs"
                      />
                      <button type="submit" className="px-3 py-1.5 bg-[#a35d1e] text-white font-bold rounded-lg whitespace-nowrap">
                        {counterSubmitted ? 'Transmitted!' : 'Transmit'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleAcceptBid}
                    className={`flex-1 h-10 px-4 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeHighestBidAccepted
                        ? 'bg-green-700 text-white'
                        : 'bg-[#a35d1e] hover:bg-[#8e4e16] text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>{activeHighestBidAccepted ? 'Bid Accepted & Escrow Locked' : 'Accept Highest Bid'}</span>
                  </button>
                  <button
                    onClick={() => setIsCounterOfferOpen(!isCounterOfferOpen)}
                    className="px-4 h-10 bg-white hover:bg-gray-50 border border-gray-300 text-xs font-bold text-gray-700 rounded-xl cursor-pointer"
                  >
                    Submit Counter
                  </button>
                </div>
              </div>
            </div>

            {/* Stage 02 Text */}
            <div className="order-1 lg:order-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#dcfce7] text-[#15803d] text-xs font-bold uppercase tracking-wider">
                <span>STAGE 02</span>
                <span className="text-emerald-300">•</span>
                <span className="text-[11px] lowercase font-normal text-emerald-900">transparent auctions</span>
              </div>
              <h3 className="font-headline text-2xl sm:text-3xl font-bold text-[#131b2e]">
                Transparent Institutional Bidding & Counter-Offers
              </h3>
              <p className="text-sm font-semibold text-[#a35d1e]">
                Discover true market price through competitive, time-bound commercial bids.
              </p>
              <ul className="space-y-3 pt-2 text-xs text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#15803d] text-[18px] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>Receive competitive bids from accredited flour mills, solvent plants, and institutional buyers in sealed or open windows.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#15803d] text-[18px] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>Direct counter-offer engine empowers FPOs to define minimum reservation prices based on daily mandi analytics.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#15803d] text-[18px] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>Zero informal cartel deductions; execute sales with a single digital authorization.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* STAGE 03: Left Text, Right Mockup with Photography & Sub-tabs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#dcfce7] text-[#15803d] text-xs font-bold uppercase tracking-wider">
                <span>STAGE 03</span>
                <span className="text-emerald-300">•</span>
                <span className="text-[11px] lowercase font-normal text-emerald-900">bank security</span>
              </div>
              <h3 className="font-headline text-2xl sm:text-3xl font-bold text-[#131b2e]">
                Verified Buyer Credentialing & Escrow Protection
              </h3>
              <p className="text-sm font-semibold text-[#a35d1e]">
                Never worry about default — trade exclusively with GST/FSSAI-verified entities.
              </p>
              <ul className="space-y-3 pt-2 text-xs text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#15803d] text-[18px] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>Mandatory GSTIN cross-checks, corporate financial underwriting, and warehouse track records for all buyers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#15803d] text-[18px] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>100% of contracted purchase funds deposited in a partner bank escrow prior to dispatch authorization.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#15803d] text-[18px] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>Eliminates customary rural credit delays, default write-offs, and predatory interest rate cycles.</span>
                </li>
              </ul>
            </div>

            {/* Stage 03 Mockup: Escrow Pre-Fund Lock with Sub-tabs */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm space-y-4">
              {/* Photo Banner */}
              <div className="relative h-32 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop"
                  alt="Banking digital security and vault lock"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-900/90 text-white text-[10px] font-bold font-mono">
                    ICICI / SBI ESCROW VAULT
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="font-bold">TR-88190-2025</span>
                  <span className="font-bold text-emerald-300">100% Locked & Pre-Funded</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3">
                {/* Sub-tabs for Stage 3 */}
                <div className="flex gap-2 border-b border-gray-100 pb-3">
                  {[
                    { id: 'escrow', label: '🛡️ Vault Balance', icon: 'shield' },
                    { id: 'rules', label: '📋 Tripartite Rules', icon: 'gavel' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setStage3Tab(tab.id as any);
                        audioAssistant.playChime('click');
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        stage3Tab === tab.id
                          ? 'bg-[#063b28] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {stage3Tab === 'escrow' ? (
                  <div className="space-y-2.5 text-xs py-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contracted Lot Value</span>
                      <span className="font-mono font-bold text-gray-900">₹10,12,200.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Buyer Escrow Deposit Status</span>
                      <span className="font-bold text-green-700 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        <span>100% Locked & Earmarked</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Disbursement Trigger</span>
                      <span className="font-bold text-gray-900">Electronic Tare/Gross Net Weighment</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                    <p className="font-bold text-emerald-900 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-emerald-700">lock</span>
                      <span>Tripartite Escrow Protocol:</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Escrow funds cannot be reversed, recalled, or intercepted by the buyer once transit starts. Release is governed purely by electronic weighbridge telemetry.
                    </p>
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-2 text-[11px] text-blue-900">
                  <span className="material-symbols-outlined text-[16px] text-blue-700 flex-shrink-0">
                    verified_user
                  </span>
                  <span>Funds cannot be recalled by buyer while truck is in transit.</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STAGE 04: Left Mockup, Right Text with Sub-tabs & Photography */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            {/* Stage 04 Mockup: Live Dispatch & Telemetry */}
            <div className="order-2 lg:order-1 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm space-y-4">
              {/* Photo Banner */}
              <div className="relative h-32 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop"
                  alt="Industrial electronic weighbridge logistics"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-white/90 text-stone-900 text-[10px] font-bold font-mono">
                    LIVE WEIGHBRIDGE TELEMETRY
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="font-mono font-bold">TRUCK: MP-09-HH-3901</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-bold text-[10px]">
                    At Terminal Weighbridge
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3">
                {/* Sub-tabs for Stage 4 */}
                <div className="flex gap-2 border-b border-gray-100 pb-3">
                  {[
                    { id: 'telemetry', label: '⚖️ Electronic Scale Gross-Tare', icon: 'scale' },
                    { id: 'rtgs', label: '💳 Same-Day Bank Settlement', icon: 'payments' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setStage4Tab(tab.id as any);
                        audioAssistant.playChime('click');
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        stage4Tab === tab.id
                          ? 'bg-[#063b28] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {stage4Tab === 'telemetry' ? (
                  <div className="p-3.5 bg-gray-50 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] uppercase text-gray-400 font-bold block">TRANSIT ROUTE</span>
                        <span className="font-bold text-gray-900">Indore Hub → Pithampur Plant #2</span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold">
                        Verified 0% Scale Drift
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] border-t border-gray-200">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Gross:</span>
                        <span className="font-mono font-bold text-gray-800">48,220 kg</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Tare:</span>
                        <span className="font-mono font-bold text-gray-800">14,300 kg</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Net:</span>
                        <span className="font-mono font-bold text-[#063b28]">33,920 kg</span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-[#063b28] h-2 rounded-full w-[100%]"></div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-2 font-mono">
                    <div className="flex justify-between text-stone-600">
                      <span>Gross Net Delivered:</span>
                      <span className="font-bold text-stone-900">339.20 Quintals</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Settled Rate:</span>
                      <span className="font-bold text-stone-900">₹2,410 / Qtl</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-bold border-t border-stone-200 pt-1">
                      <span>Total RTGS Disbursed:</span>
                      <span>₹8,17,472.00</span>
                    </div>
                  </div>
                )}

                <div className="p-3.5 bg-[#dcfce7] rounded-xl border border-[#bbf7d0] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#063b28]">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span>Escrow Release Executed</span>
                  </div>
                  <span className="font-mono text-xs font-extrabold text-[#063b28]">
                    ₹8,17,472 (Same-Day RTGS)
                  </span>
                </div>
              </div>
            </div>

            {/* Stage 04 Text */}
            <div className="order-1 lg:order-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#dcfce7] text-[#15803d] text-xs font-bold uppercase tracking-wider">
                <span>STAGE 04</span>
                <span className="text-emerald-300">•</span>
                <span className="text-[11px] lowercase font-normal text-emerald-900">instant settlement</span>
              </div>
              <h3 className="font-headline text-2xl sm:text-3xl font-bold text-[#131b2e]">
                Coordinated Logistics & Instant Weighment Settlement
              </h3>
              <p className="text-sm font-semibold text-[#a35d1e]">
                Frictionless farmgate pickup and same-day electronic payment reconciliation.
              </p>
              <ul className="space-y-3 pt-2 text-xs text-gray-600">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#15803d] text-[18px] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>Automated freight partner dispatch directly to the FPO aggregation cluster or godown door.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#15803d] text-[18px] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>Certified weighbridge integration transmits gross/tare values instantly via secure telemetry.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#15803d] text-[18px] flex-shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>Automated escrow payout triggered directly to the FPO banking account without manual delay.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Interactive Escrow Lifecycle Simulator Component */}
          <div id="escrow-simulator-section" className="pt-8 scroll-mt-20">
            <EscrowSimulator initialLotValue={1012200} />
          </div>
        </div>
      </section>

      {/* 5. Section: "ADVISORY & FIELD VALIDATION" */}
      <section
        id="advisory-section"
        className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-[#f2f6f2] border-t border-emerald-900/10 scroll-mt-20"
      >
        <div className="max-w-[1200px] mx-auto text-center mb-10">
          <span className="text-xs font-bold text-[#a35d1e] uppercase tracking-widest">
            ADVISORY & FIELD VALIDATION
          </span>
          <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-[#131b2e] mt-2 max-w-2xl mx-auto leading-tight">
            Guided by Agricultural Economists & Supply Chain Leaders
          </h2>
          <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Validated through real pilot cohort deployments under the Smart India Hackathon agricultural exchange framework.
          </p>

          {/* Sub-tabs for Advisory Voices */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {[
              { id: 'all', label: 'All Stakeholder Testimonials', icon: 'forum' },
              { id: 'economists', label: 'Agricultural Economists & Policy', icon: 'school' },
              { id: 'fpos', label: 'FPO Coordinators & Farmers', icon: 'groups' },
              { id: 'processors', label: 'Institutional Millers & Exporters', icon: 'factory' },
            ].map((tab) => {
              const isActive = advisoryFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setAdvisoryFilter(tab.id as any);
                    audioAssistant.playChime('click');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? 'bg-[#063b28] text-white border-[#063b28] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Testimonials Grid with Category Filtering */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1: Economist */}
          {(advisoryFilter === 'all' || advisoryFilter === 'economists') && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl font-serif text-[#a35d1e] font-extrabold block leading-none">”</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    Policy Evaluation
                  </span>
                </div>
                <p className="text-xs text-gray-700 italic leading-relaxed">
                  "The primary bottleneck in Indian agri-value chains is not harvest volume but information asymmetry during post-harvest aggregation. AgriTrade Nexus directly solves this."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                  alt="Dr. Rameshwar Sharma"
                  className="w-11 h-11 rounded-full object-cover border border-gray-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                    <span>Dr. Rameshwar Sharma</span>
                    <span className="material-symbols-outlined text-[15px] text-blue-600">verified</span>
                  </h4>
                  <p className="text-[11px] text-gray-500">Former NABARD Consultant, Agricultural Marketing Expert</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Testimonial 2: FPO */}
          {(advisoryFilter === 'all' || advisoryFilter === 'fpos') && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl font-serif text-[#a35d1e] font-extrabold block leading-none">”</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                    +₹360/Qtl Gain
                  </span>
                </div>
                <p className="text-xs text-gray-700 italic leading-relaxed">
                  "In our pilot lot of 40 quintals Sharbati wheat, direct buyer bidding fetched ₹2,340/quintal versus ₹1,980 at the district mandi, saving ₹14,400 in net deductions."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
                  alt="Gurpreet Singh Mann"
                  className="w-11 h-11 rounded-full object-cover border border-gray-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                    <span>Gurpreet Singh Mann</span>
                    <span className="material-symbols-outlined text-[15px] text-blue-600">verified</span>
                  </h4>
                  <p className="text-[11px] text-gray-500">Chief Coordinator, Malwa Farmers Producer Co. (850 Members)</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Testimonial 3: Processor */}
          {(advisoryFilter === 'all' || advisoryFilter === 'processors') && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl font-serif text-[#a35d1e] font-extrabold block leading-none">”</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200">
                    &lt;1.5% Rejection Rate
                  </span>
                </div>
                <p className="text-xs text-gray-700 italic leading-relaxed">
                  "Standardized digital moisture assays reduce inbound quality rejections at our processing gates from 12% to under 1.5%. We can schedule logistics with total confidence."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
                  alt="Sunita Deshmukh"
                  className="w-11 h-11 rounded-full object-cover border border-gray-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1">
                    <span>Sunita Deshmukh</span>
                    <span className="material-symbols-outlined text-[15px] text-blue-600">verified</span>
                  </h4>
                  <p className="text-[11px] text-gray-500">Procurement Lead, Sahyadri Agro-Processing Units</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 6. Banner: "Direct Institutional Procurement for Trending Commodities" */}
      <section className="w-full bg-[#063b28] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1000px] mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d97706] text-white text-[11px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            <span>HIGH SPOT DEMAND • TOP TRENDING COMMODITIES</span>
          </div>

          <h2 className="font-headline text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Direct Institutional Procurement for Trending Harvests
          </h2>

          <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Institutional millers and exporters are actively sourcing premium Sharbati Wheat, Yellow Mustard, and Chana. Connect your harvest directly with zero middleman cuts and guaranteed escrow settlements.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onOpenPilotCohort}
              className="h-12 px-7 bg-[#a35d1e] hover:bg-[#8e4e16] text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 btn-press btn-shine"
            >
              <span className="material-symbols-outlined text-[20px]">assignment</span>
              <span>Register for Direct Procurement (Free for Farmers & FPOs)</span>
            </button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-gray-300">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-400 text-[18px]">check_circle</span>
              <span>Zero broker commissions & zero listing fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-400 text-[18px]">check_circle</span>
              <span>Dedicated on-ground aggregation support</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-400 text-[18px]">check_circle</span>
              <span>Full APMC model harmonization</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section: "Frequently Asked Questions" */}
      <section
        id="faq-section"
        className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-[#f7faf7] border-t border-emerald-900/10 scroll-mt-20"
      >
        <div className="max-w-[850px] mx-auto text-center mb-10">
          <span className="text-xs font-bold text-[#a35d1e] uppercase tracking-widest">
            DIRECT OPERATIONAL CLARITY
          </span>
          <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-[#131b2e] mt-2">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-gray-600 max-w-xl mx-auto">
            Transparent answers addressing risk mitigation, quality checks, technology access, and fee structures.
          </p>

          {/* Sub-tabs for FAQ categories */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {[
              { id: 'all', label: 'All Questions', count: faqItems.length },
              { id: 'escrow', label: 'Escrow & Banking', count: faqItems.filter(f => f.category === 'escrow').length },
              { id: 'quality', label: 'Quality & Assaying', count: faqItems.filter(f => f.category === 'quality').length },
              { id: 'platform', label: 'Mandi Comparison & Tech', count: faqItems.filter(f => f.category === 'platform').length },
            ].map((tab) => {
              const isActive = faqCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setFaqCategory(tab.id as any);
                    audioAssistant.playChime('click');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? 'bg-[#063b28] text-white border-[#063b28] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-w-[850px] mx-auto space-y-3">
          {faqItems
            .filter((faq) => faqCategory === 'all' || faq.category === faqCategory)
            .map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <motion.div
                  key={faq.question}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => {
                      toggleFaq(idx);
                      audioAssistant.playChime('click');
                    }}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 hover:bg-gray-50/70 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0 border border-emerald-200">
                        <span className="material-symbols-outlined text-[18px]">{faq.icon || 'help'}</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[#a35d1e] uppercase tracking-wider mb-0.5">
                          {faq.tag}
                        </div>
                        <span className="text-gray-900 font-semibold">{faq.question}</span>
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined text-gray-500 text-[20px] transition-transform duration-200 flex-shrink-0"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      keyboard_arrow_down
                    </span>
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 pt-3 text-xs text-gray-700 leading-relaxed border-t border-gray-100 bg-[#f4f7f4]"
                    >
                      <div className="p-3 bg-white rounded-xl border border-emerald-100 text-stone-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
        </div>
      </section>
    </div>
  );
};
