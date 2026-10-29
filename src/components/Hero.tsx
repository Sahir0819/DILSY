import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onExploreHampers: () => void;
  onCreateYourOwn: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreHampers,
  onCreateYourOwn,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-20 bg-[#FAF7F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Eyebrow */}
            <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5A63] mb-4">
              Haute Atelier Gifting
            </p>

            {/* Main Editorial Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[72px] font-normal leading-[1.04] tracking-tight text-[#2A0D15]">
              A Little Box
              <br />
              Full of
              <br />
              Feelings.
            </h1>

            {/* Editorial Lead Paragraph */}
            <p className="text-sm text-[#6E565D] font-light leading-relaxed max-w-md mt-6 mb-8 font-sans">
              Thoughtfully curated. Beautifully personal. Tactile tokens of devotion, memory, and unspoken reverence packaged in luxury keepsake presentation.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onExploreHampers}
                className="px-8 py-3.5 bg-[#3E101D] hover:bg-[#2A0B13] text-white text-[11px] font-sans font-medium tracking-[0.2em] uppercase transition-all text-center cursor-pointer shadow-xs"
              >
                Explore Hampers
              </button>

              <button
                onClick={onCreateYourOwn}
                className="px-8 py-3.5 border border-[#3E101D] hover:bg-[#3E101D] hover:text-white text-[#3E101D] text-[11px] font-sans font-medium tracking-[0.2em] uppercase transition-all text-center cursor-pointer"
              >
                Create Your Own
              </button>
            </div>

            {/* Local Studio Context Note */}
            <div className="mt-10 pt-6 border-t border-[#EADBDB] flex items-center justify-between text-[11px] font-sans text-[#7A5A63]">
              <span>Handcrafted in Mohali Atelier</span>
              <span>·</span>
              <span>Direct CU & Campus Handover</span>
              <span>·</span>
              <span>₹799 — ₹1,199</span>
            </div>
          </div>

          {/* Right Column: Architectural Framed Presentation */}
          <div className="lg:col-span-7">
            <div className="bg-[#F7F1EE] p-4 sm:p-6 border border-[#EADBDB]">
              {/* Product Photograph */}
              <div className="relative aspect-[16/10] sm:aspect-[16/11] w-full overflow-hidden bg-[#FAF7F5]">
                <img
                  src="/assets/images/hero-atelier-hamper.jpg"
                  alt="DILSY Autumn / Winter Atelier Keepsake Hamper"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Caption Line Below Image */}
              <div className="mt-4 pt-2 flex items-center justify-between text-[#7A5A63]">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#7A5A63]">
                  Edition 04 — The Memory Keepsake
                </span>
                <span className="font-serif italic text-base text-[#3E101D]">
                  Autumn / Winter Atelier
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
