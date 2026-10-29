import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Heart, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';
import { adminLoginApi } from '../utils/api';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Please enter the studio master password.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      await adminLoginApi(password.trim());
      onLoginSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Incorrect credentials. Please verify your admin password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCE7ED] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans">
      {/* Decorative delicate background glow */}
      <div className="absolute top-0 -left-20 w-80 h-80 rounded-full bg-[#F1C5D1]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 rounded-full bg-[#FFF1F4]/70 blur-3xl pointer-events-none" />

      {/* Discrete return to storefront */}
      <button
        onClick={onBackToStore}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-medium text-[#9F2343] hover:text-[#72172F] transition-colors bg-[#FFFAF8] px-3.5 py-2 rounded-xl border border-[#F1C5D1] shadow-2xs group cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>Return to Customer Store</span>
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Monogram & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#9F2343] text-white shadow-md shadow-[#72172F]/20 mb-4 border border-[#72172F]">
            <Heart className="w-7 h-7 fill-white text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#9F2343] bg-[#FFFAF8] px-3 py-1 rounded-full border border-[#F1C5D1] mb-2 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9F2343]" />
            <span>Private Management Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3B2028] tracking-tight">
            DILSY Admin Studio
          </h1>
          <p className="mt-2 text-sm text-[#79665C] font-medium">
            Your brand. Your rules.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#FFFAF8] rounded-3xl p-7 sm:p-8 shadow-xl shadow-[#3B2028]/5 border border-[#F1C5D1]">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-xs font-medium text-[#991B1B] flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#991B1B] mt-1.5 shrink-0" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#3B2028] mb-2"
              >
                Studio Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9F2343]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                  className="w-full pl-10 pr-11 py-3 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] placeholder-[#79665C] focus:outline-none focus:ring-2 focus:ring-[#9F2343] focus:border-[#9F2343] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#79665C] hover:text-[#3B2028] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#9F2343] hover:bg-[#72172F] active:scale-[0.99] text-white rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-[#72172F]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Enter DILSY Studio</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#F1C5D1] text-center">
            <p className="text-[11px] text-[#79665C]">
              Protected with server-side salted cryptographic hashing and secure session tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
