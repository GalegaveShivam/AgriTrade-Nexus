import React from 'react';

interface WhyChooseUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreMarketplace?: () => void;
  onListProduce?: () => void;
}

export const WhyChooseUsModal: React.FC<WhyChooseUsModalProps> = ({
  isOpen,
  onClose,
  onExploreMarketplace,
  onListProduce,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#063b28] text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            <span>PROVEN VALUE PROPOSITION</span>
          </div>

          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Why You Choose AgriTrade Nexus
          </h2>
          <p className="text-gray-200 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
            Eliminating structural middleman friction, delayed payment cycles, and unscientific deductions in agricultural bulk commodity trade.
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#131b2e]">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[#f8f9fa] rounded-2xl border border-gray-200/80 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Broker Cut</p>
              <p className="font-headline text-xl sm:text-2xl font-extrabold text-[#063b28] mt-0.5">0%</p>
              <p className="text-[10px] text-gray-500">vs 5–8% legacy</p>
            </div>
            <div className="border-x border-gray-200">
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Settlement</p>
              <p className="font-headline text-xl sm:text-2xl font-extrabold text-[#063b28] mt-0.5">&lt; 24h</p>
              <p className="text-[10px] text-gray-500">Bank Escrow RTGS</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Assay Testing</p>
              <p className="font-headline text-xl sm:text-2xl font-extrabold text-[#063b28] mt-0.5">100%</p>
              <p className="text-[10px] text-gray-500">Calibrated Digital QA</p>
            </div>
          </div>

          {/* 4 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pillar 1 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:border-[#a8dfc1] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#063b28] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">money_off</span>
                </div>
                <div>
                  <h3 className="font-headline text-sm font-bold text-[#131b2e]">Zero Middleman Commissions</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Traditional APMC yards involve 2–3 layers of commission agents (kachha &amp; pukka arthiyas) taking 5–8% of trade value. Nexus is a direct farmgate-to-factory model with zero hidden commissions.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:border-[#a8dfc1] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#063b28] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">lock</span>
                </div>
                <div>
                  <h3 className="font-headline text-sm font-bold text-[#131b2e]">Tripartite Bank Escrow</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Buyer funds are safely locked in a designated escrow account prior to dispatch. Funds are automatically released via RTGS upon digital weighbridge confirmation, eliminating 45-day payment delays.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:border-[#a8dfc1] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#063b28] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">biotech</span>
                </div>
                <div>
                  <h3 className="font-headline text-sm font-bold text-[#131b2e]">Scientific Moisture &amp; Lab QA</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    No subjective eyeball assessments or arbitrary 5–10% weight deductions at the gate. Every lot has transparent digital lab assay certificates verifying moisture, protein, and foreign matter.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs hover:border-[#a8dfc1] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#063b28] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">query_stats</span>
                </div>
                <div>
                  <h3 className="font-headline text-sm font-bold text-[#131b2e]">Real-Time Mandi Benchmarks</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Direct synchronization with APMC Agmarknet price feeds across 45+ mandis allows both farmers and buyers to transact based on live, verified market indices instead of speculative whispers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Side by side comparison snippet */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden text-xs">
            <div className="grid grid-cols-2 bg-[#f4f5fa] border-b border-gray-200 p-3 font-bold text-[#131b2e]">
              <div className="flex items-center gap-1.5 text-red-700">
                <span className="material-symbols-outlined text-[16px]">close</span>
                <span>Traditional Mandi Yards</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#063b28]">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>AgriTrade Nexus</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              <div className="grid grid-cols-2 p-3 text-gray-600">
                <span>5% to 8% lost in multi-tier commissions</span>
                <span className="font-semibold text-emerald-800">0% broker commission on farmgate lots</span>
              </div>
              <div className="grid grid-cols-2 p-3 text-gray-600">
                <span>15 to 45 day delayed credit cycles</span>
                <span className="font-semibold text-emerald-800">&lt; 24h bank settlement through escrow</span>
              </div>
              <div className="grid grid-cols-2 p-3 text-gray-600">
                <span>Arbitrary physical weight cuts (5–10%)</span>
                <span className="font-semibold text-emerald-800">Calibrated digital moisture assay slips</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / CTAs */}
        <div className="p-5 sm:p-6 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            Trusted by 42+ verified FPOs and 1,800+ commercial food processors.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                if (onExploreMarketplace) onExploreMarketplace();
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 text-[#131b2e] font-bold rounded-xl text-xs transition-colors btn-press shadow-2xs"
            >
              Explore Marketplace
            </button>
            <button
              onClick={() => {
                onClose();
                if (onListProduce) onListProduce();
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#063b28] hover:bg-[#0b4d32] text-white font-bold rounded-xl text-xs transition-colors shadow-xs hover:shadow-sm btn-press btn-shine"
            >
              List Produce
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
