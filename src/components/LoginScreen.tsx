import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { BRAND_LOGO_URL, INITIAL_BUYER_USER, INITIAL_FARMER_USER } from '../data/initialData';
import { loginUser, registerUser, isUsernameTaken } from '../services/authService';

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
}) => {
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'farmer'>(
    initialRole === 'farmer' ? 'farmer' : 'buyer'
  );
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Sign In inputs
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Registration inputs
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regOrgName, setRegOrgName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Live username availability check
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Check username availability as user types during registration
  useEffect(() => {
    if (authMode !== 'register') {
      setUsernameStatus('idle');
      return;
    }

    const trimmed = regUsername.trim().toLowerCase();
    if (trimmed.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    let isMounted = true;
    setUsernameStatus('checking');

    const timer = setTimeout(async () => {
      try {
        const taken = await isUsernameTaken(trimmed);
        if (isMounted) {
          setUsernameStatus(taken ? 'taken' : 'available');
        }
      } catch {
        if (isMounted) setUsernameStatus('idle');
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [regUsername, authMode]);

  // Role toggle
  const handleRoleChange = (role: 'buyer' | 'farmer') => {
    setSelectedRole(role);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Sign in submit
  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your username, email, or registered phone number.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsVerifying(true);

    try {
      const result = await loginUser({
        identifier: identifier.trim(),
        password: password.trim(),
        expectedRole: selectedRole,
      });

      setIsVerifying(false);

      if (!result.success || !result.user) {
        // STRICT REJECTION: Wrong password or account not found
        setErrorMsg(result.error || 'Authentication failed. Please check your credentials.');
        return;
      }

      // Success
      setSuccessMsg(`Access granted as ${result.user.name}. Loading terminal...`);
      setTimeout(() => {
        onLoginSuccess(result.user!);
      }, 300);
    } catch (err: any) {
      setIsVerifying(false);
      setErrorMsg(err?.message || 'Server authentication error. Please try again.');
    }
  };

  // Register submit
  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanUsername = regUsername.trim().toLowerCase();

    if (!cleanUsername) {
      setErrorMsg('Please choose a username.');
      return;
    }
    if (cleanUsername.length < 3) {
      setErrorMsg('Username must be at least 3 characters long.');
      return;
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
      setErrorMsg('Username can only contain alphanumeric characters, hyphens, and underscores.');
      return;
    }
    if (!regName.trim()) {
      setErrorMsg(
        selectedRole === 'farmer'
          ? 'Please enter your full legal name or FPO coordinator name.'
          : 'Please enter authorized officer full name.'
      );
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Please enter your business email or registered mobile number.');
      return;
    }
    if (!regPassword.trim()) {
      setErrorMsg('Please create a password.');
      return;
    }
    if (regPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsVerifying(true);

    try {
      const result = await registerUser({
        username: cleanUsername,
        name: regName.trim(),
        orgName: regOrgName.trim(),
        email: regEmail.trim(),
        phone: regEmail.trim(),
        password: regPassword.trim(),
        role: selectedRole,
      });

      setIsVerifying(false);

      if (!result.success || !result.user) {
        // STRICT REJECTION: Username already taken or duplicate user
        setErrorMsg(result.error || 'Registration failed. Please choose a different username.');
        return;
      }

      // Success
      setSuccessMsg(`Account created successfully for @${result.user.username || cleanUsername}! Logging in...`);
      setTimeout(() => {
        onLoginSuccess(result.user!);
      }, 400);
    } catch (err: any) {
      setIsVerifying(false);
      setErrorMsg(err?.message || 'Server registration error. Please try again.');
    }
  };

  const handleQuickPreset = async (role: 'buyer' | 'farmer') => {
    handleRoleChange(role);
    const demoUsername = role === 'farmer' ? 'rameshwar' : 'agrocore';
    const demoPassword = 'password123';
    setIdentifier(demoUsername);
    setPassword(demoPassword);
    setIsVerifying(true);
    try {
      const result = await loginUser({
        identifier: demoUsername,
        password: demoPassword,
        expectedRole: role,
      });
      setIsVerifying(false);
      if (result.success && result.user) {
        setSuccessMsg(`Welcome, ${result.user.name}! Connecting...`);
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 300);
      } else {
        setErrorMsg(result.error || 'Authentication error.');
      }
    } catch {
      setIsVerifying(false);
      setErrorMsg('Authentication error.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fc] text-[#131b2e] flex flex-col justify-between selection:bg-[#c1ecd4] selection:text-[#002114]">
      {/* 1. Top Exchange Terminal Header Bar */}
      <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#063b28] font-semibold py-1.5 px-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="Return to Main Portal"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span className="hidden sm:inline">Back to Home</span>
          </button>

          <div className="border border-gray-200 rounded-lg px-2.5 py-1 flex items-center gap-2 bg-white shadow-2xs">
            <img
              src={BRAND_LOGO_URL}
              alt="AgriTrade Nexus"
              className="h-5 w-auto object-contain"
            />
            <span className="font-serif font-bold text-gray-900 text-sm tracking-tight">
              AgriTrade Nexus
            </span>
          </div>

          <span className="bg-[#eef1f6] text-[#4b5563] text-[10px] font-bold tracking-widest px-2.5 py-1 rounded">
            EXCHANGE TERMINAL
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[#4a5568] text-xs font-semibold tracking-wider">
          <span className="material-symbols-outlined text-[16px] text-gray-600">
            shield
          </span>
          <span className="hidden sm:inline">SECURE CREDENTIALS ENFORCEMENT</span>
          <span className="sm:hidden">256-BIT SSL</span>
        </div>
      </header>

      {/* 2. Centered Authentication Card */}
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
              {authMode === 'register' ? 'Register New Profile' : 'Terminal Sign In'}
            </h1>
            <p className="text-xs text-gray-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
              {authMode === 'register'
                ? 'Create a unique trading username with secure password authentication'
                : 'Sign in with your verified username or email and registered password'}
            </p>

            {/* Mode Switcher */}
            <div className="inline-flex p-1 bg-[#edf2f7] rounded-lg mt-4 border border-gray-200">
              <button
                type="button"
                id="btnAuthSignInMode"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
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
                id="btnAuthRegisterMode"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                  authMode === 'register'
                    ? 'bg-white text-[#063b28] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Register New User
              </button>
            </div>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#f3f4f6] rounded-xl mb-5 border border-gray-200">
            <button
              type="button"
              id="tabBreweryBuyer"
              onClick={() => handleRoleChange('buyer')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                selectedRole === 'buyer'
                  ? 'bg-[#063b28] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                storefront
              </span>
              <span>Brewery / Buyer</span>
            </button>

            <button
              type="button"
              id="tabFarmerProducer"
              onClick={() => handleRoleChange('farmer')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                selectedRole === 'farmer'
                  ? 'bg-[#063b28] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                agriculture
              </span>
              <span>Farmer / Producer</span>
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div
              id="authErrorMessage"
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-shake"
            >
              <span className="material-symbols-outlined text-[18px] text-red-600 flex-shrink-0 mt-0.5">
                error
              </span>
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMsg && (
            <div
              id="authSuccessMessage"
              className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2"
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-600 flex-shrink-0 mt-0.5">
                check_circle
              </span>
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* ----------------- SIGN IN FORM ----------------- */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Field 1: Username / Email */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label htmlFor="loginIdentifier" className="font-bold text-gray-800">
                    Username, Work Email, or Mobile
                  </label>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    REQUIRED
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-gray-400 text-[18px]">
                    account_circle
                  </span>
                  <input
                    type="text"
                    id="loginIdentifier"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'farmer'
                        ? 'Username (e.g. rameshwar) or mobile'
                        : 'Username (e.g. agrocore) or work email'
                    }
                    className="w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm font-medium border border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label htmlFor="loginPassword" className="font-bold text-gray-800">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert(`Password assistance:\n- Demo farmer: password123\n- Demo buyer: password123\n\nIf you registered a custom account, please enter the password you created.`)}
                    className="text-[11px] font-bold text-[#a35d1e] hover:text-[#804612] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-gray-400 text-[18px]">
                    key
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="loginPassword"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 pr-10 text-xs sm:text-sm font-mono border border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me */}
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
                  Remember credentials on this terminal
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="signInTerminalBtn"
                disabled={isVerifying}
                className="w-full mt-2 h-12 bg-[#063b28] hover:bg-[#0a4d35] text-white font-bold rounded-xl shadow-xs hover:shadow-sm flex items-center justify-center gap-2 text-sm transition-all cursor-pointer disabled:opacity-75"
              >
                {isVerifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    <span>Verifying Password &amp; Identity...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Marketplace</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ----------------- REGISTRATION FORM ----------------- */
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Field 1: Choose Username (CRITICAL UNIQUE IDENTIFIER) */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label htmlFor="regUsername" className="font-bold text-gray-800">
                    Choose Username
                  </label>
                  <div className="flex items-center gap-1.5">
                    {usernameStatus === 'checking' && (
                      <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                        <span className="w-2.5 h-2.5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin"></span>
                        Checking availability...
                      </span>
                    )}
                    {usernameStatus === 'available' && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-300 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        Available
                      </span>
                    )}
                    {usernameStatus === 'taken' && (
                      <span className="text-[10px] text-red-700 bg-red-50 border border-red-300 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">cancel</span>
                        Already taken
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      UNIQUE ID
                    </span>
                  </div>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-gray-400 text-[18px]">
                    alternate_email
                  </span>
                  <input
                    type="text"
                    id="regUsername"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    onBlur={async () => {
                      const trimmed = regUsername.trim().toLowerCase();
                      if (trimmed.length >= 3) {
                        setUsernameStatus('checking');
                        try {
                          const taken = await isUsernameTaken(trimmed);
                          setUsernameStatus(taken ? 'taken' : 'available');
                        } catch {
                          setUsernameStatus('idle');
                        }
                      }
                    }}
                    placeholder="e.g. shivam, agro_core, kisan_patel"
                    className={`w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm font-medium border transition-all outline-none ${
                      usernameStatus === 'taken'
                        ? 'border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-100'
                        : usernameStatus === 'available'
                        ? 'border-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                        : 'border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10'
                    }`}
                  />
                </div>
                {usernameStatus === 'taken' && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    This username already exists. Another user cannot use it.
                  </p>
                )}
              </div>

              {/* Field 2: Full Legal Name */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label htmlFor="regName" className="font-bold text-gray-800">
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
                    id="regName"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={
                      selectedRole === 'farmer'
                        ? 'e.g. Rameshwar Patel'
                        : 'e.g. Vikramaditya Sharma'
                    }
                    className="w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm font-medium border border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Field 3: Company / FPO Name */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label htmlFor="regOrgName" className="font-bold text-gray-800">
                    {selectedRole === 'farmer' ? 'FPO / Cooperative / Farm Name' : 'Brewery / Corporate Entity Name'}
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
                    id="regOrgName"
                    value={regOrgName}
                    onChange={(e) => setRegOrgName(e.target.value)}
                    placeholder={
                      selectedRole === 'farmer'
                        ? 'e.g. Malwa Kisan Samriddhi FPC'
                        : 'e.g. Sovereign Malting & Foods Ltd.'
                    }
                    className="w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm font-medium border border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Field 4: Email / Mobile */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label htmlFor="regEmail" className="font-bold text-gray-800">
                    {selectedRole === 'farmer' ? 'Registered Mobile Number or Email' : 'Work Email Address'}
                  </label>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    REQUIRED
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-gray-400 text-[18px]">
                    {selectedRole === 'farmer' ? 'phone_iphone' : 'mail'}
                  </span>
                  <input
                    type="text"
                    id="regEmail"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder={
                      selectedRole === 'farmer'
                        ? 'Enter 10-digit mobile (e.g. 9826044120)'
                        : 'Enter corporate email (e.g. procurement@corp.in)'
                    }
                    className="w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm font-medium border border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Field 5: Create Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="regPassword" className="block mb-1.5 text-xs font-bold text-gray-800">
                    Create Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-gray-400 text-[18px]">
                      key
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="regPassword"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 4 chars"
                      className="w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm font-mono border border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="regConfirmPassword" className="block mb-1.5 text-xs font-bold text-gray-800">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-gray-400 text-[18px]">
                      lock_reset
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="regConfirmPassword"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-[#f0f3ff] hover:bg-[#e8edff] focus:bg-white text-[#131b2e] rounded-xl px-4 py-2.5 pl-10 text-xs sm:text-sm font-mono border border-transparent focus:border-[#063b28] focus:ring-2 focus:ring-[#063b28]/10 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Show password toggle */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-semibold text-gray-600 hover:text-[#063b28] flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                  <span>{showPassword ? 'Hide password' : 'Show password text'}</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="registerTerminalBtn"
                disabled={isVerifying || usernameStatus === 'taken'}
                className="w-full mt-2 h-12 bg-[#063b28] hover:bg-[#0a4d35] text-white font-bold rounded-xl shadow-xs hover:shadow-sm flex items-center justify-center gap-2 text-sm transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    <span>Checking Username &amp; Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration &amp; Enter</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Credentials Help */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Demo Accounts (For Instant Testing)
              </span>
              <span className="text-[10px] text-gray-400 font-mono">password: password123</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="quickPresetFarmer"
                onClick={() => handleQuickPreset('farmer')}
                className="py-2 px-2.5 bg-gray-50 hover:bg-green-50 border border-gray-200 rounded-lg text-left transition-colors flex items-center gap-2 group"
                title="Demo Farmer (username: rameshwar, password: password123)"
              >
                <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[15px]">agriculture</span>
                </span>
                <div className="truncate">
                  <p className="text-[11px] font-bold text-gray-800 group-hover:text-[#063b28] truncate">
                    Farmer Demo
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono truncate">@rameshwar</p>
                </div>
              </button>

              <button
                type="button"
                id="quickPresetBuyer"
                onClick={() => handleQuickPreset('buyer')}
                className="py-2 px-2.5 bg-gray-50 hover:bg-green-50 border border-gray-200 rounded-lg text-left transition-colors flex items-center gap-2 group"
                title="Demo Buyer (username: agrocore, password: password123)"
              >
                <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[15px]">storefront</span>
                </span>
                <div className="truncate">
                  <p className="text-[11px] font-bold text-gray-800 group-hover:text-[#063b28] truncate">
                    Buyer Demo
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono truncate">@agrocore</p>
                </div>
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-5 text-center space-y-3">
            <p className="text-xs text-gray-500">
              {authMode === 'signin' ? 'New to the exchange? ' : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'signin' ? 'register' : 'signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="font-bold text-gray-900 hover:text-[#063b28] underline underline-offset-2"
              >
                {authMode === 'signin'
                  ? 'Register New Unique Profile'
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

        {/* Live Ticker */}
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
          <span>CFTC &amp; USDA Regulated Protocol</span>
          <span>•</span>
          <span>Tier-1 Depository Escrow</span>
        </div>
        <div>
          © 2026 AgriTrade Nexus Systems LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

