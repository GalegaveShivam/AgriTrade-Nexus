import React, { useState } from 'react';
import { CropLot } from '../types';
import { useLanguage } from '../i18n';
import { audioAssistant } from '../utils/audioAssistant';

interface AssayReportModalProps {
  crop: CropLot | null;
  isOpen: boolean;
  onClose: () => void;
  onBuyNow?: (crop: CropLot) => void;
}

export const AssayReportModal: React.FC<AssayReportModalProps> = ({
  crop,
  isOpen,
  onClose,
  onBuyNow,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'parameters' | 'sample' | 'certificate'>('parameters');
  const [sampleRequested, setSampleRequested] = useState<boolean>(false);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [isSubmittingSample, setIsSubmittingSample] = useState<boolean>(false);
  const [sampleTrackingId, setSampleTrackingId] = useState<string>('');

  if (!isOpen || !crop) return null;

  const handleRequestSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) return;
    setIsSubmittingSample(true);
    audioAssistant.playChime('click');

    setTimeout(() => {
      setIsSubmittingSample(false);
      setSampleRequested(true);
      setSampleTrackingId('SMPL-BLUEDART-' + Math.floor(100000 + Math.random() * 900000));
      audioAssistant.playChime('success');
    }, 800);
  };

  const handleDownloadCertificate = () => {
    audioAssistant.playChime('click');
    const element = document.createElement('a');
    const file = new Blob(
      [
        `===============================================================\n` +
        `       NATIONAL AGRI-ASSAY & NABL ACCREDITED LAB REPORT        \n` +
        `===============================================================\n` +
        `Report ID: NABL-AGRI-${crop.id.toUpperCase()}-2025\n` +
        `Date of Inspection: 12-September-2025\n` +
        `Accreditation: ISO/IEC 17025:2017 #TC-48291\n` +
        `Commodity: ${crop.title}\n` +
        `Origin FPO: ${crop.fpoName} (${crop.location})\n` +
        `Farmer: ${crop.farmerName}\n` +
        `Batch Quantity: ${crop.batchQuantityQtl} Quintals\n` +
        `Moisture Level: ${crop.moisturePct}%\n` +
        `Quality Grade: ${crop.qualityGrade}\n` +
        `Quality Score: ${crop.qualityScore}/100\n` +
        `Foreign Matter: 0.3% (Compliant)\n` +
        `Damaged Grains: 0.4% (Compliant)\n` +
        `Aflatoxin Residue: Non-Detected\n` +
        `Compliance Seal: AGMARK Grade-1 & FSSAI MRL Standards\n` +
        `===============================================================\n`
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `Assay_Certificate_${crop.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Ribbon Header */}
        <div className="bg-[#063b28] text-white px-6 py-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <span className="material-symbols-outlined text-[24px]">biotech</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
                  NABL ACCREDITED LAB #TC-48291
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  ISO/IEC 17025:2017
                </span>
              </div>
              <h2 className="font-headline text-lg sm:text-xl font-bold text-white mt-0.5">
                Digital Quality Assay &amp; Certificate of Analysis
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Sub-header with Crop summary & Tabs */}
        <div className="bg-[#f4f7f4] px-6 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={crop.imageUrl}
              alt={crop.title}
              className="w-12 h-12 rounded-xl object-cover border border-gray-300 flex-shrink-0"
            />
            <div>
              <h3 className="font-headline font-bold text-sm text-[#131b2e] leading-tight">
                {crop.title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Lot #{crop.id.toUpperCase()} • {crop.batchQuantityQtl} Qtl • {crop.fpoName} ({crop.location})
              </p>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('parameters')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'parameters'
                  ? 'bg-[#063b28] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Lab Parameters
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'certificate'
                  ? 'bg-[#063b28] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Assay Certificate
            </button>
            <button
              onClick={() => setActiveTab('sample')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'sample'
                  ? 'bg-[#a35d1e] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">local_shipping</span>
              <span>Courier 500g Sample</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'parameters' && (
            <div className="space-y-6">
              {/* Overall Score Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                    Assay Quality Score
                  </span>
                  <div className="font-headline text-2xl sm:text-3xl font-extrabold text-[#063b28] mt-0.5">
                    {crop.qualityScore} / 100
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                    AGMARK GRADE-1
                  </span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-gray-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    Calibrated Moisture
                  </span>
                  <div className="font-headline text-2xl sm:text-3xl font-mono font-extrabold text-[#063b28] mt-0.5">
                    {crop.moisturePct}%
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Safe &lt; 12.0%</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-gray-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    Foreign Matter
                  </span>
                  <div className="font-headline text-2xl sm:text-3xl font-mono font-extrabold text-[#131b2e] mt-0.5">
                    0.3%
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Pass (Limit 1.5%)</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-gray-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    Damaged Grains
                  </span>
                  <div className="font-headline text-2xl sm:text-3xl font-mono font-extrabold text-[#131b2e] mt-0.5">
                    0.4%
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">Pass (Limit 2.0%)</span>
                </div>
              </div>

              {/* Detailed Technical Parameters Table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h4 className="font-headline text-xs font-bold uppercase tracking-wider text-gray-700">
                    Comprehensive Laboratory Analysis (NABL TC-48291 Test Sheet)
                  </h4>
                  <span className="text-[11px] text-gray-500 font-mono">Sample ID: #SMP-9281-QC</span>
                </div>

                <div className="divide-y divide-gray-100 text-xs">
                  <div className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <span className="font-bold text-gray-900 block">Moisture Content (Digital Halogen Meter)</span>
                      <span className="text-[11px] text-gray-500">Method: ISO 712:2009 oven standard calibrated</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#063b28] text-sm">{crop.moisturePct}%</span>
                      <span className="block text-[10px] text-emerald-700 font-bold">✓ Optimum Dry Storage</span>
                    </div>
                  </div>

                  <div className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <span className="font-bold text-gray-900 block">Test Weight / Hectolitre (Hectoliter Mass)</span>
                      <span className="text-[11px] text-gray-500">Method: ISO 7971-3 / Kerley measure</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-gray-900 text-sm">81.4 kg/hl</span>
                      <span className="block text-[10px] text-emerald-700 font-bold">✓ High Flour/Extract Yield</span>
                    </div>
                  </div>

                  <div className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <span className="font-bold text-gray-900 block">Foreign Matter (Inorganic stones / dirt)</span>
                      <span className="text-[11px] text-gray-500">Separated via calibrated seed sieves</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-gray-900 text-sm">0.2%</span>
                      <span className="block text-[10px] text-emerald-700 font-bold">✓ Well below 0.5% ceiling</span>
                    </div>
                  </div>

                  <div className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <span className="font-bold text-gray-900 block">Crude Protein / Oil Content (Kjeldahl / NIR)</span>
                      <span className="text-[11px] text-gray-500">Tested on calibrated Foss Infratec instrument</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#063b28] text-sm">
                        {crop.cropCategory === 'mustard' ? '41.2% Oil' : crop.cropCategory === 'soybean' ? '39.8% Protein' : '13.6% Protein'}
                      </span>
                      <span className="block text-[10px] text-emerald-700 font-bold">✓ Premium Milling Grade</span>
                    </div>
                  </div>

                  <div className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <span className="font-bold text-gray-900 block">Aflatoxin &amp; Mycotoxin Contamination</span>
                      <span className="text-[11px] text-gray-500">HPLC method (B1, B2, G1, G2)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-700 text-sm">Non-Detected (&lt; 1 ppb)</span>
                      <span className="block text-[10px] text-emerald-700 font-bold">✓ Food Safety Passed</span>
                    </div>
                  </div>

                  <div className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <span className="font-bold text-gray-900 block">Pesticide Residue Screen</span>
                      <span className="text-[11px] text-gray-500">LC-MS/MS screen against 142 chemical compounds</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-700 text-sm">Zero Detectable Residues</span>
                      <span className="block text-[10px] text-emerald-700 font-bold">✓ Codex / FSSAI Compliant</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Attestation Box */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-emerald-300 flex items-center justify-center text-[#063b28] font-bold">
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Dr. Anand K. Varma, Chief Quality Officer</h5>
                    <p className="text-[11px] text-gray-600">
                      Central Agmark Assaying Laboratory, Western Agro Corridor
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadCertificate}
                  className="px-3.5 py-2 bg-white hover:bg-gray-50 text-[#063b28] border border-emerald-300 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs transition-all btn-press"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Download Signed PDF</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'certificate' && (
            <div className="p-6 bg-[#fffef9] border-2 border-emerald-900/20 rounded-2xl shadow-sm space-y-6 font-serif">
              {/* Certificate Header */}
              <div className="text-center border-b border-gray-300 pb-5">
                <div className="inline-block px-3 py-1 rounded bg-[#063b28] text-white font-sans text-[10px] font-bold uppercase tracking-widest mb-2">
                  OFFICIAL AGMARK &amp; NABL CERTIFICATE OF QUALITY
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Certificate of Conformity &amp; Assay Analysis
                </h3>
                <p className="text-xs text-gray-600 font-sans mt-1">
                  Issued under the National Agricultural Quality Standards Act • Laboratory Accreditation #TC-48291
                </p>
              </div>

              {/* Certificate Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans text-xs border-b border-gray-200 pb-4">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Certificate No.</span>
                  <span className="font-mono font-bold text-gray-900">QC-2025-AGMARK-{crop.id.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Date of Testing</span>
                  <span className="font-bold text-gray-900">12 September 2025</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Commodity</span>
                  <span className="font-bold text-gray-900">{crop.title}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Inspected Quantity</span>
                  <span className="font-mono font-bold text-[#063b28]">{crop.batchQuantityQtl} Quintals</span>
                </div>
              </div>

              {/* Certificate Core Statement */}
              <div className="text-xs text-gray-700 leading-relaxed font-sans space-y-3">
                <p>
                  This is to certify that representative samples drawn from the above-mentioned consignment at{' '}
                  <strong>{crop.fpoName} ({crop.location})</strong> have been subjected to rigorous physical and biochemical testing at our accredited facilities.
                </p>
                <p>
                  The consignment conforms in all respects to <strong>AGMARK Grade-1 Specifications</strong> with calibrated moisture content of{' '}
                  <strong>{crop.moisturePct}%</strong> and foreign matter below permissible ceilings. The consignment has been cleared for commercial inter-state freight transit and bank escrow settlement.
                </p>
              </div>

              {/* Signature & Seal Footer */}
              <div className="pt-6 border-t border-gray-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-emerald-700 flex items-center justify-center text-center p-1 text-emerald-800">
                    <span className="text-[8px] font-bold uppercase leading-tight">NABL SEAL TC-48291</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Signed Cryptographically</span>
                    <span className="text-[10px] text-gray-500 font-mono">SHA-256: 8f4a...92b1 (Verified)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadCertificate}
                  className="px-4 py-2 bg-[#063b28] hover:bg-[#094c34] text-white rounded-xl font-bold flex items-center gap-2 shadow-2xs transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  <span>Print / Download Certificate</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sample' && (
            <div className="space-y-6">
              {sampleRequested ? (
                <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-300 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">check</span>
                  </div>
                  <div>
                    <h4 className="font-headline text-xl font-bold text-[#063b28]">
                      500g Physical Sample Dispatch Booked!
                    </h4>
                    <p className="text-xs text-emerald-900 mt-1 max-w-md mx-auto">
                      Your sealed sample packet from Lot #{crop.id.toUpperCase()} has been scheduled for priority courier dispatch to your address.
                    </p>
                  </div>

                  <div className="inline-block p-3 bg-white rounded-xl border border-emerald-200 font-mono text-xs text-gray-800">
                    <span className="text-gray-400 block text-[10px]">TRACKING AIRWAY BILL</span>
                    <span className="font-bold text-[#063b28] text-sm">{sampleTrackingId}</span>
                    <span className="block text-[11px] text-gray-500 mt-0.5">Courier: BlueDart Surface Cargo Express</span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSampleRequested(false)}
                      className="text-xs font-bold text-emerald-800 underline"
                    >
                      Book Another Sample Request
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">inventory_2</span>
                    </div>
                    <div>
                      <h4 className="font-headline text-base font-bold text-[#131b2e]">
                        Request 500g Sealed Physical Sample
                      </h4>
                      <p className="text-xs text-gray-500">
                        Test in your own mill quality laboratory before finalizing bulk purchases.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleRequestSampleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                        Shipping / Delivery Address (Corporate Lab or Mill Godown)
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Enter full facility address with PIN code (e.g. Unit 4, AgroCore Processing Plant, Pithampur Industrial Area, Indore - 452010)"
                        className="w-full p-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#063b28] focus:outline-none"
                      />
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-700 text-[18px] flex-shrink-0 mt-0.5">
                        info
                      </span>
                      <div>
                        <span className="font-bold">Complimentary Verified Sample:</span>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          Samples are packed in moisture-barrier tamper-proof vacuum pouches with QR verification seals. Delivery within 24–48 hours across western & central India.
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingSample}
                      className="w-full h-11 bg-[#a35d1e] hover:bg-[#8e4e16] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-all btn-press"
                    >
                      <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                      <span>{isSubmittingSample ? 'Scheduling Courier Pickup...' : 'Confirm 500g Sample Dispatch (Free)'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="material-symbols-outlined text-emerald-700 text-[18px]">verified_user</span>
            <span>All lab parameters legally binding for escrow settlement release.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial h-10 px-4 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl"
            >
              Close
            </button>
            {onBuyNow && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBuyNow(crop);
                }}
                className="flex-1 sm:flex-initial h-10 px-5 bg-[#063b28] hover:bg-[#094c34] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all btn-press"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Proceed to Buy Lot (Lock Escrow)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
