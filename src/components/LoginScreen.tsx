import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { BRAND_LOGO_URL, INITIAL_BUYER_USER, INITIAL_FARMER_USER } from '../data/initialData';

interface LoginScreenProps {
  initialRole?: UserRole;
  onLoginSuccess: (user: User) => void;
  onBack: () => void;
  onRequestAccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  initialRole = 'buyer',
  onLoginSuccess,
  onBack,
  onRequestAccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'farmer'>(
    initialRole === 'farmer' ? 'farmer' : 'buyer'
  );
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync role change without pre-filling mock data
  const handleRoleChange = (role: 'buyer' | 'farmer') => {
    setSelectedRole(role);
    setErrorMsg('');
  };

  const handleVerifyAndLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg(
        selectedRole === 'farmer'
          ? 'Please enter your name or FPO coordinator identity.'
          : 'Please enter authorized officer name.'
      );
      return;
    }

    if (!email.trim()) {
      setErrorMsg(
        selectedRole === 'farmer'
          ? 'Please enter your registered mobile number or email.'
          : 'Please enter your business email.'
      );
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (email.toLowerCase().includes('student')) {
      setErrorMsg(
        'Student accounts are restricted from institutional trading terminals. Please sign in as a verified FPO/Farmer or Commercial Buyer.'
      );
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const userOrg = orgName.trim()
        ? orgName.trim()
        : selectedRole === 'farmer'
        ? `${name.trim()} Kisan FPO Producer Co.`
        : `${name.trim()} Agro Trading Ltd.`;

      const verifiedUser: User = {
        id: `${selectedRole}-${Date.now()}`,
        name: name.trim(),
        role: selectedRole,
        orgName: userOrg,
        phone: selectedRole === 'farmer' ? (email.match(/^\d+$/) ? email : '+91 98260-44120') : '+91 91234-56789',
        email: email.trim(),
        location:
          selectedRole === 'farmer'
            ? 'Datoda Agritech Hub, Indore, MP'
            : 'Indore Central Industrial Area, MP',
        escrowBalance: selectedRole === 'buyer' ? 4500000 : undefined,
        verified: true,
        memberCount: selectedRole === 'farmer' ? 650 : undefined,
      };

      onLoginSuccess(verifiedUser);
    }, 600);
  };

  const handleQuickPreset = (role: 'buyer' | 'farmer') => {
    handleRoleChange(role);
    if (role === 'farmer') {
      onLoginSuccess(INITIAL_FARMER_USER);
    } else {
      onLoginSuccess(INITIAL_BUYER_USER);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fc] text-[#131b2e] flex flex-col justify-between selection:bg-[#c1ecd4] selection:text-[#002114]">
      {/* 1. Top Exchange Terminal Header Bar (Exact match to screenshot) */}
      <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#063b28] font-semibold py-1.5 px-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="Return to Main Portal"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span className="hidden sm:inline">Back to Home</span>
          </button>

          {/* Brand Logo with blue dashed border */}
          <div className="border border-dashed border-[#3b82f6] rounded-md px-2.5 py-1 flex items-center gap-2 bg-white">
            <img
              src={BRAND_LOGO_URL}
              alt="AgriTrade Nexus"
              className="h-5 w-auto object-contain"
            />
            <span className="font-serif font-bold text-gray-900 text-sm tracking-tight">
              AgriTrade Nexus
            </span>
          </div>

          {/* Exchange Terminal Tag */}
          <span className="bg-[#eef1f6] text-[#4b5563] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded">
            EXCHANGE TERMINAL
          </span>
        </div>

        {/* Right Security Badge */}
        <div className="flex items-center gap-1.5 text-[#4a5568] text-xs font-semibold tracking-wider">
          <span className="material-symbols-outlined text-[16px] text-gray-600">
            shield
          </span>
          <span className="hidden sm:inline">INSTITUTIONAL 256-BIT SSL</span>
          <span className="sm:hidden">256-BIT SSL</span>
        </div>
      </header>

      {/* 2. Centered Authentication Card & Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-4 sm:my-8">
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl border border-gray-200/80 p-7 sm:p-9 relative animate-fade-in">
          {/* Logo Squircle with Padlock Badge */}
          <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center relative mx-auto mb-4 shadow-xs">
            <img
              src={BRAND_LOGO_URL}
              alt="AgriTrade Emblem"
              className="w-8 h-8 object-contain"
            />
            <div className="w-5 h-5 rounded-full bg-[#063b28] text-white flex items-center justify-center absolute -bottom-1 -right-1 ring-2 ring-white text-[12px] shadow-xs">
              <span className="material-symbols-outlined text-[12px]">lock</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="text-center mb-5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#063b28] tracking-tight">
              {authMode === 'register' ? 'Register New Profile' : 'Welcome back'}
            </h1>
            <p className="text-xs text-gray-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
              {authMode === 'register'
                ? selectedRole === 'buyer'
                  ? 'Set up commercial brewery procurement account with verified escrow'
                  : 'Register certified FPO or farmer collective for direct mandi farmgate listing'
                : selectedRole === 'buyer'
                ? 'Direct farmgate sourcing for commercial breweries & premium grain processors'
                : 'Direct farmgate settlement for certified FPOs & farmer collectives'}
            </p>

            {/* Sign In vs Register Mode Toggle */}
            <div className="inline-flex p-1 bg-[#edf2f7] rounded-lg mt-4 border border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMsg('');
                }}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                  authMode === 'signin'
                    ? 'bg-white text-[#063b28] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg('');
                }}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                  authMode === 'register'
                    ? 'bg-white text-[#063b28] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Register New
              </button>
            </div>
          </div>

          {/* Segmented Dual Role Selector (Exact match to screenshot) */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#f3f4f6] rounded-xl mb-5 border border-gray-200">
            {/* Brewery / Buyer Tab */}
            <button
              type="button"
              id="tabBreweryBuyer"
              onClick={() => handleRoleChange('buyer')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                selectedRole === 'buyer'
                  ? 'bg-[#063b28] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-dashed border-blue-400 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                storefront
              </span>
              <span>Brewery / Buyer</span>
            </button>

            {/* Farmer / Producer Tab */}
            <button
              type="button"
              id="tabFarmerProducer"
              onClick={() => handleRoleChange('farmer')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                selectedRole === 'farmer'
                  ? 'bg-[#063b28] text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-dashed border-blue-400 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                agriculture
              </span>
              <span>Farmer / Producer</span>
            </button>
          </div>

          {/* Error notice if any */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5">
                error
              </span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleVerifyAndLogin} className="space-y-4">
            {/* Field 1: Name / Authorized Officer */}
            <div>
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <label className="font-bold text-gray-800">
                  {selectedRole === 'farmer' ? 'Farmer / Coordinator Full Name' : 'Authorized Officer Name'}
                </label>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  REQUIRED
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-gray-400 text-[18px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    selectedRole === 'farmer'
                      ? 'Enter farmer / coordinator full name'
                      : 'Enter procurement officer full name'
                  }
                  className="w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm font-medium border border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10 transition-all outline-none"
                />
              </div>
            </div>

            {/* Field 2: Organization / FPO Name (Shows for registration or optional for login) */}
            {authMode === 'register' && (
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="font-bold text-gray-800">
                    {selectedRole === 'farmer' ? 'FPO / Farm / Cooperative Name' : 'Company / Brewery Name'}
                  </label>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    OPTIONAL
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-gray-400 text-[18px]">
                    domain
                  </span>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder={
                      selectedRole === 'farmer'
                        ? 'e.g. Malwa Valley Kisan Samiti'
                        : 'e.g. Apex Craft Maltsters Ltd.'
                    }
                    className="w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm font-medium border border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10 transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* Field 3: Business Email / Mobile */}
            <div>
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <label className="font-bold text-gray-800">
                  {selectedRole === 'farmer' ? 'Registered Mobile Number or Email' : 'Work Email Address'}
                </label>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {selectedRole === 'farmer' ? 'VERIFIED ID' : 'INSTITUTIONAL'}
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-gray-400 text-[18px]">
                  {selectedRole === 'farmer' ? 'phone_iphone' : 'mail'}
                </span>
                <input
                  type={selectedRole === 'farmer' ? 'text' : 'email'}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'farmer'
                      ? 'Enter 10-digit mobile number or email'
                      : 'Enter corporate email (e.g. trade@brewery.com)'
                  }
                  className="w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm font-medium border border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10 transition-all outline-none"
                />
              </div>
            </div>

            {/* Field 4: Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <label className="font-bold text-gray-800">
                  {authMode === 'register' ? 'Create Password' : 'Password'}
                </label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset PIN dispatched to registered mobile/email.')}
                    className="text-[11px] font-bold text-[#a35d1e] hover:text-[#804612] transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-gray-400 text-[18px]">
                  key
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={authMode === 'register' ? 'Create a secure password' : 'Enter your password'}
                  className="w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 pr-10 text-xs sm:text-sm font-mono border border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Checkbox: Remember this terminal */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberTerminal"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#063b28] accent-[#063b28] focus:ring-[#063b28] border-gray-300 cursor-pointer"
              />
              <label
                htmlFor="rememberTerminal"
                className="text-xs text-gray-600 font-medium select-none cursor-pointer"
              >
                {authMode === 'register'
                  ? 'I agree to the CFTC-compliant escrow and farmgate settlement charter'
                  : 'Remember this terminal for 30 days'}
              </label>
            </div>

            {/* Submit Button (Forest green with blue dashed border outline) */}
            <button
              type="submit"
              id="signInTerminalBtn"
              disabled={isVerifying}
              className="w-full mt-2 h-12 bg-[#063b28] hover:bg-[#0a4d35] text-white font-bold rounded-xl border border-dashed border-blue-400 shadow-md flex items-center justify-center gap-2 text-sm transition-all cursor-pointer disabled:opacity-75"
            >
              {isVerifying ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  <span>{authMode === 'register' ? 'Registering Account & Escrow Key...' : 'Verifying Credentials & Escrow...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {authMode === 'register' ? 'Complete Registration & Enter' : 'Sign In to Marketplace'}
                  </span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Personas - Clearly labeled as optional demo shortcuts */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">
              Or Instant Demo Sign-In (Optional)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset('farmer')}
                className="py-1.5 px-2 bg-gray-50 hover:bg-green-50 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-700 hover:text-[#063b28] transition-colors flex items-center justify-center gap-1 truncate"
                title="Sign in as Rameshwar Patel (Malwa Kisan FPO)"
              >
                <span className="material-symbols-outlined text-[14px] text-[#063b28]">agriculture</span>
                <span className="truncate">Demo Farmer Profile</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('buyer')}
                className="py-1.5 px-2 bg-gray-50 hover:bg-green-50 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-700 hover:text-[#063b28] transition-colors flex items-center justify-center gap-1 truncate"
                title="Sign in as Vikramaditya (AgroCore Foods)"
              >
                <span className="material-symbols-outlined text-[14px] text-[#063b28]">storefront</span>
                <span className="truncate">Demo Buyer Profile</span>
              </button>
            </div>
          </div>

          {/* Card Footer Note & Compliance Pill */}
          <div className="mt-5 text-center space-y-3">
            <p className="text-xs text-gray-500">
              {authMode === 'signin' ? 'New to the exchange? ' : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'signin' ? 'register' : 'signin');
                  setErrorMsg('');
                }}
                className="font-bold text-gray-900 hover:text-[#063b28] underline underline-offset-2"
              >
                {authMode === 'signin'
                  ? 'Register New Account'
                  : 'Sign in to Existing Terminal'}
              </button>
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f1f3f9] text-[#4a5568] text-[10px] font-bold rounded-full tracking-wider border border-gray-200">
              <span className="material-symbols-outlined text-[13px] text-gray-600">
                shield
              </span>
              <span>CFTC COMPLIANT • E-NWR INTEROPERABLE</span>
            </div>
          </div>
        </div>

        {/* Live Ticker Beneath Card */}
        <div className="w-full max-w-[480px] mt-4 flex items-center justify-between text-xs px-2">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Malting Barley Cash: $318.40/MT • Sharbati Wheat: ₹2,410/Qtl</span>
          </div>
          <span className="font-bold text-[#a35d1e]">Escrow Pool Active</span>
        </div>
      </main>

      {/* 3. Bottom Legal Footer Bar */}
      <footer className="w-full bg-white border-t border-gray-200 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px]">shield</span>
          <span>CFTC & USDA Regulated Protocol</span>
          <span>•</span>
          <span>Tier-1 Depository Escrow</span>
        </div>
        <div>
          © 2025 AgriTrade Nexus Systems LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
