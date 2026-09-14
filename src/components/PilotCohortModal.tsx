import React, { useState } from 'react';

interface PilotCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (fpoDetails: { fpoName: string; district: string; crops: string }) => void;
}

export const PilotCohortModal: React.FC<PilotCohortModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [fpoName, setFpoName] = useState('');
  const [district, setDistrict] = useState('');
  const [memberCount, setMemberCount] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [primaryCrop, setPrimaryCrop] = useState('');
  const [estimatedHarvestQtl, setEstimatedHarvestQtl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmitSuccess({
        fpoName: fpoName.trim() || 'Kisan Producer Collective',
        district: district.trim() || 'Mandi Terminal Hub',
        crops: primaryCrop || 'Durum Sharbati Wheat',
      });
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative animate-fade-in my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-[#c1ecd4] text-[#012d1d] rounded-full mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-[#012d1d]">
              Pilot Cohort Application Received!
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Our rural aggregation desk officer will inspect your FPO cluster details and contact <span className="font-semibold">{contactName || 'the coordinator'}</span> within 4 business hours to dispatch certified moisture calibration kits.
            </p>
            <div className="p-3 bg-[#f2f3ff] rounded-xl text-xs font-mono text-[#1b4332]">
              Registration Token: #PROCURE-{Math.floor(10000 + Math.random() * 90000)}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdcc3] text-[#904d00] text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>Direct Procurement Window</span>
              </div>
              <h2 className="font-headline text-2xl font-bold text-[#131b2e] pt-1">
                Apply for Direct Marketplace Access
              </h2>
              <p className="text-xs text-gray-500">
                Join 42+ verified FPOs accessing direct institutional millers with zero listing fees.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  FPO / Cooperative Society Name *
                </label>
                <input
                  type="text"
                  required
                  value={fpoName}
                  onChange={(e) => setFpoName(e.target.value)}
                  placeholder="e.g. Malwa Valley Farmer Producer Co."
                  className="w-full h-11 px-3.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    District & State *
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Indore, Madhya Pradesh"
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Active Farmer Members
                  </label>
                  <input
                    type="number"
                    value={memberCount}
                    onChange={(e) => setMemberCount(e.target.value)}
                    placeholder="e.g. 450"
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Primary Crop
                  </label>
                  <select
                    value={primaryCrop}
                    onChange={(e) => setPrimaryCrop(e.target.value)}
                    className="w-full h-11 px-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332] bg-white"
                  >
                    <option value="">Select Primary Crop</option>
                    <option value="Durum Sharbati Wheat">Durum Sharbati Wheat</option>
                    <option value="Yellow Soybean (JS-9560)">Yellow Soybean (JS-9560)</option>
                    <option value="Desi Chana (JG-11)">Desi Chana (JG-11)</option>
                    <option value="Mustard Seed (Pusa Bold)">Mustard Seed (Pusa Bold)</option>
                    <option value="Cotton (Medium Staple)">Cotton (Medium Staple)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Expected Lot Size (Quintals)
                  </label>
                  <input
                    type="number"
                    value={estimatedHarvestQtl}
                    onChange={(e) => setEstimatedHarvestQtl(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Coordinator Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Rameshwar Patel"
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Contact Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXX-XXXXX"
                    className="w-full h-11 px-3.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#e8f5e9] rounded-xl text-xs text-[#1b4332] flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5">verified_user</span>
                <span>
                  <strong>Zero-Risk Guarantee:</strong> Free onboarding, no hidden broker cuts, and fully e-NAM & APMC Model Act compliant.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#a35d1e] hover:bg-[#8e4e16] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
