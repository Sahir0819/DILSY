import React from 'react';
import { ArrowRight, Sparkles, Heart, Gift } from 'lucide-react';
import { Product } from '../types';
import { THEME_CATEGORIES } from '../data/themes';
import { ThemeArtwork } from './ThemeArtwork';

interface ShopByThemeSectionProps {
  products: Product[];
  onSelectTheme: (themeSlugOrId: string) => void;
  onOpenCustomBuilder: (themeOccasion?: string) => void;
}

export const ShopByThemeSection: React.FC<ShopByThemeSectionProps> = ({
  products,
  onSelectTheme,
  onOpenCustomBuilder,
}) => {
  return (
    <section id="shop-by-theme" className="py-16 md:py-24 bg-gradient-to-b from-[#FDF9F7] via-[#FFF8FA] to-[#FDF9F7] border-t border-[#E8D0D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#A32842] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5] mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 fill-[#C73858] text-[#C73858]" />
              <span>Feelings & Occasions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D1B22] tracking-tight text-balance">
              Shop by Theme
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#52333D] font-light max-w-2xl leading-relaxed">
              Every feeling has its own story. Explore our 9 dedicated occasion collections, or commission a bespoke box handcrafted for someone special.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7A1E31] bg-[#FFEBF0] px-3 py-1.5 rounded-full border border-[#FFCCD5] font-semibold">
              9 Business-Approved Occasions
            </span>
          </div>
        </div>

        {/* 9 Dedicated Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {THEME_CATEGORIES.map((theme) => {
            const productCount = products.filter(
              (p) =>
                theme.linkedProductIds.includes(p.id) ||
                (p.themeIds && p.themeIds.includes(theme.id))
            ).length;

            return (
              <div
                key={theme.id}
                className="bg-[#FFFCFD] rounded-2xl border border-[#E8C2CC] hover:border-[#C73858] overflow-hidden shadow-xs hover:shadow-xl hover:shadow-[#FFB3C6]/25 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Distinct Aesthetic Theme Artwork */}
                  <div
                    onClick={() => onSelectTheme(theme.slug || theme.id)}
                    className="relative overflow-hidden cursor-pointer"
                  >
                    <ThemeArtwork themeId={theme.id} />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-black/5 shadow-xs">
                      <span className={`text-[11px] font-semibold tracking-wide ${theme.accentText}`}>
                        {theme.badge}
                      </span>
                    </div>
                    {productCount > 0 ? (
                      <div className="absolute top-3 right-3 bg-[#99223A]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                        {productCount} {productCount === 1 ? 'Hamper' : 'Hampers'}
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-white/90 text-[#7A1E31] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#FFCCD5] shadow-xs">
                        Bespoke Studio
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3
                      onClick={() => onSelectTheme(theme.slug || theme.id)}
                      className="text-xl font-serif font-bold text-[#2D1B22] group-hover:text-[#99223A] transition-colors cursor-pointer"
                    >
                      {theme.name}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#52333D] font-light leading-relaxed line-clamp-2">
                      {theme.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#E8D0D6]/60 flex items-center justify-between text-xs">
                      <span className="text-[#6B424E] text-[11px] italic">
                        {productCount > 0 ? 'Confirmed launch hampers' : 'Customise via Studio'}
                      </span>
                      <span className="text-[11px] font-mono text-[#A32842] bg-[#FFF0F4] px-1.5 py-0.5 rounded">
                        /collections/{theme.slug}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Working Action Buttons */}
                <div className="px-6 pb-6 pt-0 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectTheme(theme.slug || theme.id)}
                    className="w-full sm:flex-1 py-2.5 px-3 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-xl text-xs font-semibold text-center transition-all shadow-xs shadow-[#99223A]/20 flex items-center justify-center gap-1.5"
                  >
                    <span>View Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenCustomBuilder(theme.name)}
                    className="w-full sm:w-auto py-2.5 px-3 bg-[#FFF5F8] hover:bg-[#FFEBF0] text-[#7A1E31] border border-[#FFCCD5] rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
                  >
                    <Gift className="w-3.5 h-3.5 text-[#C73858]" />
                    <span>Customise</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
