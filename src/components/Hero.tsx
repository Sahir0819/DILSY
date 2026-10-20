import React from 'react';
import { ArrowRight, Sparkles, MapPin, Gift, Feather } from 'lucide-react';
import { ProductArtwork } from './ProductArtwork';

interface HeroProps {
  onShopClick: () => void;
  onCustomClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onCustomClick }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-[#FAF7F2]">
      {/* Decorative subtle ambient warm gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8D5CE]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#D4A39A]/20 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#8C5A4F]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>A Little Box Full of Feelings</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2A1E1A] leading-[1.12] tracking-tight text-balance">
              Some feelings deserve a little something.
            </h1>

            {/* Supporting Prose */}
            <p className="text-base sm:text-lg text-[#4A352F]/90 font-light leading-relaxed max-w-2xl">
              Thoughtfully curated, handcrafted gift hampers designed to celebrate birthdays, milestones, long-distance smiles, and quiet moments. Made personal with hand-penned wax-sealed notes, memory polaroids, and handpicked keepsakes.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onShopClick}
                className="px-7 py-3.5 bg-[#2A1E1A] hover:bg-[#3D2C26] text-[#FAF7F2] rounded-lg font-medium text-sm tracking-wide transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B87A68]"
              >
                <span>Shop Launch Hampers</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onCustomClick}
                className="px-7 py-3.5 bg-transparent hover:bg-[#F0E6DC] text-[#2A1E1A] border border-[#2A1E1A]/25 rounded-lg font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B87A68]"
              >
                <span>Create Your Own Box</span>
                <Gift className="w-4 h-4 text-[#B87A68]" />
              </button>
            </div>

            {/* Campus & Local Context Pillars */}
            <div className="pt-6 border-t border-[#2A1E1A]/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#4A352F]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B87A68] shrink-0" />
                <span>Chandigarh University & Mohali PGs</span>
              </div>
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-[#B87A68] shrink-0" />
                <span>Handwritten Letters & Polaroids</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#2A1E1A] tabular-nums">₹999 – ₹1,499</span>
                <span>Affordable boutique pricing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Anchor */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Stacked tactile card presentation */}
              <div className="relative p-2 bg-[#FAF7F2] rounded-2xl border border-[#2A1E1A]/10 shadow-xl">
                <ProductArtwork type="dilsy-edit" className="shadow-xs" />
                <div className="p-4 bg-[#FAF7F2] border-t border-[#2A1E1A]/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-[#2A1E1A] text-lg">The DILSY Edit</h3>
                    <p className="text-xs text-[#4A352F]/80">Personalised handcrafted keepsake hamper</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-serif font-bold text-[#2A1E1A] tabular-nums">₹1,249</span>
                    <span className="block text-[11px] text-[#8C5A4F]">Most loved</span>
                  </div>
                </div>
              </div>

              {/* Floating micro trust seal */}
              <div className="absolute -bottom-4 -left-4 bg-[#FAF7F2] border border-[#2A1E1A]/10 p-3 rounded-xl shadow-lg hidden sm:flex items-center gap-3 max-w-xs">
                <div className="w-8 h-8 rounded-full bg-[#E8D5CE] flex items-center justify-center text-[#8C5A4F] font-serif font-bold text-sm">
                  D
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#2A1E1A]">Handmade in Mohali</p>
                  <p className="text-[11px] text-[#4A352F]/70">Hand-delivered to hostels & residences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
