import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { BRAND_LOGO_URL, INITIAL_BUYER_USER, INITIAL_FARMER_USER } from '../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'buyer',
}) => {
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'farmer'>(
    initialRole === 'farmer' ? 'farmer' : 'buyer'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

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
      const verifiedUser: User = {
        id: `${selectedRole}-${Date.now()}`,
        name: name.trim(),
        role: selectedRole,
        orgName:
          selectedRole === 'farmer'
            ? `${name.trim()} Kisan FPO Producer Co.`
            : `${name.trim()} AgroCore Trading Ltd.`,
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
      onClose();
    }, 500);
  };

  const handleQuickPreset = (role: 'buyer' | 'farmer') => {
    handleRoleChange(role);
    if (role === 'farmer') {
      onLoginSuccess(INITIAL_FARMER_USER);
    } else {
      onLoginSuccess(INITIAL_BUYER_USER);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-2xl border border-gray-200 p-7 sm:p-9 relative max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close dialog"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Logo Squircle with Padlock Badge */}
        <div className="w-14 h-14 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center relative mx-auto mb-3.5 shadow-xs">
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
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#063b28] text-center tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs text-gray-500 text-center mt-1.5 max-w-xs mx-auto leading-relaxed">
          {selectedRole === 'buyer'
            ? 'Direct farmgate sourcing for commercial breweries & premium grain processors'
            : 'Direct farmgate settlement for certified FPOs & farmer collectives'}
        </p>

        {/* Segmented Dual Role Selector */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#f3f4f6] rounded-xl my-5 border border-gray-200">
          <button
            type="button"
            onClick={() => handleRoleChange('buyer')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              selectedRole === 'buyer'
                ? 'bg-[#063b28] text-white shadow-sm'
                : 'bg-white text-gray-700 border border-dashed border-blue-400 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">storefront</span>
            <span>Brewery / Buyer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('farmer')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              selectedRole === 'farmer'
                ? 'bg-[#063b28] text-white shadow-sm'
                : 'bg-white text-gray-700 border border-dashed border-blue-400 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">agriculture</span>
            <span>Farmer / Producer</span>
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerifyAndLogin} className="space-y-3.5">
          {/* Field 1: Name */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <label className="font-bold text-gray-800">
                {selectedRole === 'farmer' ? 'Farmer / Coordinator Name' : 'Authorized Officer Name'}
              </label>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                GREETING IDENTITY
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
                    : 'Enter authorized officer name'
                }
                className="w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm font-medium border border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10 transition-all outline-none"
              />
            </div>
          </div>

          {/* Field 2: Email / Mobile */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <label className="font-bold text-gray-800">
                {selectedRole === 'farmer' ? 'Registered Mobile / ID' : 'Business Email'}
              </label>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {selectedRole === 'farmer' ? 'VERIFIED PRODUCER' : 'INSTITUTIONAL'}
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
                    : 'Enter corporate email (e.g. buyer@company.com)'
                }
                className="w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm font-medium border border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10 transition-all outline-none"
              />
            </div>
          </div>

          {/* Field 3: Password */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <label className="font-bold text-gray-800">Password</label>
              <span className="text-[11px] font-bold text-[#a35d1e] cursor-pointer">
                Forgot password?
              </span>
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
                placeholder="Enter password"
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

          {/* Remember Me */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              type="checkbox"
              id="rememberTerminalModal"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-[#063b28] accent-[#063b28] focus:ring-[#063b28] border-gray-300 cursor-pointer"
            />
            <label
              htmlFor="rememberTerminalModal"
              className="text-xs text-gray-600 font-medium cursor-pointer"
            >
              Remember this terminal for 30 days
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full mt-1.5 h-11 bg-[#063b28] hover:bg-[#0a4d35] text-white font-bold rounded-xl border border-dashed border-blue-400 shadow-md flex items-center justify-center gap-2 text-sm transition-all cursor-pointer disabled:opacity-75"
          >
            {isVerifying ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Marketplace</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Personas */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">
            1-Click Fast Verification
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickPreset('farmer')}
              className="py-1.5 px-2 bg-gray-50 hover:bg-green-50 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-700 hover:text-[#063b28] transition-colors flex items-center justify-center gap-1 truncate"
            >
              <span className="material-symbols-outlined text-[14px] text-[#063b28]">agriculture</span>
              <span className="truncate">Rameshwar (Farmer)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('buyer')}
              className="py-1.5 px-2 bg-gray-50 hover:bg-green-50 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-700 hover:text-[#063b28] transition-colors flex items-center justify-center gap-1 truncate"
            >
              <span className="material-symbols-outlined text-[14px] text-[#063b28]">storefront</span>
              <span className="truncate">Vikramaditya (Buyer)</span>
            </button>
          </div>
        </div>

        {/* Compliance Footer Tag */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f1f3f9] text-[#4a5568] text-[10px] font-bold rounded-full tracking-wider border border-gray-200">
            <span className="material-symbols-outlined text-[13px] text-gray-600">shield</span>
            <span>CFTC COMPLIANT • E-NWR INTEROPERABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
