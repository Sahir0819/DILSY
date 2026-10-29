import React from 'react';
import { ArrowRight, MapPin, Feather, Heart } from 'lucide-react';
import { ProductArtwork } from './ProductArtwork';

interface HeroProps {
  onExploreHampers: () => void;
  onCreateYourOwn: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreHampers,
  onCreateYourOwn,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-[#FCE7ED]">
      {/* Decorative ambient soft blush & warm ivory glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F1C5D1]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#FFF1F4]/70 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-[#E88AA4]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#9F2343] bg-[#FFFAF8] px-3.5 py-1.5 rounded-full border border-[#F1C5D1] w-fit shadow-2xs">
              <Heart className="w-3.5 h-3.5 text-[#9F2343] fill-[#9F2343]" />
              <span>Boutique Personalised Gifting</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#3B2028] leading-[1.12] tracking-tight text-balance">
              A Little Box Full of Feelings
            </h1>

            {/* Short supporting text explaining personalised gifting */}
            <p className="text-base sm:text-lg text-[#79665C] font-light leading-relaxed max-w-2xl">
              Thoughtful, handcrafted gift hampers curated to celebrate love, birthdays, milestones, and care. Made truly personal with your handwritten message, keepsake photos, and sweet surprises.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onExploreHampers}
                className="px-7 py-3.5 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl font-medium text-sm tracking-wide transition-all shadow-md shadow-[#9F2343]/25 flex items-center justify-center gap-2 group whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2343] cursor-pointer"
              >
                <span>Explore Hampers</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onCreateYourOwn}
                className="px-7 py-3.5 bg-[#FFFAF8] hover:bg-[#FFF1F4] text-[#9F2343] border border-[#F1C5D1] rounded-xl font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2343] shadow-2xs cursor-pointer"
              >
                <span>Create Your Own</span>
                <Heart className="w-4 h-4 text-[#9F2343] fill-[#9F2343]" />
              </button>
            </div>

            {/* Campus & Local Context Pillars */}
            <div className="pt-6 border-t border-[#F1C5D1] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#79665C]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#9F2343] shrink-0" />
                <span>Chandigarh University & Mohali PGs</span>
              </div>
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-[#9F2343] shrink-0" />
                <span>Personal Handwritten Cards</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#9F2343] tabular-nums">₹799 – ₹1,199</span>
                <span>Official box pricing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Anchor */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Stacked tactile card presentation featuring Loved Box */}
              <div className="relative p-2.5 bg-[#FFFAF8] rounded-2xl border border-[#F1C5D1] shadow-xl shadow-[#3B2028]/5">
                <ProductArtwork type="loved-box" className="shadow-xs" />
                <div className="p-4 bg-[#FFFAF8] border-t border-[#F1C5D1] flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-[#3B2028] text-lg">Loved Box</h3>
                    <p className="text-xs text-[#79665C]">Medium · A little box full of love</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-serif font-bold text-[#9F2343] tabular-nums">₹969</span>
                    <span className="text-[11px] text-[#9F2343] font-medium flex items-center justify-end gap-1">
                      <Heart className="w-2.5 h-2.5 fill-[#9F2343] text-[#9F2343]" />
                      Most loved
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating micro trust seal */}
              <div className="absolute -bottom-4 -left-4 bg-[#FFFAF8] border border-[#F1C5D1] p-3 rounded-xl shadow-lg hidden sm:flex items-center gap-3 max-w-xs">
                <div className="w-8 h-8 rounded-full bg-[#FFF1F4] border border-[#F1C5D1] flex items-center justify-center text-[#9F2343] font-serif font-bold text-sm shadow-xs">
                  ♥
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#3B2028]">Handmade with Love in Mohali</p>
                  <p className="text-[11px] text-[#79665C]">Direct handover to hostels & campuses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
