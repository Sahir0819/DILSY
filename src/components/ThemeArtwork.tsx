import React from 'react';

interface ThemeArtworkProps {
  themeId: string;
  className?: string;
}

export const ThemeArtwork: React.FC<ThemeArtworkProps> = ({ themeId, className = '' }) => {
  // 1. I Love You — For Him
  if (themeId === 'i-love-you-for-him') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#F7F2EC] via-[#EFE7DE] to-[#E5DDD2] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#2A1E1A]/10 shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/70 via-transparent to-transparent opacity-80" />
        <div className="relative w-48 h-30 bg-[#362722] rounded-lg shadow-md border border-neutral-700/30 p-2.5 flex items-center justify-between">
          <div className="w-10 h-16 bg-gradient-to-b from-amber-800 to-amber-950 rounded shadow-xs flex flex-col items-center justify-center border border-amber-950/40">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-xs" />
            <span className="text-[6px] font-mono text-amber-200 uppercase mt-1">Amber</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-16 h-10 bg-[#FAF7F2] rounded border border-neutral-300 p-1 flex flex-col justify-between shadow-xs">
              <span className="text-[6px] font-serif text-[#362722] font-semibold">For Him ♥</span>
              <div className="w-full h-0.5 bg-[#C87D70]/40" />
              <span className="text-[5px] text-neutral-500 font-mono">forever yours</span>
            </div>
            <div className="w-12 h-4 bg-[#8B5A3E] rounded flex items-center justify-center shadow-xs">
              <span className="text-[6px] text-amber-100 font-mono font-bold tracking-widest">HIM·01</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. I Love You — For Her
  if (themeId === 'i-love-you-for-her') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF5F8] via-[#FDF0F4] to-[#FCE6EC] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#FFCCD5] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#FFE5EC]/80 via-transparent to-transparent opacity-90" />
        <div className="relative w-48 h-30 bg-[#FFFCFD] rounded-lg shadow-md border border-[#F2BDCA] p-2.5 flex items-center justify-between">
          <div className="relative w-14 h-18 bg-white p-1 pb-2 shadow-sm -rotate-6 border border-pink-200 rounded-xs flex flex-col justify-between">
            <div className="w-full h-11 bg-gradient-to-br from-[#FFB3C6] to-[#C73858] rounded-xs flex items-center justify-center">
              <span className="text-[12px] text-white">♥</span>
            </div>
            <span className="text-[5px] text-center font-serif text-[#99223A] italic font-semibold">my girl</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#E56B85] flex items-center justify-center shadow-xs">
              <span className="text-white text-[10px]">✿</span>
            </div>
            <div className="w-18 h-8 bg-[#FFF8FA] rounded-xs border border-[#F2BDCA] p-1 flex items-center justify-between shadow-2xs">
              <span className="text-[6px] font-serif text-[#7A1E31] uppercase">A Love Letter</span>
              <div className="w-3.5 h-3.5 rounded-full bg-[#C73858] flex items-center justify-center text-[6px] text-white font-bold">D</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Anniversary Box
  if (themeId === 'anniversary') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF5F7] via-[#FCE8EE] to-[#F7D8E2] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#E8A5B5] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/70 via-transparent to-transparent opacity-80" />
        <div className="relative w-48 h-30 bg-[#FAF7F2] rounded-lg shadow-md border border-[#D4899B] p-2.5 flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 shadow-xs ring-1 ring-amber-300" />
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 shadow-xs ring-1 ring-amber-300" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="w-20 h-10 bg-[#FFFDFE] rounded border border-rose-200 p-1 flex flex-col justify-between shadow-xs">
              <span className="text-[6px] font-serif text-[#8C1D33] uppercase font-bold tracking-wider">Our Story</span>
              <span className="text-[7px] text-[#A32842] font-serif italic text-right">Together Forever</span>
            </div>
            <div className="w-14 h-4 bg-[#8C1D33] rounded flex items-center justify-center shadow-xs">
              <span className="text-[6px] text-amber-200 font-serif uppercase tracking-widest font-semibold">Years Of Love</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Birthday Box
  if (themeId === 'birthday') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF8F0] via-[#FFEEDD] to-[#FDE0C7] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#F8CBB0] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-100/60 via-transparent to-transparent opacity-80" />
        <div className="relative w-48 h-30 bg-[#FFFAF5] rounded-lg shadow-md border border-[#E8A07A] p-2.5 flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="w-2 h-3 bg-amber-400 rounded-full animate-bounce" />
            <div className="w-7 h-10 bg-gradient-to-b from-amber-300 to-amber-500 rounded-t-sm shadow-xs border border-amber-600/30 flex items-center justify-center">
              <span className="text-[8px] text-amber-900 font-bold">★</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-22 h-9 bg-gradient-to-r from-[#FF8A65] to-[#E64A19] rounded p-1 flex flex-col items-center justify-center shadow-xs text-white">
              <span className="text-[8px] font-serif font-bold uppercase tracking-wider">Happy Birthday</span>
              <span className="text-[6px] font-mono opacity-90">Make a wish!</span>
            </div>
            <div className="flex items-center gap-1 text-[8px] text-amber-600">
              <span>✦</span><span>🧁</span><span>✦</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Periods Box
  if (themeId === 'periods-box') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF5F7] via-[#F9E9ED] to-[#F5DDE3] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#E8B8C4] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#FFE5EC]/70 via-transparent to-transparent opacity-80" />
        <div className="relative w-48 h-30 bg-[#FFFDFE] rounded-lg shadow-md border border-[#D99CAE] p-2.5 flex items-center justify-between">
          {/* Comforting Warm Mug */}
          <div className="flex flex-col items-center">
            <div className="flex gap-0.5 mb-0.5">
              <div className="w-0.5 h-2 bg-neutral-300 rounded-full animate-pulse" />
              <div className="w-0.5 h-3 bg-neutral-300 rounded-full animate-pulse delay-100" />
            </div>
            <div className="relative w-8 h-10 bg-gradient-to-b from-[#EAA2B2] to-[#C74B64] rounded-b-md shadow-sm border border-[#C74B64]/30 flex items-center justify-center">
              <span className="text-[8px] text-white">☕</span>
            </div>
          </div>
          {/* Gentle comfort care notes */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="w-22 h-9 bg-[#FFF5F8] rounded border border-rose-200 p-1 flex flex-col justify-between shadow-2xs">
              <span className="text-[7px] font-serif text-[#8C283B] font-semibold">Gentle Care & Warmth</span>
              <span className="text-[6px] text-neutral-500 italic">take it easy today ♥</span>
            </div>
            <div className="w-16 h-4 bg-[#7A1E31] rounded flex items-center justify-center shadow-xs">
              <span className="text-[6px] text-pink-100 font-serif font-medium">Warm Hugs Box</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. Apology Box
  if (themeId === 'apology-box') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FDFBF9] via-[#F5EFE9] to-[#EAE0D6] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#D9C8BC] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/70 via-transparent to-transparent opacity-80" />
        <div className="relative w-48 h-30 bg-[#FAF7F2] rounded-lg shadow-md border border-[#C4B2A5] p-2.5 flex items-center justify-between">
          {/* Calming white botanic / olive sprig */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-12 border-l-2 border-emerald-800/40 rotate-6 flex flex-col justify-between py-1">
              <div className="w-2 h-1.5 bg-emerald-700/60 rounded-full self-start" />
              <div className="w-2 h-1.5 bg-emerald-700/60 rounded-full self-end" />
              <div className="w-2 h-1.5 bg-emerald-700/60 rounded-full self-start" />
            </div>
          </div>
          {/* Understated letter */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="w-22 h-11 bg-white rounded border border-[#D9C8BC] p-1.5 flex flex-col justify-between shadow-xs">
              <span className="text-[7px] font-serif text-[#4A352F] font-semibold italic">"From the bottom of my heart"</span>
              <div className="w-full h-0.5 bg-neutral-200" />
              <span className="text-[6px] text-neutral-400">A sincere gesture</span>
            </div>
            <div className="w-16 h-3.5 bg-[#4A352F] rounded flex items-center justify-center shadow-xs">
              <span className="text-[6px] text-[#FAF7F2] font-serif uppercase tracking-widest">Peace & Care</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7. Miss You Box
  if (themeId === 'miss-you-box') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#F7F6FB] via-[#ECE9F7] to-[#DFDAF2] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#CEC6EB] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/80 via-transparent to-transparent opacity-80" />
        <div className="relative w-48 h-30 bg-[#FAF8FE] rounded-lg shadow-md border border-[#BDB2E3] p-2.5 flex items-center justify-between">
          {/* Airmail postcard envelope */}
          <div className="relative w-16 h-18 bg-white rounded border border-[#BDB2E3] p-1 flex flex-col justify-between shadow-xs -rotate-3">
            <div className="flex items-center justify-between">
              <div className="w-3.5 h-4 bg-indigo-100 border border-indigo-300 flex items-center justify-center text-[5px] text-indigo-700 font-mono">✈</div>
              <span className="text-[5px] text-neutral-400 font-mono">POST</span>
            </div>
            <div className="w-full h-8 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-xs flex items-center justify-center">
              <span className="text-[8px] text-indigo-800">✉</span>
            </div>
            <span className="text-[5px] font-serif text-indigo-900 text-center font-semibold">miss you</span>
          </div>
          {/* Miles apart quote */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="w-20 h-10 bg-white rounded border border-indigo-200 p-1 flex flex-col justify-between shadow-2xs">
              <span className="text-[7px] font-serif text-[#4F4178] font-bold">Miles Apart</span>
              <span className="text-[6px] text-indigo-700 italic">Close at heart</span>
            </div>
            <div className="w-14 h-4 bg-[#4F4178] rounded flex items-center justify-center shadow-xs">
              <span className="text-[6px] text-indigo-100 font-mono font-medium">KEEPSAKE</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 8. Valentine Box
  if (themeId === 'valentine-box') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF0F3] via-[#FCD5DE] to-[#F8BAC8] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#F29CAE] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/70 via-transparent to-transparent opacity-85" />
        <div className="relative w-48 h-30 bg-[#991B33] rounded-lg shadow-md border border-rose-900/40 p-2.5 flex items-center justify-between text-white">
          {/* Red velvet chocolate box */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-[#781226] border border-rose-400/50 flex items-center justify-center shadow-inner">
              <span className="text-[14px] text-rose-200 animate-pulse">♥</span>
            </div>
            <span className="text-[5px] text-rose-200 font-serif uppercase tracking-widest mt-1">Velvet</span>
          </div>
          {/* Romantic envelope with sweet hearts */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="w-22 h-10 bg-[#FFF5F7] rounded p-1.5 flex flex-col justify-between text-[#801026] shadow-xs">
              <span className="text-[7px] font-serif font-bold uppercase tracking-wider">Be My Valentine</span>
              <span className="text-[6px] italic text-[#B31D3F]">Love you always & forever</span>
            </div>
            <div className="w-16 h-3.5 bg-gradient-to-r from-rose-500 to-rose-600 rounded flex items-center justify-center shadow-xs">
              <span className="text-[6px] text-white font-serif uppercase tracking-wider font-semibold">Forever & Always</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 9. Diwali Box
  return (
    <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFFDF5] via-[#FCF4D9] to-[#F7E7B5] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#F0DC94] shadow-inner ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-200/50 via-transparent to-transparent opacity-80" />
      <div className="relative w-48 h-30 bg-[#FFFDF8] rounded-lg shadow-md border border-[#DEBE66] p-2.5 flex items-center justify-between">
        {/* Glowing Diya Lamp */}
        <div className="flex flex-col items-center">
          <div className="w-3 h-4 bg-gradient-to-t from-amber-500 via-yellow-400 to-amber-200 rounded-full blur-[1px] animate-pulse shadow-md shadow-amber-300" />
          <div className="w-9 h-6 bg-gradient-to-b from-[#B86B2F] to-[#783F15] rounded-b-full shadow-sm border border-amber-900/30 flex items-center justify-center">
            <span className="text-[6px] text-amber-200">🪔</span>
          </div>
        </div>
        {/* Festive sweets & gold banner */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="w-22 h-10 bg-gradient-to-r from-[#D99B26] to-[#B37812] rounded p-1 flex flex-col justify-between text-white shadow-xs">
            <span className="text-[8px] font-serif font-bold uppercase tracking-wider">Shubh Deepavali</span>
            <span className="text-[6px] text-amber-100 font-mono">Lights & Sweets</span>
          </div>
          <div className="flex items-center gap-1 text-[8px] text-amber-700 font-serif">
            <span>✨</span>
            <span className="text-[6px] font-semibold uppercase tracking-wider">Festival of Joy</span>
            <span>✨</span>
          </div>
        </div>
      </div>
    </div>
  );
};
