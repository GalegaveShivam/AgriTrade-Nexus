import { User, UserRole } from '../types';
import { INITIAL_BUYER_USER, INITIAL_FARMER_USER } from '../data/initialData';

export interface AuthAccount {
  id: string;
  username: string; // lowercase trimmed unique identifier
  password: string;
  name: string;
  role: UserRole;
  orgName: string;
  phone: string;
  email: string;
  location: string;
  escrowBalance?: number;
  verified: boolean;
  memberCount?: number;
  createdAt: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  orgName?: string;
  location?: string;
}

export interface LoginParams {
  identifier: string; // username, email, or mobile
  password: string;
  expectedRole?: UserRole;
}

const STORAGE_KEY = 'agritrade_registered_accounts_v1';

// Seed default initial accounts
const DEFAULT_SEED_ACCOUNTS: AuthAccount[] = [
  {
    id: INITIAL_BUYER_USER.id,
    username: 'agrocore',
    password: 'password123',
    name: INITIAL_BUYER_USER.name,
    role: 'buyer',
    orgName: INITIAL_BUYER_USER.orgName,
    phone: INITIAL_BUYER_USER.phone,
    email: INITIAL_BUYER_USER.email,
    location: INITIAL_BUYER_USER.location,
    escrowBalance: INITIAL_BUYER_USER.escrowBalance,
    verified: true,
    createdAt: '2026-09-01',
  },
  {
    id: INITIAL_FARMER_USER.id,
    username: 'rameshwar',
    password: 'password123',
    name: INITIAL_FARMER_USER.name,
    role: 'farmer',
    orgName: INITIAL_FARMER_USER.orgName,
    phone: INITIAL_FARMER_USER.phone,
    email: INITIAL_FARMER_USER.email,
    location: INITIAL_FARMER_USER.location,
    verified: true,
    memberCount: INITIAL_FARMER_USER.memberCount,
    createdAt: '2026-09-01',
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
    createdAt: '2026-09-02',
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
    createdAt: '2026-09-02',
  },
];

/**
 * Get all accounts stored in localStorage, merging with default accounts.
 */
export function getStoredAccounts(): AuthAccount[] {
  if (typeof window === 'undefined') return DEFAULT_SEED_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_ACCOUNTS));
      return DEFAULT_SEED_ACCOUNTS;
    }
    const parsed: AuthAccount[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SEED_ACCOUNTS));
      return DEFAULT_SEED_ACCOUNTS;
    }

    // Ensure default seeds are always present if not already in parsed list
    let updated = false;
    const combined = [...parsed];
    for (const def of DEFAULT_SEED_ACCOUNTS) {
      if (!combined.some((a) => a.username.toLowerCase() === def.username.toLowerCase())) {
        combined.push(def);
        updated = true;
      }
    }
    if (updated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
    }
    return combined;
  } catch (err) {
    console.error('Failed to read accounts from storage', err);
    return DEFAULT_SEED_ACCOUNTS;
  }
}

/**
 * Save accounts to local storage
 */
export function saveAccounts(accounts: AuthAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save accounts to storage', err);
  }
}

/**
 * Convert AuthAccount to public User interface
 */
export function accountToUser(account: AuthAccount): User {
  return {
    id: account.id,
    username: account.username,
    name: account.name,
    role: account.role,
    orgName: account.orgName,
    phone: account.phone,
    email: account.email,
    location: account.location,
    escrowBalance: account.escrowBalance,
    verified: account.verified,
    memberCount: account.memberCount,
  };
}

/**
 * Check if a username is already taken (case-insensitive)
 */
export async function isUsernameTaken(rawUsername: string): Promise<boolean> {
  const normalized = rawUsername.trim().toLowerCase();
  if (!normalized) return false;

  // 1. Check local storage accounts
  const localAccounts = getStoredAccounts();
  const localExists = localAccounts.some(
    (acc) => acc.username.toLowerCase() === normalized
  );
  if (localExists) return true;

  // 2. Cross-check backend API
  try {
    const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(normalized)}`);
    if (res.ok) {
      const data = await res.json();
      if (typeof data.available === 'boolean') {
        return !data.available;
      }
    }
  } catch {
    // offline / fallback to local state
  }

  return false;
}

/**
 * Register a new user with strict username uniqueness enforcement.
 */
export async function registerUser(
  params: RegisterParams
): Promise<{ success: boolean; user?: User; error?: string }> {
  const cleanUsername = params.username.trim().toLowerCase();
  const cleanName = params.name.trim();
  const cleanPassword = params.password.trim();
  const cleanEmail = params.email.trim().toLowerCase();

  // Validations
  if (!cleanUsername) {
    return { success: false, error: 'Please choose a username.' };
  }
  if (cleanUsername.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters long.' };
  }
  if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
    return {
      success: false,
      error: 'Username can only contain letters, numbers, underscores, dots, or hyphens (no spaces).',
    };
  }
  if (!cleanName) {
    return { success: false, error: 'Please enter your full name or authorized officer name.' };
  }
  if (!cleanPassword) {
    return { success: false, error: 'Please enter a password.' };
  }
  if (cleanPassword.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }
  if (!cleanEmail) {
    return { success: false, error: 'Please enter your email or registered phone number.' };
  }

  // CRITICAL CHECK 1: Ensure username does NOT already exist
  const taken = await isUsernameTaken(cleanUsername);
  if (taken) {
    return {
      success: false,
      error: `Username "${cleanUsername}" is already taken. Please choose a different username or sign in.`,
    };
  }

  // Check email/phone uniqueness locally
  const currentAccounts = getStoredAccounts();
  const emailInUse = currentAccounts.some(
    (acc) => acc.email.toLowerCase() === cleanEmail && cleanEmail.includes('@')
  );
  if (emailInUse) {
    return {
      success: false,
      error: `An account with email "${cleanEmail}" already exists. Please sign in or use a different email.`,
    };
  }

  const newAccount: AuthAccount = {
    id: `${params.role}-${Date.now()}`,
    username: cleanUsername,
    password: cleanPassword,
    name: cleanName,
    role: params.role,
    orgName:
      params.orgName?.trim() ||
      (params.role === 'farmer'
        ? `${cleanName} Kisan FPO Producer Co.`
        : `${cleanName} Agro Trading Ltd.`),
    phone: params.phone?.trim() || (cleanEmail.match(/^\d+$/) ? cleanEmail : '+91 98765-43210'),
    email: cleanEmail,
    location:
      params.location?.trim() ||
      (params.role === 'farmer'
        ? 'Datoda Agritech Hub, Indore, MP'
        : 'Indore Central Industrial Area, MP'),
    escrowBalance: params.role === 'buyer' ? 4500000 : undefined,
    verified: true,
    memberCount: params.role === 'farmer' ? 500 : undefined,
    createdAt: new Date().toISOString().split('T')[0],
  };

  // Try to persist to backend
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: newAccount.username,
        password: newAccount.password,
        name: newAccount.name,
        role: newAccount.role,
        orgName: newAccount.orgName,
        phone: newAccount.phone,
        email: newAccount.email,
        location: newAccount.location,
      }),
    });

    const errData = await res.json().catch(() => null);

    if (!res.ok || !errData?.success) {
      return {
        success: false,
        error: errData?.message || `Username "${cleanUsername}" is already taken. Please choose a different username.`,
      };
    }
  } catch (err) {
    console.warn('Backend register sync fallback to localStorage', err);
  }

  // Save to local storage
  currentAccounts.push(newAccount);
  saveAccounts(currentAccounts);

  return {
    success: true,
    user: accountToUser(newAccount),
  };
}

/**
 * Log in a user with strict password verification and username lookup.
 */
export async function loginUser(
  params: LoginParams
): Promise<{ success: boolean; user?: User; error?: string }> {
  const cleanIdentifier = params.identifier.trim();
  const cleanPassword = params.password.trim();

  if (!cleanIdentifier) {
    return { success: false, error: 'Please enter your username, email, or registered phone number.' };
  }
  if (!cleanPassword) {
    return { success: false, error: 'Please enter your password.' };
  }

  // 1. First attempt login through backend API
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: cleanIdentifier,
        username: cleanIdentifier,
        password: cleanPassword,
        role: params.expectedRole,
      }),
    });

    const data = await res.json().catch(() => null);

    if (res.status === 401) {
      // Wrong password - STRICT REJECTION!
      return {
        success: false,
        error: data?.message || `Incorrect password for "${cleanIdentifier}". Please verify your password and try again.`,
      };
    }

    if (res.status === 404) {
      // User does not exist
      return {
        success: false,
        error: data?.message || `No account found with username "${cleanIdentifier}". Please check your username or register.`,
      };
    }

    if (res.ok && data?.success && data?.user) {
      return {
        success: true,
        user: data.user,
      };
    }

    if (!res.ok) {
      return {
        success: false,
        error: data?.message || 'Authentication failed. Please verify credentials.',
      };
    }
  } catch (err) {
    console.warn('Backend login endpoint unavailable, verifying against local database', err);
  }

  // 2. Fallback / Client-side verification against stored accounts
  const accounts = getStoredAccounts();
  const target = cleanIdentifier.toLowerCase();
  const targetDigits = target.replace(/\D/g, '');

  // STRICT MATCHING: exact username, or exact email, or phone with >= 10 digits
  const matchedAccount = accounts.find(
    (acc) =>
      acc.username.toLowerCase() === target ||
      (target.includes('@') && acc.email.toLowerCase() === target) ||
      (targetDigits.length >= 10 && acc.phone.replace(/\D/g, '').endsWith(targetDigits))
  );

  // If username does not exist
  if (!matchedAccount) {
    return {
      success: false,
      error: `No account found with username "${cleanIdentifier}". Please register a new profile or check your username.`,
    };
  }

  // If username exists, CHECK THE PASSWORD!
  if (matchedAccount.password !== cleanPassword) {
    return {
      success: false,
      error: `Incorrect password for username "${matchedAccount.username}". Please verify your password and try again.`,
    };
  }

  return {
    success: true,
    user: accountToUser(matchedAccount),
  };
}
