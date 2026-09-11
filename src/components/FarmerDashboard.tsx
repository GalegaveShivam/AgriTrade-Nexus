import React, { useState, useMemo, useRef } from 'react';
import { CropCategory, CropLot, MandiPriceItem, PurchaseOrder, User } from '../types';

interface FarmerDashboardProps {
  farmer: User | null;
  crops: CropLot[];
  orders: PurchaseOrder[];
  mandiPrices: MandiPriceItem[];
  onOpenAddCropModal?: () => void;
  onRemoveCrop: (cropId: string) => void;
  onUpdateCropPrice: (cropId: string, newPrice: number) => void;
  onConfirmDispatch: (orderId: string) => void;
  activeFarmerTab?: string;
  onSwitchRole?: () => void;
  onSelectTab?: (tab: string) => void;
  onAddCrop?: (newCrop: CropLot) => void;
}

interface CommodityOption {
  id: string;
  category: CropCategory;
  nameEn: string;
  nameHi: string;
  msp: number;
  suggestedMin: number;
  suggestedMax: number;
  defaultPrice: number;
  imageUrl: string;
  varieties: string[];
}

const COMMODITIES: CommodityOption[] = [
  {
    id: 'wheat',
    category: 'wheat',
    nameEn: 'Wheat',
    nameHi: 'गेहूँ',
    msp: 2275,
    suggestedMin: 2400,
    suggestedMax: 2480,
    defaultPrice: 2420,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfA43YzxtpL2BRPGL788li1Cfm2MBZjnYwIx83I4g3RBr8bN8oxRSkzpCzydY2eEZls9xvUvsN_vSKxwhbvjgUKvNP0x8jS2g0YWLc_w-fmUY7Ix8LlDxJDu4Xv8WC5eKeaRm30xl9k22H15iE5KLRU7YVj8zZkg0jgI5O9qeZY2lmifevBoJeYYsjmMmt8U6PWZcDxiloF_DXdYDU8M_V53mZGWQS5uSPF0qxtIiokOHtod6-71bc',
    varieties: ['Sharbati (C-306)', 'Lokwan (Golden)', 'HI-1544 (Malwi Durum)', 'Purna (HI-1531)'],
  },
  {
    id: 'soybean',
    category: 'soybean',
    nameEn: 'Soybean',
    nameHi: 'सोयाबीन',
    msp: 4600,
    suggestedMin: 4700,
    suggestedMax: 4850,
    defaultPrice: 4750,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbbMhGkaW6euQ9Gqd0368Le8yIYGF_f0489XFEGQzW5XZwLrWJ9WAxXoysB8MAZcp-auwb1LrSezyA5AwwFyDAfESB2IxGBFqkwJLSBezMYN0VpcRl1zf4GhiAmdBdYQ7D0vTekKBNR_RYAYv0HR1yxm0LnBK9cNFUgeQ0Kz92GMDNYvhnIlb1bUENT66CsWTqy19H0qhKy2aQMUCN5kVjzFL7XYlG9Tr8MqydRhvjh_xzotLy4WJY',
    varieties: ['JS-9560 (Certified Oil 18.5%)', 'JS-2034 (High Yield)', 'NRC-127'],
  },
  {
    id: 'mustard',
    category: 'mustard',
    nameEn: 'Mustard',
    nameHi: 'सरसों',
    msp: 5650,
    suggestedMin: 5400,
    suggestedMax: 5600,
    defaultPrice: 5450,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8gXkKIBzvdi3TGfnd2AoLnVn89TTV-DrPmmDZTxsfa71q5qMAIcYFvDG9RN6zZxEAzINhTTVtsMyOomo_b9NMAJVDydCp-VmJmRn_CLlfyhD9oGS3k5qBjjn1emXFKdQVHNTy8EjRPr2Ugyq2ZYcq7Sr7Hci4fJ8qzmiX32MpxABKpAeurmiRcq6ulwh5UbHykA45lSDwszDwTgLLe5T16eIFi7YUOba7EqddJMs1G71827TIT4GL',
    varieties: ['Pusa Bold (High Oil 42%)', 'Giriraj (DRMRIJ-31)', 'Pusa Jai Kisan'],
  },
  {
    id: 'chana',
    category: 'chana',
    nameEn: 'Chana',
    nameHi: 'चना',
    msp: 5440,
    suggestedMin: 5450,
    suggestedMax: 5600,
    defaultPrice: 5480,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoVsKHunbCqL3zT5yZUVea7Sn-Wg5cQrAh7O2OoCxePNtcAgIWb5PV_PJtyHGahxexK8GlxI9nSJkUz9SjEXrL8ThGe__AI3pO4UNQp726rSXmvVdebRAPwWwoVNUGwfJG9-Y-mRzgp3eRNK4rWsNvM4nHR0U4dRDOVU1mPemjiGQQeZnhxgHzI027IpCYQP7kkAZNGMA-MvRx_2I4fib5OvBoIRrpvyjwsjhsCozIRRn9UXzlnSAT',
    varieties: ['JG-11 Desi', 'Dollar Kabuli (Export 42-44)', 'Vishal (JG-130)'],
  },
  {
    id: 'maize',
    category: 'maize',
    nameEn: 'Maize',
    nameHi: 'मक्का',
    msp: 2090,
    suggestedMin: 2150,
    suggestedMax: 2300,
    defaultPrice: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80',
    varieties: ['Yellow Feed Grade-1', 'Starch High-Density', 'Sweet Corn Hybrid'],
  },
  {
    id: 'cotton',
    category: 'cotton',
    nameEn: 'Cotton',
    nameHi: 'कपास',
    msp: 7121,
    suggestedMin: 7200,
    suggestedMax: 7500,
    defaultPrice: 7350,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYgwAr3XFQrxNHy89mJqcpD8qP9Wac7Qa1_F8PDHGTiOYgdRLjm-8soiAbcRWkanr2EDsSg9qx2la_DM-kMMJAPjMp_IwVl-oQ1egBlC0gKi6qz6-MVZBZmAZ9-zJxeGr0jtaho9nqsfznjt-lBgZmvURRyXMADGHb7kMs7BlV7-nQ1ZOak2ftmwFUhPTOE9OXF6PDqCCQXakynmC1pAWEl309do1-XCmXyGPdrOD72QNTZs9ExwtX',
    varieties: ['Shankar-6 (Long Staple)', 'Bunny Bt-2', 'Organic DCH-32'],
  },
];

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  farmer,
  crops,
  orders,
  onRemoveCrop,
  onUpdateCropPrice,
  onConfirmDispatch,
  activeFarmerTab,
  onSwitchRole,
  onSelectTab,
  onAddCrop,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tableFilter, setTableFilter] = useState<'all' | 'bids' | 'sold'>('all');
  const [editingCropId, setEditingCropId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);
  const [selectedOfferCrop, setSelectedOfferCrop] = useState<CropLot | null>(null);
  const [activeMenuCropId, setActiveMenuCropId] = useState<string | null>(null);
  const [audioHelpPlaying, setAudioHelpPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for inline listing
  const listFormRef = useRef<HTMLDivElement>(null);
  const [producerScale, setProducerScale] = useState<'smallholder' | 'commercial'>('commercial');
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('wheat');
  const [variety, setVariety] = useState<string>('Sharbati (C-306)');
  const [assayingHub, setAssayingHub] = useState<string>('Gram Datoda Hub #4, Indore Central Depot');
  const [quantity, setQuantity] = useState<number>(200);
  const [quantityUnit, setQuantityUnit] = useState<'Qtl' | 'MT'>('Qtl');
  const [moisture, setMoisture] = useState<number>(10.8);
  const [harvestDate, setHarvestDate] = useState<string>('2025-02-15');
  const [pickupType, setPickupType] = useState<'farmgate' | 'godown' | 'shed' | 'mandi'>('farmgate');
  const [pickupAddress, setPickupAddress] = useState<string>('Rameshwar Patel Farmstead, Khasra 142/2, Gram Datoda');
  const [pincodeTehsil, setPincodeTehsil] = useState<string>('452020, Sanwer Tehsil, Indore');
  const [contactPerson, setContactPerson] = useState<string>('Rameshwar Patel');
  const [contactMobile, setContactMobile] = useState<string>('98260 12345');
  const [askingPrice, setAskingPrice] = useState<number>(2420);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(['Grain Close-up', 'Weighbridge Slip']);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeCommodity = useMemo(() => {
    return COMMODITIES.find((c) => c.id === selectedCommodityId) || COMMODITIES[0];
  }, [selectedCommodityId]);

  // Sync default variety and price when commodity changes
  const handleSelectCommodity = (comm: CommodityOption) => {
    setSelectedCommodityId(comm.id);
    setVariety(comm.varieties[0] || '');
    setAskingPrice(comm.defaultPrice);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAudioHelp = () => {
    setAudioHelpPlaying(true);
    showToast('🔊 आवाज सहायता: राम-राम रमेशवर जी! आपका एग्रीट्रेड नेक्सस टर्मिनल सक्रिय है।');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'राम-राम रमेशवर जी! आपका एग्रीट्रेड नेक्सस टर्मिनल सक्रिय है। आप सीधे मिल मालिकों को अपनी फसल बेच सकते हैं।'
      );
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setAudioHelpPlaying(false);
      utterance.onerror = () => setAudioHelpPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setAudioHelpPlaying(false), 3000);
    }
  };

  const handleScrollToListing = () => {
    if (listFormRef.current) {
      listFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Farmer inventory lots
  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      if (tableFilter === 'bids') {
        return crop.status === 'available';
      }
      if (tableFilter === 'sold') {
        return crop.status === 'sold' || crop.status === 'reserved';
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          crop.title.toLowerCase().includes(q) ||
          crop.variety.toLowerCase().includes(q) ||
          crop.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [crops, tableFilter, searchQuery]);

  const totalQuintals = crops.reduce((acc, c) => acc + c.batchQuantityQtl, 0);

  // Submit Listing Form
  const handleBroadcastLot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askingPrice || askingPrice <= 0 || !quantity || quantity <= 0) {
      showToast('कृपया मान्य मात्रा और मूल्य दर्ज करें');
      return;
    }

    setIsSubmitting(true);
    const qtyInQtl = quantityUnit === 'MT' ? quantity * 10 : quantity;

    const newCropData: CropLot = {
      id: `lot-${Date.now()}`,
      farmerName: farmer?.name || 'Rameshwar Patel',
      fpoName: farmer?.orgName || 'Malwa Agro Producer Co. Ltd.',
      farmerPhone: farmer?.phone || '+91 98260 12345',
      farmerLocation: pickupAddress || 'Gram Datoda, Indore, MP',
      cropCategory: activeCommodity.category,
      title: `${activeCommodity.nameEn} (${variety.split(' ')[0]})`,
      variety: variety,
      grade: 'AGMARK Grade-A Certified',
      qualityGrade: 'A-Grade',
      qualityScore: 96,
      batchQuantityQtl: qtyInQtl,
      pricePerQtl: askingPrice,
      mandiRate: activeCommodity.msp,
      premiumText: `+₹${Math.max(0, askingPrice - activeCommodity.msp)} over MSP`,
      moisturePct: moisture,
      harvestDate: harvestDate,
      location: 'Indore, MP',
      distanceKm: 14,
      source: 'farmgate',
      sourceLabel: 'Direct Farmgate',
      pickupOption: 'buyer_pickup',
      verifiedAssay: true,
      imageUrl: activeCommodity.imageUrl,
      certBadge: 'AGMARK Certified',
      moistureBadge: `${moisture}% Moisture`,
      keyMetricLabel: 'Moisture',
      keyMetricValue: `${moisture}%`,
      status: 'available',
      addedAt: 'Just now',
      mandiRefPrice: activeCommodity.msp,
      paymentTerms: '100% Direct Escrow on Digital Weighbridge Verification',
    };

    setTimeout(() => {
      if (onAddCrop) {
        onAddCrop(newCropData);
      }
      setIsSubmitting(false);
      showToast('✅ फसल लॉट सफलतापूर्वक दर्ज हो गया! 180+ खरीदारों को नोटिफिकेशन भेज दिया गया है।');
      // Reset form slightly
      setQuantity(150);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#131b2e]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#012d1d] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span className="flex-1">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* TOP BAR / FARMER PROFILE ROW (Screenshot 3) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-headline text-2xl sm:text-3xl font-bold text-[#012d1d] tracking-tight">
                Welcome, {farmer?.name || 'Rameshwar Patel'}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#012d1d] text-[10px] font-bold uppercase tracking-wider">
                LIVE TERMINAL
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Integrated trading terminal for individual farmers, producers &amp; FPO collectives
            </p>
          </div>

          {/* Right Controls: Mode Toggle, Audio Help, Language, Profile Chip */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Mode Switcher */}
            <div className="inline-flex p-1 bg-gray-100 rounded-full border border-gray-200 text-xs font-bold">
              <button
                className="px-3.5 py-1.5 rounded-full bg-[#012d1d] text-white shadow-xs"
                title="Active Seller Mode"
              >
                Selling (Farmer)
              </button>
              <button
                onClick={() => {
                  if (onSwitchRole) onSwitchRole();
                  else if (onSelectTab) onSelectTab('marketplace');
                }}
                className="px-3.5 py-1.5 rounded-full text-gray-600 hover:text-[#012d1d] transition-colors"
                title="Switch to Commercial Buyer Hub"
              >
                Buying (Commercial)
              </button>
            </div>

            {/* Audio Help Button */}
            <button
              onClick={handleAudioHelp}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
                audioHelpPlaying
                  ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
              title="Click to hear spoken audio guidance in Hindi"
            >
              <span className="material-symbols-outlined text-[18px]">volume_up</span>
              <span>आवाज सहायता (Audio Help)</span>
            </button>

            {/* Language Selector */}
            <div className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <span>🇮🇳 हिंदी (Malwi/Hindi)</span>
            </div>

            {/* Profile Avatar Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
              <div className="w-10 h-10 rounded-full bg-[#012d1d] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                RP
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-gray-900 leading-tight">
                  {farmer?.name || 'Rameshwar Patel'}
                </div>
                <div className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-amber-500">verified</span>
                  SFAC Certified
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 TOP KPI CARDS (Screenshot 3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Escrow Realized */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  TOTAL ESCROW REALIZED
                </span>
                <div className="font-headline text-2xl font-bold text-[#012d1d] mt-1">₹8,45,200</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
              </div>
            </div>
            <div className="mt-4 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>+₹1,12,000 this Rabi • 100% Settled</span>
            </div>
          </div>

          {/* Card 2: Active Commodity Lots */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    ACTIVE COMMODITY LOTS
                  </span>
                </div>
                <div className="font-headline text-2xl font-bold text-[#012d1d] mt-1">
                  {crops.length || 4} Lots Listed
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">inventory_2</span>
              </div>
            </div>
            <div className="mt-4 text-[11px] font-semibold text-gray-600">
              Total: {totalQuintals || 650} Quintals • Indore Hub Alpha
            </div>
          </div>

          {/* Card 3: Awaiting Logistics Pickup */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  AWAITING LOGISTICS PICKUP
                </span>
                <div className="font-headline text-2xl font-bold text-[#012d1d] mt-1">2 Dispatches</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">local_shipping</span>
              </div>
            </div>
            <div className="mt-4 text-[11px] font-semibold text-orange-700 flex items-center gap-1.5">
              <span>₹3,40,000 In Escrow | TRUCKS EN ROUTE</span>
            </div>
          </div>

          {/* Card 4: Quick Mandi Connect (Forest Green Highlight Card) */}
          <div className="bg-[#012d1d] text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                QUICK MANDI CONNECT
              </span>
              <div className="font-headline text-lg font-bold text-white mt-1 leading-snug">
                Direct to 180+ Industrial Buyers
              </div>
              <p className="text-[11px] text-emerald-200/90 mt-1 leading-relaxed">
                Sell from 5 quintals to truckloads with direct farmgate pickup.
              </p>
            </div>
            <button
              onClick={handleScrollToListing}
              className="mt-4 w-full py-2.5 px-3 bg-[#fe932c] hover:bg-[#e27a00] text-[#012d1d] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>+ List New Produce Lot</span>
            </button>
          </div>
        </div>

        {/* SECTION: ACTIVE ESCROW CONTRACTS & DISPATCHES (Screenshot 3) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <h2 className="font-headline text-xl font-bold text-[#012d1d]">
                Active Escrow Contracts &amp; Dispatches
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                2 Active
              </span>
            </div>
            <button
              onClick={() => showToast('14 ऐतिहासिक अनुबंध और भुगतानों का लेखा-जोखा उपलब्ध है।')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <span>View All 14 Historical Contracts</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 -mt-2">
            Commercial contracts locked in banking escrow. Payouts released upon weighbridge verification.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Contract Card 1: Sharbati Golden Wheat */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  Scheduled Today 3:30 PM
                </span>
                <span className="font-mono text-gray-400 font-bold">#ATN-MP-8942</span>
              </div>

              <div className="flex items-start gap-4">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfA43YzxtpL2BRPGL788li1Cfm2MBZjnYwIx83I4g3RBr8bN8oxRSkzpCzydY2eEZls9xvUvsN_vSKxwhbvjgUKvNP0x8jS2g0YWLc_w-fmUY7Ix8LlDxJDu4Xv8WC5eKeaRm30xl9k22H15iE5KLRU7YVj8zZkg0jgI5O9qeZY2lmifevBoJeYYsjmMmt8U6PWZcDxiloF_DXdYDU8M_V53mZGWQS5uSPF0qxtIiokOHtod6-71bc"
                  alt="Sharbati Wheat"
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-headline text-base font-bold text-gray-900 leading-tight">
                    Sharbati Golden Wheat (A-Grade)
                  </h3>
                  <div className="font-headline text-xl font-bold text-[#012d1d] mt-1">₹6,05,000</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    250 Qtl (25 MT) • Unit: ₹2,420/Qtl • Moisture: 10.4%
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs flex items-center justify-between">
                <div className="truncate">
                  <span className="text-gray-500 font-medium">Pickup: </span>
                  <span className="font-semibold text-gray-800">Rameshwar Patel Farmstead, Gram Datoda</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                  Escrow Locked
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-gray-400">local_shipping</span>
                  Buyer Truck: <strong className="font-mono text-gray-800">MP-09-HH-3901</strong>
                </span>
                <span className="font-semibold text-emerald-700">Zero Farmer Freight</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => showToast('खरीदार डेस्क से संपर्क किया जा रहा है: +91 98260 99881')}
                  className="py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>Call Buyer Desk</span>
                </button>
                <button
                  onClick={() => showToast('डिजिटल गेट पास #GP-8942 तैयार है।')}
                  className="py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  <span>Dossier &amp; Gate Pass</span>
                </button>
              </div>
            </div>

            {/* Contract Card 2: Organic Desi Chana */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Quality Assayed (98.8%) • In-Transit
                </span>
                <span className="font-mono text-gray-400 font-bold">#ATN-MP-7721</span>
              </div>

              <div className="flex items-start gap-4">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoVsKHunbCqL3zT5yZUVea7Sn-Wg5cQrAh7O2OoCxePNtcAgIWb5PV_PJtyHGahxexK8GlxI9nSJkUz9SjEXrL8ThGe__AI3pO4UNQp726rSXmvVdebRAPwWwoVNUGwfJG9-Y-mRzgp3eRNK4rWsNvM4nHR0U4dRDOVU1mPemjiGQQeZnhxgHzI027IpCYQP7kkAZNGMA-MvRx_2I4fib5OvBoIRrpvyjwsjhsCozIRRn9UXzlnSAT"
                  alt="Desi Chana"
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-headline text-base font-bold text-gray-900 leading-tight">
                    Organic Desi Chana (Bengal Gram)
                  </h3>
                  <div className="font-headline text-xl font-bold text-[#012d1d] mt-1">₹6,57,600</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    120 Qtl (12 MT) • Unit: ₹5,480/Qtl • Foreign Matter: 0.4%
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs flex items-center justify-between">
                <div className="truncate">
                  <span className="text-gray-500 font-medium">Pickup: </span>
                  <span className="font-semibold text-gray-800">Village Aggregation Shed, Datoda</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
                  GPS Active
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[18px] text-gray-400">near_me</span>
                  Truck MP-13-GA-1120 (14 km away)
                </span>
                <span className="font-semibold text-blue-700">ETA: 55 Mins</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => showToast('प्रोक्योरमेंट डेस्क से कनेक्ट किया जा रहा है...')}
                  className="py-2.5 px-3 rounded-xl bg-[#012d1d] hover:bg-[#063b28] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>Call Procurement Desk</span>
                </button>
                <button
                  onClick={() => showToast('लाइव GPS टेलीमेट्री: वाहन 42 किमी/घंटे की गति से अग्रसर है।')}
                  className="py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  <span>Track GPS Telemetry</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: ACTIVE CROP INVENTORY (HUB MANDI LOTS) (Screenshot 4) */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="font-headline text-xl font-bold text-[#012d1d]">
                Active Crop Inventory (Hub Mandi Lots)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time status of your harvest lots stored at your farm, home godown, or village hub.
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search crop, lot #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-9 pr-3 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#012d1d] w-48 sm:w-56"
                />
              </div>

              <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-bold">
                <button
                  onClick={() => setTableFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    tableFilter === 'all' ? 'bg-white text-[#012d1d] shadow-xs' : 'text-gray-600'
                  }`}
                >
                  All Lots ({crops.length})
                </button>
                <button
                  onClick={() => setTableFilter('bids')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    tableFilter === 'bids' ? 'bg-white text-[#012d1d] shadow-xs' : 'text-gray-600'
                  }`}
                >
                  Active Bids (2)
                </button>
                <button
                  onClick={() => setTableFilter('sold')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    tableFilter === 'sold' ? 'bg-white text-[#012d1d] shadow-xs' : 'text-gray-600'
                  }`}
                >
                  Sold (1)
                </button>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#f2f3ff] text-gray-600 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">LOT &amp; COMMODITY</th>
                    <th className="py-3.5 px-4">VARIETY &amp; GRADE</th>
                    <th className="py-3.5 px-4">VOLUME</th>
                    <th className="py-3.5 px-4">ASKING PRICE</th>
                    <th className="py-3.5 px-4">HARVEST DATE</th>
                    <th className="py-3.5 px-4">EXCHANGE STATUS</th>
                    <th className="py-3.5 px-4 text-right">MANAGE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCrops.map((crop, idx) => {
                    const lotCode = `LOT #MP-IND-${String(idx + 1).padStart(3, '0')}`;
                    const isSold = crop.status === 'sold';
                    const isReserved = crop.status === 'reserved';
                    const isEditing = editingCropId === crop.id;

                    return (
                      <tr key={crop.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* LOT & Commodity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={crop.imageUrl}
                              alt={crop.title}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                            />
                            <div>
                              <div className="font-bold text-gray-900 leading-tight">{crop.title}</div>
                              <div className="font-mono text-[10px] text-gray-400 mt-0.5">{lotCode}</div>
                            </div>
                          </div>
                        </td>

                        {/* Variety & Grade */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-gray-800">{crop.variety}</div>
                          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">{crop.grade}</div>
                        </td>

                        {/* Volume */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-gray-900">
                            {crop.batchQuantityQtl} Qtl
                          </div>
                          <div className="text-[10px] text-gray-500">
                            ({(crop.batchQuantityQtl / 10).toFixed(0)} MT)
                          </div>
                        </td>

                        {/* Asking Price */}
                        <td className="py-3.5 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={editPriceValue}
                                onChange={(e) => setEditPriceValue(Number(e.target.value))}
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                              />
                              <button
                                onClick={() => {
                                  if (editPriceValue > 0) {
                                    onUpdateCropPrice(crop.id, editPriceValue);
                                  }
                                  setEditingCropId(null);
                                }}
                                className="px-2 py-1 bg-emerald-700 text-white rounded text-[10px] font-bold"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="font-headline font-bold text-[#012d1d]">
                                ₹{crop.pricePerQtl.toLocaleString('en-IN')} / Qtl
                              </div>
                              <button
                                onClick={() => {
                                  setEditingCropId(crop.id);
                                  setEditPriceValue(crop.pricePerQtl);
                                }}
                                className="text-[10px] text-emerald-700 hover:underline"
                              >
                                Edit Rate
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Harvest Date */}
                        <td className="py-3.5 px-4 text-gray-600 font-medium">
                          {crop.harvestDate}
                        </td>

                        {/* Exchange Status */}
                        <td className="py-3.5 px-4">
                          {isSold ? (
                            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-bold text-[11px]">
                              Sold (Settled)
                            </span>
                          ) : isReserved ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                              Reserved (Drafted)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              Available (3 Bids)
                            </span>
                          )}
                        </td>

                        {/* Manage Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 relative">
                            {isSold ? (
                              <span className="font-mono text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                UTR#402910
                              </span>
                            ) : (
                              <button
                                onClick={() => setSelectedOfferCrop(crop)}
                                className="px-3 py-1.5 bg-[#012d1d] hover:bg-[#063b28] text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                              >
                                View Offers
                              </button>
                            )}

                            {/* Dropdown menu trigger */}
                            <button
                              onClick={() =>
                                setActiveMenuCropId(activeMenuCropId === crop.id ? null : crop.id)
                              }
                              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-600"
                              title="More actions"
                            >
                              <span className="material-symbols-outlined text-[20px]">more_vert</span>
                            </button>

                            {/* Context Menu */}
                            {activeMenuCropId === crop.id && (
                              <div className="absolute right-0 top-9 w-44 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20 text-left text-xs animate-fade-in">
                                <button
                                  onClick={() => {
                                    setEditingCropId(crop.id);
                                    setEditPriceValue(crop.pricePerQtl);
                                    setActiveMenuCropId(null);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                >
                                  <span className="material-symbols-outlined text-[16px]">edit</span>
                                  <span>Edit Asking Price</span>
                                </button>
                                <button
                                  onClick={() => {
                                    showToast(`लॉट #${lotCode} का ई-वे बिल और टेस्ट सर्टिफिकेट डाउनलोड हो रहा है...`);
                                    setActiveMenuCropId(null);
                                  }}
                                  className="w-full px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                >
                                  <span className="material-symbols-outlined text-[16px]">download</span>
                                  <span>Download Assay Slip</span>
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button
                                  onClick={() => {
                                    onRemoveCrop(crop.id);
                                    setActiveMenuCropId(null);
                                    showToast('लॉट सफलतापूर्वक हटा दिया गया है।');
                                  }}
                                  className="w-full px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-semibold"
                                >
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                  <span>Remove Lot</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION: LIST NEW CROP LOT (नयी फसल दर्ज करें) (Screenshots 4, 5, 6) */}
        <div
          ref={listFormRef}
          id="listNewCropSection"
          className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-8 space-y-8"
        >
          {/* Section Header with Badges */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#012d1d] text-xs font-bold uppercase tracking-wide">
                RAPID MANDI GATEWAY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200">
                e-NWR Compliant
              </span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#012d1d]">
              List New Crop Lot (नयी फसल दर्ज करें)
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-3xl">
              Instant listing to 180+ verified millers, processors &amp; institutions with automated APMC pass generation.
            </p>
          </div>

          {/* 4-Step Progress Indicator */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-b border-gray-200 pb-6 text-xs font-bold">
            <div className="flex items-center gap-2 text-[#012d1d]">
              <span className="w-6 h-6 rounded-full bg-[#012d1d] text-white flex items-center justify-center text-[11px]">
                1
              </span>
              <span>Crop &amp; Scale</span>
            </div>
            <div className="flex items-center gap-2 text-[#012d1d]">
              <span className="w-6 h-6 rounded-full bg-[#012d1d] text-white flex items-center justify-center text-[11px]">
                2
              </span>
              <span>Quantity &amp; Quality</span>
            </div>
            <div className="flex items-center gap-2 text-[#012d1d]">
              <span className="w-6 h-6 rounded-full bg-[#012d1d] text-white flex items-center justify-center text-[11px]">
                3
              </span>
              <span>Pickup Address</span>
            </div>
            <div className="flex items-center gap-2 text-[#012d1d]">
              <span className="w-6 h-6 rounded-full bg-[#012d1d] text-white flex items-center justify-center text-[11px]">
                4
              </span>
              <span>Price</span>
            </div>
          </div>

          <form onSubmit={handleBroadcastLot} className="space-y-8">
            {/* STEP 1: Select Commodity (फसल चुनें) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-sm font-bold text-gray-900">
                  Step 1: Select Commodity (फसल चुनें)
                </label>
                <div className="inline-flex p-1 bg-gray-100 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setProducerScale('smallholder')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      producerScale === 'smallholder' ? 'bg-white text-[#012d1d] shadow-xs' : 'text-gray-500'
                    }`}
                  >
                    Smallholder (1-50 Qtl)
                  </button>
                  <button
                    type="button"
                    onClick={() => setProducerScale('commercial')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      producerScale === 'commercial' ? 'bg-white text-[#012d1d] shadow-xs' : 'text-gray-500'
                    }`}
                  >
                    Commercial / FPO (50+ Qtl)
                  </button>
                </div>
              </div>

              {/* 6 Crop Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {COMMODITIES.map((comm) => {
                  const isSelected = selectedCommodityId === comm.id;
                  return (
                    <div
                      key={comm.id}
                      onClick={() => handleSelectCommodity(comm)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center relative ${
                        isSelected
                          ? 'border-[#012d1d] bg-emerald-50/50 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#012d1d] text-white flex items-center justify-center text-[12px]">
                          ✓
                        </span>
                      )}
                      <img
                        src={comm.imageUrl}
                        alt={comm.nameEn}
                        className="w-14 h-14 rounded-full object-cover border border-gray-200 mt-1 mb-2"
                      />
                      <span className="font-headline font-bold text-xs text-gray-900 leading-tight">
                        {comm.nameEn}
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium">{comm.nameHi}</span>
                    </div>
                  );
                })}
              </div>

              {/* Variety and Assaying Hub Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                    Crop Variety &amp; Commercial Grade (किस्म)
                  </label>
                  <select
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full h-11 px-3.5 bg-gray-50 text-xs font-semibold text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#012d1d]"
                  >
                    {activeCommodity.varieties.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                    Assaying / Storage Hub (जाँच केंद्र)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-[18px]">
                      warehouse
                    </span>
                    <input
                      type="text"
                      value={assayingHub}
                      onChange={(e) => setAssayingHub(e.target.value)}
                      placeholder="e.g. Gram Datoda Hub #4, Indore Central Depot"
                      className="w-full h-11 pl-10 pr-3.5 bg-gray-50 text-xs font-semibold text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#012d1d]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: Quantity & Moisture Parameters (मात्रा एवं नमी) */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-900">
                  Step 2: Quantity &amp; Moisture Parameters (मात्रा एवं नमी)
                </label>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  STANDARD MOISTURE: &lt;12%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Available Quantity */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase text-gray-600">Available Quantity</label>
                    <div className="inline-flex p-0.5 bg-gray-100 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setQuantityUnit('Qtl')}
                        className={`px-2 py-0.5 rounded ${
                          quantityUnit === 'Qtl' ? 'bg-white text-[#012d1d] shadow-xs' : 'text-gray-500'
                        }`}
                      >
                        Qtl
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuantityUnit('MT')}
                        className={`px-2 py-0.5 rounded ${
                          quantityUnit === 'MT' ? 'bg-white text-[#012d1d] shadow-xs' : 'text-gray-500'
                        }`}
                      >
                        MT
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full h-11 px-3.5 bg-gray-50 font-mono text-sm font-bold text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#012d1d]"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Equivalent to {quantityUnit === 'MT' ? quantity * 10 : (quantity / 10).toFixed(1)} MT
                  </span>
                </div>

                {/* Moisture Content Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase text-gray-600">
                      Moisture Content (%)
                    </label>
                    <span className="font-mono text-xs font-bold text-emerald-800">{moisture}%</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="18"
                    step="0.1"
                    value={moisture}
                    onChange={(e) => setMoisture(Number(e.target.value))}
                    className="w-full accent-[#012d1d] h-2 bg-gray-200 rounded-lg cursor-pointer mt-3"
                  />
                  <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                    ✓ Optimal for premium milling grade
                  </span>
                </div>

                {/* Harvest / Bagging Date */}
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                    Harvest / Bagging Date
                  </label>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full h-11 px-3.5 bg-gray-50 text-xs font-semibold text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#012d1d]"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Fresh Rabi 2025 Harvest</span>
                </div>
              </div>
            </div>

            {/* STEP 3: Produce Storage & Pickup Address (Screenshot 5) */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-bold text-gray-900">
                    Step 3: Produce Storage &amp; Pickup Address (कहाँ से माल उठाना है?)
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Buyers arrange direct vehicle pickup from your specified location.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  ✓ Zero Farmer Freight Cost
                </span>
              </div>

              {/* 4 Pickup Type Radios */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'farmgate', label: 'Farmgate / Khet', sub: 'खेत से सीधी उठान', icon: 'agriculture' },
                  { id: 'godown', label: 'Home / Godown', sub: 'घर या गोदाम', icon: 'warehouse' },
                  { id: 'shed', label: 'Panchayat Shed', sub: 'साझा केंद्र', icon: 'corporate_fare' },
                  { id: 'mandi', label: 'Mandi Hub', sub: 'लाइसेंस्ड उपमंडी', icon: 'storefront' },
                ].map((p) => {
                  const isChecked = pickupType === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setPickupType(p.id as any)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                        isChecked
                          ? 'border-[#012d1d] bg-emerald-50/50 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px] text-[#012d1d] mb-1">
                        {p.icon}
                      </span>
                      <span className="font-bold text-xs text-gray-900 leading-tight">{p.label}</span>
                      <span className="text-[10px] text-gray-500 mt-0.5">{p.sub}</span>
                    </div>
                  );
                })}
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                    Full Pickup Address / Land Landmark
                  </label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="e.g. Rameshwar Patel Farmstead, Khasra 142/2, Gram Datoda"
                    className="w-full h-11 px-3.5 bg-gray-50 text-xs font-semibold text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#012d1d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                    Pincode &amp; Tehsil
                  </label>
                  <input
                    type="text"
                    value={pincodeTehsil}
                    onChange={(e) => setPincodeTehsil(e.target.value)}
                    placeholder="452020, Sanwer Tehsil, Indore"
                    className="w-full h-11 px-3.5 bg-gray-50 text-xs font-semibold text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#012d1d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                    Contact Person at Site
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Rameshwar Patel"
                    className="w-full h-11 px-3.5 bg-gray-50 text-xs font-semibold text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#012d1d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                    Mobile Number for Driver
                  </label>
                  <input
                    type="tel"
                    value={contactMobile}
                    onChange={(e) => setContactMobile(e.target.value)}
                    placeholder="98260 12345"
                    className="w-full h-11 px-3.5 bg-gray-50 text-xs font-semibold text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#012d1d]"
                  />
                </div>
              </div>
            </div>

            {/* STEP 4: Pricing & Sample Photos (Screenshots 5 & 6) */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-900">
                  Step 4: Pricing &amp; Sample Photos (मूल्य एवं फोटो)
                </label>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  ✓ MSP Protection Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Pricing & Live Total */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Government MSP (2024-25):</span>
                    <span className="font-mono font-bold text-gray-800">
                      ₹{activeCommodity.msp.toLocaleString('en-IN')} / Qtl
                    </span>
                  </div>

                  <div className="text-xs">
                    <div className="flex justify-between text-gray-600 mb-1 font-semibold">
                      <span>Suggested Range:</span>
                      <span className="text-emerald-800 font-mono">
                        ₹{activeCommodity.suggestedMin} - ₹{activeCommodity.suggestedMax} / Qtl
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                      Your Asking Price (प्रति क्विंटल दर)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 font-headline font-bold text-gray-500">₹</span>
                      <input
                        type="number"
                        value={askingPrice}
                        onChange={(e) => setAskingPrice(Number(e.target.value))}
                        className="w-full h-11 pl-8 pr-16 bg-white font-headline text-lg font-bold text-[#012d1d] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#012d1d]"
                      />
                      <span className="absolute right-3.5 top-3 text-xs text-gray-400 font-bold">
                        / Quintal
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-700 block">Estimated Lot Total:</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        0% Commission • 100% Direct to Bank
                      </span>
                    </div>
                    <div className="font-headline text-xl font-bold text-[#012d1d]">
                      {formatCurrency((quantityUnit === 'MT' ? quantity * 10 : quantity) * askingPrice)}
                    </div>
                  </div>
                </div>

                {/* Right: Sample Photos & Upload Container */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col justify-between space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
                      Upload Photos &amp; Quality Slips
                    </label>
                    <div
                      onClick={() => showToast('कैमरा और फोटो पिकर खुला... (डेमो फोटो लोड की गई)')}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-3xl text-gray-400 mb-2">
                        add_a_photo
                      </span>
                      <div className="text-xs font-bold text-gray-800">
                        Click or drag grain photos here
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        Smartphone camera photo or test slip (JPEG/PDF up to 10MB)
                      </div>
                    </div>
                  </div>

                  {/* Preset Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    {uploadedPhotos.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-700 flex items-center gap-1 shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-emerald-600 text-[14px]">
                          check
                        </span>
                        {tag}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => setUploadedPhotos((prev) => [...prev, `Slip #${prev.length + 1}`])}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-800 hover:bg-emerald-50"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => showToast('प्रारूप सुरक्षित कर लिया गया है।')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs transition-colors"
              >
                Save as Draft (प्रारूप सहेजें)
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#012d1d] hover:bg-[#063b28] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    <span>Broadcasting to Millers...</span>
                  </>
                ) : (
                  <>
                    <span>Save &amp; Broadcast for Direct Buyer Bids</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 3 GUARANTEE FEATURE CARDS (Screenshot 6) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-gray-900">Guaranteed Bank Escrow</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                100% buyer funds pre-locked prior to dispatch. Zero settlement default risk.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">receipt_long</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-gray-900">e-NAM &amp; Transit Pass</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Instant digital transit pass and gate pass generation valid across interstate borders.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">support_agent</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-gray-900">Krishi Mitra Support</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Doorstep pickup assistance and free portable moisture testing at your farm or village.
              </p>
            </div>
          </div>
        </div>

        {/* KISAN SUPPORT TOLL-FREE BAR (Screenshot 6) */}
        <div className="p-5 bg-[#012d1d] text-white rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-800/60 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[24px] text-emerald-300">headset_mic</span>
            </div>
            <div>
              <div className="font-headline text-base font-bold">
                किसान सहायता टोल-फ्री डेस्क (Kisan Support 24×7)
              </div>
              <div className="text-xs text-emerald-200/90 mt-0.5">
                Instant help in Hindi, Marathi, and English for lot listing or payment disputes
              </div>
            </div>
          </div>

          <a
            href="tel:18004192474"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-[#012d1d] rounded-xl font-headline font-bold text-xs shadow-sm hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>1800-419-AGRI (2474)</span>
          </a>
        </div>
      </div>

      {/* OFFERS MODAL / POPUP */}
      {selectedOfferCrop && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-headline text-lg font-bold text-[#012d1d]">
                  Active Bids for {selectedOfferCrop.title}
                </h3>
                <p className="text-xs text-gray-500">
                  Asking Price: ₹{selectedOfferCrop.pricePerQtl}/Qtl • {selectedOfferCrop.batchQuantityQtl} Qtl
                </p>
              </div>
              <button
                onClick={() => setSelectedOfferCrop(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">AgroCore Foods Ltd.</div>
                  <div className="text-emerald-800 font-bold font-mono text-sm mt-0.5">
                    ₹{selectedOfferCrop.pricePerQtl + 20} / Qtl
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    Full lot ({selectedOfferCrop.batchQuantityQtl} Qtl) • Farmgate pickup scheduled
                  </div>
                </div>
                <button
                  onClick={() => {
                    showToast('AgroCore Foods का प्रस्ताव स्वीकार किया गया! एस्क्रो कॉन्ट्रैक्ट जनरेट हो रहा है।');
                    setSelectedOfferCrop(null);
                  }}
                  className="px-3.5 py-2 bg-[#012d1d] text-white font-bold rounded-xl shadow-xs hover:bg-[#063b28]"
                >
                  Accept Offer
                </button>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900">Malwa Flour Mills Pvt Ltd</div>
                  <div className="text-gray-800 font-bold font-mono text-sm mt-0.5">
                    ₹{selectedOfferCrop.pricePerQtl} / Qtl
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    Partial lot (100 Qtl) • Self weighbridge dispatch
                  </div>
                </div>
                <button
                  onClick={() => {
                    showToast('Malwa Flour Mills का प्रस्ताव स्वीकार किया गया!');
                    setSelectedOfferCrop(null);
                  }}
                  className="px-3.5 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Accept
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedOfferCrop(null)}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
