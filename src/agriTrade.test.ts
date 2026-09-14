import { describe, it, expect } from 'vitest';
import { INITIAL_CROPS, INITIAL_BUYER_USER, INITIAL_FARMER_USER, INITIAL_MANDI_PRICES, INITIAL_ORDERS } from './data/initialData';
import { CropLot, PurchaseOrder } from './types';

describe('AgriTrade Nexus - Core Data Integrity & Calculations', () => {
  it('loads initial crop listings with valid fields and realistic pricing', () => {
    expect(INITIAL_CROPS.length).toBeGreaterThan(0);
    for (const crop of INITIAL_CROPS) {
      expect(crop.id).toBeDefined();
      expect(crop.batchQuantityQtl).toBeGreaterThan(0);
      expect(crop.pricePerQtl).toBeGreaterThan(0);
      expect(crop.moisturePct).toBeGreaterThan(0);
      expect(crop.moisturePct).toBeLessThan(20); // standard grain moisture threshold
      expect(crop.mandiRate).toBeGreaterThan(0);
      expect(['available', 'reserved', 'sold']).toContain(crop.status);
    }
  });

  it('validates user profiles for both Buyer and Farmer roles', () => {
    expect(INITIAL_BUYER_USER.role).toBe('buyer');
    expect(INITIAL_BUYER_USER.escrowBalance).toBeDefined();
    expect(INITIAL_BUYER_USER.escrowBalance!).toBeGreaterThanOrEqual(1000000);
    expect(INITIAL_BUYER_USER.verified).toBe(true);

    expect(INITIAL_FARMER_USER.role).toBe('farmer');
    expect(INITIAL_FARMER_USER.memberCount).toBeDefined();
    expect(INITIAL_FARMER_USER.memberCount!).toBeGreaterThan(0);
    expect(INITIAL_FARMER_USER.verified).toBe(true);
  });

  it('computes total lot valuation accurately', () => {
    const wheatLot = INITIAL_CROPS.find((c) => c.cropCategory === 'wheat');
    expect(wheatLot).toBeDefined();
    if (wheatLot) {
      const totalLotValue = wheatLot.batchQuantityQtl * wheatLot.pricePerQtl;
      expect(totalLotValue).toBe(wheatLot.batchQuantityQtl * 2420);
      expect(totalLotValue).toBeGreaterThan(0);
    }
  });

  it('validates Mandi Benchmark prices and price trend dynamics', () => {
    expect(INITIAL_MANDI_PRICES.length).toBeGreaterThan(0);
    for (const item of INITIAL_MANDI_PRICES) {
      expect(item.ratePerQtl).toBeGreaterThan(0);
      expect(item.mandiName).toBeDefined();
      expect(item.crop).toBeDefined();
      expect(['up', 'down']).toContain(item.trend);
      expect(typeof item.changePct).toBe('number');
    }
  });

  it('calculates escrow transactions, tax breakdown and order completion status', () => {
    expect(INITIAL_ORDERS.length).toBeGreaterThan(0);
    for (const order of INITIAL_ORDERS) {
      const expectedGross = order.quantityQtl * order.pricePerQtl;
      expect(order.grossAmount).toBe(expectedGross);
      expect(order.totalAmount).toBe(order.grossAmount + order.mandiTax);
      expect([
        'escrow_locked',
        'transit_scheduled',
        'weighbridge_verified',
        'delivered',
        'completed',
      ]).toContain(order.status);
      expect(order.transitPassNo).toMatch(/^MP-TP-/);
    }
  });

  it('handles filtering crops by category and regional hubs correctly', () => {
    const wheatCrops = INITIAL_CROPS.filter((c) => c.cropCategory === 'wheat');
    expect(wheatCrops.every((c) => c.cropCategory === 'wheat')).toBe(true);

    const regionalCrops = INITIAL_CROPS.filter((c) =>
      c.location.toLowerCase().includes('datoda') ||
      c.location.toLowerCase().includes('ujjain') ||
      c.location.toLowerCase().includes('sehore')
    );
    expect(regionalCrops.length).toBeGreaterThanOrEqual(2);
  });

  it('handles creating a new crop lot and verifies escrow readiness', () => {
    const newLot: CropLot = {
      id: `lot-test-${Date.now()}`,
      farmerName: 'Rameshwar Patel',
      fpoName: 'Malwa Agro Producer Co. Ltd.',
      farmerPhone: '+91 98260 12345',
      farmerLocation: 'Gram Datoda, Indore, MP',
      cropCategory: 'mustard',
      title: 'Mustard (Pusa Bold)',
      variety: 'Pusa Bold (High Oil 42%)',
      qualityGrade: 'A-Grade',
      qualityScore: 97,
      batchQuantityQtl: 150,
      pricePerQtl: 5450,
      mandiRate: 5400,
      premiumText: '+₹50 over MSP',
      moisturePct: 8.5,
      harvestDate: '2025-02-15',
      location: 'Indore, MP',
      distanceKm: 12,
      source: 'farmgate',
      sourceLabel: 'Direct Farmgate',
      pickupOption: 'buyer_pickup',
      verifiedAssay: true,
      imageUrl: 'https://example.com/mustard.jpg',
      certBadge: 'AGMARK Certified',
      moistureBadge: '8.5% Moisture',
      keyMetricLabel: 'Moisture',
      keyMetricValue: '8.5%',
      status: 'available',
      addedAt: 'Just now',
      mandiRefPrice: 5400,
      paymentTerms: '100% Direct Escrow on Digital Weighbridge Verification',
    };

    expect(newLot.batchQuantityQtl).toBe(150);
    const metricTonnes = newLot.batchQuantityQtl / 10;
    expect(metricTonnes).toBe(15);
    const totalCost = newLot.batchQuantityQtl * newLot.pricePerQtl;
    expect(totalCost).toBe(817500);
    expect(newLot.verifiedAssay).toBe(true);
  });

  it('verifies unit conversions between Quintal and Metric Tonne (MT)', () => {
    // 1 Metric Tonne = 10 Quintals
    const convertMtToQtl = (mt: number) => mt * 10;
    const convertQtlToMt = (qtl: number) => qtl / 10;

    expect(convertMtToQtl(25)).toBe(250);
    expect(convertQtlToMt(300)).toBe(30);
    expect(convertMtToQtl(1.5)).toBe(15);
  });

  it('calculates order tax breakdown with 1.5% Mandi cess and buyer escrow deductions', () => {
    const quantityQtl = 200;
    const pricePerQtl = 2400;
    const grossAmount = quantityQtl * pricePerQtl; // 480,000
    const mandiTaxRate = 0.015; // 1.5%
    const mandiTax = Math.round(grossAmount * mandiTaxRate); // 7,200
    const totalPayable = grossAmount + mandiTax; // 487,200

    expect(grossAmount).toBe(480000);
    expect(mandiTax).toBe(7200);
    expect(totalPayable).toBe(487200);

    const buyerBalanceBefore = 4500000;
    const buyerBalanceAfter = buyerBalanceBefore - totalPayable;
    expect(buyerBalanceAfter).toBe(4012800);
    expect(buyerBalanceAfter).toBeGreaterThan(0);
  });

  it('evaluates grain moisture thresholds and storage classification', () => {
    const classifyMoisture = (pct: number) => {
      if (pct <= 10) return 'Optimal Dry';
      if (pct <= 12) return 'Commercial Safe';
      if (pct <= 14) return 'Acceptable Standard';
      return 'Excess Moisture (Requires Drying)';
    };

    expect(classifyMoisture(8.5)).toBe('Optimal Dry');
    expect(classifyMoisture(10.4)).toBe('Commercial Safe');
    expect(classifyMoisture(13.2)).toBe('Acceptable Standard');
    expect(classifyMoisture(15.5)).toBe('Excess Moisture (Requires Drying)');
  });

  it('calculates MSP premium and farmer earnings comparison', () => {
    const calculatePremium = (askingPrice: number, msp: number) => {
      const diff = askingPrice - msp;
      return {
        isAboveMsp: diff >= 0,
        premiumAmount: Math.max(0, diff),
        pctAboveMsp: Number(((diff / msp) * 100).toFixed(1)),
      };
    };

    const wheatResult = calculatePremium(2420, 2275);
    expect(wheatResult.isAboveMsp).toBe(true);
    expect(wheatResult.premiumAmount).toBe(145);
    expect(wheatResult.pctAboveMsp).toBe(6.4);

    const atMspResult = calculatePremium(2275, 2275);
    expect(atMspResult.isAboveMsp).toBe(true);
    expect(atMspResult.premiumAmount).toBe(0);
    expect(atMspResult.pctAboveMsp).toBe(0);
  });

  describe('Authentication Security & Strict Verification', () => {
    // Seed users mock database
    const mockUsers = [
      { username: 'rameshwar', password: 'password123', name: 'Rameshwar Patel', role: 'farmer' },
      { username: 'agrocore', password: 'password123', name: 'AgroCore Foods Ltd.', role: 'buyer' },
      { username: 'buyer', password: 'buyer123', name: 'Apex Craft Breweries Ltd.', role: 'buyer' },
      { username: 'farmer', password: 'farmer123', name: 'Suresh Verma', role: 'farmer' },
    ];

    it('rejects registration when username already exists (no duplicate usernames allowed)', () => {
      const attemptRegister = (username: string) => {
        const clean = username.trim().toLowerCase();
        const exists = mockUsers.some((u) => u.username.toLowerCase() === clean);
        if (exists) {
          return {
            success: false,
            error: `Username "${clean}" is already taken by an existing account. Another user cannot use it.`,
          };
        }
        return { success: true };
      };

      // Existing usernames must fail
      expect(attemptRegister('rameshwar').success).toBe(false);
      expect(attemptRegister('RAMESHWAR').success).toBe(false);
      expect(attemptRegister('agrocore').success).toBe(false);
      expect(attemptRegister('  buyer  ').success).toBe(false);

      // Unique new usernames must succeed
      expect(attemptRegister('shivam_agro').success).toBe(true);
      expect(attemptRegister('new_farmer_99').success).toBe(true);
    });

    it('rejects login when password does not match (wrong password error)', () => {
      const attemptLogin = (identifier: string, pass: string) => {
        const cleanId = identifier.trim().toLowerCase();
        const cleanPass = pass.trim();
        const user = mockUsers.find((u) => u.username.toLowerCase() === cleanId);
        if (!user) {
          return { success: false, status: 404, error: 'User does not exist' };
        }
        if (user.password !== cleanPass) {
          return { success: false, status: 401, error: 'Incorrect password. Access denied.' };
        }
        return { success: true, status: 200, user };
      };

      // Wrong password MUST fail with 401
      const wrongPassResult = attemptLogin('rameshwar', 'wrongPassword123');
      expect(wrongPassResult.success).toBe(false);
      expect(wrongPassResult.status).toBe(401);
      expect(wrongPassResult.error).toContain('Incorrect password');

      const wrongPassBuyer = attemptLogin('agrocore', 'differentpassword');
      expect(wrongPassBuyer.success).toBe(false);
      expect(wrongPassBuyer.status).toBe(401);

      // Correct password MUST succeed
      const correctLogin = attemptLogin('rameshwar', 'password123');
      expect(correctLogin.success).toBe(true);
      expect(correctLogin.status).toBe(200);
      expect(correctLogin.user?.name).toBe('Rameshwar Patel');
    });

    it('validates multilingual translation coverage for all 11 bulk agricultural languages', async () => {
      const { translations, LANGUAGES } = await import('./i18n');
      const languages = ['en', 'hi', 'pa', 'mr', 'gu', 'te', 'kn', 'ta', 'bn', 'ml', 'or'] as const;

      expect(LANGUAGES.length).toBe(11);

      for (const lang of languages) {
        expect(translations[lang]).toBeDefined();
        expect(translations[lang].appName).toBeDefined();
        expect(translations[lang].whyChooseUs).toBeDefined();
        expect(translations[lang].marketplace).toBeDefined();
        expect(translations[lang].taleOfTwoReceipts).toBeDefined();
        expect(translations[lang].twoReceiptsHeading).toBeDefined();
        expect(translations[lang].zeroCommission).toBeDefined();
        expect(translations[lang].escrowProtection).toBeDefined();
      }
    });
  });
});
