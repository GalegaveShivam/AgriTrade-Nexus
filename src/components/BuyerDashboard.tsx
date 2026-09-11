import React, { useState, useMemo } from 'react';
import { CropCategory, CropLot, MandiPriceItem, PurchaseOrder, SourceType, User } from '../types';

interface BuyerDashboardProps {
  buyer: User | null;
  crops: CropLot[];
  orders: PurchaseOrder[];
  mandiPrices: MandiPriceItem[];
  onSelectCropForOrder: (crop: CropLot, quantity?: number) => void;
  onCallFarmer: (crop: CropLot) => void;
  activeBuyerTab: string;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  buyer,
  crops,
  orders,
  mandiPrices,
  onSelectCropForOrder,
  onCallFarmer,
  activeBuyerTab,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [pickupFilter, setPickupFilter] = useState<'all' | 'farmgate' | 'hub'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('nearest');
  const [filterOrganic, setFilterOrganic] = useState(false);
  const [filterGrade1, setFilterGrade1] = useState(false);
  const [filterLowMoisture, setFilterLowMoisture] = useState(false);

  // Calculator State
  const [calcCropRate, setCalcCropRate] = useState<number>(2420);
  const [calcCropTitle, setCalcCropTitle] = useState<string>('Sharbati Wheat (C-306)');
  const [calcCropCategory, setCalcCropCategory] = useState<CropCategory>('wheat');
  const [calcQuantity, setCalcQuantity] = useState<number>(200);

  // Welcome greeting banner state
  const [showWelcomeBanner, setShowWelcomeBanner] = useState<boolean>(true);

  // Dynamic time greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const timeSlot = hour < 12 ? 'Morning Session' : hour < 17 ? 'Afternoon Session' : 'Evening Desk Session';

  // Calculator math
  const calcGross = calcCropRate * calcQuantity;
  const calcCess = Math.round(calcGross * 0.015);
  const calcTotal = calcGross + calcCess;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Filter and sort crops
  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      // Category filter
      if (selectedCategory !== 'all' && crop.cropCategory !== selectedCategory) {
        return false;
      }
      // Pickup mode
      if (pickupFilter !== 'all' && crop.source !== pickupFilter) {
        return false;
      }
      // Organic filter
      if (filterOrganic && !crop.certBadge.toLowerCase().includes('organic')) {
        return false;
      }
      // Grade 1 filter
      if (filterGrade1 && !crop.qualityGrade.toLowerCase().includes('grade-1') && !crop.certBadge.toLowerCase().includes('grade-1')) {
        return false;
      }
      // Low moisture
      if (filterLowMoisture && crop.moisturePct >= 10) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          crop.title.toLowerCase().includes(query) ||
          crop.variety.toLowerCase().includes(query) ||
          crop.farmerName.toLowerCase().includes(query) ||
          crop.fpoName.toLowerCase().includes(query) ||
          crop.location.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'lowest_price') return a.pricePerQtl - b.pricePerQtl;
      if (sortBy === 'highest_assay') return b.qualityScore - a.qualityScore;
      if (sortBy === 'largest_vol') return b.batchQuantityQtl - a.batchQuantityQtl;
      // Default: nearest
      return a.distanceKm - b.distanceKm;
    });
  }, [crops, selectedCategory, pickupFilter, filterOrganic, filterGrade1, filterLowMoisture, searchQuery, sortBy]);

  // If user selected "My Orders" tab
  if (activeBuyerTab === 'my-orders') {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-2xl md:text-3xl font-bold text-[#012d1d]">
              Purchase Orders & Dispatch Tracking
            </h1>
            <p className="text-xs text-[#414844] mt-1">
              Real-time monitoring of digital weighbridge passes, carrier tracking, and escrow status.
            </p>
          </div>
          <span className="px-3.5 py-1.5 bg-[#f2f3ff] text-[#1b4332] text-xs font-bold rounded-xl border border-[#dae2fd]">
            {orders.length} Total Institutional Orders
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#eaedff] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f2f3ff] text-[#414844] font-bold uppercase tracking-wider border-b border-[#dae2fd]">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Commodity Batch</th>
                  <th className="p-4">Producer / FPO</th>
                  <th className="p-4">Quantity (Qtl)</th>
                  <th className="p-4">Total Amount (₹)</th>
                  <th className="p-4">Escrow & Logistics Status</th>
                  <th className="p-4">Transit Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-[#131b2e]">
                      <div>{ord.orderNumber}</div>
                      <span className="text-[10px] text-gray-500 font-normal">{ord.createdAt}</span>
                    </td>
                    <td className="p-4 font-bold text-[#131b2e]">
                      {ord.cropTitle}
                      <span className="block text-[11px] text-gray-500 font-normal">
                        ₹{ord.pricePerQtl.toLocaleString()}/Qtl
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-[#131b2e]">{ord.farmerName}</div>
                      <span className="text-[10px] text-gray-500">{ord.fpoName}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-[#131b2e]">
                      {ord.quantityQtl} Qtl ({(ord.quantityQtl / 10).toFixed(1)} MT)
                    </td>
                    <td className="p-4 font-mono font-bold text-[#1b4332]">
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    <td className="p-4">
                      {ord.status === 'weighbridge_verified' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#c1ecd4] text-[#002114]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1b4332]"></span>
                          Weighbridge Verified
                        </span>
                      )}
                      {ord.status === 'transit_scheduled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ffdcc3] text-[#2f1500]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#904d00]"></span>
                          In Transit to Mill
                        </span>
                      )}
                      {ord.status === 'escrow_locked' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>
                          Escrow Locked & Awaiting Dispatch
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#414844]">
                      <div className="font-semibold text-[#1b4332]">{ord.transitPassNo}</div>
                      <span className="text-[10px] text-gray-400">Toll Gate Pass Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // If user selected "Contracts & Payments" tab
  if (activeBuyerTab === 'contracts-and-payments') {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-6">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-[#012d1d]">
            Tripartite Escrow Ledger & Vault
          </h1>
          <p className="text-xs text-[#414844] mt-1">
            ICICI Bank Escrow Vault #4489-001 • Instant same-day automated RTGS settlement to verified farmer cooperatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-[#eaedff]">
            <span className="text-xs font-bold uppercase text-[#414844]">Available Vault Balance</span>
            <div className="font-mono text-3xl font-bold text-[#1b4332] mt-2">
              {formatCurrency(buyer?.escrowBalance || 4500000)}
            </div>
            <p className="text-xs text-[#414844] mt-2">Held in high-liquidity escrow trust account.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-[#eaedff]">
            <span className="text-xs font-bold uppercase text-[#414844]">Locked in Active Transit</span>
            <div className="font-mono text-3xl font-bold text-[#904d00] mt-2">
              {formatCurrency(orders.reduce((acc, o) => acc + o.totalAmount, 0))}
            </div>
            <p className="text-xs text-[#414844] mt-2">Released immediately after destination weighbridge signoff.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-[#eaedff]">
            <span className="text-xs font-bold uppercase text-[#414844]">Brokerage Commission Saved</span>
            <div className="font-mono text-3xl font-bold text-[#1b4332] mt-2">
              +₹5,40,000
            </div>
            <p className="text-xs text-[#414844] mt-2">Saved vs 4.5% standard APMC commission fee.</p>
          </div>
        </div>
      </div>
    );
  }

  // If user selected "Market Prices" tab
  if (activeBuyerTab === 'market-prices') {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-6">
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-[#012d1d]">
            National Mandi Grid Price Index
          </h1>
          <p className="text-xs text-[#414844] mt-1">
            Real-time APMC Mandi rates across Madhya Pradesh, Rajasthan, Gujarat, and Maharashtra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mandiPrices.map((mandi, idx) => (
            <div key={idx} className="p-5 bg-white rounded-2xl shadow-sm border border-[#eaedff]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#131b2e]">{mandi.crop}</h3>
                  <span className="text-xs text-gray-500">{mandi.mandiName}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  mandi.trend === 'up' ? 'bg-[#c1ecd4] text-[#002114]' : 'bg-red-100 text-red-700'
                }`}>
                  {mandi.trend === 'up' ? '+' : ''}{mandi.changePct}%
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-gray-100 pt-3">
                <span className="text-xs text-gray-500 uppercase font-bold">Spot Rate</span>
                <span className="font-mono text-xl font-bold text-[#1b4332]">
                  ₹{mandi.ratePerQtl.toLocaleString()}/Qtl
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: Marketplace view (Matching provided HTML and image screenshot!)
  return (
    <div className="w-full flex flex-col">
      {/* Top Context Header & KPI Metric Strip */}
      <section className="w-full px-4 md:px-8 pt-6 pb-6 bg-[#faf8ff] border-b border-[#eaedff]">
        <div className="max-w-[1600px] mx-auto">
          {/* Personalized Welcome Banner Greeting */}
          {showWelcomeBanner && buyer && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#063b28] via-[#0b4d32] to-[#125e3d] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-[#1b4332] animate-fade-in">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-[#86af99]">
                  <span className="material-symbols-outlined text-[26px] text-[#c1ecd4]">verified</span>
                </div>
                <div>
                  <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                    <span>Welcome, {buyer.name}!</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                      Verified Buyer Terminal
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mt-0.5">
                    Your institutional procurement session is active. Live farmgate lots from 42 FPOs are authenticated with AGMARK Grade-1 assay reports.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Escrow Vault: {buyer.escrowBalance ? `₹${(buyer.escrowBalance / 100000).toFixed(1)}L` : 'Active'}
                </span>
                <button
                  onClick={() => setShowWelcomeBanner(false)}
                  className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                  title="Dismiss greeting banner"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center flex-wrap gap-2 text-[11px] text-[#3f6653] uppercase tracking-wider font-bold">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#c1ecd4]/80 text-[#002114]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1b4332] animate-pulse"></span>
                    <span>{timeSlot} • Rabi Procurement Active</span>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span>Central India Mandi Grid</span>
                </div>
                <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-[#131b2e] tracking-tight font-bold flex flex-wrap items-center gap-3 mt-1">
                  <span>{greeting}</span>, <span className="text-[#012d1d]">{buyer?.name || 'AgroCore Foods Ltd.'}</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f2f3ff] rounded-lg text-xs text-[#904d00] font-bold border border-[#dae2fd] shadow-xs">
                    <span className="material-symbols-outlined text-[16px] text-[#1b4332]">verified</span>
                    Tier-1 Institutional Buyer
                  </span>
                </h1>
                <p className="text-xs text-[#414844] mt-0.5">
                  Commercial Procurement Terminal • Direct farmgate batch allocation & instant escrow settlement
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-auto">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-xs border border-gray-200">
                <span className="material-symbols-outlined text-[20px] text-[#3f6653]">verified_user</span>
                <span className="text-xs font-bold text-[#131b2e]">✓ Escrow Protection Active</span>
              </div>
              <button
                onClick={() => {
                  if (crops.length > 0) onSelectCropForOrder(crops[0]);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-300"
              >
                <span className="material-symbols-outlined text-[18px]">add_task</span>
                <span>+ New Purchase Order</span>
              </button>
            </div>
          </div>

          {/* 4 Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Card 1: Escrow Vault */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#414844]">
                  Escrow Vault Balance
                </span>
                <span className="material-symbols-outlined text-[#1b4332] text-[20px]">account_balance_wallet</span>
              </div>
              <div className="mt-4">
                <div className="font-mono text-2xl lg:text-3xl font-bold text-[#1b4332] tracking-tight">
                  {formatCurrency(buyer?.escrowBalance || 4500000)}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-[#414844]">
                  <span className="material-symbols-outlined text-[16px] text-[#3f6653]">security</span>
                  <span>Held securely in ICICI escrow vault</span>
                </div>
              </div>
            </div>

            {/* Card 2: Active Orders */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#414844]">
                  Active Purchase Orders
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e2e7ff] text-[#131b2e]">
                  In Progress
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
                  {orders.length} Active
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-[#414844]">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#fe932c]"></span>
                  <span className="truncate">Wheat (Lokwan), Soybean (JS), Desi Chana</span>
                </div>
              </div>
            </div>

            {/* Card 3: Available Verified Lots */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#414844]">
                  Available Verified Lots
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eaedff] text-[#414844]">
                  Live Mandi Sync
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl lg:text-3xl font-bold text-[#131b2e] tracking-tight">
                  {crops.length * 24} Lots
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-[#414844]">
                  <span className="material-symbols-outlined text-[16px] text-[#3f6653]">warehouse</span>
                  <span>From 18 Verified Farmer Cooperatives</span>
                </div>
              </div>
            </div>

            {/* Card 4: Savings vs Middlemen */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff] flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#414844]">
                  Savings vs Middlemen
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c1ecd4]/80 text-[#002114]">
                  0% Extra Commission
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl lg:text-3xl font-bold text-[#1b4332] tracking-tight">
                  +12.4%
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-[#3f6653]">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>Saved approx ₹5,40,000 this quarter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Search & Comprehensive Filters Panel */}
      <section className="sticky top-20 z-40 w-full px-4 md:px-8 py-3 bg-[#faf8ff]/95 backdrop-blur-xl border-b border-[#eaedff] shadow-xs">
        <div className="max-w-[1600px] mx-auto space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                search
              </span>
              <input
                id="buyerSearchInput"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crop name, variety (e.g. Sharbati Wheat), farmer group, or district..."
                className="w-full h-11 pl-11 pr-4 bg-white text-[#131b2e] placeholder:text-gray-400 text-xs rounded-xl shadow-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1b4332]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                </button>
              )}
            </div>

            {/* Pickup toggle buttons */}
            <div className="flex items-center p-1 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] self-start md:self-auto">
              <button
                onClick={() => setPickupFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  pickupFilter === 'all'
                    ? 'bg-[#1b4332] text-white shadow-xs'
                    : 'text-[#414844] hover:text-[#131b2e]'
                }`}
              >
                All Sellers
              </button>
              <button
                onClick={() => setPickupFilter('farmgate')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  pickupFilter === 'farmgate'
                    ? 'bg-[#1b4332] text-white shadow-xs'
                    : 'text-[#414844] hover:text-[#131b2e]'
                }`}
              >
                Direct from Farm
              </button>
              <button
                onClick={() => setPickupFilter('hub')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  pickupFilter === 'hub'
                    ? 'bg-[#1b4332] text-white shadow-xs'
                    : 'text-[#414844] hover:text-[#131b2e]'
                }`}
              >
                From Storage Hub
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white px-3 h-11 rounded-xl shadow-xs border border-gray-200">
              <span className="text-[11px] font-bold text-[#414844] uppercase whitespace-nowrap">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#1b4332] focus:outline-none cursor-pointer"
              >
                <option value="nearest">Nearest Distance</option>
                <option value="lowest_price">Lowest Price / Qtl</option>
                <option value="highest_assay">Highest Quality Score</option>
                <option value="largest_vol">Volume: Largest First</option>
              </select>
            </div>
          </div>

          {/* Commodity Category Pills & Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#414844] uppercase mr-1">Commodity:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold shadow-xs transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#1b4332] text-white'
                  : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] border border-gray-200'
              }`}
            >
              All Crops ({crops.length})
            </button>
            <button
              onClick={() => setSelectedCategory('wheat')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold shadow-xs transition-all ${
                selectedCategory === 'wheat'
                  ? 'bg-[#1b4332] text-white'
                  : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] border border-gray-200'
              }`}
            >
              Wheat (Sharbati)
            </button>
            <button
              onClick={() => setSelectedCategory('soybean')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold shadow-xs transition-all ${
                selectedCategory === 'soybean'
                  ? 'bg-[#1b4332] text-white'
                  : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] border border-gray-200'
              }`}
            >
              Yellow Soybean
            </button>
            <button
              onClick={() => setSelectedCategory('mustard')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold shadow-xs transition-all ${
                selectedCategory === 'mustard'
                  ? 'bg-[#1b4332] text-white'
                  : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] border border-gray-200'
              }`}
            >
              Mustard
            </button>
            <button
              onClick={() => setSelectedCategory('chana')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold shadow-xs transition-all ${
                selectedCategory === 'chana'
                  ? 'bg-[#1b4332] text-white'
                  : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] border border-gray-200'
              }`}
            >
              Chana / Chickpea
            </button>
            <button
              onClick={() => setSelectedCategory('cotton')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold shadow-xs transition-all ${
                selectedCategory === 'cotton'
                  ? 'bg-[#1b4332] text-white'
                  : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] border border-gray-200'
              }`}
            >
              Cotton
            </button>

            <div className="h-4 w-[1px] bg-gray-300 mx-1 hidden md:block"></div>

            {/* Extra Spec Toggles */}
            <button
              onClick={() => setFilterOrganic(!filterOrganic)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                filterOrganic
                  ? 'bg-[#1b4332] text-white shadow-xs'
                  : 'bg-[#c1ecd4]/80 text-[#002114] border border-[#1b4332]/20'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">eco</span>
              <span>Organic Certified</span>
            </button>
            <button
              onClick={() => setFilterGrade1(!filterGrade1)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                filterGrade1
                  ? 'bg-[#1b4332] text-white shadow-xs'
                  : 'bg-[#f2f3ff] text-[#414844] hover:bg-[#eaedff] border border-gray-200'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>Grade-1 Quality</span>
            </button>
            <button
              onClick={() => setFilterLowMoisture(!filterLowMoisture)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                filterLowMoisture
                  ? 'bg-[#1b4332] text-white shadow-xs'
                  : 'bg-[#f2f3ff] text-[#414844] hover:bg-[#eaedff] border border-gray-200'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">water_drop</span>
              <span>Moisture &lt; 10%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dual Column Layout Area */}
      <div className="w-full px-4 md:px-8 py-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left 8 Columns: Available Crop Batches */}
            <section className="xl:col-span-8 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-[#eaedff]">
                <div>
                  <span className="font-headline text-lg font-bold text-[#131b2e]">
                    Available Crop Batches
                  </span>
                  <span className="ml-2 text-xs font-bold text-[#3f6653]">
                    (Showing {filteredCrops.length} priority listings of {crops.length * 8})
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#414844]">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#1b4332]"></span>
                    Lab Tested & Weight Verified
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#fe932c]"></span>
                    Ready to Ship
                  </span>
                </div>
              </div>

              {filteredCrops.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 space-y-3">
                  <span className="material-symbols-outlined text-[48px] text-gray-300">search_off</span>
                  <h3 className="font-bold text-base text-[#131b2e]">No matching crop batches found</h3>
                  <p className="text-xs text-gray-500">
                    Try broadening your filters, resetting the search query, or selecting "All Crops".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setPickupFilter('all');
                      setFilterOrganic(false);
                      setFilterGrade1(false);
                      setFilterLowMoisture(false);
                    }}
                    className="px-4 py-2 bg-[#1b4332] text-white text-xs font-bold rounded-xl"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="cardsGrid">
                  {filteredCrops.map((crop) => (
                    <article
                      key={crop.id}
                      className="bg-white rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 border border-[#eaedff] flex flex-col overflow-hidden group"
                    >
                      {/* Image Header with Badges */}
                      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                        <img
                          src={crop.imageUrl}
                          alt={crop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#012d1d]/85 via-transparent to-transparent"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-sm text-[#012d1d] shadow-xs">
                            {crop.certBadge}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/90 backdrop-blur-sm text-[#131b2e]">
                            {crop.moistureBadge}
                          </span>
                        </div>

                        {/* Bottom Image Overlay */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                          <div className="flex items-center gap-1 text-xs">
                            <span className="material-symbols-outlined text-[16px] text-[#ffdcc3]">pin_drop</span>
                            <span className="truncate">{crop.distanceKm} km away • {crop.location}</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdcc3] text-[#2f1500] whitespace-nowrap">
                            {crop.sourceLabel}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="font-headline text-base font-bold text-[#131b2e] leading-snug">
                            {crop.title}
                          </h3>
                          <p className="text-xs text-[#414844] mt-1">
                            By <span className="font-semibold text-[#131b2e]">{crop.farmerName}</span> ({crop.fpoName})
                          </p>

                          {/* 2-Column Specs Grid */}
                          <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-[#f2f3ff]/80 rounded-xl font-mono text-xs">
                            <div className="p-1">
                              <span className="text-gray-500 text-[10px] uppercase block mb-0.5">
                                Batch Quantity
                              </span>
                              <span className="font-bold text-[#131b2e]">
                                {crop.batchQuantityQtl} Qtl ({(crop.batchQuantityQtl / 10).toFixed(0)} MT)
                              </span>
                            </div>
                            <div className="p-1">
                              <span className="text-gray-500 text-[10px] uppercase block mb-0.5">
                                {crop.keyMetricLabel}
                              </span>
                              <span className="font-bold text-[#1b4332]">
                                {crop.keyMetricValue}
                              </span>
                            </div>
                          </div>

                          {/* Price & Mandi Rate Row */}
                          <div className="mt-3 flex items-baseline justify-between border-t border-gray-100 pt-3">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-gray-500 block">
                                Price Per Quintal
                              </span>
                              <div className="font-headline text-2xl font-mono font-bold text-[#1b4332]">
                                ₹{crop.pricePerQtl.toLocaleString()}
                                <span className="text-xs font-normal text-gray-500">/Qtl</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#eaedff] text-[#3f6653]">
                                Mandi Rate: ₹{crop.mandiRate.toLocaleString()} ({crop.premiumText})
                              </span>
                              <span className="block text-[11px] text-gray-500 mt-1 font-mono">
                                Est. Lot: ₹{(crop.batchQuantityQtl * crop.pricePerQtl).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Working Interactive Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => onCallFarmer(crop)}
                            className="w-full h-11 px-2 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-[#dae2fd]"
                          >
                            <span className="material-symbols-outlined text-[18px]">call</span>
                            <span className="truncate">Call Farmer / FPO</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectCropForOrder(crop)}
                            className="w-full h-11 px-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">lock</span>
                            <span className="truncate">Buy Now (Lock Payment)</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Listings update banner and pagination */}
              <div className="p-4 bg-[#f2f3ff]/80 rounded-xl border border-[#dae2fd] flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
                <div className="flex items-center gap-2 text-xs text-[#414844]">
                  <span className="material-symbols-outlined text-[18px] text-[#1b4332]">sync_saved_locally</span>
                  <span>Listings update every 15 minutes upon digital weighbridge confirmation.</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="px-3 py-1 rounded-lg bg-white text-xs font-bold text-[#131b2e] shadow-xs border border-gray-200">
                    1
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-transparent text-xs text-[#414844] hover:text-[#131b2e]">
                    2
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-transparent text-xs text-[#414844] hover:text-[#131b2e]">
                    3
                  </button>
                  <span className="text-gray-400 px-1 text-xs">...</span>
                  <button className="px-3 py-1 rounded-lg bg-transparent text-xs text-[#414844] hover:text-[#131b2e]">
                    8
                  </button>
                </div>
              </div>
            </section>

            {/* Right 4 Columns: Mandi Prices, Calculator, Safe Purchase */}
            <aside className="xl:col-span-4 space-y-6">
              {/* Today's Mandi Prices */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff]">
                <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[22px] text-[#904d00]">bar_chart</span>
                    <div>
                      <h2 className="font-headline text-base font-bold text-[#131b2e] leading-tight">
                        Today's Mandi Prices
                      </h2>
                      <p className="text-[11px] text-[#414844] mt-0.5">Official Govt APMC Rates</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#c1ecd4]/80 text-[#002114] rounded-full text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1b4332] animate-pulse"></span>
                    Updated 8m ago
                  </span>
                </div>

                <div className="divide-y divide-gray-100 mt-2">
                  {mandiPrices.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#131b2e]">{item.crop}</div>
                        <div className="text-[11px] text-[#414844]">{item.mandiName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-[#131b2e]">
                          ₹{item.ratePerQtl.toLocaleString()}/Qtl
                        </div>
                        <div
                          className={`flex items-center justify-end gap-0.5 font-mono text-[11px] font-bold ${
                            item.trend === 'up' ? 'text-[#1b4332]' : 'text-red-600'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {item.trend === 'up' ? 'arrow_drop_up' : 'arrow_drop_down'}
                          </span>
                          <span>{item.trend === 'up' ? '+' : ''}{item.changePct}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Platform Savings Spread Graph */}
                <div className="mt-4 p-3 bg-[#f2f3ff] rounded-xl border border-[#dae2fd]">
                  <div className="flex items-center justify-between text-[11px] text-[#414844] mb-1">
                    <span className="font-bold text-[#131b2e]">Platform Savings Spread</span>
                    <span className="font-bold text-[#1b4332]">Avg ₹120–₹210 / Qtl saved</span>
                  </div>
                  <svg className="w-full h-10 mt-1" viewBox="0 0 300 40" fill="none">
                    <rect x="10" y="14" width="28" height="22" rx="3" fill="#1b4332" opacity="0.7"></rect>
                    <rect x="50" y="8" width="28" height="28" rx="3" fill="#1b4332" opacity="0.85"></rect>
                    <rect x="90" y="20" width="28" height="16" rx="3" fill="#fe932c"></rect>
                    <rect x="130" y="10" width="28" height="26" rx="3" fill="#1b4332" opacity="0.8"></rect>
                    <rect x="170" y="16" width="28" height="20" rx="3" fill="#1b4332" opacity="0.65"></rect>
                    <rect x="210" y="6" width="28" height="30" rx="3" fill="#1b4332" opacity="0.9"></rect>
                    <rect x="250" y="12" width="28" height="24" rx="3" fill="#1b4332" opacity="0.75"></rect>
                    <line x1="0" y1="36" x2="300" y2="36" stroke="#c1c8c2" strokeWidth="1"></line>
                  </svg>
                </div>
              </div>

              {/* Price & Cost Calculator */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[22px] text-[#3f6653]">calculate</span>
                  <h3 className="font-headline text-base font-bold text-[#131b2e]">
                    Price & Cost Calculator
                  </h3>
                </div>
                <p className="text-xs text-[#414844] mb-4">
                  Direct farmer purchase with 0% middleman cut and instant same-day payout.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#414844] mb-1.5">
                      Select Crop
                    </label>
                    <select
                      value={calcCropRate}
                      onChange={(e) => {
                        const rate = Number(e.target.value);
                        setCalcCropRate(rate);
                        if (rate === 2420) {
                          setCalcCropTitle('Sharbati Wheat (C-306)');
                          setCalcCropCategory('wheat');
                        } else if (rate === 5480) {
                          setCalcCropTitle('Organic Desi Chana (JG-11)');
                          setCalcCropCategory('chana');
                        } else if (rate === 4710) {
                          setCalcCropTitle('Yellow Soybean (JS-9560)');
                          setCalcCropCategory('soybean');
                        } else if (rate === 7800) {
                          setCalcCropTitle('Dollar Kabuli Chana');
                          setCalcCropCategory('chana');
                        } else {
                          setCalcCropTitle('Pusa Bold Mustard');
                          setCalcCropCategory('mustard');
                        }
                      }}
                      className="w-full h-11 px-3 bg-[#f2f3ff] text-xs font-semibold text-[#131b2e] rounded-xl border border-[#dae2fd] focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                    >
                      <option value="2420">Sharbati Wheat (₹2,420 / Qtl)</option>
                      <option value="5480">Organic Desi Chana (₹5,480 / Qtl)</option>
                      <option value="4710">Yellow Soybean JS-9560 (₹4,710 / Qtl)</option>
                      <option value="7800">Dollar Kabuli Chana (₹7,800 / Qtl)</option>
                      <option value="5450">Pusa Bold Mustard (₹5,450 / Qtl)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold uppercase text-[#414844]">
                        Quantity (Quintals)
                      </label>
                      <span className="font-mono text-xs font-bold text-[#1b4332]">
                        {calcQuantity} Qtl ({(calcQuantity / 10).toFixed(0)} MT)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="1000"
                      step="10"
                      value={calcQuantity}
                      onChange={(e) => setCalcQuantity(Number(e.target.value))}
                      className="w-full accent-[#1b4332] cursor-pointer h-2 bg-gray-200 rounded-lg"
                    />
                  </div>

                  {/* Computed values */}
                  <div className="p-3.5 bg-[#f2f3ff] rounded-xl space-y-2 border border-[#dae2fd] text-xs">
                    <div className="flex items-center justify-between text-[#414844]">
                      <span>Crop Value:</span>
                      <span className="font-mono font-bold text-[#131b2e]">{formatCurrency(calcGross)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#1b4332]">
                      <span>Platform Fee (0%):</span>
                      <span className="font-mono font-bold">₹0.00</span>
                    </div>
                    <div className="flex items-center justify-between text-[#414844]">
                      <span>Mandi Tax & Market Fee (1.5%):</span>
                      <span className="font-mono font-bold text-[#131b2e]">{formatCurrency(calcCess)}</span>
                    </div>
                    <div className="border-t border-[#dae2fd] pt-2 flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase text-[#131b2e] block">
                          Total Payment to Deposit
                        </span>
                        <span className="text-[10px] text-gray-500">Instant RTGS / Linked Mandate</span>
                      </div>
                      <div className="font-headline text-lg font-mono font-bold text-[#1b4332]">
                        {formatCurrency(calcTotal)}
                      </div>
                    </div>
                  </div>

                  {/* Reserve Batch with Escrow Button */}
                  <button
                    onClick={() => {
                      // Find matching crop or first crop
                      const match = crops.find(c => c.pricePerQtl === calcCropRate) || crops[0];
                      onSelectCropForOrder(match, calcQuantity);
                    }}
                    className="w-full h-11 bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Reserve Batch with Direct Escrow</span>
                  </button>
                </div>
              </div>

              {/* Safe Purchase Guarantee */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#eaedff] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[22px] text-[#3f6653]">local_shipping</span>
                  <h4 className="font-headline text-base font-bold text-[#131b2e]">
                    Safe Purchase Guarantee
                  </h4>
                </div>
                <p className="text-xs text-[#414844] leading-relaxed">
                  Every purchase is protected by end-to-end digital tracking, verified weighing, and escrow security.
                </p>

                <ul className="space-y-2 text-xs text-[#131b2e]">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#3f6653] text-[16px] flex-shrink-0 mt-0.5">check_circle</span>
                    <span>Automated e-Way bills and digital transit passes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#3f6653] text-[16px] flex-shrink-0 mt-0.5">check_circle</span>
                    <span>Accurate digital weighbridge verification at farm & mill</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#3f6653] text-[16px] flex-shrink-0 mt-0.5">check_circle</span>
                    <span>Lab-tested moisture & grade verification with no arbitrary cuts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#3f6653] text-[16px] flex-shrink-0 mt-0.5">check_circle</span>
                    <span>Zero commission or middleman markups</span>
                  </li>
                </ul>

                <div className="p-3.5 bg-[#012d1d] text-white rounded-xl flex items-center justify-between mt-2">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#86af99]">Toll-Free Support Desk</div>
                    <div className="font-mono text-base font-bold">1800-419-AGRI</div>
                  </div>
                  <a
                    href="tel:18004192474"
                    className="px-3 py-1.5 bg-white text-[#012d1d] text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs hover:bg-gray-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">support_agent</span>
                    <span>24x7 Help</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
