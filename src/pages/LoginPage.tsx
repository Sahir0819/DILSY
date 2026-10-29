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
    <div className="min-h-screen bg-[#FAF7F5] text-[#2A0D15] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans">
      {/* Return to Store Navigation */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between relative z-10">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#3E101D] hover:text-[#2A0D15] transition-colors bg-white px-3.5 py-2 border border-[#EADBDB] group cursor-pointer uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Return to Store</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Monogram & Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center justify-center w-12 h-12 bg-[#3E101D] text-white mb-3 cursor-pointer group hover:scale-105 transition-transform"
          >
            <Heart className="w-6 h-6 fill-white text-white" />
          </button>
          <div className="font-serif tracking-[0.3em] uppercase text-xs text-[#7A5A63] mb-1">
            Private Client Atelier
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#2A0D15] tracking-tight">
            DILSY Account
          </h1>
          <p className="mt-1.5 text-xs text-[#7A5A63] font-light max-w-xs mx-auto">
            A Little Box Full of Feelings — Curate hampers, save personal notes, and coordinate direct handover.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white p-6 sm:p-8 border border-[#EADBDB] shadow-sm">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#FAF7F5] border border-[#EADBDB] mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMessage(null);
              }}
              className={`py-2.5 text-xs font-semibold tracking-widest uppercase transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-[#3E101D] text-white shadow-xs'
                  : 'text-[#7A5A63] hover:text-[#2A0D15]'
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
              className={`py-2.5 text-xs font-semibold tracking-widest uppercase transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-[#3E101D] text-white shadow-xs'
                  : 'text-[#7A5A63] hover:text-[#2A0D15]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-xs font-medium text-red-700 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label
                  htmlFor="login-identifier"
                  className="block text-[11px] font-semibold uppercase tracking-widest text-[#2A0D15] mb-1.5"
                >
                  Email or Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A5A63]">
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
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF7F5] border border-[#EADBDB] text-sm text-[#2A0D15] placeholder-[#7A5A63]/60 focus:outline-none focus:border-[#3E101D] transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-[11px] font-semibold uppercase tracking-widest text-[#2A0D15] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A5A63]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password..."
                    required
                    className="w-full pl-10 pr-11 py-3 bg-[#FAF7F5] border border-[#EADBDB] text-sm text-[#2A0D15] placeholder-[#7A5A63]/60 focus:outline-none focus:border-[#3E101D] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7A5A63] hover:text-[#3E101D] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                <p className="text-xs text-[#7A5A63] font-light">
                  New to DILSY?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signup');
                      setErrorMessage(null);
                    }}
                    className="font-medium text-[#3E101D] hover:underline cursor-pointer"
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
                  className="block text-[11px] font-semibold uppercase tracking-widest text-[#2A0D15] mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A5A63]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-sm text-[#2A0D15] placeholder-[#7A5A63]/60 focus:outline-none focus:border-[#3E101D] transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-[11px] font-semibold uppercase tracking-widest text-[#2A0D15] mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A5A63]">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-sm text-[#2A0D15] placeholder-[#7A5A63]/60 focus:outline-none focus:border-[#3E101D] transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-phone"
                  className="block text-[11px] font-semibold uppercase tracking-widest text-[#2A0D15] mb-1.5"
                >
                  Phone Number (for WhatsApp delivery coordination)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A5A63]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-sm text-[#2A0D15] placeholder-[#7A5A63]/60 focus:outline-none focus:border-[#3E101D] transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-[11px] font-semibold uppercase tracking-widest text-[#2A0D15] mb-1.5"
                >
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A5A63]">
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
                    className="w-full pl-10 pr-11 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-sm text-[#2A0D15] placeholder-[#7A5A63]/60 focus:outline-none focus:border-[#3E101D] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7A5A63] hover:text-[#3E101D] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-landmark"
                  className="block text-[11px] font-semibold uppercase tracking-widest text-[#2A0D15] mb-1.5"
                >
                  Hostel / PG / Delivery Area (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A5A63]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-landmark"
                    type="text"
                    value={specificLandmark}
                    onChange={(e) => setSpecificLandmark(e.target.value)}
                    placeholder="e.g. CU North Campus / Kharar Road"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-sm text-[#2A0D15] placeholder-[#7A5A63]/60 focus:outline-none focus:border-[#3E101D] transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                <p className="text-xs text-[#7A5A63] font-light">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('signin');
                      setErrorMessage(null);
                    }}
                    className="font-medium text-[#3E101D] hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Reassurance notes */}
        <div className="mt-6 text-center text-xs text-[#7A5A63] font-light space-y-1">
          <p>Handmade in Mohali with love & care.</p>
          <p>Orders & customisation are coordinated directly on WhatsApp.</p>
        </div>
      </div>
    </div>
  );
};
