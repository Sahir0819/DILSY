import React from 'react';

interface AddOnThumbnailProps {
  type: string;
  className?: string;
}

export const AddOnThumbnail: React.FC<AddOnThumbnailProps> = ({ type, className = '' }) => {
  return (
    <div
      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative border border-[#FFCCD5] shadow-2xs ${className}`}
    >
      {/* 1. Single Rose */}
      {type === 'single-rose' && (
        <div className="w-full h-full bg-gradient-to-br from-[#FFF0F4] to-[#FFE5EC] flex items-center justify-center p-1.5">
          <svg viewBox="0 0 48 48" className="w-10 h-10 text-[#C73858]" fill="none">
            {/* Stem & Leaves */}
            <path d="M24 22 C23 32, 22 40, 21 44" stroke="#4A7C59" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M23 30 C20 28, 16 30, 15 33 C18 35, 22 33, 23 30 Z" fill="#689F77" />
            <path d="M23 36 C26 34, 30 35, 31 38 C28 40, 24 38, 23 36 Z" fill="#689F77" />
            {/* Rose Blossom Layers */}
            <circle cx="24" cy="15" r="9" fill="#99223A" />
            <path d="M18 14 C18 10, 22 8, 24 8 C27 8, 30 10, 30 14 C30 18, 26 21, 24 21 C21 21, 18 18, 18 14 Z" fill="#C73858" />
            <path d="M20 13 C21 10, 24 9, 25 11 C26 13, 24 16, 23 16 C21 16, 20 14, 20 13 Z" fill="#E56B85" />
            <path d="M22 13 C23 11, 25 11, 25 13 C25 14, 24 15, 23 15 Z" fill="#FFCCD5" />
            {/* Small ribbon bow */}
            <path d="M20 23 L26 25 M20 25 L26 23" stroke="#D4506D" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* 2. Small Rose Bunch */}
      {type === 'small-rose-bunch' && (
        <div className="w-full h-full bg-gradient-to-br from-[#FFF2F5] via-[#FFEBF0] to-[#FCE6EC] flex items-center justify-center p-1.5">
          <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
            {/* Kraft Cone Wrap */}
            <polygon points="17,25 31,25 25,45 23,45" fill="#D9BA9B" stroke="#B89474" strokeWidth="1" />
            <path d="M22 34 L26 34 M21 35 L27 35" stroke="#8C6544" strokeWidth="1.5" strokeLinecap="round" />
            {/* Greenery */}
            <circle cx="18" cy="18" r="4" fill="#689F77" />
            <circle cx="30" cy="18" r="4" fill="#689F77" />
            {/* Rose 1 Left */}
            <circle cx="18" cy="17" r="5" fill="#C73858" />
            <circle cx="18" cy="17" r="2.5" fill="#FFA8BA" />
            {/* Rose 2 Right */}
            <circle cx="30" cy="17" r="5" fill="#99223A" />
            <circle cx="30" cy="17" r="2.5" fill="#E56B85" />
            {/* Rose 3 Center Front */}
            <circle cx="24" cy="21" r="6" fill="#D43F62" />
            <circle cx="24" cy="20.5" r="3" fill="#FFCCD5" />
            {/* Tied ribbon knot */}
            <circle cx="24" cy="34" r="2" fill="#E56B85" />
          </svg>
        </div>
      )}

      {/* 3. Chocolate Treat */}
      {type === 'chocolate-treat' && (
        <div className="w-full h-full bg-gradient-to-br from-[#FFF5F7] via-[#FFF0F4] to-[#F9E8EC] flex items-center justify-center p-1.5">
          <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
            {/* Fluted Truffle Cup */}
            <path d="M15 30 L18 40 L30 40 L33 30 Z" fill="#F4D3C4" stroke="#D9A893" strokeWidth="1" />
            {/* Heart Truffle Body */}
            <path
              d="M24 31 C24 31 14 24 14 17 C14 12 18 10 21 11 C23 12 24 14 24 14 C24 14 25 12 27 11 C30 10 34 12 34 17 C34 24 24 31 24 31 Z"
              fill="#4A1822"
              stroke="#682432"
              strokeWidth="1.5"
            />
            {/* White Chocolate Swirl */}
            <path
              d="M19 16 C21 18, 23 15, 25 18 C27 21, 29 18, 30 20"
              stroke="#FFEBF0"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="26" cy="23" r="1" fill="#FFCCD5" />
          </svg>
        </div>
      )}

      {/* 4. Assorted Chocolate Pack */}
      {type === 'assorted-chocolate' && (
        <div className="w-full h-full bg-gradient-to-br from-[#FFF8F0] via-[#FFF0F4] to-[#FEEAED] flex items-center justify-center p-1.5">
          <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
            {/* Box Base */}
            <rect x="10" y="12" width="28" height="24" rx="4" fill="#3D141C" stroke="#C99859" strokeWidth="1.5" />
            {/* Gold Ribbon Cross */}
            <rect x="22" y="12" width="4" height="24" fill="#D4AF37" />
            <rect x="10" y="22" width="28" height="4" fill="#D4AF37" />
            {/* Mini Truffles in Grids */}
            <circle cx="16" cy="17" r="3" fill="#681F2F" />
            <circle cx="32" cy="17" r="3" fill="#8C3549" />
            <circle cx="16" cy="31" r="3" fill="#8C3549" />
            <circle cx="32" cy="31" r="3" fill="#681F2F" />
            {/* Ribbon Bow on top */}
            <circle cx="24" cy="24" r="2.5" fill="#F3E5AB" stroke="#C99859" strokeWidth="1" />
          </svg>
        </div>
      )}

      {/* 5. Gourmet Snack Pack */}
      {type === 'gourmet-snack' && (
        <div className="w-full h-full bg-gradient-to-br from-[#FFFDF9] via-[#FAF3ED] to-[#F5E8DC] flex items-center justify-center p-1.5">
          <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
            {/* Kraft Stand-up Pouch */}
            <path
              d="M14 14 L17 40 C17 42, 31 42, 31 40 L34 14 Z"
              fill="#D9BCA3"
              stroke="#B38F6F"
              strokeWidth="1.5"
            />
            {/* Pouch Zipper Seal */}
            <line x1="14" y1="18" x2="34" y2="18" stroke="#9C7756" strokeWidth="1.5" />
            {/* Window with Artisan Treats */}
            <rect x="18" y="24" width="12" height="10" rx="3" fill="#FFF0F4" stroke="#D4A0AC" strokeWidth="1" />
            <circle cx="21" cy="29" r="1.5" fill="#C73858" />
            <circle cx="26" cy="27" r="1.5" fill="#802034" />
            <circle cx="25" cy="31" r="1.5" fill="#C73858" />
            {/* Heart Badge Sticker */}
            <circle cx="24" cy="14" r="3" fill="#C73858" />
            <path d="M23 14 L24 15 L25 14" stroke="#FFF" strokeWidth="0.8" />
          </svg>
        </div>
      )}

      {/* 6. Cookies or Brownie Treat */}
      {type === 'cookies-brownie' && (
        <div className="w-full h-full bg-gradient-to-br from-[#FFF5F7] via-[#FFF0ED] to-[#FBECE6] flex items-center justify-center p-1.5">
          <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
            {/* Brownie Square */}
            <rect x="11" y="13" width="22" height="20" rx="3" fill="#3E1D16" stroke="#5D3025" strokeWidth="1.5" />
            {/* Chocolate Chunks on Brownie */}
            <rect x="15" y="17" width="4" height="4" rx="1" fill="#1F0D09" />
            <rect x="23" y="19" width="5" height="4" rx="1" fill="#29120C" />
            <rect x="17" y="25" width="4" height="4" rx="1" fill="#29120C" />
            {/* Drizzled Pink Rose Sugar */}
            <path d="M12 22 Q 22 17, 32 23" stroke="#FFA8BA" strokeWidth="1.5" strokeLinecap="round" />
            {/* Golden Cookie Overlapping Bottom Right */}
            <circle cx="31" cy="31" r="9" fill="#D49B60" stroke="#9C6B3A" strokeWidth="1.5" />
            <circle cx="28" cy="28" r="1.5" fill="#3D141C" />
            <circle cx="34" cy="29" r="1.5" fill="#3D141C" />
            <circle cx="31" cy="34" r="1.5" fill="#3D141C" />
          </svg>
        </div>
      )}

      {/* 7. Extra Personalised Photo Print */}
      {type === 'photo-print' && (
        <div className="w-full h-full bg-gradient-to-br from-[#FFF0F4] via-[#FFE5EC] to-[#FCE1E8] flex items-center justify-center p-1.5">
          <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
            {/* Polaroid Frame */}
            <rect x="11" y="9" width="26" height="32" rx="2" fill="#FFFFFF" stroke="#FFCCD5" strokeWidth="1.5" />
            {/* Photo Screen Area */}
            <rect x="14" y="12" width="20" height="20" rx="1" fill="#FFF0F4" />
            {/* Romantic Photo Motif */}
            <path
              d="M24 23 C24 23 18 19 18 15 C18 12.5 20.5 11.5 22 12.5 C23 13.5 24 14.5 24 14.5 C24 14.5 25 13.5 26 12.5 C27.5 11.5 30 12.5 30 15 C30 19 24 23 24 23 Z"
              fill="#C73858"
            />
            {/* Caption Lines */}
            <line x1="16" y1="36" x2="26" y2="36" stroke="#99223A" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="30" cy="36" r="1" fill="#C73858" />
            {/* Mini Craft Peg on Top */}
            <rect x="22" y="7" width="4" height="6" rx="1" fill="#D9BA9B" stroke="#8C6544" strokeWidth="1" />
          </svg>
        </div>
      )}

      {/* 8. Cute Keychain */}
      {type === 'cute-keychain' && (
        <div className="w-full h-full bg-gradient-to-br from-[#FFF5F8] via-[#FFEBF0] to-[#FAD4DF] flex items-center justify-center p-1.5">
          <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
            {/* Key Ring */}
            <circle cx="24" cy="13" r="5" stroke="#C99859" strokeWidth="2" />
            <line x1="24" y1="18" x2="24" y2="23" stroke="#C99859" strokeWidth="1.5" />
            {/* Heart Leather Charm */}
            <path
              d="M24 39 C24 39 12 30 12 21 C12 15 17 14 20 15 C22 16 24 18 24 18 C24 18 26 16 28 15 C31 14 36 15 36 21 C36 30 24 39 24 39 Z"
              fill="#8C243B"
              stroke="#591020"
              strokeWidth="1.5"
            />
            {/* Initial & Heart Detailing */}
            <circle cx="24" cy="25" r="4.5" fill="#FFF0F4" />
            <path
              d="M24 27 L22 25 C21 24 21 23 22 22 C23 21 24 22 24 22 C24 22 25 21 26 22 C27 23 27 24 26 25 Z"
              fill="#8C243B"
            />
          </svg>
        </div>
      )}

      {/* 9. Extra Greeting Card */}
      {type === 'greeting-card' && (
        <div className="w-full h-full bg-gradient-to-br from-[#FAF7F2] via-[#FFF5F8] to-[#FCE6EC] flex items-center justify-center p-1.5">
          <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
            {/* Envelope Back */}
            <rect x="9" y="14" width="30" height="22" rx="2" fill="#FFFDFE" stroke="#E8C2CC" strokeWidth="1.5" />
            {/* Envelope Flap Lines */}
            <path d="M10 15 L24 26 L38 15" stroke="#F2BDCA" strokeWidth="1.5" />
            <path d="M10 35 L19 24" stroke="#F2BDCA" strokeWidth="1" />
            <path d="M38 35 L29 24" stroke="#F2BDCA" strokeWidth="1" />
            {/* Folded Parchment Note Peeking */}
            <rect x="15" y="8" width="18" height="12" rx="1" fill="#FFF8F0" stroke="#E5C7AF" strokeWidth="1" />
            <line x1="18" y1="12" x2="28" y2="12" stroke="#A32842" strokeWidth="1" strokeLinecap="round" />
            <line x1="18" y1="15" x2="25" y2="15" stroke="#A32842" strokeWidth="1" strokeLinecap="round" />
            {/* Crimson Wax Seal Stamp */}
            <circle cx="24" cy="26" r="4" fill="#99223A" stroke="#7A182B" strokeWidth="1" />
            <circle cx="24" cy="26" r="2" fill="#C73858" />
          </svg>
        </div>
      )}

      {/* 10. Mini Keepsake */}
      {type === 'mini-keepsake' && (
        <div className="w-full h-full bg-gradient-to-br from-[#FFF0F4] via-[#FCE8EE] to-[#FAD4DF] flex items-center justify-center p-1.5">
          <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
            {/* Velvet Drawstring Pouch */}
            <path
              d="M17 19 C17 15, 31 15, 31 19 L34 38 C34 42, 14 42, 14 38 Z"
              fill="#631525"
              stroke="#4A0E1B"
              strokeWidth="1.5"
            />
            {/* Drawstring Neck & Bow */}
            <line x1="16" y1="21" x2="32" y2="21" stroke="#D4AF37" strokeWidth="2" />
            <circle cx="20" cy="22" r="1.5" fill="#D4AF37" />
            <circle cx="28" cy="22" r="1.5" fill="#D4AF37" />
            {/* Golden Star Keepsake Token Motif */}
            <path
              d="M24 27 L25.5 30.5 L29 31 L26.5 33.5 L27 37 L24 35 L21 37 L21.5 33.5 L19 31 L22.5 30.5 Z"
              fill="#F3E5AB"
              stroke="#D4AF37"
              strokeWidth="1"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
