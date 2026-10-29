import React, { useState } from 'react';
import { Heart, Eye, EyeOff, Lock, Mail, User, Phone, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { unifiedLoginApi, customerSignupApi, UnifiedLoginResult } from '../utils/api';

interface LoginPageProps {
  onLoginSuccess: (result: UnifiedLoginResult) => void;
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specificLandmark, setSpecificLandmark] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email/username and password.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const result = await unifiedLoginApi(identifier.trim(), password.trim());
      onLoginSuccess(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid username/email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanedEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanedEmail || !emailRegex.test(cleanedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Please enter a valid contact phone number.');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const result = await customerSignupApi({
        name: name.trim(),
        email: cleanedEmail,
        phone: phone.trim(),
        password: signupPassword.trim(),
        deliveryAddress: deliveryAddress.trim(),
        specificLandmark: specificLandmark.trim(),
      });
      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        onLoginSuccess(result);
      }, 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCE7ED] text-[#3B2028] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans">
      {/* Delicate background decorative glows */}
      <div className="absolute top-0 -left-20 w-96 h-96 rounded-full bg-[#F1C5D1]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 rounded-full bg-[#FFF1F4]/70 blur-3xl pointer-events-none" />

      {/* Return to Store Navigation */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9F2343] hover:text-[#72172F] transition-colors bg-[#FFFAF8] px-3.5 py-2 rounded-xl border border-[#F1C5D1] shadow-2xs group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Continue Browsing Hampers</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Monogram & Header */}
        <div className="text-center mb-6">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#9F2343] text-white shadow-md shadow-[#72172F]/20 mb-3 border border-[#72172F] cursor-pointer group hover:scale-105 transition-transform"
          >
            <Heart className="w-7 h-7 fill-white text-white animate-heart-pulse" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3B2028] tracking-tight">
            DILSY Gifting Account
          </h1>
          <p className="mt-1.5 text-xs text-[#795A63] font-medium max-w-xs mx-auto">
            A Little Box Full of Feelings — Save hampers, track personal notes, and coordinate delivery.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#FFFAF8] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#3B2028]/5 border border-[#F1C5D1]">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#FFF1F4] rounded-2xl border border-[#F1C5D1] mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-[#9F2343] text-white shadow-xs'
                  : 'text-[#795A63] hover:text-[#3B2028]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-[#9F2343] text-white shadow-xs'
                  : 'text-[#795A63] hover:text-[#3B2028]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-xs font-medium text-[#991B1B] flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B] mt-1.5 shrink-0" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-xs font-medium text-[#166534] flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label
                  htmlFor="login-identifier"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#3B2028] mb-1.5"
                >
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9F2343]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="login-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email or username..."
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] placeholder-[#795A63] focus:outline-none focus:ring-2 focus:ring-[#9F2343] focus:border-[#9F2343] transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#3B2028] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9F2343]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password..."
                    required
                    className="w-full pl-10 pr-11 py-3 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] placeholder-[#795A63] focus:outline-none focus:ring-2 focus:ring-[#9F2343] focus:border-[#9F2343] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#795A63] hover:text-[#9F2343] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#9F2343] hover:bg-[#72172F] text-white text-xs font-semibold uppercase tracking-wider shadow-md shadow-[#72172F]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>

              <div className="pt-3 text-center">
                <p className="text-xs text-[#795A63]">
                  New to DILSY?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setErrorMessage(null);
                    }}
                    className="font-semibold text-[#9F2343] hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleSignUp} noValidate className="space-y-3.5">
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#3B2028] mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9F2343]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] placeholder-[#795A63] focus:outline-none focus:ring-2 focus:ring-[#9F2343] focus:border-[#9F2343] transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#3B2028] mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9F2343]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.replace(/\s+/g, ''))}
                    onBlur={() => setEmail((prev) => prev.trim().toLowerCase())}
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="e.g. priya@gmail.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] placeholder-[#795A63] focus:outline-none focus:ring-2 focus:ring-[#9F2343] focus:border-[#9F2343] transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-phone"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#3B2028] mb-1.5"
                >
                  Phone Number (for WhatsApp delivery coordination)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9F2343]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] placeholder-[#795A63] focus:outline-none focus:ring-2 focus:ring-[#9F2343] focus:border-[#9F2343] transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#3B2028] mb-1.5"
                >
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9F2343]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create a secure password..."
                    required
                    minLength={6}
                    className="w-full pl-10 pr-11 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] placeholder-[#795A63] focus:outline-none focus:ring-2 focus:ring-[#9F2343] focus:border-[#9F2343] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#795A63] hover:text-[#9F2343] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-landmark"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#3B2028] mb-1.5"
                >
                  Hostel / PG / Delivery Area (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9F2343]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-landmark"
                    type="text"
                    value={specificLandmark}
                    onChange={(e) => setSpecificLandmark(e.target.value)}
                    placeholder="e.g. CU North Campus / Kharar Road"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] placeholder-[#795A63] focus:outline-none focus:ring-2 focus:ring-[#9F2343] focus:border-[#9F2343] transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#9F2343] hover:bg-[#72172F] text-white text-xs font-semibold uppercase tracking-wider shadow-md shadow-[#72172F]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create My Account</span>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <p className="text-xs text-[#795A63]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setErrorMessage(null);
                    }}
                    className="font-semibold text-[#9F2343] hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Reassurance notes */}
        <div className="mt-6 text-center text-xs text-[#795A63] space-y-1">
          <p>Handmade in Mohali with love & care.</p>
          <p>Orders & customisation are coordinated directly on WhatsApp.</p>
        </div>
      </div>
    </div>
  );
};
