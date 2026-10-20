import React from 'react';

interface ProductArtworkProps {
  type: 'little-affair' | 'dilsy-edit' | 'everything-box';
  className?: string;
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({ type, className = '' }) => {
  if (type === 'little-affair') {
    return (
      <div className={`relative w-full aspect-[4/3] bg-gradient-to-b from-[#F7F2EB] to-[#EFE7DC] rounded-xl overflow-hidden flex items-center justify-center p-6 border border-[#2A1E1A]/5 shadow-inner ${className}`}>
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/70 via-transparent to-transparent opacity-80" />

        {/* Tactile Hamper Composition */}
        <div className="relative w-full max-w-[280px] h-full flex flex-col items-center justify-center">
          {/* Ivory Keepsake Box Base */}
          <div className="relative w-56 h-36 bg-[#FDFBF7] rounded-lg shadow-md border border-[#2A1E1A]/10 p-3 flex flex-col justify-between">
            {/* Box Inner Shading & Tissue Paper */}
            <div className="absolute inset-1.5 bg-[#FAF4ED] rounded border border-dashed border-[#D4A39A]/40 flex flex-col justify-between p-2 overflow-hidden">
              {/* Delicate items inside box */}
              <div className="flex items-center justify-between gap-2">
                {/* Votive Candle */}
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2.5 bg-amber-400 rounded-full blur-[1px] animate-pulse" />
                  <div className="w-8 h-10 bg-[#E6DACF] rounded-t-sm border border-[#2A1E1A]/15 shadow-sm flex flex-col justify-center items-center">
                    <div className="w-6 h-0.5 bg-[#C87D70]/40 my-0.5" />
                    <span className="text-[7px] font-serif text-[#4A352F] tracking-tighter">SOY</span>
                  </div>
                </div>

                {/* Polaroid Frame */}
                <div className="relative w-16 h-18 bg-white p-1 pb-3 shadow-md -rotate-6 border border-neutral-200 rounded-sm">
                  <div className="w-full h-11 bg-gradient-to-br from-[#D4A39A]/40 via-[#F3E7E4] to-[#B87A68]/30 rounded-xs flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#8C5A4F]/60" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span className="block text-[6px] text-center font-serif text-neutral-600 mt-1 italic">you & me</span>
                </div>

                {/* Chocolates & Dried Sprig */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-[#5C3A32] shadow flex items-center justify-center border border-amber-200/40">
                    <span className="text-[8px] text-amber-100 font-serif">✦</span>
                  </div>
                  {/* Dried Floral Sprig */}
                  <div className="w-4 h-6 border-l border-amber-800/40 rotate-12 flex flex-col gap-0.5">
                    <div className="w-2 h-1 bg-[#8C7A6B] rounded-full self-start" />
                    <div className="w-2 h-1 bg-[#8C7A6B] rounded-full self-end" />
                  </div>
                </div>
              </div>

              {/* Envelope note with blush seal */}
              <div className="w-full h-8 bg-[#F5EDE6] rounded-xs border border-[#2A1E1A]/10 flex items-center justify-between px-2 shadow-xs">
                <span className="text-[8px] font-serif tracking-widest text-[#4A352F] uppercase">A Note of Love</span>
                <div className="w-4 h-4 rounded-full bg-[#C87D70] flex items-center justify-center shadow-xs">
                  <span className="text-[7px] text-white font-serif font-bold">D</span>
                </div>
              </div>
            </div>

            {/* Muted Blush Silk Ribbon Overlay */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 h-5 flex flex-col items-center pointer-events-none">
              <div className="w-5 h-2 bg-[#D4A39A] rounded-full shadow-sm" />
              <div className="flex justify-between w-6">
                <div className="w-2 h-3 bg-[#D4A39A]/90 rotate-12 origin-top rounded-b-xs" />
                <div className="w-2 h-3 bg-[#D4A39A]/90 -rotate-12 origin-top rounded-b-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Badge in corner */}
        <div className="absolute bottom-3 left-4 text-xs font-serif italic text-[#4A352F]/70">
          The Little Affair · ₹999
        </div>
      </div>
    );
  }

  if (type === 'dilsy-edit') {
    return (
      <div className={`relative w-full aspect-[4/3] bg-gradient-to-b from-[#F5EFEB] to-[#EAE0D6] rounded-xl overflow-hidden flex items-center justify-center p-6 border border-[#2A1E1A]/5 shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent opacity-75" />

        <div className="relative w-full max-w-[280px] h-full flex flex-col items-center justify-center">
          {/* Signature Ecru & Tan Box */}
          <div className="relative w-60 h-40 bg-[#FAF7F2] rounded-lg shadow-md border border-[#2A1E1A]/10 p-3.5 flex flex-col justify-between">
            <div className="absolute inset-1.5 bg-[#F6EFE9] rounded border border-[#B87A68]/30 flex flex-col justify-between p-2.5 overflow-hidden">
              <div className="flex items-center justify-between">
                {/* Amber Glass Soy Jar */}
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2.5 bg-amber-400 rounded-full blur-[1px] animate-pulse" />
                  <div className="w-10 h-12 bg-gradient-to-b from-amber-700 to-amber-900 rounded-md shadow-md border border-amber-950/30 flex flex-col justify-center items-center p-1">
                    <div className="w-7 h-5 bg-[#FAF7F2] rounded-xs flex flex-col items-center justify-center shadow-xs">
                      <span className="text-[6px] font-bold text-[#2A1E1A] tracking-wider uppercase">AMBER</span>
                      <span className="text-[5px] text-[#2A1E1A]/60">DILSY</span>
                    </div>
                  </div>
                </div>

                {/* Handcrafted Vegan Leather Keychain */}
                <div className="flex flex-col items-center rotate-6">
                  <div className="w-3 h-3 rounded-full border-2 border-amber-300 shadow-xs mb-0.5" />
                  <div className="w-6 h-12 bg-[#8B5A3E] rounded-md shadow-sm border border-black/10 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-amber-200 font-bold tracking-widest">D·S</span>
                  </div>
                </div>

                {/* Gourmet Bakery Cookies & Velvet Pouch */}
                <div className="flex flex-col items-end gap-1.5">
                  <div className="w-11 h-7 bg-[#E8DDD2] rounded-xs border border-dashed border-[#8C5A4F]/40 flex items-center justify-center px-1 shadow-xs">
                    <span className="text-[7px] font-serif text-[#4A352F]">Cookies</span>
                  </div>
                  <div className="w-9 h-7 bg-[#543831] rounded-t-sm rounded-b-md shadow-sm flex items-center justify-center">
                    <span className="text-[6px] text-amber-100 font-serif italic">velvet</span>
                  </div>
                </div>
              </div>

              {/* Folded Parchment Letter with Burgundy Wax Stamp */}
              <div className="w-full h-8 bg-[#FBF9F5] rounded-xs border border-[#2A1E1A]/10 flex items-center justify-between px-2.5 shadow-xs mt-1">
                <span className="text-[8px] font-serif tracking-wide text-[#362722]">A Handwritten Letter For You</span>
                <div className="w-5 h-5 rounded-full bg-[#782823] flex items-center justify-center shadow-xs ring-1 ring-[#782823]/30">
                  <span className="text-[8px] text-amber-100 font-serif font-bold">D</span>
                </div>
              </div>
            </div>

            {/* Espresso band across */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-4 bg-[#362722]/90 flex items-center justify-center pointer-events-none">
              <span className="text-[7px] tracking-[0.25em] text-[#FAF7F2] font-semibold uppercase">The DILSY Edit</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 left-4 text-xs font-serif italic text-[#4A352F]/70">
          The DILSY Edit · ₹1,249
        </div>
      </div>
    );
  }

  // Everything Box
  return (
    <div className={`relative w-full aspect-[4/3] bg-gradient-to-b from-[#F2ECE6] to-[#E3D7CC] rounded-xl overflow-hidden flex items-center justify-center p-6 border border-[#2A1E1A]/5 shadow-inner ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/70 via-transparent to-transparent opacity-80" />

      <div className="relative w-full max-w-[280px] h-full flex flex-col items-center justify-center">
        {/* Luxury Espresso & Ivory Magnetic Box */}
        <div className="relative w-64 h-42 bg-[#362722] rounded-lg shadow-lg border border-amber-900/30 p-2.5 flex flex-col justify-between">
          <div className="absolute inset-1.5 bg-[#FAF7F2] rounded-md border border-[#2A1E1A]/10 flex flex-col justify-between p-2.5 overflow-hidden">
            {/* Top row with Tumbler & Scented Candle */}
            <div className="flex items-center justify-between">
              {/* Insulated Tumbler */}
              <div className="flex flex-col items-center -rotate-3">
                <div className="w-5 h-2 bg-neutral-300 rounded-t-sm border border-neutral-400" />
                <div className="w-8 h-14 bg-gradient-to-b from-[#D4A39A] to-[#B87A68] rounded-b-md shadow-md flex items-center justify-center">
                  <span className="text-[7px] text-white font-serif tracking-widest uppercase rotate-90">DILSY</span>
                </div>
              </div>

              {/* Hot Cocoa & Mist */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-10 bg-[#422B24] rounded-sm shadow-sm flex flex-col items-center justify-center p-0.5 border border-amber-300/30">
                  <span className="text-[6px] text-amber-200 font-serif uppercase tracking-tighter">COCOA</span>
                  <span className="text-[5px] text-white/70">Blend</span>
                </div>
                <div className="w-5 h-7 bg-[#EFE7DE] rounded-xs border border-neutral-300 flex items-center justify-center shadow-xs">
                  <span className="text-[5px] text-neutral-600 font-mono">MIST</span>
                </div>
              </div>

              {/* Set of 3 Polaroid prints with wooden clips */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute w-12 h-14 bg-white shadow-xs rotate-12 border border-neutral-200 rounded-xs" />
                <div className="absolute w-12 h-14 bg-white shadow-xs -rotate-6 border border-neutral-200 rounded-xs" />
                <div className="relative w-12 h-14 bg-white shadow-md border border-neutral-300 rounded-xs p-1 pb-2 flex flex-col justify-between">
                  <div className="w-full h-8 bg-gradient-to-br from-[#E8D5CE] to-[#C87D70] rounded-xs flex items-center justify-center">
                    <span className="text-[8px] text-white font-serif">♥</span>
                  </div>
                  <span className="text-[5px] text-center font-serif text-neutral-700">forever</span>
                </div>
              </div>
            </div>

            {/* Deluxe gold-accented note card */}
            <div className="w-full h-7 bg-[#FAF4ED] rounded-xs border border-amber-300/40 flex items-center justify-between px-2 shadow-xs">
              <span className="text-[7px] font-serif tracking-wider text-[#362722] uppercase">Memories & Feelings</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-[#B87A68] flex items-center justify-center text-[7px] text-white font-serif">
                  D
                </div>
              </div>
            </div>
          </div>

          {/* Magnetic flap accent */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-2 bg-[#2A1E1A] rounded-b border border-amber-500/20 shadow-xs flex items-center justify-center">
            <div className="w-2 h-0.5 bg-amber-400/60 rounded-full" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 left-4 text-xs font-serif italic text-[#4A352F]/70">
        The Everything Box · ₹1,499
      </div>
    </div>
  );
};
