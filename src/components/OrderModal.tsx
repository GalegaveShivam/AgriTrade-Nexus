import React, { useState } from 'react';
import { CropLot, User } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: CropLot | null;
  buyer: User | null;
  defaultQuantity?: number;
  onConfirmOrder: (orderData: {
    crop: CropLot;
    quantity: number;
    destinationMandi: string;
    totalAmount: number;
    grossAmount: number;
    mandiTax: number;
  }) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  crop,
  buyer,
  defaultQuantity,
  onConfirmOrder,
}) => {
  if (!isOpen || !crop) return null;

  const maxQty = crop.batchQuantityQtl;
  const [quantity, setQuantity] = useState<number>(
    defaultQuantity ? Math.min(defaultQuantity, maxQty) : Math.min(100, maxQty)
  );
  const [destinationMandi, setDestinationMandi] = useState('Indore Central Processing Mill');
  const [transitConfirmed, setTransitConfirmed] = useState(true);

  const grossAmount = quantity * crop.pricePerQtl;
  const mandiTax = Math.round(grossAmount * 0.015);
  const totalAmount = grossAmount + mandiTax;

  const buyerBalance = buyer?.escrowBalance || 4500000;
  const hasSufficientEscrow = buyerBalance >= totalAmount;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleConfirm = () => {
    if (!hasSufficientEscrow) {
      alert('Insufficient balance in your ICICI Escrow vault. Please top up your balance or reduce the quantity.');
      return;
    }
    onConfirmOrder({
      crop,
      quantity,
      destinationMandi,
      totalAmount,
      grossAmount,
      mandiTax,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-[#eaedff] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1b4332] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-[#86af99] uppercase font-bold tracking-wider">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Tripartite Escrow Contract Protocol</span>
          </div>
          <h2 className="font-headline text-2xl font-bold mt-1 text-white">
            Execute Direct Farmgate Order
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            Funds will be held securely in escrow and released upon digital weighbridge sign-off.
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Crop Summary Card */}
          <div className="flex gap-4 p-3.5 bg-[#f2f3ff] rounded-xl border border-[#dae2fd]">
            <img
              src={crop.imageUrl}
              alt={crop.title}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="inline-block px-2 py-0.5 bg-[#1b4332] text-white text-[10px] font-bold rounded-md">
                {crop.certBadge}
              </span>
              <h3 className="font-bold text-sm text-[#131b2e] truncate mt-1">
                {crop.title}
              </h3>
              <p className="text-xs text-[#414844]">
                By <span className="font-semibold text-[#131b2e]">{crop.farmerName}</span> ({crop.fpoName})
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs">
                <span className="font-mono font-bold text-[#1b4332]">
                  ₹{crop.pricePerQtl.toLocaleString()} / Qtl
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-[#414844]">
                  Max Available: <strong>{crop.batchQuantityQtl} Qtl</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase text-[#414844] tracking-wider">
                Procurement Quantity (Quintals)
              </label>
              <span className="font-mono text-sm font-bold text-[#1b4332]">
                {quantity} Qtl ({(quantity / 10).toFixed(1)} MT)
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={maxQty}
              step={5}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-[#1b4332] cursor-pointer h-2 bg-gray-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-[#414844] mt-1">
              <span>Min: 10 Qtl</span>
              <span>Selected: {quantity} Quintals</span>
              <span>Lot Capacity: {maxQty} Qtl</span>
            </div>
          </div>

          {/* Delivery Mandi / Mill Selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-[#414844] mb-1.5 tracking-wider">
              Destination Weighbridge / Mill
            </label>
            <select
              value={destinationMandi}
              onChange={(e) => setDestinationMandi(e.target.value)}
              className="w-full h-11 px-3 bg-white text-xs font-semibold text-[#131b2e] rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            >
              <option value="Indore Central Processing Mill">Indore Central Processing Mill, Plot #44</option>
              <option value="Dewas Agro Flour & Pulses Terminal">Dewas Agro Flour & Pulses Terminal</option>
              <option value="Ujjain Grain Elevator Silo #2">Ujjain Grain Elevator Silo #2</option>
              <option value="Sehore Logistics Hub Terminal">Sehore Logistics Hub Terminal</option>
            </select>
          </div>

          {/* Price Breakdown Ledger */}
          <div className="p-4 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#414844]">
              <span>Base Commodity Cost ({quantity} Qtl × ₹{crop.pricePerQtl}):</span>
              <span className="font-mono font-bold text-[#131b2e]">{formatCurrency(grossAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-[#1b4332]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check</span>
                Platform Commission Fee:
              </span>
              <span className="font-mono font-bold">₹0.00 (0% Commission)</span>
            </div>
            <div className="flex items-center justify-between text-[#414844]">
              <span>APMC Mandi Cess & Market Fee (1.5%):</span>
              <span className="font-mono font-bold text-[#131b2e]">{formatCurrency(mandiTax)}</span>
            </div>
            <div className="pt-2 border-t border-[#dae2fd] flex items-baseline justify-between">
              <div>
                <span className="font-bold text-sm text-[#131b2e] block">Total Escrow Deposit Required</span>
                <span className="text-[10px] text-[#414844]">ICICI Vault Auto-Hold</span>
              </div>
              <div className="font-mono text-xl font-bold text-[#1b4332]">
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>

          {/* Escrow Balance Check */}
          <div className="p-3 bg-white rounded-xl border border-[#c1ecd4] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1b4332] text-[20px]">account_balance_wallet</span>
              <div>
                <span className="text-[11px] text-gray-500 block">Current Escrow Vault Balance:</span>
                <span className="font-mono font-bold text-[#131b2e]">{formatCurrency(buyerBalance)}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-[#c1ecd4] text-[#002114] font-bold rounded-lg text-[11px]">
              Active & Verified
            </span>
          </div>

          {/* Automated Transit Pass Check */}
          <label className="flex items-start gap-2 text-xs text-[#414844] cursor-pointer">
            <input
              type="checkbox"
              checked={transitConfirmed}
              onChange={(e) => setTransitConfirmed(e.target.checked)}
              className="mt-0.5 accent-[#1b4332] w-4 h-4 rounded"
            />
            <span>
              Generate digital inter-state transit pass and notify farmer's FPO dispatch coordinator for digital weighbridge booking.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-[#414844] hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 h-12 bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Lock Payment & Create Purchase Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
