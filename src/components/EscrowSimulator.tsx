import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audioAssistant } from '../utils/audioAssistant';
import { useLanguage } from '../i18n';

interface EscrowSimulatorProps {
  initialLotValue?: number;
}

export const EscrowSimulator: React.FC<EscrowSimulatorProps> = ({
  initialLotValue = 726000,
}) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [grossWeight] = useState<number>(44200);
  const [tareWeight] = useState<number>(14200);
  const netWeight = grossWeight - tareWeight;
  const [escrowRef] = useState<string>('ESC-ICICI-882194');

  // Automatic progression when simulation is playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStep < 4) {
          setCurrentStep((prev) => prev + 1);
          audioAssistant.playChime('click');
        } else {
          setIsPlaying(false);
          audioAssistant.playChime('success');
        }
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  const handleStartSimulation = () => {
    setCurrentStep(1);
    setIsPlaying(true);
    audioAssistant.playChime('click');
  };

  const handleSelectStep = (step: number) => {
    setIsPlaying(false);
    setCurrentStep(step);
    audioAssistant.playChime('click');
  };

  const stepsData = [
    {
      step: 1,
      name: 'Pre-Funding Lock',
      badge: 'ICICI BANK ESCROW',
      icon: 'shield_lock',
      title: 'Institutional Pre-Funding in Custodial Vault',
      desc: 'Buyer transfers 100% of contracted lot funds into a scheduled commercial bank escrow account prior to dispatch. Funds cannot be canceled or diverted while transit is active.',
      meta: 'Protected against buyer default or deferred payments.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop',
      accentColor: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    },
    {
      step: 2,
      name: 'Transit & GPS Pass',
      badge: 'QR E-WAY BILL',
      icon: 'local_shipping',
      title: 'Digital Transit Pass & GPS Gate-Out',
      desc: 'FPO hub scans lot QR to generate official e-Way bill and gate-out pass. Carrier vehicle MP-09-HH-3901 assigned with GPS geofencing telemetry.',
      meta: 'Automated digital cargo tagging prevents en-route diversion.',
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=600&auto=format&fit=crop',
      accentColor: 'text-blue-700 bg-blue-50 border-blue-300',
    },
    {
      step: 3,
      name: 'Weighbridge Telemetry',
      badge: 'IOT SENSOR SYNC',
      icon: 'scale',
      title: 'Electronic Weighbridge Automated Sync',
      desc: 'Truck rolls onto certified electronic weighbridge. Gross weight (44,200 kg) and Tare weight (14,200 kg) sync directly into system without operator tampering.',
      meta: 'Eliminates traditional 3–5% visual katauti haircuts completely.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop',
      accentColor: 'text-amber-700 bg-amber-50 border-amber-300',
    },
    {
      step: 4,
      name: 'RTGS Settlement',
      badge: 'SAME-DAY SETTLEMENT',
      icon: 'payments',
      title: 'Automated RTGS Disbursement to FPO',
      desc: 'Weighbridge net weight matches contract assay. System immediately triggers automated bank settlement release directly into the FPO bank account.',
      meta: 'Full payment realized within minutes of gate weighment.',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
      accentColor: 'text-emerald-800 bg-emerald-100 border-emerald-400',
    },
  ];

  return (
    <div className="w-full bg-white border border-emerald-800/15 rounded-3xl p-5 sm:p-8 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold uppercase tracking-wider mb-2 border border-teal-200">
            <span className="material-symbols-outlined text-[15px] text-teal-700">lock_reset</span>
            <span>AUTOMATED ZERO-DEFAULT SETTLEMENT ARCHITECTURE</span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#131b2e] leading-tight">
            Interactive Escrow Lifecycle Simulator
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            See step-by-step how funds flow securely from institutional pre-deposit to digital weighbridge verification and same-day RTGS credit.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartSimulation}
          disabled={isPlaying}
          className="h-11 px-5 bg-[#063b28] hover:bg-[#0b4d32] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all btn-press self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isPlaying ? 'sync' : 'play_circle'}
          </span>
          <span>{isPlaying ? `Running Stage ${currentStep} of 4...` : '▶ Run Live Escrow Simulation'}</span>
        </button>
      </div>

      {/* Progress Track spanning all 4 steps */}
      <div className="relative mt-6 mb-3">
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#063b28] via-[#a35d1e] to-emerald-500 rounded-full"
            initial={false}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* 4 Step Timeline Header Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {stepsData.map((item) => {
          const isActive = currentStep === item.step;
          const isCompleted = currentStep > item.step;
          return (
            <button
              key={item.step}
              onClick={() => handleSelectStep(item.step)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-emerald-50/90 border-[#063b28] shadow-xs ring-2 ring-[#063b28]/25'
                  : isCompleted
                  ? 'bg-gray-50/90 border-gray-300 text-gray-700'
                  : 'bg-white border-gray-200 text-gray-400 hover:border-emerald-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeEscrowStepIndicator"
                  className="absolute top-0 left-0 right-0 h-1 bg-[#063b28]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                    isActive
                      ? 'bg-[#063b28] text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? '✓' : `0${item.step}`}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                  {item.badge}
                </span>
              </div>
              <p
                className={`font-bold text-xs leading-snug transition-colors ${
                  isActive ? 'text-[#063b28]' : 'text-gray-800'
                }`}
              >
                {item.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Simulation Sandbox Canvas */}
      <div className="bg-[#f7faf7] rounded-2xl p-5 sm:p-7 border border-emerald-900/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 7 Columns: Active Stage Graphic, Photo & Explainer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#063b28] text-white text-[11px] font-bold uppercase tracking-wider">
              STAGE 0{currentStep}
            </span>
            <span className="text-xs font-bold text-[#a35d1e] uppercase tracking-wider">
              {stepsData[currentStep - 1].badge}
            </span>
          </div>

          <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#131b2e]">
            {stepsData[currentStep - 1].title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-4 h-28 rounded-xl overflow-hidden border border-gray-200 shadow-2xs">
              <img
                src={stepsData[currentStep - 1].image}
                alt={stepsData[currentStep - 1].title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="sm:col-span-8">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {stepsData[currentStep - 1].desc}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-gray-200 text-xs text-gray-600 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-emerald-700 text-[18px] flex-shrink-0 mt-0.5">
              verified
            </span>
            <span>{stepsData[currentStep - 1].meta}</span>
          </div>

          {/* Step navigation dots */}
          <div className="flex items-center gap-2 pt-1">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => handleSelectStep(s)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === s ? 'w-8 bg-[#063b28]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                title={`Jump to step ${s}`}
              />
            ))}
          </div>
        </div>

        {/* Right 5 Columns: Dynamic Interactive Telemetry Ledger */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm font-mono text-xs space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-700 font-bold">
              <span className="material-symbols-outlined text-emerald-700 text-[18px]">terminal</span>
              <span>ESCROW TELEMETRY FEED</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">
              LIVE SYNC
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-400">Vault Reference:</span>
              <span className="font-bold text-gray-900">{escrowRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Contracted Value:</span>
              <span className="font-bold text-[#063b28]">₹{initialLotValue.toLocaleString('en-IN')}.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Assay Lot:</span>
              <span className="font-bold text-gray-900">300 Qtl (Sharbati C-306)</span>
            </div>

            {currentStep >= 2 && (
              <div className="flex justify-between border-t border-gray-100 pt-1.5 text-blue-700">
                <span>Vehicle Assigned:</span>
                <span className="font-bold">MP-09-HH-3901 (GPS PASS)</span>
              </div>
            )}

            {currentStep >= 3 && (
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 space-y-1 text-gray-800">
                <div className="flex justify-between text-[10px]">
                  <span>Gross Scale: {grossWeight.toLocaleString()} kg</span>
                  <span>Tare: {tareWeight.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>Net Weighment:</span>
                  <span>{(netWeight / 100).toFixed(1)} Quintals</span>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>SETTLEMENT COMPLETED</span>
                </div>
                <p className="text-[10px] text-emerald-800">
                  UTR: RTGS-SBIN9281740192 • ₹{initialLotValue.toLocaleString('en-IN')} released to Malwa Kisan Producer Co.
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
            <span>Security: 256-Bit Encrypted Mandate</span>
            <span className="font-bold text-[#063b28]">Zero Credit Loss</span>
          </div>
        </div>
      </div>
    </div>
  );
};

