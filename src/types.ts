export type UserRole = 'buyer' | 'farmer' | 'guest';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  orgName: string;
  phone: string;
  email: string;
  location: string;
  escrowBalance?: number;
  verified: boolean;
  memberCount?: number;
}

export type CropCategory = 'wheat' | 'soybean' | 'chana' | 'mustard' | 'cotton' | 'maize' | 'other';
export type SourceType = 'hub' | 'farmgate';

export interface CropLot {
  id: string;
  title: string;
  variety: string;
  cropCategory: CropCategory;
  farmerName: string;
  fpoName: string;
  farmerPhone: string;
  batchQuantityQtl: number;
  qualityScore: number;
  qualityGrade: string;
  moisturePct: number;
  pricePerQtl: number;
  mandiRate: number;
  premiumText: string;
  location: string;
  distanceKm: number;
  source: SourceType;
  sourceLabel: string;
  imageUrl: string;
  certBadge: string;
  moistureBadge: string;
  keyMetricLabel: string;
  keyMetricValue: string;
  status: 'available' | 'reserved' | 'sold';
  addedAt: string;
  harvestDate?: string;
  grade?: string;
  pickupOption?: string;
  verifiedAssay?: boolean;
  mandiRefPrice?: number;
  paymentTerms?: string;
  farmerLocation?: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  lotId: string;
  cropTitle: string;
  cropCategory: CropCategory;
  quantityQtl: number;
  pricePerQtl: number;
  grossAmount: number;
  mandiTax: number;
  totalAmount: number;
  buyerId: string;
  buyerName: string;
  farmerName: string;
  fpoName: string;
  farmerPhone: string;
  status: 'escrow_locked' | 'transit_scheduled' | 'weighbridge_verified' | 'delivered' | 'completed';
  createdAt: string;
  transitPassNo: string;
  destinationMandi: string;
  weighbridgeWeightQtl?: number;
}

export interface MandiPriceItem {
  crop: string;
  mandiName: string;
  ratePerQtl: number;
  changePct: number;
  trend: 'up' | 'down';
}
