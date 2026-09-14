import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

interface CropRecord {
  id: string;
  title: string;
  variety: string;
  cropCategory: string;
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
  source: 'hub' | 'farmgate';
  sourceLabel: string;
  imageUrl: string;
  certBadge: string;
  moistureBadge: string;
  keyMetricLabel: string;
  keyMetricValue: string;
  status: 'available' | 'reserved' | 'sold';
  addedAt: string;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  lotId: string;
  cropTitle: string;
  cropCategory: string;
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

// In-memory persistent database store (can connect to PostgreSQL via connection string when configured)
let cropsDatabase: CropRecord[] = [
  {
    id: 'crop-1',
    title: 'Durum Sharbati Wheat (C-306 Super A-Grade)',
    variety: 'C-306',
    cropCategory: 'wheat',
    farmerName: 'Rameshwar Patel',
    fpoName: 'Malwa Kisan FPO (850 Members)',
    farmerPhone: '+91 98260-44120',
    batchQuantityQtl: 300,
    qualityScore: 98.2,
    qualityGrade: 'AGMARK Grade-1',
    moisturePct: 10.4,
    pricePerQtl: 2420,
    mandiRate: 2350,
    premiumText: '+₹70 premium',
    location: 'Gram Datoda Hub #4',
    distanceKm: 14,
    source: 'hub',
    sourceLabel: 'Local Mandi Hub',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfA43YzxtpL2BRPGL788li1Cfm2MBZjnYwIx83I4g3RBr8bN8oxRSkzpCzydY2eEZls9xvUvsN_vSKxwhbvjgUKvNP0x8jS2g0YWLc_w-fmUY7Ix8LlDxJDu4Xv8WC5eKeaRm30xl9k22H15iE5KLRU7YVj8zZkg0jgI5O9qeZY2lmifevBoJeYYsjmMmt8U6PWZcDxiloF_DXdYDU8M_V53mZGWQS5uSPF0qxtIiokOHtod6-71bc',
    certBadge: 'AGMARK Grade-1',
    moistureBadge: 'Moisture: 10.4%',
    keyMetricLabel: 'Quality Score',
    keyMetricValue: '98.2 / 100 Pure',
    status: 'available',
    addedAt: '2026-09-10',
  },
  {
    id: 'crop-2',
    title: 'Organic Desi Chana (Bengal Gram JG-11)',
    variety: 'JG-11',
    cropCategory: 'chana',
    farmerName: 'Nimar Agro Farmer Producer Co.',
    fpoName: 'Nimar Valley Cooperative',
    farmerPhone: '+91 97551-88932',
    batchQuantityQtl: 250,
    qualityScore: 96.8,
    qualityGrade: 'NPOP Organic',
    moisturePct: 9.8,
    pricePerQtl: 5480,
    mandiRate: 5380,
    premiumText: 'MSP Protected',
    location: 'Ujjain Central',
    distanceKm: 38,
    source: 'hub',
    sourceLabel: 'Local Mandi Hub',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoVsKHunbCqL3zT5yZUVea7Sn-Wg5cQrAh7O2OoCxePNtcAgIWb5PV_PJtyHGahxexK8GlxI9nSJkUz9SjEXrL8ThGe__AI3pO4UNQp726rSXmvVdebRAPwWwoVNUGwfJG9-Y-mRzgp3eRNK4rWsNvM4nHR0U4dRDOVU1mPemjiGQQeZnhxgHzI027IpCYQP7kkAZNGMA-MvRx_2I4fib5OvBoIRrpvyjwsjhsCozIRRn9UXzlnSAT',
    certBadge: 'NPOP Organic',
    moistureBadge: 'Moisture: 9.8%',
    keyMetricLabel: 'Quality Score',
    keyMetricValue: '96.8 / 100 Organic',
    status: 'available',
    addedAt: '2026-09-09',
  },
  {
    id: 'crop-3',
    title: 'Yellow Soybean (JS-9560 Certified Seed)',
    variety: 'JS-9560',
    cropCategory: 'soybean',
    farmerName: 'Hoshangabad Progressive FPO',
    fpoName: 'Hoshangabad Progressive FPO (1,200 Farmers)',
    farmerPhone: '+91 94250-12093',
    batchQuantityQtl: 450,
    qualityScore: 94.0,
    qualityGrade: 'AGMARK Certified',
    moisturePct: 8.4,
    pricePerQtl: 4710,
    mandiRate: 4650,
    premiumText: 'Verified Lab Report',
    location: 'Sehore Bay 2',
    distanceKm: 62,
    source: 'hub',
    sourceLabel: 'Lab Tested (Verified)',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbbMhGkaW6euQ9Gqd0368Le8yIYGF_f0489XFEGQzW5XZwLrWJ9WAxXoysB8MAZcp-auwb1LrSezyA5AwwFyDAfESB2IxGBFqkwJLSBezMYN0VpcRl1zf4GhiAmdBdYQ7D0vTekKBNR_RYAYv0HR1yxm0LnBK9cNFUgeQ0Kz92GMDNYvhnIlb1bUENT66CsWTqy19H0qhKy2aQMUCN5kVjzFL7XYlG9Tr8MqydRhvjh_xzotLy4WJY',
    certBadge: 'AGMARK Certified',
    moistureBadge: 'Oil: 18.5%',
    keyMetricLabel: 'Moisture Level',
    keyMetricValue: '8.4% (Safe Store)',
    status: 'available',
    addedAt: '2026-09-08',
  },
  {
    id: 'crop-4',
    title: 'Dollar Grade-1 Bold Kabuli Chana',
    variety: 'Dollar Grade-1',
    cropCategory: 'chana',
    farmerName: 'Gurpreet Singh',
    fpoName: 'Malwa Farmers Collective',
    farmerPhone: '+91 98930-77182',
    batchQuantityQtl: 180,
    qualityScore: 99.0,
    qualityGrade: 'Export Quality (Grade 1)',
    moisturePct: 8.9,
    pricePerQtl: 7800,
    mandiRate: 7600,
    premiumText: 'Export Quality (Grade 1)',
    location: 'Dewas Agro',
    distanceKm: 22,
    source: 'farmgate',
    sourceLabel: 'Direct from Farm',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBN_zg7XHjrLUqGj_W-HovZy-UhnIWgvt_e22bItcDFZ1Gw_pkAN6y6EQDa_qVdpCp1fVy078xrbH8_MJsrGzYIMTI8TTBGVsTd6QkLAouhWwzVL2MBk93J2KWgAxRTAZcOBDSvySPVALzoPNfjemyFREZPWkBlY0ioKK-sT6S2Zk2-f7Wy0tPp8Ofp6ibuMtNvX90GMz11msKIUKHzXjHhTyOPiXBUJ76KyeSY3haj8eaB52UJ3MYy',
    certBadge: 'Ready to Ship',
    moistureBadge: 'Moisture: 8.9%',
    keyMetricLabel: 'Seed Size',
    keyMetricValue: '42-44 Count/Oz',
    status: 'available',
    addedAt: '2026-09-07',
  },
  {
    id: 'crop-5',
    title: 'Pusa Bold High-Oil Mustard Seeds',
    variety: 'Pusa Bold',
    cropCategory: 'mustard',
    farmerName: 'Morena Agri Cluster Hub',
    fpoName: 'Chambal Valley Farmers',
    farmerPhone: '+91 97532-61901',
    batchQuantityQtl: 400,
    qualityScore: 95.2,
    qualityGrade: 'High-Yield Expeller',
    moisturePct: 6.8,
    pricePerQtl: 5450,
    mandiRate: 5410,
    premiumText: 'High-Yield Expeller',
    location: 'Chambal Depot',
    distanceKm: 85,
    source: 'hub',
    sourceLabel: 'Local Mandi Hub',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8gXkKIBzvdi3TGfnd2AoLnVn89TTV-DrPmmDZTxsfa71q5qMAIcYFvDG9RN6zZxEAzINhTTVtsMyOomo_b9NMAJVDydCp-VmJmRn_CLlfyhD9oGS3k5qBjjn1emXFKdQVHNTy8EjRPr2Ugyq2ZYcq7Sr7Hci4fJ8qzmiX32MpxABKpAeurmiRcq6ulwh5UbHykA45lSDwszDwTgLLe5T16eIFi7YUOba7EqddJMs1G71827TIT4GL',
    certBadge: 'Lab Tested (Verified)',
    moistureBadge: 'Oil: 41.2%',
    keyMetricLabel: 'Impurities / Cleanliness',
    keyMetricValue: '< 0.4% Clean',
    status: 'available',
    addedAt: '2026-09-06',
  },
  {
    id: 'crop-6',
    title: 'Shankar-6 Long Staple Cotton Bales',
    variety: 'Shankar-6',
    cropCategory: 'cotton',
    farmerName: 'Khandwa Cotton Producers',
    fpoName: 'Khandwa Cotton Co-Op',
    farmerPhone: '+91 94066-55209',
    batchQuantityQtl: 120,
    qualityScore: 93.5,
    qualityGrade: 'Super Combed',
    moisturePct: 7.2,
    pricePerQtl: 6850,
    mandiRate: 6720,
    premiumText: 'Trash < 2.5%',
    location: 'Khandwa',
    distanceKm: 110,
    source: 'farmgate',
    sourceLabel: '120 Bales',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYgwAr3XFQrxNHy89mJqcpD8qP9Wac7Qa1_F8PDHGTiOYgdRLjm-8soiAbcRWkanr2EDsSg9qx2la_DM-kMMJAPjMp_IwVl-oQ1egBlC0gKi6qz6-MVZBZmAZ9-zJxeGr0jtaho9nqsfznjt-lBgZmvURRyXMADGHb7kMs7BlV7-nQ1ZOak2ftmwFUhPTOE9OXF6PDqCCQXakynmC1pAWEl309do1-XCmXyGPdrOD72QNTZs9ExwtX',
    certBadge: 'Direct from Farm',
    moistureBadge: 'Staple: 29.5 mm',
    keyMetricLabel: 'Micronaire',
    keyMetricValue: '3.8 - 4.2 Fine',
    status: 'available',
    addedAt: '2026-09-05',
  },
];

let ordersDatabase: OrderRecord[] = [
  {
    id: 'ord-101',
    orderNumber: 'PO-2026-0891',
    lotId: 'crop-1',
    cropTitle: 'Durum Sharbati Wheat (C-306)',
    cropCategory: 'wheat',
    quantityQtl: 150,
    pricePerQtl: 2420,
    grossAmount: 363000,
    mandiTax: 5445,
    totalAmount: 368445,
    buyerId: 'buyer-01',
    buyerName: 'AgroCore Foods Ltd.',
    farmerName: 'Rameshwar Patel',
    fpoName: 'Malwa Kisan FPO',
    farmerPhone: '+91 98260-44120',
    status: 'weighbridge_verified',
    createdAt: '2026-09-09',
    transitPassNo: 'MP-TP-2026-9921',
    destinationMandi: 'Indore Central Depot',
    weighbridgeWeightQtl: 150.2,
  },
  {
    id: 'ord-102',
    orderNumber: 'PO-2026-0892',
    lotId: 'crop-3',
    cropTitle: 'Yellow Soybean (JS-9560)',
    cropCategory: 'soybean',
    quantityQtl: 200,
    pricePerQtl: 4710,
    grossAmount: 942000,
    mandiTax: 14130,
    totalAmount: 956130,
    buyerId: 'buyer-01',
    buyerName: 'AgroCore Foods Ltd.',
    farmerName: 'Hoshangabad Progressive FPO',
    fpoName: 'Hoshangabad Progressive FPO',
    farmerPhone: '+91 94250-12093',
    status: 'transit_scheduled',
    createdAt: '2026-09-10',
    transitPassNo: 'MP-TP-2026-9945',
    destinationMandi: 'Sehore Logistics Hub',
  },
  {
    id: 'ord-103',
    orderNumber: 'PO-2026-0893',
    lotId: 'crop-2',
    cropTitle: 'Organic Desi Chana (JG-11)',
    cropCategory: 'chana',
    quantityQtl: 100,
    pricePerQtl: 5480,
    grossAmount: 548000,
    mandiTax: 8220,
    totalAmount: 556220,
    buyerId: 'buyer-01',
    buyerName: 'AgroCore Foods Ltd.',
    farmerName: 'Nimar Agro FPC',
    fpoName: 'Nimar Valley Cooperative',
    farmerPhone: '+91 97551-88932',
    status: 'escrow_locked',
    createdAt: '2026-09-11',
    transitPassNo: 'MP-TP-2026-9988',
    destinationMandi: 'Ujjain Central Warehouses',
  },
];

interface AuthUser {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'buyer' | 'farmer';
  orgName: string;
  phone: string;
  email: string;
  location: string;
  escrowBalance?: number;
  verified: boolean;
  memberCount?: number;
}

const USERS_FILE_PATH = path.join(process.cwd(), 'src/data/users.json');

const SEED_USERS: AuthUser[] = [
  {
    id: 'buyer-01',
    username: 'agrocore',
    password: 'password123',
    name: 'AgroCore Foods Ltd.',
    role: 'buyer',
    orgName: 'AgroCore Foods Ltd.',
    phone: '+91 91234-56789',
    email: 'procurement@agrocore.com',
    location: 'Indore Central Industrial Area, MP',
    escrowBalance: 4500000,
    verified: true,
  },
  {
    id: 'farmer-01',
    username: 'rameshwar',
    password: 'password123',
    name: 'Rameshwar Patel',
    role: 'farmer',
    orgName: 'Malwa Kisan FPO',
    phone: '+91 98260-44120',
    email: 'rameshwar.patel@malwafpo.in',
    location: 'Gram Datoda Hub #4, Indore, MP',
    verified: true,
    memberCount: 850,
  },
  {
    id: 'buyer-02',
    username: 'buyer',
    password: 'buyer123',
    name: 'Apex Craft Breweries Ltd.',
    role: 'buyer',
    orgName: 'Apex Craft Maltsters',
    phone: '+91 99887-66554',
    email: 'trade@apexmalt.com',
    location: 'Bhopal Agro Complex, MP',
    escrowBalance: 3200000,
    verified: true,
  },
  {
    id: 'farmer-02',
    username: 'farmer',
    password: 'farmer123',
    name: 'Suresh Verma',
    role: 'farmer',
    orgName: 'Nimar Agro Farmer Producer Co.',
    phone: '+91 97551-88932',
    email: 'suresh.verma@nimarfpo.in',
    location: 'Ujjain Central Agro Hub, MP',
    verified: true,
    memberCount: 420,
  },
];

function loadUsersFromDisk(): AuthUser[] {
  try {
    if (fs.existsSync(USERS_FILE_PATH)) {
      const raw = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure initial seeds exist in the list
        const list = [...parsed];
        let changed = false;
        for (const seed of SEED_USERS) {
          if (!list.some((u) => u.username.toLowerCase() === seed.username.toLowerCase())) {
            list.push(seed);
            changed = true;
          }
        }
        if (changed) {
          saveUsersToDisk(list);
        }
        return list;
      }
    }
  } catch (err) {
    console.error('Error reading users from disk:', err);
  }
  // Initialize file with seed users if not found or corrupted
  saveUsersToDisk(SEED_USERS);
  return [...SEED_USERS];
}

function saveUsersToDisk(users: AuthUser[]): void {
  try {
    const dir = path.dirname(USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving users to disk:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'AgriTrade Nexus API' });
  });

  // Check username availability endpoint
  app.get('/api/auth/check-username', (req, res) => {
    const rawUsername = String(req.query.username || '').trim().toLowerCase();
    if (!rawUsername) {
      return res.status(400).json({ success: false, available: false, message: 'Username is required' });
    }
    const currentUsers = loadUsersFromDisk();
    const exists = currentUsers.some((u) => u.username.toLowerCase() === rawUsername);
    return res.json({ success: true, username: rawUsername, available: !exists });
  });

  // Register endpoint with strict username uniqueness enforcement
  app.post('/api/auth/register', (req, res) => {
    const { username, password, name, role, orgName, phone, email, location } = req.body;

    const cleanUsername = String(username || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();
    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (!cleanUsername) {
      return res.status(400).json({ success: false, message: 'Username is required.' });
    }
    if (cleanUsername.length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long.' });
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message: 'Username can only contain letters, numbers, underscores, dots, or hyphens (no spaces).',
      });
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      return res.status(400).json({ success: false, message: 'Password must be at least 4 characters long.' });
    }
    if (!cleanName) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }

    const currentUsers = loadUsersFromDisk();

    // STRICT CHECK: Does username already exist? If so, REJECT WITH 409 CONFLICT
    const existingUser = currentUsers.find((u) => u.username.toLowerCase() === cleanUsername);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: `Username "${cleanUsername}" is already taken by an existing account. Please choose a different username or sign in with your password.`,
      });
    }

    // Check email uniqueness if email provided
    if (cleanEmail && cleanEmail.includes('@')) {
      const existingEmail = currentUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: `Email "${cleanEmail}" is already registered. Please sign in or use a different email.`,
        });
      }
    }

    const assignedRole: 'buyer' | 'farmer' = role === 'farmer' ? 'farmer' : 'buyer';
    const newUser: AuthUser = {
      id: `${assignedRole}-${Date.now()}`,
      username: cleanUsername,
      password: cleanPassword,
      name: cleanName,
      role: assignedRole,
      orgName:
        orgName?.trim() ||
        (assignedRole === 'farmer'
          ? `${cleanName} Kisan FPO Producer Co.`
          : `${cleanName} Agro Trading Ltd.`),
      phone: phone?.trim() || '+91 98765-43210',
      email: cleanEmail || `${cleanUsername}@agritrade.internal`,
      location:
        location?.trim() ||
        (assignedRole === 'farmer'
          ? 'Datoda Agritech Hub, Indore, MP'
          : 'Indore Central Industrial Area, MP'),
      escrowBalance: assignedRole === 'buyer' ? 4500000 : undefined,
      verified: true,
      memberCount: assignedRole === 'farmer' ? 500 : undefined,
    };

    currentUsers.push(newUser);
    saveUsersToDisk(currentUsers);

    // Return safe user object without password
    const { password: _, ...safeUser } = newUser;
    return res.status(201).json({
      success: true,
      user: safeUser,
      token: `nexus_jwt_${newUser.id}_${Date.now()}`,
    });
  });

  // Login endpoint with strict password check and username lookup
  app.post('/api/auth/login', (req, res) => {
    const { identifier, username, email, password } = req.body;
    const query = String(identifier || username || email || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your username, email, or registered phone number.',
      });
    }
    if (!cleanPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your password.',
      });
    }

    const currentUsers = loadUsersFromDisk();

    // STRICT MATCHING: Only exact username, valid email, or complete 10-digit phone
    let matchedUser = currentUsers.find((u) => u.username.toLowerCase() === query);

    if (!matchedUser && query.includes('@')) {
      matchedUser = currentUsers.find((u) => u.email.toLowerCase() === query);
    }

    const queryDigits = query.replace(/\D/g, '');
    if (!matchedUser && queryDigits.length >= 10) {
      matchedUser = currentUsers.find((u) => {
        const uDigits = u.phone.replace(/\D/g, '');
        return uDigits.length >= 10 && (uDigits.endsWith(queryDigits) || queryDigits.endsWith(uDigits));
      });
    }

    // STRICT CHECK 1: Account does not exist
    if (!matchedUser) {
      return res.status(404).json({
        success: false,
        message: `No account exists with username "${query}". Please check your username or register a new account.`,
      });
    }

    // STRICT CHECK 2: User exists, check password!
    if (matchedUser.password !== cleanPassword) {
      return res.status(401).json({
        success: false,
        message: `Incorrect password for username "${matchedUser.username}". Access denied.`,
      });
    }

    // Case 3: Credentials match! Return safe user info and auth token
    const { password: _, ...safeUser } = matchedUser;
    return res.json({
      success: true,
      user: safeUser,
      token: `nexus_jwt_${matchedUser.id}_${Date.now()}`,
    });
  });

  // Crops endpoints
  app.get('/api/crops', (req, res) => {
    res.json(cropsDatabase);
  });

  app.post('/api/crops', (req, res) => {
    const newCrop: CropRecord = {
      id: 'crop-' + (Date.now()),
      title: req.body.title || 'Fresh Crop Batch',
      variety: req.body.variety || 'Certified Grade-1',
      cropCategory: req.body.cropCategory || 'wheat',
      farmerName: req.body.farmerName || 'Rameshwar Patel',
      fpoName: req.body.fpoName || 'Malwa Kisan FPO',
      farmerPhone: req.body.farmerPhone || '+91 98260-44120',
      batchQuantityQtl: Number(req.body.batchQuantityQtl) || 100,
      qualityScore: Number(req.body.qualityScore) || 96.0,
      qualityGrade: req.body.qualityGrade || 'AGMARK Grade-1',
      moisturePct: Number(req.body.moisturePct) || 9.5,
      pricePerQtl: Number(req.body.pricePerQtl) || 2400,
      mandiRate: Number(req.body.mandiRate) || 2350,
      premiumText: req.body.premiumText || 'Direct Farmgate',
      location: req.body.location || 'Gram Datoda Hub',
      distanceKm: Number(req.body.distanceKm) || 15,
      source: req.body.source || 'hub',
      sourceLabel: req.body.source === 'farmgate' ? 'Direct from Farm' : 'Local Mandi Hub',
      imageUrl: req.body.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfA43YzxtpL2BRPGL788li1Cfm2MBZjnYwIx83I4g3RBr8bN8oxRSkzpCzydY2eEZls9xvUvsN_vSKxwhbvjgUKvNP0x8jS2g0YWLc_w-fmUY7Ix8LlDxJDu4Xv8WC5eKeaRm30xl9k22H15iE5KLRU7YVj8zZkg0jgI5O9qeZY2lmifevBoJeYYsjmMmt8U6PWZcDxiloF_DXdYDU8M_V53mZGWQS5uSPF0qxtIiokOHtod6-71bc',
      certBadge: req.body.certBadge || 'AGMARK Grade-1',
      moistureBadge: `Moisture: ${req.body.moisturePct || 9.5}%`,
      keyMetricLabel: 'Quality Score',
      keyMetricValue: `${req.body.qualityScore || 96.0} / 100 Pure`,
      status: 'available',
      addedAt: new Date().toISOString().split('T')[0],
    };

    cropsDatabase.unshift(newCrop);
    res.status(201).json({ success: true, crop: newCrop });
  });

  app.delete('/api/crops/:id', (req, res) => {
    const { id } = req.params;
    const initialLen = cropsDatabase.length;
    cropsDatabase = cropsDatabase.filter(c => c.id !== id);
    if (cropsDatabase.length < initialLen) {
      res.json({ success: true, message: `Crop ${id} deleted successfully` });
    } else {
      res.status(404).json({ success: false, message: 'Crop not found' });
    }
  });

  app.patch('/api/crops/:id', (req, res) => {
    const { id } = req.params;
    const { pricePerQtl, batchQuantityQtl } = req.body;
    const crop = cropsDatabase.find(c => c.id === id);
    if (crop) {
      if (pricePerQtl !== undefined) crop.pricePerQtl = Number(pricePerQtl);
      if (batchQuantityQtl !== undefined) crop.batchQuantityQtl = Number(batchQuantityQtl);
      res.json({ success: true, crop });
    } else {
      res.status(404).json({ success: false, message: 'Crop not found' });
    }
  });

  // Orders endpoints
  app.get('/api/orders', (req, res) => {
    res.json(ordersDatabase);
  });

  app.post('/api/orders', (req, res) => {
    const {
      lotId,
      cropTitle,
      cropCategory,
      quantityQtl,
      pricePerQtl,
      buyerId,
      buyerName,
      farmerName,
      fpoName,
      farmerPhone,
      destinationMandi,
    } = req.body;

    const gross = (Number(quantityQtl) || 100) * (Number(pricePerQtl) || 2000);
    const tax = gross * 0.015;
    const total = gross + tax;

    const newOrder: OrderRecord = {
      id: 'ord-' + Date.now(),
      orderNumber: 'PO-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      lotId: lotId || 'crop-1',
      cropTitle: cropTitle || 'Agricultural Commodity',
      cropCategory: cropCategory || 'wheat',
      quantityQtl: Number(quantityQtl) || 100,
      pricePerQtl: Number(pricePerQtl) || 2000,
      grossAmount: gross,
      mandiTax: tax,
      totalAmount: total,
      buyerId: buyerId || 'buyer-01',
      buyerName: buyerName || 'AgroCore Foods Ltd.',
      farmerName: farmerName || 'Rameshwar Patel',
      fpoName: fpoName || 'Malwa Kisan FPO',
      farmerPhone: farmerPhone || '+91 98260-44120',
      status: 'escrow_locked',
      createdAt: new Date().toISOString().split('T')[0],
      transitPassNo: 'MP-TP-2026-' + Math.floor(1000 + Math.random() * 9000),
      destinationMandi: destinationMandi || 'Indore Mandi Terminal',
    };

    ordersDatabase.unshift(newOrder);

    // Update crop status if quantity depleted
    const targetCrop = cropsDatabase.find(c => c.id === lotId);
    if (targetCrop) {
      if (targetCrop.batchQuantityQtl <= quantityQtl) {
        targetCrop.status = 'reserved';
      } else {
        targetCrop.batchQuantityQtl -= quantityQtl;
      }
    }

    res.status(201).json({ success: true, order: newOrder });
  });

  // Update order status (for farmer dispatch or buyer completion)
  app.patch('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, weighbridgeWeightQtl } = req.body;
    const order = ordersDatabase.find(o => o.id === id);
    if (order) {
      order.status = status;
      if (weighbridgeWeightQtl) {
        order.weighbridgeWeightQtl = Number(weighbridgeWeightQtl);
      }
      res.json({ success: true, order });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  });

  // Vite integration:
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriTrade Nexus server listening on port ${PORT}`);
  });
}

startServer();
