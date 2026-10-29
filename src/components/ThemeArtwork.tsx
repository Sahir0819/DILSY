import React from 'react';

interface ThemeArtworkProps {
  themeId: string;
  className?: string;
}

export const ThemeArtwork: React.FC<ThemeArtworkProps> = ({ themeId, className = '' }) => {
  // 1. I Love You — For Him
  if (themeId === 'i-love-you-for-him') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF1F4] via-[#FCE7ED] to-[#F1C5D1]/50 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#F1C5D1] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/70 via-transparent to-transparent opacity-80" />
        <div className="relative w-48 h-30 bg-[#3B2028] rounded-lg shadow-md border border-[#72172F]/30 p-2.5 flex items-center justify-between">
          <div className="w-10 h-16 bg-gradient-to-b from-[#72172F] to-[#3B2028] rounded shadow-xs flex flex-col items-center justify-center border border-[#9F2343]/40">
            <div className="w-2 h-2 bg-[#E88AA4] rounded-full animate-pulse shadow-xs" />
            <span className="text-[6px] font-mono text-[#FCE7ED] uppercase mt-1">Groom</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-16 h-10 bg-[#FFFAF8] rounded border border-[#F1C5D1] p-1 flex flex-col justify-between shadow-xs">
              <span className="text-[6px] font-serif text-[#3B2028] font-semibold">For Him ♥</span>
              <div className="w-full h-0.5 bg-[#E88AA4]/40" />
              <span className="text-[5px] text-[#795A63] font-mono">forever yours</span>
            </div>
            <div className="w-12 h-4 bg-[#72172F] rounded flex items-center justify-center shadow-xs">
              <span className="text-[6px] text-[#FFFAF8] font-mono font-bold tracking-widest">HIM·01</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. I Love You — For Her
  if (themeId === 'i-love-you-for-her') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF1F4] via-[#FCE7ED] to-[#F1C5D1]/60 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#F1C5D1] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/80 via-transparent to-transparent opacity-90" />
        <div className="relative w-48 h-30 bg-[#FFFAF8] rounded-lg shadow-md border border-[#F1C5D1] p-2.5 flex items-center justify-between">
          <div className="relative w-14 h-18 bg-white p-1 pb-2 shadow-sm -rotate-6 border border-[#F1C5D1] rounded-xs flex flex-col justify-between">
            <div className="w-full h-11 bg-gradient-to-br from-[#9F2343] to-[#72172F] rounded-xs flex items-center justify-center">
              <span className="text-[12px] text-white">♥</span>
            </div>
            <span className="text-[5px] text-center font-serif text-[#9F2343] italic font-semibold">my girl</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#9F2343] flex items-center justify-center shadow-xs">
              <span className="text-white text-[10px]">✿</span>
            </div>
            <div className="w-18 h-8 bg-[#FFF1F4] rounded-xs border border-[#F1C5D1] p-1 flex items-center justify-between shadow-2xs">
              <span className="text-[6px] font-serif text-[#3B2028] uppercase font-medium">A Love Letter</span>
              <div className="w-3.5 h-3.5 rounded-full bg-[#9F2343] flex items-center justify-center text-[6px] text-white font-bold">D</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Anniversary Box
  if (themeId === 'anniversary') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF1F4] via-[#FCE7ED] to-[#F1C5D1] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#F1C5D1] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/70 via-transparent to-transparent opacity-80" />
        <div className="relative w-48 h-30 bg-[#FFFAF8] rounded-lg shadow-md border border-[#E88AA4] p-2.5 flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 shadow-xs ring-1 ring-amber-300" />
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 shadow-xs ring-1 ring-amber-300" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="w-20 h-10 bg-[#FFF1F4] rounded border border-[#F1C5D1] p-1 flex flex-col justify-between shadow-xs">
              <span className="text-[6px] font-serif text-[#9F2343] uppercase font-bold tracking-wider">Our Story</span>
              <span className="text-[7px] text-[#72172F] font-serif italic text-right">Together Forever</span>
            </div>
            <div className="w-14 h-4 bg-[#9F2343] rounded flex items-center justify-center shadow-xs">
              <span className="text-[6px] text-[#FFFAF8] font-serif uppercase tracking-widest font-semibold">Years Of Love</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Birthday Box
  if (themeId === 'birthday') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF1F4] via-[#FCE7ED] to-[#FFE2EA] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#F1C5D1] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-100/60 via-transparent to-transparent opacity-80" />
        <div className="relative w-48 h-30 bg-[#FFFAF8] rounded-lg shadow-md border border-[#E88AA4] p-2.5 flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="w-2 h-3 bg-amber-400 rounded-full animate-bounce" />
            <div className="w-7 h-10 bg-gradient-to-b from-[#E88AA4] to-[#9F2343] rounded-t-sm shadow-xs border border-[#72172F]/30 flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">★</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-22 h-9 bg-gradient-to-r from-[#E88AA4] to-[#9F2343] rounded p-1 flex flex-col items-center justify-center shadow-xs text-white">
              <span className="text-[8px] font-serif font-bold uppercase tracking-wider">Happy Birthday</span>
              <span className="text-[6px] font-mono opacity-90">Make a wish!</span>
            </div>
            <div className="flex items-center gap-1 text-[8px] text-[#9F2343]">
              <span>✦</span><span>🧁</span><span>✦</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Periods Box
  if (themeId === 'periods-box' || themeId === 'periods') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF1F4] via-[#FCE7ED] to-[#F1C5D1]/50 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#F1C5D1] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/70 via-transparent to-transparent opacity-80" />
        <div className="relative w-48 h-30 bg-[#FFFAF8] rounded-lg shadow-md border border-[#F1C5D1] p-2.5 flex items-center justify-between">
          {/* Comforting Warm Mug */}
          <div className="flex flex-col items-center">
            <div className="flex gap-0.5 mb-0.5">
              <div className="w-0.5 h-2 bg-[#E88AA4] rounded-full animate-pulse" />
              <div className="w-0.5 h-3 bg-[#E88AA4] rounded-full animate-pulse delay-100" />
            </div>
            <div className="relative w-8 h-10 bg-gradient-to-b from-[#9F2343] to-[#72172F] rounded-b-md shadow-sm border border-[#9F2343]/40 flex items-center justify-center">
              <span className="text-[8px] text-white">☕</span>
            </div>
          </div>
          {/* Gentle comfort care notes */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="w-22 h-9 bg-[#FFF1F4] rounded border border-[#F1C5D1] p-1 flex flex-col justify-between shadow-2xs">
              <span className="text-[7px] font-serif text-[#9F2343] font-semibold">Gentle Care & Warmth</span>
              <span className="text-[6px] text-[#795A63] italic">take it easy today ♥</span>
            </div>
            <div className="w-16 h-4 bg-[#72172F] rounded flex items-center justify-center shadow-xs">
              <span className="text-[6px] text-[#FFFAF8] font-serif font-medium">Warm Hugs Box</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. Apology Box
  if (themeId === 'apology-box' || themeId === 'apology') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF1F4] via-[#FCE7ED] to-[#F1C5D1]/40 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#F1C5D1] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/70 via-transparent to-transparent opacity-80" />
        <div className="relative w-48 h-30 bg-[#FFFAF8] rounded-lg shadow-md border border-[#F1C5D1] p-2.5 flex items-center justify-between">
          {/* Calming botanical sprig */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-12 border-l-2 border-[#72172F]/40 rotate-6 flex flex-col justify-between py-1">
              <div className="w-2 h-1.5 bg-[#E88AA4] rounded-full self-start" />
              <div className="w-2 h-1.5 bg-[#E88AA4] rounded-full self-end" />
              <div className="w-2 h-1.5 bg-[#E88AA4] rounded-full self-start" />
            </div>
          </div>
          {/* Understated letter */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="w-22 h-11 bg-white rounded border border-[#F1C5D1] p-1.5 flex flex-col justify-between shadow-xs">
              <span className="text-[7px] font-serif text-[#3B2028] font-semibold italic">"From the bottom of my heart"</span>
              <div className="w-full h-0.5 bg-[#F1C5D1]" />
              <span className="text-[6px] text-[#795A63]">A sincere gesture</span>
            </div>
            <div className="w-16 h-3.5 bg-[#72172F] rounded flex items-center justify-center shadow-xs">
              <span className="text-[6px] text-[#FFFAF8] font-serif uppercase tracking-widest">Peace & Care</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7. Miss You Box (Restored to Romantic Blush & Rose Pink - Lavender/Purple removed!)
  if (themeId === 'miss-you-box' || themeId === 'miss-you') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF1F4] via-[#FCE7ED] to-[#F1C5D1] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#F1C5D1] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/80 via-transparent to-transparent opacity-80" />
        <div className="relative w-48 h-30 bg-[#FFFAF8] rounded-lg shadow-md border border-[#F1C5D1] p-2.5 flex items-center justify-between">
          {/* Airmail postcard envelope in blush & rose */}
          <div className="relative w-16 h-18 bg-white rounded border border-[#F1C5D1] p-1 flex flex-col justify-between shadow-xs -rotate-3">
            <div className="flex items-center justify-between">
              <div className="w-3.5 h-4 bg-[#FFF1F4] border border-[#E88AA4] flex items-center justify-center text-[5px] text-[#9F2343] font-mono">✈</div>
              <span className="text-[5px] text-[#795A63] font-mono">POST</span>
            </div>
            <div className="w-full h-8 bg-gradient-to-br from-[#FFF1F4] to-[#FCE7ED] rounded-xs flex items-center justify-center border border-[#F1C5D1]/50">
              <span className="text-[8px] text-[#9F2343]">✉</span>
            </div>
            <span className="text-[5px] font-serif text-[#3B2028] text-center font-semibold">miss you</span>
          </div>
          {/* Miles apart quote */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="w-20 h-10 bg-[#FFF1F4] rounded border border-[#F1C5D1] p-1 flex flex-col justify-between shadow-2xs">
              <span className="text-[7px] font-serif text-[#3B2028] font-bold">Miles Apart</span>
              <span className="text-[6px] text-[#9F2343] italic">Close at heart</span>
            </div>
            <div className="w-14 h-4 bg-[#9F2343] rounded flex items-center justify-center shadow-xs">
              <span className="text-[6px] text-[#FFFAF8] font-mono font-medium tracking-wider">KEEPSAKE</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 8. Valentine Box
  if (themeId === 'valentine-box' || themeId === 'valentine') {
    return (
      <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF1F4] via-[#FCE7ED] to-[#F1C5D1] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#F1C5D1] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/70 via-transparent to-transparent opacity-85" />
        <div className="relative w-48 h-30 bg-[#9F2343] rounded-lg shadow-md border border-[#72172F] p-2.5 flex items-center justify-between text-white">
          {/* Velvet heart box */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-[#72172F] border border-[#E88AA4]/50 flex items-center justify-center shadow-inner">
              <span className="text-[14px] text-[#FCE7ED] animate-pulse">♥</span>
            </div>
            <span className="text-[5px] text-[#FCE7ED] font-serif uppercase tracking-widest mt-1">Velvet</span>
          </div>
          {/* Romantic envelope with sweet hearts */}
          <div className="flex flex-col items-end gap-1.5">
            <div className="w-22 h-10 bg-[#FFFAF8] rounded p-1.5 flex flex-col justify-between text-[#72172F] shadow-xs">
              <span className="text-[7px] font-serif font-bold uppercase tracking-wider">Be My Valentine</span>
              <span className="text-[6px] italic text-[#9F2343]">Love you always & forever</span>
            </div>
            <div className="w-16 h-3.5 bg-gradient-to-r from-[#E88AA4] to-[#9F2343] rounded flex items-center justify-center shadow-xs">
              <span className="text-[6px] text-white font-serif uppercase tracking-wider font-semibold">Forever & Always</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 9. Diwali Box
  return (
    <div className={`relative w-full aspect-[16/10] bg-gradient-to-br from-[#FFF1F4] via-[#FFF8EC] to-[#FCE7ED] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-[#F1C5D1] shadow-inner ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-200/40 via-transparent to-transparent opacity-80" />
      <div className="relative w-48 h-30 bg-[#FFFAF8] rounded-lg shadow-md border border-[#E88AA4] p-2.5 flex items-center justify-between">
        {/* Glowing Diya Lamp */}
        <div className="flex flex-col items-center">
          <div className="w-3 h-4 bg-gradient-to-t from-amber-500 via-yellow-400 to-amber-200 rounded-full blur-[1px] animate-pulse shadow-md shadow-amber-300" />
          <div className="w-9 h-6 bg-gradient-to-b from-[#9F2343] to-[#72172F] rounded-b-full shadow-sm border border-[#72172F]/30 flex items-center justify-center">
            <span className="text-[6px] text-[#FCE7ED]">🪔</span>
          </div>
        </div>
        {/* Festive sweets & banner */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="w-22 h-10 bg-gradient-to-r from-[#9F2343] to-[#72172F] rounded p-1 flex flex-col justify-between text-white shadow-xs">
            <span className="text-[8px] font-serif font-bold uppercase tracking-wider">Shubh Deepavali</span>
            <span className="text-[6px] text-[#FCE7ED] font-mono">Lights & Sweets</span>
          </div>
          <div className="flex items-center gap-1 text-[8px] text-[#9F2343] font-serif">
            <span>✨</span>
            <span className="text-[6px] font-semibold uppercase tracking-wider">Festival of Joy</span>
            <span>✨</span>
          </div>
        </div>
      </div>
    </div>
  );
};
