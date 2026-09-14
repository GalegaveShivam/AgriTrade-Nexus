import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../i18n';
import { audioAssistant } from '../utils/audioAssistant';

interface CropProfile {
  id: string;
  name: string;
  category: string;
  mandiBaseRate: number; // ₹/Qtl
  agriTradeRate: number; // ₹/Qtl
  typicalMoisture: number; // %
  defaultQty: number; // Qtl
  sampleFpo: string;
  image: string;
  region: string;
}

const COMMODITY_PROFILES: CropProfile[] = [
  {
    id: 'wheat_sharbati',
    name: 'Sharbati Wheat (C-306)',
    category: 'wheat',
    mandiBaseRate: 2320,
    agriTradeRate: 2420,
    typicalMoisture: 10.4,
    defaultQty: 300,
    sampleFpo: 'Malwa Kisan Producer Co.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400&auto=format&fit=crop',
    region: 'Sehore, MP',
  },
  {
    id: 'mustard_bold',
    name: 'Pusa Bold Mustard',
    category: 'mustard',
    mandiBaseRate: 5320,
    agriTradeRate: 5460,
    typicalMoisture: 8.5,
    defaultQty: 280,
    sampleFpo: 'Kota Agri Producers Co.',
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=400&auto=format&fit=crop',
    region: 'Alwar, Rajasthan',
  },
  {
    id: 'soybean_yellow',
    name: 'Yellow Soybean (JS-9560)',
    category: 'soybean',
    mandiBaseRate: 4580,
    agriTradeRate: 4720,
    typicalMoisture: 10.1,
    defaultQty: 400,
    sampleFpo: 'Dewas Soy Samiti',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=400&auto=format&fit=crop',
    region: 'Indore, MP',
  },
  {
    id: 'chana_desi',
    name: 'Desi Chana (JG-11)',
    category: 'chana',
    mandiBaseRate: 5310,
    agriTradeRate: 5490,
    typicalMoisture: 9.8,
    defaultQty: 250,
    sampleFpo: 'Nimar Agri Farmers Fed',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?q=80&w=400&auto=format&fit=crop',
    region: 'Khandwa, MP',
  },
  {
    id: 'chana_kabuli',
    name: 'Dollar Kabuli Chana',
    category: 'chana',
    mandiBaseRate: 7550,
    agriTradeRate: 7820,
    typicalMoisture: 9.2,
    defaultQty: 200,
    sampleFpo: 'Indore Organics Cluster',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop',
    region: 'Ujjain, MP',
  },
  {
    id: 'cotton_shankar',
    name: 'Shankar-6 Raw Cotton',
    category: 'cotton',
    mandiBaseRate: 6680,
    agriTradeRate: 6860,
    typicalMoisture: 8.0,
    defaultQty: 350,
    sampleFpo: 'Vidarbha White Gold FPO',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=400&auto=format&fit=crop',
    region: 'Amravati, Maharashtra',
  },
  {
    id: 'rice_basmati',
    name: 'Basmati Rice (1121)',
    category: 'rice',
    mandiBaseRate: 3450,
    agriTradeRate: 3620,
    typicalMoisture: 12.0,
    defaultQty: 450,
    sampleFpo: 'Karnal Grain Producer Co.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400&auto=format&fit=crop',
    region: 'Karnal, Haryana',
  },
  {
    id: 'groundnut_saurashtra',
    name: 'Saurashtra Groundnut (G-20)',
    category: 'groundnut',
    mandiBaseRate: 6200,
    agriTradeRate: 6380,
    typicalMoisture: 7.5,
    defaultQty: 320,
    sampleFpo: 'Junagadh Kisan Mandali',
    image: 'https://images.unsplash.com/photo-1567892320421-1c657571ea4c?q=80&w=400&auto=format&fit=crop',
    region: 'Rajkot, Gujarat',
  },
];

interface NetProfitCalculatorProps {
  onListProduce?: () => void;
  onExploreMarket?: () => void;
}

export const NetProfitCalculator: React.FC<NetProfitCalculatorProps> = ({
  onListProduce,
  onExploreMarket,
}) => {
  const { t, language, getCropName } = useLanguage();

  const [selectedCropId, setSelectedCropId] = useState<string>('wheat_sharbati');
  const [quantityQtl, setQuantityQtl] = useState<number>(300);
  const [distanceKm, setDistanceKm] = useState<number>(45);
  const [viewMode, setViewMode] = useState<'farmer' | 'buyer'>('farmer');

  const selectedCrop = useMemo(() => {
    return COMMODITY_PROFILES.find((c) => c.id === selectedCropId) || COMMODITY_PROFILES[0];
  }, [selectedCropId]);

  // Financial calculations
  const calculations = useMemo(() => {
    const mandiRate = selectedCrop.mandiBaseRate;
    const directRate = selectedCrop.agriTradeRate;

    // Traditional Mandi math (Farmer side)
    const mandiGross = mandiRate * quantityQtl;
    const arhtiyaCommission = Math.round(mandiGross * 0.025); // 2.5% commission cut
    const dockageKatauti = Math.round(mandiGross * 0.035); // 3.5% arbitrary dockage deduction
    const handlingAndLabor = quantityQtl * 24; // ₹24/qtl unauthorized unloading/sacks
    const transportToMandi = Math.round(quantityQtl * (distanceKm * 0.65)); // fuel & vehicle hiring
    const mandiTotalDeductions = arhtiyaCommission + dockageKatauti + handlingAndLabor + transportToMandi;
    const mandiNetPayout = mandiGross - mandiTotalDeductions;

    // AgriTrade Nexus math (Farmer side)
    const nexusGross = directRate * quantityQtl;
    const nexusPlatformFee = 0; // 0% fee for farmers
    const nexusDockage = 0; // 0% dockage - 100% calibrated assay
    const nexusNetPayout = nexusGross; // Full direct realization

    // Advantage
    const farmerNetGain = nexusNetPayout - mandiNetPayout;
    const farmerPercentageGain = ((farmerNetGain / mandiNetPayout) * 100).toFixed(1);

    // Institutional Buyer Math
    // In traditional channels, buyer pays mandi fees + trader markup (+8% to 12%)
    const buyerTraditionalCost = Math.round(mandiGross * 1.11);
    const buyerAgriTradeCost = Math.round(nexusGross * 1.015); // only 1.5% statutory cess
    const buyerNetSavings = buyerTraditionalCost - buyerAgriTradeCost;
    const buyerPercentageSavings = ((buyerNetSavings / buyerTraditionalCost) * 100).toFixed(1);

    return {
      mandiRate,
      directRate,
      mandiGross,
      arhtiyaCommission,
      dockageKatauti,
      handlingAndLabor,
      transportToMandi,
      mandiTotalDeductions,
      mandiNetPayout,
      nexusGross,
      nexusPlatformFee,
      nexusDockage,
      nexusNetPayout,
      farmerNetGain,
      farmerPercentageGain,
      buyerTraditionalCost,
      buyerAgriTradeCost,
      buyerNetSavings,
      buyerPercentageSavings,
    };
  }, [selectedCrop, quantityQtl, distanceKm]);

  const formatINR = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  const handleAudioSummary = () => {
    const cropLocalized = getCropName(selectedCrop.name);
    let textToSpeak = '';
    let voiceLang = 'en-IN';

    if (language === 'hi') {
      voiceLang = 'hi-IN';
      textToSpeak = `${cropLocalized} के ${quantityQtl} क्विंटल पर पारंपरिक मंडी के मुकाबले एग्रीट्रेड नेक्सस से कुल ${formatINR(
        calculations.farmerNetGain
      )} रुपये का अतिरिक्त मुनाफा मिलता है। यह लगभग ${calculations.farmerPercentageGain} प्रतिशत अधिक है। सीधे बैंक खाते में भुगतान होता है।`;
    } else if (language === 'mr') {
      voiceLang = 'mr-IN';
      textToSpeak = `${cropLocalized} च्या ${quantityQtl} क्विंटलवर पारंपारिक मंडीच्या तुलनेत एग्रीट्रेड नेक्सस द्वारे एकूण ${formatINR(
        calculations.farmerNetGain
      )} रुपयांचा अतिरिक्त नफा मिळतो. हे सुमारे ${calculations.farmerPercentageGain} टक्के जास्त आहे. 24 तासांत थेट बँक खात्यात पैसे जमा होतात.`;
    } else if (language === 'pa') {
      voiceLang = 'pa-IN';
      textToSpeak = `${cropLocalized} ਦੇ ${quantityQtl} ਕੁਇੰਟਲ ਉੱਤੇ ਰਵਾਇਤੀ ਮੰਡੀ ਦੇ ਮੁਕਾਬਲੇ ਐਗਰੀਟ੍ਰੇਡ ਨੈਕਸਸ ਨਾਲ ਕੁੱਲ ${formatINR(
        calculations.farmerNetGain
      )} ਰੁਪਏ ਦਾ ਵਾਧੂ ਮੁਨਾਫ਼ਾ ਮਿਲਦਾ ਹੈ। ਇਹ ਲਗਭਗ ${calculations.farmerPercentageGain} ਫ਼ੀਸਦੀ ਜ਼ਿਆਦਾ ਹੈ।`;
    } else {
      voiceLang = 'en-IN';
      textToSpeak = `For ${quantityQtl} quintals of ${selectedCrop.name}, selling through AgriTrade Nexus gives an additional net profit of ${formatINR(
        calculations.farmerNetGain
      )}, which is ${calculations.farmerPercentageGain} percent higher than traditional mandis.`;
    }

    audioAssistant.speak(textToSpeak, voiceLang);
  };

  return (
    <div className="w-full bg-[#f4f7f4] border border-emerald-800/15 rounded-3xl p-5 sm:p-8 shadow-xs">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#063b28] text-white text-[11px] font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[15px] text-emerald-400">calculate</span>
            <span>{t('calcPill', 'REAL-TIME MANDI COMPARISON ENGINE')}</span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#131b2e] leading-tight">
            {t('calcHeading', 'Mandi vs. AgriTrade Net Realization Calculator')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            {t('calcSub', 'Input your crop volume and see transparent, line-item financial proof of why direct FPO procurement yields higher take-home earnings with zero dockage losses.')}
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Audio Assistance */}
          <button
            type="button"
            onClick={handleAudioSummary}
            className="h-10 px-3.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-all btn-press"
            title="Listen to calculation summary"
          >
            <span className="material-symbols-outlined text-[18px] text-emerald-700">volume_up</span>
            <span className="hidden sm:inline">{t('listenVoiceCalculation', 'Audio Summary')}</span>
          </button>

          {/* Perspective Switcher with animated pill */}
          <div className="relative flex p-1 bg-gray-200/90 rounded-xl">
            <button
              onClick={() => {
                setViewMode('farmer');
                audioAssistant.playChime('click');
              }}
              className={`relative z-10 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                viewMode === 'farmer' ? 'text-white' : 'text-gray-700 hover:text-black'
              }`}
            >
              {viewMode === 'farmer' && (
                <motion.div
                  layoutId="calcViewPill"
                  className="absolute inset-0 bg-[#063b28] rounded-lg shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="material-symbols-outlined text-[15px] relative z-10">agriculture</span>
              <span className="relative z-10">{t('farmerRealizationView', 'Farmer / FPO Realization')}</span>
            </button>
            <button
              onClick={() => {
                setViewMode('buyer');
                audioAssistant.playChime('click');
              }}
              className={`relative z-10 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                viewMode === 'buyer' ? 'text-white' : 'text-gray-700 hover:text-black'
              }`}
            >
              {viewMode === 'buyer' && (
                <motion.div
                  layoutId="calcViewPill"
                  className="absolute inset-0 bg-[#a35d1e] rounded-lg shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="material-symbols-outlined text-[15px] relative z-10">factory</span>
              <span className="relative z-10">{t('buyerSavingsView', 'Buyer Procurement Savings')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Controls Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Left Column (5 Cols): Inputs & Sliders */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
          {/* Crop Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                {t('selectCommodity', '1. Select Agricultural Commodity')}
              </label>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                8 Active Bulk Hubs
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {COMMODITY_PROFILES.map((crop) => {
                const isSelected = crop.id === selectedCropId;
                const gainPerQtl = crop.agriTradeRate - crop.mandiBaseRate;
                return (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => {
                      setSelectedCropId(crop.id);
                      setQuantityQtl(crop.defaultQty);
                      audioAssistant.playChime('click');
                    }}
                    className={`relative p-2 text-left rounded-xl border text-xs font-semibold transition-all group overflow-hidden ${
                      isSelected
                        ? 'bg-emerald-50/90 border-[#063b28] text-[#063b28] shadow-xs ring-2 ring-[#063b28]/20'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-gray-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-black/10">
                        <img
                          src={crop.image}
                          alt={crop.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-115"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-bold text-[11px] leading-tight text-gray-900">
                          {getCropName(crop.name)}
                        </div>
                        <div className="flex items-center justify-between mt-0.5 text-[9.5px]">
                          <span className="text-gray-500 font-mono">₹{crop.agriTradeRate}/Q</span>
                          <span className="font-bold text-green-700 bg-green-100/80 px-1 rounded">
                            +{gainPerQtl}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Slider & Quick Preset Tabs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                {t('lotSizeQtl', '2. Lot Size / Quantity (Quintals)')}
              </label>
              <span className="font-mono text-sm font-extrabold text-[#063b28] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {quantityQtl} Qtl ({(quantityQtl / 10).toFixed(1)} MT)
              </span>
            </div>

            {/* Micro tabs for Quick Volume Presets */}
            <div className="flex gap-1.5 mb-2">
              {[
                { label: '50 Qtl', desc: 'Tractor', val: 50 },
                { label: '200 Qtl', desc: 'Truck', val: 200 },
                { label: '450 Qtl', desc: 'Multi-Axle', val: 450 },
                { label: '1000 Qtl', desc: 'Rake Lot', val: 1000 },
              ].map((preset) => {
                const isPreset = quantityQtl === preset.val;
                return (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => {
                      setQuantityQtl(preset.val);
                      audioAssistant.playChime('click');
                    }}
                    className={`flex-1 py-1 px-1.5 rounded-lg border text-[10px] font-bold text-center transition-all ${
                      isPreset
                        ? 'bg-[#063b28] text-white border-[#063b28] shadow-2xs'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>

            <input
              type="range"
              min={20}
              max={1500}
              step={10}
              value={quantityQtl}
              onChange={(e) => setQuantityQtl(Number(e.target.value))}
              className="w-full accent-[#063b28] cursor-pointer h-2 bg-gray-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
              <span>20 Qtl (Small)</span>
              <span>500 Qtl (Standard)</span>
              <span>1500 Qtl (Institutional)</span>
            </div>
          </div>

          {/* Distance Slider & Preset Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                {t('distanceMandiYard', '3. Distance to APMC Mandi Yard')}
              </label>
              <span className="font-mono text-sm font-extrabold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                {distanceKm} km
              </span>
            </div>

            <div className="flex gap-1.5 mb-2">
              {[
                { label: '15 km', name: 'Tehsil Mandi', val: 15 },
                { label: '45 km', name: 'District Hub', val: 45 },
                { label: '90 km', name: 'Regional Market', val: 90 },
              ].map((distPreset) => {
                const isDist = distanceKm === distPreset.val;
                return (
                  <button
                    key={distPreset.val}
                    type="button"
                    onClick={() => {
                      setDistanceKm(distPreset.val);
                      audioAssistant.playChime('click');
                    }}
                    className={`flex-1 py-1 px-1.5 rounded-lg border text-[10px] font-bold text-center transition-all ${
                      isDist
                        ? 'bg-gray-800 text-white border-gray-800 shadow-2xs'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{distPreset.label}</span>
                  </button>
                );
              })}
            </div>

            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-gray-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
              <span>10 km (Local yard)</span>
              <span>60 km (District Mandi)</span>
              <span>120 km (Inter-district)</span>
            </div>
          </div>

          {/* Specs note */}
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/60 text-xs text-emerald-950 flex items-start gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[18px] flex-shrink-0 mt-0.5">
              verified
            </span>
            <div>
              <span className="font-bold">Standardized AGMARK Assay Benchmark:</span>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Calibrated moisture baseline {selectedCrop.typicalMoisture}% with non-detected foreign matter. Zero arbitrary dockage haircut.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Side-by-Side Ledger & Big Realization Box */}
        <div className="lg:col-span-7 space-y-4">
          {/* Big Takeaway Callout Box */}
          <div className="bg-gradient-to-r from-[#063b28] to-[#0a5238] rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                {viewMode === 'farmer' ? 'NET EXTRA TAKE-HOME PROFIT' : 'NET BUYER PROCUREMENT SAVINGS'}
              </span>
              <div className="font-headline text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight text-white flex items-baseline gap-2">
                <span>
                  {viewMode === 'farmer'
                    ? formatINR(calculations.farmerNetGain)
                    : formatINR(calculations.buyerNetSavings)}
                </span>
                <span className="text-sm font-semibold text-emerald-300">
                  (+{viewMode === 'farmer' ? calculations.farmerPercentageGain : calculations.buyerPercentageSavings}%)
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-md">
                {viewMode === 'farmer'
                  ? `Direct payment into FPO bank account within 24 hours of weighbridge confirmation.`
                  : `Procured directly with digital assay proof, bypassing trader markups and yard cartels.`}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5 self-stretch sm:self-auto">
              <span className="px-3 py-1 bg-emerald-400/20 rounded-lg text-emerald-200 text-xs font-bold border border-emerald-300/30 whitespace-nowrap">
                ⚡ Same-Day RTGS Payout
              </span>
              <span className="text-[11px] text-emerald-200/80">Zero default risk</span>
            </div>
          </div>

          {/* Side-by-Side Financial Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Traditional Mandi Card */}
            <div className="bg-white rounded-2xl p-5 border border-red-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-red-100">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-red-700">
                      Traditional Mandi
                    </h3>
                    <p className="text-[11px] text-gray-500">Subject to Yard Intermediaries</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold">
                    HIGH FRICTION
                  </span>
                </div>

                <div className="space-y-2 pt-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mandi Benchmark Rate:</span>
                    <span className="font-mono font-bold text-gray-800">
                      ₹{calculations.mandiRate.toLocaleString()} / Qtl
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gross Harvest Value:</span>
                    <span className="font-mono font-bold text-gray-800">
                      {formatINR(calculations.mandiGross)}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 my-1 pt-2 space-y-1.5 text-red-600 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span>• Arhtiya Cut (2.5%):</span>
                      <span>-{formatINR(calculations.arhtiyaCommission)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Arbitrary Katauti (3.5%):</span>
                      <span>-{formatINR(calculations.dockageKatauti)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Bagging/Unloading fee:</span>
                      <span>-{formatINR(calculations.handlingAndLabor)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Yard transit & idle fuel:</span>
                      <span>-{formatINR(calculations.transportToMandi)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-red-200 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-500 block">
                    Actual Realization
                  </span>
                  <span className="text-[10px] text-gray-400">Payment in 4-7 days</span>
                </div>
                <div className="font-headline text-lg font-mono font-extrabold text-red-700">
                  {formatINR(calculations.mandiNetPayout)}
                </div>
              </div>
            </div>

            {/* 2. AgriTrade Nexus Direct Card */}
            <div className="bg-[#f0f9f4] rounded-2xl p-5 border border-emerald-600 shadow-2xs flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#063b28]">
                      AgriTrade Direct
                    </h3>
                    <p className="text-[11px] text-emerald-800 font-medium">Bank Escrow &amp; Assay</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                    OPTIMAL
                  </span>
                </div>

                <div className="space-y-2 pt-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Institutional Direct Rate:</span>
                    <span className="font-mono font-bold text-[#063b28]">
                      ₹{calculations.directRate.toLocaleString()} / Qtl
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross Contract Value:</span>
                    <span className="font-mono font-bold text-[#063b28]">
                      {formatINR(calculations.nexusGross)}
                    </span>
                  </div>

                  <div className="border-t border-emerald-200 my-1 pt-2 space-y-1.5 text-emerald-700 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span>• Farmer Commission (0%):</span>
                      <span className="font-bold">₹0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Arbitrary Katauti:</span>
                      <span className="font-bold">₹0.00 (Calibrated)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Digital Weighbridge:</span>
                      <span className="font-bold">100% Verified Net</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Transit Logistics:</span>
                      <span className="font-bold">Buyer Silo Route</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-300 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-900 block">
                    Actual Realization
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Instant same-day RTGS</span>
                </div>
                <div className="font-headline text-xl font-mono font-extrabold text-[#063b28]">
                  {formatINR(calculations.nexusNetPayout)}
                </div>
              </div>
            </div>
          </div>

          {/* Quick CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <span className="material-symbols-outlined text-emerald-700 text-[20px]">handshake</span>
              <span>
                {t('wantToTrade', 'Want to trade')}{' '}
                <strong>{getCropName(selectedCrop.name)}</strong> {t('atRate', 'at')}{' '}
                <strong>₹{selectedCrop.agriTradeRate.toLocaleString()}/Qtl</strong>?
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onListProduce}
                className="flex-1 sm:flex-initial h-10 px-4 bg-[#063b28] hover:bg-[#094c34] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 btn-press"
              >
                <span className="material-symbols-outlined text-[16px]">add_box</span>
                <span>{t('listProduce', 'List Produce Now')}</span>
              </button>
              <button
                type="button"
                onClick={onExploreMarket}
                className="flex-1 sm:flex-initial h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                <span>{t('browseMarketplace', 'Browse Marketplace')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
