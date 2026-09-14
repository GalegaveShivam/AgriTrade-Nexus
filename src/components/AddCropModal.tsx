import React, { useState } from 'react';
import { CropCategory, CropLot, SourceType, User } from '../types';

interface AddCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: User | null;
  onAddCrop: (crop: CropLot) => void;
}

const PRESET_IMAGES: { label: string; url: string; category: CropCategory }[] = [
  {
    label: 'Durum Sharbati Wheat',
    category: 'wheat',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfA43YzxtpL2BRPGL788li1Cfm2MBZjnYwIx83I4g3RBr8bN8oxRSkzpCzydY2eEZls9xvUvsN_vSKxwhbvjgUKvNP0x8jS2g0YWLc_w-fmUY7Ix8LlDxJDu4Xv8WC5eKeaRm30xl9k22H15iE5KLRU7YVj8zZkg0jgI5O9qeZY2lmifevBoJeYYsjmMmt8U6PWZcDxiloF_DXdYDU8M_V53mZGWQS5uSPF0qxtIiokOHtod6-71bc',
  },
  {
    label: 'Organic Desi Chana',
    category: 'chana',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoVsKHunbCqL3zT5yZUVea7Sn-Wg5cQrAh7O2OoCxePNtcAgIWb5PV_PJtyHGahxexK8GlxI9nSJkUz9SjEXrL8ThGe__AI3pO4UNQp726rSXmvVdebRAPwWwoVNUGwfJG9-Y-mRzgp3eRNK4rWsNvM4nHR0U4dRDOVU1mPemjiGQQeZnhxgHzI027IpCYQP7kkAZNGMA-MvRx_2I4fib5OvBoIRrpvyjwsjhsCozIRRn9UXzlnSAT',
  },
  {
    label: 'Yellow Soybean',
    category: 'soybean',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbbMhGkaW6euQ9Gqd0368Le8yIYGF_f0489XFEGQzW5XZwLrWJ9WAxXoysB8MAZcp-auwb1LrSezyA5AwwFyDAfESB2IxGBFqkwJLSBezMYN0VpcRl1zf4GhiAmdBdYQ7D0vTekKBNR_RYAYv0HR1yxm0LnBK9cNFUgeQ0Kz92GMDNYvhnIlb1bUENT66CsWTqy19H0qhKy2aQMUCN5kVjzFL7XYlG9Tr8MqydRhvjh_xzotLy4WJY',
  },
  {
    label: 'Bold Kabuli Chana',
    category: 'chana',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBN_zg7XHjrLUqGj_W-HovZy-UhnIWgvt_e22bItcDFZ1Gw_pkAN6y6EQDa_qVdpCp1fVy078xrbH8_MJsrGzYIMTI8TTBGVsTd6QkLAouhWwzVL2MBk93J2KWgAxRTAZcOBDSvySPVALzoPNfjemyFREZPWkBlY0ioKK-sT6S2Zk2-f7Wy0tPp8Ofp6ibuMtNvX90GMz11msKIUKHzXjHhTyOPiXBUJ76KyeSY3haj8eaB52UJ3MYy',
  },
  {
    label: 'High-Oil Mustard',
    category: 'mustard',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8gXkKIBzvdi3TGfnd2AoLnVn89TTV-DrPmmDZTxsfa71q5qMAIcYFvDG9RN6zZxEAzINhTTVtsMyOomo_b9NMAJVDydCp-VmJmRn_CLlfyhD9oGS3k5qBjjn1emXFKdQVHNTy8EjRPr2Ugyq2ZYcq7Sr7Hci4fJ8qzmiX32MpxABKpAeurmiRcq6ulwh5UbHykA45lSDwszDwTgLLe5T16eIFi7YUOba7EqddJMs1G71827TIT4GL',
  },
  {
    label: 'Cotton Bales',
    category: 'cotton',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYgwAr3XFQrxNHy89mJqcpD8qP9Wac7Qa1_F8PDHGTiOYgdRLjm-8soiAbcRWkanr2EDsSg9qx2la_DM-kMMJAPjMp_IwVl-oQ1egBlC0gKi6qz6-MVZBZmAZ9-zJxeGr0jtaho9nqsfznjt-lBgZmvURRyXMADGHb7kMs7BlV7-nQ1ZOak2ftmwFUhPTOE9OXF6PDqCCQXakynmC1pAWEl309do1-XCmXyGPdrOD72QNTZs9ExwtX',
  },
];

export const AddCropModal: React.FC<AddCropModalProps> = ({
  isOpen,
  onClose,
  farmer,
  onAddCrop,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [variety, setVariety] = useState('');
  const [category, setCategory] = useState<CropCategory>('wheat');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [qualityScore, setQualityScore] = useState<number | ''>('');
  const [moisture, setMoisture] = useState<number | ''>('');
  const [qualityGrade, setQualityGrade] = useState('AGMARK Grade-1');
  const [source, setSource] = useState<SourceType>('farmgate');
  const [location, setLocation] = useState(farmer?.location || '');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedQty = Number(quantity) || 100;
    const parsedPrice = Number(price) || 2400;
    const parsedQuality = Number(qualityScore) || 95.0;
    const parsedMoisture = Number(moisture) || 10.0;

    const newCrop: CropLot = {
      id: `crop-${Date.now()}`,
      title: title.trim() || 'Premium Sharbati Wheat Lot',
      variety: variety.trim() || 'Grade-1 Certified',
      cropCategory: category,
      farmerName: farmer?.name || 'Verified Producer',
      fpoName: farmer?.orgName || 'Kisan Producer Collective',
      farmerPhone: farmer?.phone || '+91 98260-44120',
      batchQuantityQtl: parsedQty,
      qualityScore: parsedQuality,
      qualityGrade,
      moisturePct: parsedMoisture,
      pricePerQtl: parsedPrice,
      mandiRate: Math.max(1500, parsedPrice - 60),
      premiumText: 'Direct Farmgate',
      location: location.trim() || 'Central Mandi Hub, MP',
      distanceKm: Math.floor(10 + Math.random() * 40),
      source,
      sourceLabel: source === 'farmgate' ? 'Direct from Farm' : 'Local Mandi Hub',
      imageUrl,
      certBadge: qualityGrade,
      moistureBadge: `Moisture: ${parsedMoisture}%`,
      keyMetricLabel: 'Quality Score',
      keyMetricValue: `${parsedQuality} / 100 Assayed`,
      status: 'available',
      addedAt: new Date().toISOString().split('T')[0],
    };

    onAddCrop(newCrop);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#eaedff] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1b4332] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-[#86af99] uppercase font-bold tracking-wider">
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Farmer Listing Portal</span>
          </div>
          <h2 className="font-headline text-2xl font-bold mt-1 text-white">
            List New Crop Batch for Sale
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            Your listing will immediately sync to the National Mandi Grid and be visible to verified institutional buyers.
          </p>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#414844] mb-1">
                Crop Title & Description
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Durum Sharbati Wheat (C-306 Super A-Grade)"
                className="w-full h-10 px-3 bg-white text-xs font-semibold text-[#131b2e] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#414844] mb-1">
                Commodity Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as CropCategory;
                  setCategory(cat);
                  const matchingImg = PRESET_IMAGES.find(p => p.category === cat);
                  if (matchingImg) setImageUrl(matchingImg.url);
                }}
                className="w-full h-10 px-3 bg-white text-xs font-semibold text-[#131b2e] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              >
                <option value="wheat">Wheat (Sharbati / Lokwan)</option>
                <option value="soybean">Yellow Soybean</option>
                <option value="chana">Chana / Chickpea</option>
                <option value="mustard">Mustard Seed</option>
                <option value="cotton">Cotton Bales</option>
                <option value="other">Other Grains & Pulses</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#414844] mb-1">
                Seed Variety / Spec
              </label>
              <input
                type="text"
                required
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. C-306, JS-9560, JG-11"
                className="w-full h-10 px-3 bg-white text-xs font-semibold text-[#131b2e] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#414844] mb-1">
                Batch Quantity (Quintals)
              </label>
              <input
                type="number"
                required
                min={10}
                max={5000}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 200"
                className="w-full h-10 px-3 bg-white text-xs font-semibold text-[#131b2e] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#414844] mb-1">
                Asking Price Per Quintal (₹/Qtl)
              </label>
              <input
                type="number"
                required
                min={500}
                max={50000}
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 2450"
                className="w-full h-10 px-3 bg-white text-xs font-semibold text-[#131b2e] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#414844] mb-1">
                Quality Certification / Grade
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full h-10 px-3 bg-white text-xs font-semibold text-[#131b2e] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              >
                <option value="AGMARK Grade-1">AGMARK Grade-1</option>
                <option value="NPOP Organic">NPOP Organic Certified</option>
                <option value="Export Quality (Grade 1)">Export Quality (Grade 1)</option>
                <option value="AGMARK Certified">AGMARK Certified</option>
                <option value="High-Yield Expeller">High-Yield Expeller</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#414844] mb-1">
                Lab Assay Score (0 - 100)
              </label>
              <input
                type="number"
                step="0.1"
                min={50}
                max={100}
                value={qualityScore}
                onChange={(e) => setQualityScore(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 97.5"
                className="w-full h-10 px-3 bg-white text-xs font-semibold text-[#131b2e] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#414844] mb-1">
                Moisture Content %
              </label>
              <input
                type="number"
                step="0.1"
                min={4}
                max={20}
                value={moisture}
                onChange={(e) => setMoisture(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 9.6"
                className="w-full h-10 px-3 bg-white text-xs font-semibold text-[#131b2e] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#414844] mb-1">
                Storage & Pickup Origin
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as SourceType)}
                className="w-full h-10 px-3 bg-white text-xs font-semibold text-[#131b2e] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              >
                <option value="farmgate">Direct from Farmgate</option>
                <option value="hub">From Local Mandi Storage Hub</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#414844] mb-1">
                Location / Mandi Hub
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gram Datoda Hub #4, Indore"
                className="w-full h-10 px-3 bg-white text-xs font-semibold text-[#131b2e] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              />
            </div>
          </div>

          {/* Preset Image Selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#414844] mb-2">
              Select Batch Photo
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setImageUrl(img.url)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    imageUrl === img.url ? 'border-[#1b4332] ring-2 ring-[#1b4332]/20' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-14 object-cover" />
                  <span className="block text-[9px] text-center font-semibold truncate p-1 bg-gray-50">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#414844] hover:bg-gray-100 rounded-xl btn-press"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 px-6 bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-sm flex items-center gap-2 btn-press"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              <span>Publish Batch Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
