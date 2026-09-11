import React, { useState } from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  onBrowseMarketplace: () => void;
  onOpenPilotCohort: () => void;
  onOpenAddProduce: () => void;
  onAcceptBidDemo?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onBrowseMarketplace,
  onOpenPilotCohort,
  onOpenAddProduce,
  onAcceptBidDemo,
}) => {
  // Interactive state for Mockups & Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeHighestBidAccepted, setActiveHighestBidAccepted] = useState(false);
  const [isCounterOfferOpen, setIsCounterOfferOpen] = useState(false);
  const [counterPrice, setCounterPrice] = useState('2430');
  const [counterSubmitted, setCounterSubmitted] = useState(false);

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
      question: 'How do you verify buyers are genuine and will actually pay?',
      answer:
        'Every corporate buyer and processing mill undergoes rigorous multi-tier credentialing including mandatory GSTIN cross-checks, corporate financial underwriting, FSSAI commodity licenses, and warehouse capacity verification. Most importantly, 100% of the contracted trade value must be pre-deposited and locked in our ICICI / State Bank tripartite escrow vault before the FPO is authorized to dispatch trucks. Funds cannot be recalled by the buyer while cargo is in transit.',
    },
    {
      question: "What happens if produce quality doesn't match what was listed?",
      answer:
        'Before broadcast, every lot receives a standardized digital assay certificate (moisture, foreign matter, admixture, and grain hardness) recorded with calibrated equipment at the FPO aggregation center. When the truck arrives at the buyer mill, digital weighbridge integration verifies the exact same AGMARK parameters. If variance exceeds statutory tolerance (±0.5%), a designated independent dispute officer is assigned within 2 hours under standardized contractual dispute protocols.',
    },
    {
      question: 'Do I need a smartphone or continuous internet connection to use this?',
      answer:
        'No continuous internet or high-end smartphone is required for individual farmers. FPO cluster managers, aggregation center operators, and field coordinators manage digital lot entry, weighbridge slip generation, and telemetry at the village hub. Individual farmers receive automated real-time SMS dispatch, weight confirmation, and bank credit notifications on basic feature phones in Hindi, Punjabi, and Marathi.',
    },
    {
      question: 'How is this different from selling through my local mandi or existing dealer?',
      answer:
        'In traditional mandis, farmers lose 15–20% of their realization through compounding middleman commission cuts (arhtiyas), handling fees, delayed informal payment books (4–7 days or longer), and arbitrary visual "katauti" (weight deductions without lab proof). AgriTrade Nexus bypasses intermediaries entirely: institutional buyers submit firm competitive bids directly to FPOs, payment is settled via RTGS within 24 hours of weighment, and quality is validated scientifically.',
    },
    {
      question: 'Is there a fee for farmers to list their produce?',
      answer:
        'Listing and selling produce on AgriTrade Nexus is 100% free for farmers and certified FPOs during the pilot and ongoing operational phases. There are zero listing fees, zero membership dues, and zero commission deductions from farmer payouts. The digital infrastructure and escrow banking protocols are funded entirely by institutional buyers and commercial food processors through a nominal platform facilitation fee.',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center bg-[#faf8ff] text-[#131b2e]">
      {/* 1. Hero Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-8 pb-12 bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto text-center flex flex-col items-center">
          {/* SCALE pill badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1f3f9] text-[#4b5563] text-[11px] font-bold uppercase tracking-wider mb-5 border border-gray-200 shadow-xs">
            <span className="material-symbols-outlined text-[15px] text-[#4b5563]">verified</span>
            <span>SCALE</span>
          </div>

          {/* Main Title */}
          <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#131b2e] tracking-tight leading-[1.15] max-w-4xl">
            Sell Direct. Earn More.<br />
            <span className="text-[#a35d1e]">No Middlemen</span> Between Your Harvest and the Buyer.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            List your harvest, get verified bulk buyer offers within 24 hours, and receive guaranteed escrow payouts upon certified digital weighment.
          </p>

          {/* Dual Action Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            {/* Farmer Button */}
            <button
              id="farmerHeroBtn"
              onClick={() => onSelectRole('farmer')}
              className="w-full sm:w-auto flex-1 h-12 px-6 bg-[#063b28] hover:bg-[#0a4d35] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">agriculture</span>
              <span>I'm a Farmer / FPO</span>
            </button>

            {/* Buyer Button */}
            <button
              id="buyerHeroBtn"
              onClick={() => onSelectRole('buyer')}
              className="w-full sm:w-auto flex-1 h-12 px-6 bg-white hover:bg-gray-50 border border-dashed border-blue-400/90 hover:border-blue-600 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[20px] text-gray-700">storefront</span>
              <span>I'm a Verified Buyer</span>
            </button>
          </div>

          {/* Split Screen Photographic Comparison Card */}
          <div className="mt-10 w-full max-w-5xl rounded-2xl overflow-hidden border border-gray-300 shadow-md relative group">
            <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[340px] sm:min-h-[420px] relative">
              {/* Left Half: Farmgate Wheat Harvest */}
              <div className="relative h-64 sm:h-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop"
                  alt="Farmer harvesting golden wheat field with tractor and jute bags"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />
              </div>

              {/* Vertical Divider for Split Screen (Desktop) */}
              <div className="hidden sm:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/70 z-10 -ml-[1px] shadow-sm"></div>

              {/* Right Half: Industrial Warehouse Logistics */}
              <div className="relative h-64 sm:h-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop"
                  alt="Modern industrial logistics dock with transport trucks, pallets and weighbridge"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:hidden" />
              </div>
            </div>

            {/* Bottom Gradient Bar Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#021f15]/90 via-[#021f15]/75 to-transparent px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 z-20">
              <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-semibold">
                <span className="material-symbols-outlined text-[18px] text-[#86af99]">sync_alt</span>
                <span>Connecting FPO Farmgates directly to Industrial Weighbridges & Processing Mills</span>
              </div>
              <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded border border-white/20 text-white text-[10px] font-bold tracking-wider uppercase">
                ZERO INTERMEDIARY LEAKAGE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Pilot Metrics Cards */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-[#faf8ff]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col items-center text-center">
            <span className="text-3xl font-extrabold text-[#131b2e]">42 FPOs</span>
            <span className="text-xs font-semibold text-gray-600 mt-1">
              Onboarded across 6 agro-climatic clusters
            </span>
            <span className="text-[10px] font-bold text-[#a35d1e] uppercase tracking-wider mt-2">
              (PILOT DATA)
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col items-center text-center">
            <span className="text-3xl font-extrabold text-[#131b2e]">18,450 Quintals</span>
            <span className="text-xs font-semibold text-gray-600 mt-1">
              Aggregated produce listed & traded
            </span>
            <span className="text-[10px] font-bold text-[#a35d1e] uppercase tracking-wider mt-2">
              (PILOT DATA)
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col items-center text-center">
            <span className="text-3xl font-extrabold text-[#131b2e]">+14.8% Higher</span>
            <span className="text-xs font-semibold text-gray-600 mt-1">
              Average price realization vs local mandi
            </span>
            <span className="text-[10px] font-bold text-[#a35d1e] uppercase tracking-wider mt-2">
              (PILOT DATA)
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col items-center text-center">
            <span className="text-3xl font-extrabold text-[#131b2e]">&lt; 24 Hours</span>
            <span className="text-xs font-semibold text-gray-600 mt-1">
              Average time to first verified buyer bid
            </span>
            <span className="text-[10px] font-bold text-[#a35d1e] uppercase tracking-wider mt-2">
              (PILOT DATA)
            </span>
          </div>
        </div>
      </section>

      {/* 3. Section: "Why AgriTrade Nexus: Eliminating Structural Friction in Agricultural Procurement" */}
      <section
        id="trust-verification-section"
        className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-[#faf8ff] border-t border-gray-200"
      >
        <div className="max-w-[1200px] mx-auto text-center mb-12">
          <span className="text-xs font-bold text-[#a35d1e] uppercase tracking-widest">
            MARKET INEFFICIENCY OVERHAUL
          </span>
          <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-[#131b2e] mt-2 max-w-3xl mx-auto leading-tight">
            Why AgriTrade Nexus: Eliminating Structural Friction in Agricultural Procurement
          </h2>
          <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Compare the entrenched vulnerabilities of legacy mandi corridors against our transparent, bank-settled digital procurement network.
          </p>
        </div>

        {/* 2-Column Comparison Box */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Current Mandi System */}
          <div className="bg-[#fcf7f7] rounded-2xl p-6 sm:p-7 border border-red-100 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-red-200/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-[22px]">cancel</span>
                <h3 className="font-headline text-lg font-bold text-[#131b2e]">Current Mandi System</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold uppercase tracking-wider">
                STRUCTURAL FRICTION
              </span>
            </div>

            {/* Card 1 */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-red-100 shadow-xs">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-[24px] flex-shrink-0 mt-0.5">
                  trending_down
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#131b2e]">
                    15–20% Value Loss to Intermediary Margins
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Multi-tiered commission agents (arhtiyas) and unauthorized loaders dilute farmer realization while systematically inflating wholesale procurement expenses.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-red-100 shadow-xs">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-[24px] flex-shrink-0 mt-0.5">
                  event_busy
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#131b2e]">
                    4–7 Days Settlement Delays & Defaults
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Informal credit books leave FPOs and farmers vulnerable to deferred cash flows, uncollectible promissory notes, and post-weighment haircuts.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-red-100 shadow-xs">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-[24px] flex-shrink-0 mt-0.5">
                  balance
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#131b2e]">
                    Arbitrary Quality Deduction (Katauti)
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Subjective visual inspection at yard gates enforces unscientific 5-10% weight deductions with no calibrated moisture or foreign matter lab verification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Nexus Mechanism */}
          <div className="bg-[#f2f8f5] rounded-2xl p-6 sm:p-7 border border-[#c1ecd4] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#a8dfc1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#063b28] text-[22px]">verified</span>
                <h3 className="font-headline text-lg font-bold text-[#063b28]">Nexus Mechanism</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#063b28] text-white text-[10px] font-extrabold uppercase tracking-wider">
                AUTOMATED TRUST
              </span>
            </div>

            {/* Card 1 */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-green-100 shadow-xs">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#063b28] text-[24px] flex-shrink-0 mt-0.5">
                  account_balance
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#131b2e]">
                    Direct Farmgate-to-Factory Bidding
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Firm digital counter-offers from vetted food processors, flour millers, and FMCG exporters bypass local monopolized yard cartels completely.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-green-100 shadow-xs">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#063b28] text-[24px] flex-shrink-0 mt-0.5">
                  lock
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#131b2e]">
                    Guaranteed Escrow Settlement in 24h
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Buyer capital is locked in tripartite bank escrow prior to truck departure and disbursed immediately upon digital weighbridge slip generation.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-green-100 shadow-xs">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#063b28] text-[24px] flex-shrink-0 mt-0.5">
                  science
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#131b2e]">
                    Standardized Assay & Digital QA
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Calibrated moisture testers and NIR refraction at aggregation hubs generate tamper-proof cryptographic lot certificates before dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: "Four Steps from Aggregation to Settlement" */}
      <section
        id="how-it-works-section"
        className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-white border-t border-gray-200"
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
          {/* STAGE 01: Left Text, Right Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-md bg-[#dcfce7] text-[#15803d] text-xs font-bold uppercase tracking-wider">
                STAGE 01
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

            {/* Stage 01 Mockup: Terminal Assay Mockup */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-xs">
                <span className="font-bold text-gray-500 tracking-wider uppercase">TERMINAL ASSAY MOCKUP</span>
                <span className="font-bold text-[#a35d1e]">LOT #WH-2025-089</span>
              </div>
              <div className="py-4 space-y-2.5 text-xs">
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
                  <span className="text-gray-500">FPO Origin Hub</span>
                  <span className="font-bold text-gray-900">Indore Farmers Fed Hub #4</span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="px-3 py-1.5 bg-[#063b28] text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                  <span>Assayed & Broadcasted</span>
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[11px] font-semibold flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  <span>12 Buyers Viewing</span>
                </span>
              </div>
            </div>
          </div>

          {/* STAGE 02: Left Mockup, Right Text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Stage 02 Mockup: Live Order Book Window */}
            <div className="order-2 lg:order-1 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-xs">
                <span className="font-bold text-gray-500 tracking-wider uppercase">LIVE ORDER BOOK WINDOW</span>
                <span className="font-bold text-red-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">timer</span>
                  <span>Closing in 02:44:19</span>
                </span>
              </div>

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
                  className={`flex-1 h-10 px-4 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 ${
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
                  className="px-4 h-10 bg-white hover:bg-gray-50 border border-gray-300 text-xs font-bold text-gray-700 rounded-xl"
                >
                  Submit Counter
                </button>
              </div>
            </div>

            {/* Stage 02 Text */}
            <div className="order-1 lg:order-2 space-y-4">
              <div className="inline-block px-3 py-1 rounded-md bg-[#dcfce7] text-[#15803d] text-xs font-bold uppercase tracking-wider">
                STAGE 02
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
          </div>

          {/* STAGE 03: Left Text, Right Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-md bg-[#dcfce7] text-[#15803d] text-xs font-bold uppercase tracking-wider">
                STAGE 03
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

            {/* Stage 03 Mockup: Escrow Pre-Fund Lock */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="p-4 bg-[#f0fdf4] rounded-xl border border-[#bbf7d0] flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#063b28] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">shield</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Escrow Pre-Fund Lock</h4>
                  <p className="text-[11px] font-mono text-gray-500">STATE BANK ESCROW TR-88190</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs py-2">
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

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-2 text-[11px] text-blue-900">
                <span className="material-symbols-outlined text-[16px] text-blue-700 flex-shrink-0">
                  verified_user
                </span>
                <span>Funds cannot be recalled by buyer while truck is in transit.</span>
              </div>
            </div>
          </div>

          {/* STAGE 04: Left Mockup, Right Text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Stage 04 Mockup: Live Dispatch & Telemetry */}
            <div className="order-2 lg:order-1 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-xs">
                <span className="font-bold text-gray-500 tracking-wider uppercase">LIVE DISPATCH & TELEMETRY</span>
                <span className="font-mono font-bold text-gray-900">TRUCK: MP-09-HH-3901</span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-gray-400 font-bold block">TRANSIT ROUTE</span>
                    <span className="font-bold text-gray-900">Indore Hub → Pithampur Plant #2</span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md text-[10px] font-bold">
                    At Weighbridge
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
                  <div className="bg-[#063b28] h-2 rounded-full w-[85%]"></div>
                </div>
              </div>

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

            {/* Stage 04 Text */}
            <div className="order-1 lg:order-2 space-y-4">
              <div className="inline-block px-3 py-1 rounded-md bg-[#dcfce7] text-[#15803d] text-xs font-bold uppercase tracking-wider">
                STAGE 04
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
          </div>
        </div>
      </section>

      {/* 5. Section: "ADVISORY & FIELD VALIDATION" */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-[#faf8ff] border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto text-center mb-14">
          <span className="text-xs font-bold text-[#a35d1e] uppercase tracking-widest">
            ADVISORY & FIELD VALIDATION
          </span>
          <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-[#131b2e] mt-2 max-w-2xl mx-auto leading-tight">
            Guided by Agricultural Economists & Supply Chain Leaders
          </h2>
          <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Validated through real pilot cohort deployments under the Smart India Hackathon agricultural exchange framework.
          </p>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-4xl font-serif text-[#a35d1e] font-extrabold block mb-3">”</span>
              <p className="text-xs text-gray-700 italic leading-relaxed">
                "The primary bottleneck in Indian agri-value chains is not harvest volume but information asymmetry during post-harvest aggregation. AgriTrade Nexus directly solves this."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                alt="Dr. Rameshwar Sharma"
                className="w-11 h-11 rounded-full object-cover border border-gray-200"
              />
              <div>
                <h4 className="text-xs font-bold text-gray-900">Dr. Rameshwar Sharma</h4>
                <p className="text-[11px] text-gray-500">Former NABARD Consultant, Agricultural Marketing Expert</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-4xl font-serif text-[#a35d1e] font-extrabold block mb-3">”</span>
              <p className="text-xs text-gray-700 italic leading-relaxed">
                "In our pilot lot of 40 quintals Sharbati wheat, direct buyer bidding fetched ₹2,340/quintal versus ₹1,980 at the district mandi, saving ₹14,400 in net deductions."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
                alt="Gurpreet Singh Mann"
                className="w-11 h-11 rounded-full object-cover border border-gray-200"
              />
              <div>
                <h4 className="text-xs font-bold text-gray-900">Gurpreet Singh Mann</h4>
                <p className="text-[11px] text-gray-500">Chief Coordinator, Malwa Farmers Producer Co. (850 Members)</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-4xl font-serif text-[#a35d1e] font-extrabold block mb-3">”</span>
              <p className="text-xs text-gray-700 italic leading-relaxed">
                "Standardized digital moisture assays reduce inbound quality rejections at our processing gates from 12% to under 1.5%. We can schedule logistics with total confidence."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
                alt="Sunita Deshmukh"
                className="w-11 h-11 rounded-full object-cover border border-gray-200"
              />
              <div>
                <h4 className="text-xs font-bold text-gray-900">Sunita Deshmukh</h4>
                <p className="text-[11px] text-gray-500">Procurement Lead, Sahyadri Agro-Processing Units</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Banner: "Join the Rabi 2025 Pilot Onboarding Cohort" */}
      <section className="w-full bg-[#063b28] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1000px] mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d97706] text-white text-[11px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span>RABI 2025 ALLOCATION • PRIORITY WINDOW OPEN</span>
          </div>

          <h2 className="font-headline text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Join the Rabi 2025 Pilot Onboarding Cohort
          </h2>

          <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Connect your harvest directly to guaranteed bulk procurement contracts without broker commissions, hidden discounts, or payment delays.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onOpenPilotCohort}
              className="h-12 px-7 bg-[#a35d1e] hover:bg-[#8e4e16] text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">assignment</span>
              <span>Apply for Pilot Cohort Access (Free for FPOs)</span>
            </button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-gray-300">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-400 text-[18px]">check_circle</span>
              <span>Zero listing fees during pilot phase</span>
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
        className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-white border-t border-gray-200"
      >
        <div className="max-w-[850px] mx-auto text-center mb-12">
          <span className="text-xs font-bold text-[#a35d1e] uppercase tracking-widest">
            DIRECT OPERATIONAL CLARITY
          </span>
          <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-[#131b2e] mt-2">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-gray-600 max-w-xl mx-auto">
            Transparent answers addressing risk mitigation, quality checks, technology access, and fee structures.
          </p>
        </div>

        <div className="max-w-[850px] mx-auto space-y-3">
          {faqItems.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 hover:bg-gray-50/70"
                >
                  <span>{faq.question}</span>
                  <span className="material-symbols-outlined text-gray-500 text-[20px] transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    keyboard_arrow_down
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-[#faf8ff]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
