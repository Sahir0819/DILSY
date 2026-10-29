import React from 'react';

interface ProductArtworkProps {
  type: 'loved-box' | 'little-affair' | 'dilsy-edit' | 'everything-box';
  className?: string;
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({ type, className = '' }) => {
  // 1. DEDICATED LOVED BOX ARTWORK (Medium — ₹969)
  if (type === 'loved-box') {
    return (
      <div className={`relative w-full aspect-[4/3] bg-gradient-to-b from-[#FFF1F4] via-[#FCE7ED] to-[#F1C5D1]/40 rounded-xl overflow-hidden flex items-center justify-center p-6 border border-[#F1C5D1] shadow-inner ${className}`}>
        {/* Soft romantic background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/90 via-transparent to-transparent opacity-95" />

        {/* Tactile Hamper Composition */}
        <div className="relative w-full max-w-[290px] h-full flex flex-col items-center justify-center">
          {/* Signature Blush & Warm Ivory Medium Box */}
          <div className="relative w-60 h-40 bg-[#FFFAF8] rounded-lg shadow-lg border border-[#E88AA4] p-3 flex flex-col justify-between">
            {/* Box Inner Shading & Rose-Tinted Tissue Paper */}
            <div className="absolute inset-1.5 bg-[#FFF1F4] rounded border border-dashed border-[#E88AA4]/70 flex flex-col justify-between p-2.5 overflow-hidden">
              {/* Delicate items inside Loved Box */}
              <div className="flex items-center justify-between gap-2">
                {/* Hand-poured Soy Candle with Warm Flickering Flame */}
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-3 bg-amber-400 rounded-full blur-[1px] animate-pulse shadow-xs shadow-amber-300" />
                  <div className="w-9 h-11 bg-gradient-to-b from-[#E88AA4] via-[#9F2343] to-[#72172F] rounded-md border border-[#F1C5D1] shadow-sm flex flex-col justify-center items-center p-1">
                    <div className="w-6 h-5 bg-[#FFFAF8] rounded-xs flex flex-col items-center justify-center shadow-xs">
                      <span className="text-[6px] font-serif text-[#72172F] font-bold tracking-tighter">LOVE</span>
                      <span className="text-[5px] text-[#9F2343]">SOY</span>
                    </div>
                  </div>
                </div>

                {/* Polaroid Frame with Romantic Heart Motif */}
                <div className="relative w-16 h-18 bg-white p-1 pb-3 shadow-md -rotate-3 border border-[#F1C5D1] rounded-xs">
                  <div className="w-full h-11 bg-gradient-to-br from-[#FFF1F4] via-[#FCE7ED] to-[#E88AA4]/50 rounded-xs flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#9F2343] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span className="block text-[6px] text-center font-serif text-[#9F2343] mt-1 italic font-semibold">my favorite ♥</span>
                </div>

                {/* Handcrafted Initials Keychain & Confections */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-[#72172F] shadow flex items-center justify-center border border-[#F1C5D1]">
                    <span className="text-[8px] text-[#FFFAF8] font-serif font-bold">♥</span>
                  </div>
                  {/* Heart Truffles */}
                  <div className="flex gap-1">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#3B2028] shadow-xs flex items-center justify-center">
                      <span className="text-[6px] text-[#E88AA4]">♥</span>
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#72172F] shadow-xs flex items-center justify-center">
                      <span className="text-[6px] text-[#E88AA4]">♥</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Envelope note with heart badge */}
              <div className="w-full h-8 bg-[#FFFAF8] rounded-xs border border-[#F1C5D1] flex items-center justify-between px-2.5 shadow-xs">
                <span className="text-[8px] font-serif tracking-widest text-[#3B2028] uppercase font-bold">A Little Box Full of Feelings</span>
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#9F2343] to-[#72172F] flex items-center justify-center shadow-xs ring-1 ring-[#F1C5D1]">
                  <span className="text-[8px] text-[#FFFAF8] font-serif font-bold">♥</span>
                </div>
              </div>
            </div>

            {/* Burgundy Silk Ribbon Overlay */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-5 flex flex-col items-center pointer-events-none">
              <div className="w-8 h-2.5 bg-[#9F2343] rounded-full shadow-sm" />
              <div className="flex justify-between w-9">
                <div className="w-3 h-4 bg-[#72172F] rotate-12 origin-top rounded-b-xs" />
                <div className="w-3 h-4 bg-[#72172F] -rotate-12 origin-top rounded-b-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Sample Imagery Notice */}
        <div className="absolute top-3 right-3 bg-[#FFFAF8]/95 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#F1C5D1] shadow-2xs">
          <span className="text-[9px] font-medium text-[#795A63] italic">
            Sample illustrative artwork
          </span>
        </div>

        {/* Bottom Official Box Price Badge */}
        <div className="absolute bottom-3 left-4 text-xs font-serif italic text-[#3B2028] font-semibold flex items-center gap-1.5 bg-[#FFFAF8]/95 px-2.5 py-1 rounded-full border border-[#F1C5D1] shadow-2xs">
          <span className="font-bold">Loved Box — Medium</span>
          <span>·</span>
          <span className="tabular-nums font-bold text-[#9F2343]">₹969</span>
        </div>
      </div>
    );
  }

  // 2. SMALL BOX ARTWORK (The Little Affair — ₹799)
  if (type === 'little-affair') {
    return (
      <div className={`relative w-full aspect-[4/3] bg-gradient-to-b from-[#FFF1F4] via-[#FCE7ED] to-[#F1C5D1]/40 rounded-xl overflow-hidden flex items-center justify-center p-6 border border-[#F1C5D1] shadow-inner ${className}`}>
        {/* Soft romantic background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/90 via-transparent to-transparent opacity-90" />

        {/* Tactile Hamper Composition */}
        <div className="relative w-full max-w-[280px] h-full flex flex-col items-center justify-center">
          {/* Ivory & Rose Keepsake Box Base */}
          <div className="relative w-56 h-36 bg-[#FFFAF8] rounded-lg shadow-md border border-[#E88AA4] p-3 flex flex-col justify-between">
            {/* Box Inner Shading & Rose-Tinted Tissue Paper */}
            <div className="absolute inset-1.5 bg-[#FFF1F4] rounded border border-dashed border-[#E88AA4]/60 flex flex-col justify-between p-2 overflow-hidden">
              <div className="flex items-center justify-between gap-2">
                {/* Votive Candle with Warm Romantic Flame */}
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-3 bg-amber-400 rounded-full blur-[1px] animate-pulse shadow-xs shadow-amber-300" />
                  <div className="w-8 h-10 bg-[#FFFAF8] rounded-t-sm border border-[#F1C5D1] shadow-sm flex flex-col justify-center items-center">
                    <div className="w-6 h-0.5 bg-[#9F2343]/40 my-0.5" />
                    <span className="text-[7px] font-serif text-[#3B2028] font-semibold tracking-tighter">SOY</span>
                  </div>
                </div>

                {/* Polaroid Frame with Heart and Love Theme */}
                <div className="relative w-16 h-18 bg-white p-1 pb-3 shadow-md -rotate-6 border border-[#F1C5D1] rounded-sm">
                  <div className="w-full h-11 bg-gradient-to-br from-[#FFF1F4] via-[#FCE7ED] to-[#E88AA4]/40 rounded-xs flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#9F2343]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span className="block text-[6px] text-center font-serif text-[#9F2343] mt-1 italic font-medium">with love ♥</span>
                </div>

                {/* Chocolates & Dried Sprig */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-[#72172F] shadow flex items-center justify-center border border-[#F1C5D1]">
                    <span className="text-[8px] text-[#E88AA4] font-serif">♥</span>
                  </div>
                  <div className="w-4 h-6 border-l border-[#9F2343]/50 rotate-12 flex flex-col gap-0.5">
                    <div className="w-2 h-1 bg-[#E88AA4] rounded-full self-start" />
                    <div className="w-2 h-1 bg-[#9F2343] rounded-full self-end" />
                  </div>
                </div>
              </div>

              {/* Envelope note with heart badge */}
              <div className="w-full h-8 bg-[#FFFAF8] rounded-xs border border-[#F1C5D1] flex items-center justify-between px-2 shadow-xs">
                <span className="text-[8px] font-serif tracking-widest text-[#3B2028] uppercase font-medium">A Love Note For You</span>
                <div className="w-4.5 h-4.5 rounded-full bg-gradient-to-br from-[#9F2343] to-[#72172F] flex items-center justify-center shadow-xs ring-1 ring-[#F1C5D1]">
                  <span className="text-[7px] text-[#FFFAF8] font-serif font-bold">♥</span>
                </div>
              </div>
            </div>

            {/* Burgundy Silk Ribbon Overlay */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-5 flex flex-col items-center pointer-events-none">
              <div className="w-6 h-2 bg-[#9F2343] rounded-full shadow-sm" />
              <div className="flex justify-between w-7">
                <div className="w-2.5 h-3.5 bg-[#72172F] rotate-12 origin-top rounded-b-xs" />
                <div className="w-2.5 h-3.5 bg-[#72172F] -rotate-12 origin-top rounded-b-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Sample Imagery Notice */}
        <div className="absolute top-3 right-3 bg-[#FFFAF8]/95 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#F1C5D1] shadow-2xs">
          <span className="text-[9px] font-medium text-[#795A63] italic">
            Sample illustrative artwork
          </span>
        </div>

        {/* Badge in corner */}
        <div className="absolute bottom-3 left-4 text-xs font-serif italic text-[#3B2028] font-semibold flex items-center gap-1.5 bg-[#FFFAF8]/95 px-2.5 py-1 rounded-full border border-[#F1C5D1] shadow-2xs">
          <span>Small Box — The Little Affair</span>
          <span>·</span>
          <span className="tabular-nums font-bold text-[#9F2343]">₹799</span>
        </div>
      </div>
    );
  }

  // 3. MEDIUM BOX ARTWORK (The DILSY Edit — ₹969)
  if (type === 'dilsy-edit') {
    return (
      <div className={`relative w-full aspect-[4/3] bg-gradient-to-b from-[#FFF1F4] via-[#FCE7ED] to-[#F1C5D1]/40 rounded-xl overflow-hidden flex items-center justify-center p-6 border border-[#F1C5D1] shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/80 via-transparent to-transparent opacity-85" />

        <div className="relative w-full max-w-[280px] h-full flex flex-col items-center justify-center">
          <div className="relative w-60 h-40 bg-[#FFFAF8] rounded-lg shadow-md border border-[#E88AA4] p-3.5 flex flex-col justify-between">
            <div className="absolute inset-1.5 bg-[#FFF1F4] rounded border border-[#E88AA4]/40 flex flex-col justify-between p-2.5 overflow-hidden">
              <div className="flex items-center justify-between">
                {/* Candle with flame */}
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-3 bg-amber-400 rounded-full blur-[1px] animate-pulse shadow-xs shadow-amber-300" />
                  <div className="w-10 h-12 bg-gradient-to-b from-[#E88AA4] via-[#9F2343] to-[#72172F] rounded-md shadow-md border border-[#72172F]/30 flex flex-col justify-center items-center p-1">
                    <div className="w-7 h-5 bg-[#FFFAF8] rounded-xs flex flex-col items-center justify-center shadow-xs">
                      <span className="text-[6px] font-bold text-[#72172F] tracking-wider uppercase">AMBER</span>
                      <span className="text-[5px] text-[#9F2343]">DILSY ♥</span>
                    </div>
                  </div>
                </div>

                {/* Handcrafted Keychain with Heart Monogram */}
                <div className="flex flex-col items-center rotate-6">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#E88AA4] shadow-xs mb-0.5" />
                  <div className="w-6.5 h-12 bg-[#72172F] rounded-md shadow-sm border border-black/10 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-[#FCE7ED] font-bold tracking-widest">D♥S</span>
                  </div>
                </div>

                {/* Treats */}
                <div className="flex flex-col items-end gap-1.5">
                  <div className="w-11 h-7 bg-[#FFFAF8] rounded-xs border border-dashed border-[#F1C5D1] flex items-center justify-center px-1 shadow-xs">
                    <span className="text-[7px] font-serif text-[#3B2028] font-medium">Sweet Bites</span>
                  </div>
                  <div className="w-9 h-7 bg-[#72172F] rounded-t-sm rounded-b-md shadow-sm flex items-center justify-center">
                    <span className="text-[6px] text-[#FFFAF8] font-serif italic">velvet ♥</span>
                  </div>
                </div>
              </div>

              {/* Folded Parchment Letter with Burgundy Wax Stamp */}
              <div className="w-full h-8 bg-[#FFFAF8] rounded-xs border border-[#F1C5D1] flex items-center justify-between px-2.5 shadow-xs mt-1">
                <span className="text-[8px] font-serif tracking-wide text-[#3B2028] font-medium">A Handwritten Letter From My Heart</span>
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#9F2343] to-[#72172F] flex items-center justify-center shadow-xs ring-1 ring-[#F1C5D1]">
                  <span className="text-[8px] text-[#FFFAF8] font-serif font-bold">♥</span>
                </div>
              </div>
            </div>

            {/* Rich Wine band across */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-4.5 bg-[#72172F]/95 flex items-center justify-center pointer-events-none shadow-xs">
              <span className="text-[7px] tracking-[0.25em] text-[#FFFAF8] font-semibold uppercase flex items-center gap-1">
                <span>♥</span>
                <span>The DILSY Edit</span>
                <span>♥</span>
              </span>
            </div>
          </div>
        </div>

        {/* Top Sample Imagery Notice */}
        <div className="absolute top-3 right-3 bg-[#FFFAF8]/95 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#F1C5D1] shadow-2xs">
          <span className="text-[9px] font-medium text-[#795A63] italic">
            Sample illustrative artwork
          </span>
        </div>

        <div className="absolute bottom-3 left-4 text-xs font-serif italic text-[#3B2028] font-semibold flex items-center gap-1.5 bg-[#FFFAF8]/95 px-2.5 py-1 rounded-full border border-[#F1C5D1] shadow-2xs">
          <span>Medium Box — The DILSY Edit</span>
          <span>·</span>
          <span className="tabular-nums font-bold text-[#9F2343]">₹969</span>
        </div>
      </div>
    );
  }

  // 4. LARGE BOX ARTWORK (The Everything Box — ₹1,199)
  return (
    <div className={`relative w-full aspect-[4/3] bg-gradient-to-b from-[#FFF1F4] via-[#FCE7ED] to-[#F1C5D1]/40 rounded-xl overflow-hidden flex items-center justify-center p-6 border border-[#F1C5D1] shadow-inner ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/80 via-transparent to-transparent opacity-90" />

      <div className="relative w-full max-w-[280px] h-full flex flex-col items-center justify-center">
        {/* Luxury Romantic Box */}
        <div className="relative w-64 h-42 bg-[#72172F] rounded-lg shadow-lg border border-[#9F2343] p-2.5 flex flex-col justify-between">
          <div className="absolute inset-1.5 bg-[#FFFAF8] rounded-md border border-[#F1C5D1] flex flex-col justify-between p-2.5 overflow-hidden">
            {/* Top row with Tumbler & Candle */}
            <div className="flex items-center justify-between">
              {/* Tumbler in Deep Burgundy */}
              <div className="flex flex-col items-center -rotate-3">
                <div className="w-5 h-2 bg-[#E88AA4] rounded-t-sm border border-[#F1C5D1]" />
                <div className="w-8 h-14 bg-gradient-to-b from-[#9F2343] to-[#72172F] rounded-b-md shadow-md flex items-center justify-center">
                  <span className="text-[7px] text-white font-serif tracking-widest uppercase rotate-90 font-medium">DILSY ♥</span>
                </div>
              </div>

              {/* Hot Cocoa & Mist */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-10 bg-[#72172F] rounded-sm shadow-sm flex flex-col items-center justify-center p-0.5 border border-[#F1C5D1]/40">
                  <span className="text-[6px] text-[#FFFAF8] font-serif uppercase tracking-tighter">COCOA</span>
                  <span className="text-[5px] text-white/90">Love Blend</span>
                </div>
                <div className="w-5 h-7 bg-[#FFF1F4] rounded-xs border border-[#F1C5D1] flex items-center justify-center shadow-xs">
                  <span className="text-[5px] text-[#9F2343] font-mono font-medium">MIST</span>
                </div>
              </div>

              {/* Set of 3 Polaroid prints with love theme */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute w-12 h-14 bg-white shadow-xs rotate-12 border border-[#F1C5D1] rounded-xs" />
                <div className="absolute w-12 h-14 bg-white shadow-xs -rotate-6 border border-[#F1C5D1] rounded-xs" />
                <div className="relative w-12 h-14 bg-white shadow-md border border-[#F1C5D1] rounded-xs p-1 pb-2 flex flex-col justify-between">
                  <div className="w-full h-8 bg-gradient-to-br from-[#9F2343] via-[#851D37] to-[#72172F] rounded-xs flex items-center justify-center shadow-inner">
                    <span className="text-[10px] text-white font-serif animate-pulse">♥</span>
                  </div>
                  <span className="text-[5px] text-center font-serif text-[#3B2028] font-semibold">forever you</span>
                </div>
              </div>
            </div>

            {/* Deluxe note card */}
            <div className="w-full h-7 bg-[#FFF1F4] rounded-xs border border-[#F1C5D1] flex items-center justify-between px-2 shadow-xs">
              <span className="text-[7px] font-serif tracking-wider text-[#3B2028] uppercase font-medium">Memories & Sweet Feelings</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#9F2343] to-[#72172F] flex items-center justify-center text-[7px] text-white font-serif">
                  ♥
                </div>
              </div>
            </div>
          </div>

          {/* Magnetic flap accent in dark burgundy */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-2 bg-[#3B2028] rounded-b border border-[#F1C5D1]/30 shadow-xs flex items-center justify-center">
            <div className="w-2.5 h-0.5 bg-[#E88AA4] rounded-full" />
          </div>
        </div>
      </div>

      {/* Top Sample Imagery Notice */}
      <div className="absolute top-3 right-3 bg-[#FFFAF8]/95 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#F1C5D1] shadow-2xs">
        <span className="text-[9px] font-medium text-[#795A63] italic">
          Sample illustrative artwork
        </span>
      </div>

      <div className="absolute bottom-3 left-4 text-xs font-serif italic text-[#3B2028] font-semibold flex items-center gap-1.5 bg-[#FFFAF8]/95 px-2.5 py-1 rounded-full border border-[#F1C5D1] shadow-2xs">
        <span>Large Box — The Everything Box</span>
        <span>·</span>
        <span className="tabular-nums font-bold text-[#9F2343]">₹1,199</span>
      </div>
    </div>
  );
};
