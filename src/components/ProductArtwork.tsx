import React from 'react';

interface ProductArtworkProps {
  type: 'little-affair' | 'dilsy-edit' | 'everything-box';
  className?: string;
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({ type, className = '' }) => {
  if (type === 'little-affair') {
    return (
      <div className={`relative w-full aspect-[4/3] bg-gradient-to-b from-[#FFF5F7] via-[#FDF0F3] to-[#FCE8ED] rounded-xl overflow-hidden flex items-center justify-center p-6 border border-[#FFCCD5]/60 shadow-inner ${className}`}>
        {/* Soft romantic background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFE5EC]/80 via-transparent to-transparent opacity-90" />

        {/* Tactile Hamper Composition */}
        <div className="relative w-full max-w-[280px] h-full flex flex-col items-center justify-center">
          {/* Ivory & Rose Keepsake Box Base */}
          <div className="relative w-56 h-36 bg-[#FFFCFD] rounded-lg shadow-md border border-[#F2BDCA] p-3 flex flex-col justify-between">
            {/* Box Inner Shading & Rose-Tinted Tissue Paper */}
            <div className="absolute inset-1.5 bg-[#FFF0F4] rounded border border-dashed border-[#F29CAE]/60 flex flex-col justify-between p-2 overflow-hidden">
              {/* Delicate items inside box */}
              <div className="flex items-center justify-between gap-2">
                {/* Votive Candle with Warm Romantic Flame */}
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-3 bg-amber-400 rounded-full blur-[1px] animate-pulse shadow-xs shadow-amber-300" />
                  <div className="w-8 h-10 bg-[#FCE8ED] rounded-t-sm border border-[#EAA2B2] shadow-sm flex flex-col justify-center items-center">
                    <div className="w-6 h-0.5 bg-[#C73858]/40 my-0.5" />
                    <span className="text-[7px] font-serif text-[#7A1E31] font-semibold tracking-tighter">SOY</span>
                  </div>
                </div>

                {/* Polaroid Frame with Heart and Love Theme */}
                <div className="relative w-16 h-18 bg-white p-1 pb-3 shadow-md -rotate-6 border border-pink-200 rounded-sm">
                  <div className="w-full h-11 bg-gradient-to-br from-[#FFCCD5] via-[#FFE5EC] to-[#F78CA2]/40 rounded-xs flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#C73858]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span className="block text-[6px] text-center font-serif text-[#99223A] mt-1 italic font-medium">with love ♥</span>
                </div>

                {/* Chocolates & Dried Sprig */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-[#4E1822] shadow flex items-center justify-center border border-[#FFCCD5]/50">
                    <span className="text-[8px] text-[#FFCCD5] font-serif">♥</span>
                  </div>
                  {/* Dried Rose Floral Sprig */}
                  <div className="w-4 h-6 border-l border-[#A33049]/50 rotate-12 flex flex-col gap-0.5">
                    <div className="w-2 h-1 bg-[#C74B64] rounded-full self-start" />
                    <div className="w-2 h-1 bg-[#D86D82] rounded-full self-end" />
                  </div>
                </div>
              </div>

              {/* Envelope note with rich crimson wax seal */}
              <div className="w-full h-8 bg-[#FFF8FA] rounded-xs border border-[#F2BDCA] flex items-center justify-between px-2 shadow-xs">
                <span className="text-[8px] font-serif tracking-widest text-[#7A1E31] uppercase font-medium">A Love Note For You</span>
                <div className="w-4.5 h-4.5 rounded-full bg-gradient-to-br from-[#B3243F] to-[#781226] flex items-center justify-center shadow-xs ring-1 ring-[#FFCCD5]">
                  <span className="text-[7px] text-[#FFE5EC] font-serif font-bold">♥</span>
                </div>
              </div>
            </div>

            {/* Dusty Rose Silk Ribbon Overlay */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-5 flex flex-col items-center pointer-events-none">
              <div className="w-6 h-2 bg-[#E56B85] rounded-full shadow-sm" />
              <div className="flex justify-between w-7">
                <div className="w-2.5 h-3.5 bg-[#D4506D] rotate-12 origin-top rounded-b-xs" />
                <div className="w-2.5 h-3.5 bg-[#D4506D] -rotate-12 origin-top rounded-b-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Badge in corner */}
        <div className="absolute bottom-3 left-4 text-xs font-serif italic text-[#7A1E31] font-medium flex items-center gap-1">
          <span>The Little Affair</span>
          <span>·</span>
          <span className="tabular-nums">₹999</span>
        </div>
      </div>
    );
  }

  if (type === 'dilsy-edit') {
    return (
      <div className={`relative w-full aspect-[4/3] bg-gradient-to-b from-[#FFF5F7] via-[#FDF0F3] to-[#FCE8ED] rounded-xl overflow-hidden flex items-center justify-center p-6 border border-[#FFCCD5]/60 shadow-inner ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#FFE5EC]/70 via-transparent to-transparent opacity-85" />

        <div className="relative w-full max-w-[280px] h-full flex flex-col items-center justify-center">
          {/* Signature Ecru & Tan Box with Rose Gold trim */}
          <div className="relative w-60 h-40 bg-[#FFFDFE] rounded-lg shadow-md border border-[#EAA2B2] p-3.5 flex flex-col justify-between">
            <div className="absolute inset-1.5 bg-[#FFF0F4] rounded border border-[#E89CAE]/40 flex flex-col justify-between p-2.5 overflow-hidden">
              <div className="flex items-center justify-between">
                {/* Amber Glass Soy Jar with Warm Romantic Flame */}
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-3 bg-amber-400 rounded-full blur-[1px] animate-pulse shadow-xs shadow-amber-300" />
                  <div className="w-10 h-12 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 rounded-md shadow-md border border-amber-950/30 flex flex-col justify-center items-center p-1">
                    <div className="w-7 h-5 bg-[#FFF8FA] rounded-xs flex flex-col items-center justify-center shadow-xs">
                      <span className="text-[6px] font-bold text-[#7A1E31] tracking-wider uppercase">AMBER</span>
                      <span className="text-[5px] text-[#A32842]">DILSY ♥</span>
                    </div>
                  </div>
                </div>

                {/* Handcrafted Vegan Leather Keychain with Heart Monogram */}
                <div className="flex flex-col items-center rotate-6">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-rose-300 shadow-xs mb-0.5" />
                  <div className="w-6.5 h-12 bg-[#8C283B] rounded-md shadow-sm border border-black/10 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-rose-200 font-bold tracking-widest">D♥S</span>
                  </div>
                </div>

                {/* Gourmet Bakery Cookies & Velvet Rose Pouch */}
                <div className="flex flex-col items-end gap-1.5">
                  <div className="w-11 h-7 bg-[#FFF0F4] rounded-xs border border-dashed border-[#C73858]/50 flex items-center justify-center px-1 shadow-xs">
                    <span className="text-[7px] font-serif text-[#7A1E31] font-medium">Sweet Bites</span>
                  </div>
                  <div className="w-9 h-7 bg-[#631525] rounded-t-sm rounded-b-md shadow-sm flex items-center justify-center">
                    <span className="text-[6px] text-pink-200 font-serif italic">velvet ♥</span>
                  </div>
                </div>
              </div>

              {/* Folded Parchment Letter with Burgundy Wax Stamp */}
              <div className="w-full h-8 bg-[#FFF8FA] rounded-xs border border-[#F2BDCA] flex items-center justify-between px-2.5 shadow-xs mt-1">
                <span className="text-[8px] font-serif tracking-wide text-[#5C1625] font-medium">A Handwritten Letter From My Heart</span>
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#8B1A2E] to-[#B3243F] flex items-center justify-center shadow-xs ring-1 ring-[#FFCCD5]">
                  <span className="text-[8px] text-pink-100 font-serif font-bold">♥</span>
                </div>
              </div>
            </div>

            {/* Rich Wine band across */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-4.5 bg-[#4E1420]/95 flex items-center justify-center pointer-events-none shadow-xs">
              <span className="text-[7px] tracking-[0.25em] text-[#FFE5EC] font-semibold uppercase flex items-center gap-1">
                <span>♥</span>
                <span>The DILSY Edit</span>
                <span>♥</span>
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 left-4 text-xs font-serif italic text-[#7A1E31] font-medium">
          The DILSY Edit · ₹1,249
        </div>
      </div>
    );
  }

  // Everything Box with Romantic Luxe styling
  return (
    <div className={`relative w-full aspect-[4/3] bg-gradient-to-b from-[#FFF5F7] via-[#FCE8ED] to-[#F8D7E0] rounded-xl overflow-hidden flex items-center justify-center p-6 border border-[#FFCCD5]/60 shadow-inner ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#FFE5EC]/80 via-transparent to-transparent opacity-90" />

      <div className="relative w-full max-w-[280px] h-full flex flex-col items-center justify-center">
        {/* Luxury Romantic Magnetic Box */}
        <div className="relative w-64 h-42 bg-[#3D141C] rounded-lg shadow-lg border border-[#A32842]/50 p-2.5 flex flex-col justify-between">
          <div className="absolute inset-1.5 bg-[#FFF0F4] rounded-md border border-[#F2BDCA] flex flex-col justify-between p-2.5 overflow-hidden">
            {/* Top row with Tumbler & Scented Candle */}
            <div className="flex items-center justify-between">
              {/* Insulated Tumbler in Romantic Rose Gold */}
              <div className="flex flex-col items-center -rotate-3">
                <div className="w-5 h-2 bg-rose-200 rounded-t-sm border border-rose-300" />
                <div className="w-8 h-14 bg-gradient-to-b from-[#E56B85] to-[#B3243F] rounded-b-md shadow-md flex items-center justify-center">
                  <span className="text-[7px] text-white font-serif tracking-widest uppercase rotate-90 font-medium">DILSY ♥</span>
                </div>
              </div>

              {/* Hot Cocoa & Mist */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-10 bg-[#4A1822] rounded-sm shadow-sm flex flex-col items-center justify-center p-0.5 border border-pink-300/40">
                  <span className="text-[6px] text-pink-200 font-serif uppercase tracking-tighter">COCOA</span>
                  <span className="text-[5px] text-white/90">Love Blend</span>
                </div>
                <div className="w-5 h-7 bg-[#FFF5F8] rounded-xs border border-pink-300 flex items-center justify-center shadow-xs">
                  <span className="text-[5px] text-[#8C243B] font-mono font-medium">MIST</span>
                </div>
              </div>

              {/* Set of 3 Polaroid prints with love theme */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute w-12 h-14 bg-white shadow-xs rotate-12 border border-pink-200 rounded-xs" />
                <div className="absolute w-12 h-14 bg-white shadow-xs -rotate-6 border border-pink-200 rounded-xs" />
                <div className="relative w-12 h-14 bg-white shadow-md border border-pink-300 rounded-xs p-1 pb-2 flex flex-col justify-between">
                  <div className="w-full h-8 bg-gradient-to-br from-[#FFB3C6] via-[#FF85A1] to-[#C73858] rounded-xs flex items-center justify-center shadow-inner">
                    <span className="text-[10px] text-white font-serif animate-pulse">♥</span>
                  </div>
                  <span className="text-[5px] text-center font-serif text-[#7A1E31] font-semibold">forever you</span>
                </div>
              </div>
            </div>

            {/* Deluxe gold-rose accented note card */}
            <div className="w-full h-7 bg-[#FFF8FA] rounded-xs border border-pink-300 flex items-center justify-between px-2 shadow-xs">
              <span className="text-[7px] font-serif tracking-wider text-[#5C1625] uppercase font-medium">Memories & Sweet Feelings</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#99223A] to-[#C73858] flex items-center justify-center text-[7px] text-white font-serif">
                  ♥
                </div>
              </div>
            </div>
          </div>

          {/* Magnetic flap accent in ruby rose */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-2 bg-[#2D0F15] rounded-b border border-[#FFCCD5]/30 shadow-xs flex items-center justify-center">
            <div className="w-2.5 h-0.5 bg-[#FF85A1] rounded-full" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 left-4 text-xs font-serif italic text-[#7A1E31] font-medium">
        The Everything Box · ₹1,499
      </div>
    </div>
  );
};
