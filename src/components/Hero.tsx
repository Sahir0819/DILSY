import React from 'react';
import { ArrowRight, Sparkles, MapPin, Gift, Feather, Heart } from 'lucide-react';
import { ProductArtwork } from './ProductArtwork';

interface HeroProps {
  onShopClick: () => void;
  onShopByThemeClick: () => void;
  onCustomClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopClick,
  onShopByThemeClick,
  onCustomClick,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-[#FDF9F7] via-[#FFF5F7] to-[#FDF9F7]">
      {/* Decorative romantic ambient warm rose glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFCCD5]/35 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#FFB3C6]/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-[#FFE5EC]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Tagline kicker with love badge */}
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#A32842] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5] w-fit shadow-2xs">
              <Heart className="w-3.5 h-3.5 text-[#C73858] fill-[#C73858]" />
              <span>A Little Box Full of Feelings</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2D1B22] leading-[1.12] tracking-tight text-balance">
              Some feelings deserve a little <span className="text-[#99223A] underline decoration-[#FF85A1]/40 decoration-wavy decoration-2">something special</span>.
            </h1>

            {/* Supporting Prose */}
            <p className="text-base sm:text-lg text-[#52333D] font-light leading-relaxed max-w-2xl">
              Thoughtfully curated, handcrafted gift hampers designed to celebrate love, birthdays, anniversaries, and comfort. Made personal with hand-penned wax-sealed notes, memory polaroids, and handpicked keepsakes.
            </p>

            {/* Primary Action Buttons with Love Palette */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onShopByThemeClick}
                className="px-7 py-3.5 bg-gradient-to-r from-[#99223A] via-[#A82841] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-lg font-medium text-sm tracking-wide transition-all shadow-md shadow-[#99223A]/25 hover:shadow-lg hover:shadow-[#99223A]/30 flex items-center justify-center gap-2 group whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF85A1]"
              >
                <span>Shop by Theme (9 Categories)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onCustomClick}
                className="px-7 py-3.5 bg-[#FFF5F7] hover:bg-[#FFE8EE] text-[#7A1E31] border border-[#E598A9] rounded-lg font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF85A1] shadow-2xs"
              >
                <span>Create Your Own Box</span>
                <Heart className="w-4 h-4 text-[#C73858] fill-[#FFB3C6]" />
              </button>
            </div>

            {/* Campus & Local Context Pillars */}
            <div className="pt-6 border-t border-[#E8D0D6] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#52333D]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B33951] shrink-0" />
                <span>Chandigarh University & Mohali PGs</span>
              </div>
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-[#B33951] shrink-0" />
                <span>Handwritten Letters & Wax Seals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#99223A] tabular-nums">₹999 – ₹1,499</span>
                <span>Affordable boutique pricing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Anchor */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Stacked tactile card presentation */}
              <div className="relative p-2 bg-[#FDF9F7] rounded-2xl border border-[#E8C2CC] shadow-xl shadow-[#A82841]/10">
                <ProductArtwork type="dilsy-edit" className="shadow-xs" />
                <div className="p-4 bg-[#FDF9F7] border-t border-[#E8D0D6] flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-[#2D1B22] text-lg">The DILSY Edit</h3>
                    <p className="text-xs text-[#6B424E]">Personalised handcrafted keepsake hamper</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-serif font-bold text-[#99223A] tabular-nums">₹1,249</span>
                    <span className="block text-[11px] text-[#A32842] font-medium flex items-center justify-end gap-1">
                      <Heart className="w-2.5 h-2.5 fill-[#C73858] text-[#C73858]" />
                      Most loved
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating micro trust seal with love aesthetic */}
              <div className="absolute -bottom-4 -left-4 bg-[#FFF8FA] border border-[#FFCCD5] p-3 rounded-xl shadow-lg hidden sm:flex items-center gap-3 max-w-xs">
                <div className="w-8 h-8 rounded-full bg-[#FFE5EC] border border-[#FFB3C6] flex items-center justify-center text-[#99223A] font-serif font-bold text-sm shadow-xs">
                  ♥
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#2D1B22]">Handmade with Love in Mohali</p>
                  <p className="text-[11px] text-[#6B424E]">Direct handover to hostels & campuses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
