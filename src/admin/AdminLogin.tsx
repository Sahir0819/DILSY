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
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans">
      {/* Decorative delicate background glow */}
      <div className="absolute top-0 -left-20 w-80 h-80 rounded-full bg-[#FFE5EC]/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 rounded-full bg-[#F5DDE3]/50 blur-3xl pointer-events-none" />

      {/* Discrete return to storefront */}
      <button
        onClick={onBackToStore}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-medium text-[#6B3241] hover:text-[#99223A] transition-colors bg-[#FAF0F3] px-3.5 py-2 rounded-xl border border-[#E8C2CC] shadow-2xs group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>Return to Customer Store</span>
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Monogram & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#99223A] to-[#C73858] text-[#FFF0F3] shadow-md shadow-[#99223A]/25 mb-4 border border-[#FFCCD5]/40 animate-in zoom-in-95">
            <Heart className="w-7 h-7 fill-[#FFF0F3] text-[#FFF0F3]" />
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#99223A] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5] mb-2 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C73858]" />
            <span>Private Management Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D1B22] tracking-tight">
            DILSY Admin Studio
          </h1>
          <p className="mt-2 text-sm text-[#6B424E] font-medium">
            Your brand. Your rules.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#FFFFFF]/90 backdrop-blur-md rounded-3xl p-7 sm:p-8 shadow-xl shadow-[#2D1B22]/5 border border-[#E8D0D6]">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FFF0F3] border border-[#FFCCD5] text-xs font-medium text-[#801B30] flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#99223A] mt-1.5 shrink-0" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#4D2D37] mb-2"
              >
                Studio Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#99223A]">
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
                  className="w-full pl-10 pr-11 py-3 bg-[#FAF7F2] border border-[#E2CBD2] rounded-xl text-sm text-[#2D1B22] placeholder-[#A07B86] focus:outline-none focus:ring-2 focus:ring-[#99223A] focus:border-[#99223A] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C5A66] hover:text-[#2D1B22] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] active:scale-[0.99] text-[#FFF0F3] rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-[#99223A]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#FFF0F3] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FF85A1]" />
                  <span>Enter DILSY Studio</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#F2E4E8] text-center">
            <p className="text-[11px] text-[#8C6B75]">
              Protected with server-side salted cryptographic hashing and secure session tokens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
