import React from 'react';
import { CropLot } from '../types';

interface CallFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: CropLot | null;
}

export const CallFarmerModal: React.FC<CallFarmerModalProps> = ({
  isOpen,
  onClose,
  crop,
}) => {
  if (!isOpen || !crop) return null;

  const handleDial = () => {
    window.location.href = `tel:${crop.farmerPhone.replace(/[^0-9+]/g, '')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#eaedff] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1b4332] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#86af99] block mb-1">
            Verified Farmgate Direct Line
          </span>
          <h2 className="font-headline text-2xl font-bold">
            Connect with Farmer / FPO
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            Discuss lot samples, customized bagging, or scheduled dispatch timings.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3.5 bg-[#f2f3ff] rounded-xl border border-[#dae2fd]">
            <div className="w-12 h-12 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              {crop.farmerName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-[#131b2e] truncate">{crop.farmerName}</h3>
                <span className="material-symbols-outlined text-[#1b4332] text-[16px]">verified</span>
              </div>
              <p className="text-xs text-[#414844] truncate">{crop.fpoName}</p>
              <span className="text-[11px] text-[#904d00] font-semibold block mt-0.5">
                📍 {crop.location} ({crop.distanceKm} km away)
              </span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-gray-200 text-center space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Direct Contact Number
            </span>
            <div className="font-mono text-xl font-bold text-[#1b4332]">
              {crop.farmerPhone}
            </div>
            <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full inline-block">
              ● Active on Mandi Grid • Ready to Answer
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleDial}
              className="w-full h-11 bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span>Call Direct Phone Line</span>
            </button>

            <button
              onClick={() => {
                alert(`Opening WhatsApp Chat with ${crop.farmerName} (${crop.farmerPhone}) for lot inquiry on ${crop.title}`);
                onClose();
              }}
              className="w-full h-11 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Message on WhatsApp</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
          AgriTrade Nexus connects buyers and farmers directly with zero brokerage fee.
        </div>
      </div>
    </div>
  );
};
