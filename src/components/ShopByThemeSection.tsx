import React from 'react';
import { ArrowRight, Sparkles, Heart, Gift } from 'lucide-react';
import { Product, ThemeCategory } from '../types';
import { THEME_CATEGORIES } from '../data/themes';
import { ThemeArtwork } from './ThemeArtwork';

interface ShopByThemeSectionProps {
  products: Product[];
  themes?: ThemeCategory[];
  onSelectTheme: (themeSlugOrId: string) => void;
  onOpenCustomBuilder: (themeOccasion?: string) => void;
}

export const ShopByThemeSection: React.FC<ShopByThemeSectionProps> = ({
  products,
  themes = THEME_CATEGORIES,
  onSelectTheme,
  onOpenCustomBuilder,
}) => {
  return (
    <section id="shop-by-theme" className="py-16 md:py-24 bg-[#F3E9DC] border-t border-[#D8BFAF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#6D1F32] bg-[#FFF9F2] px-3 py-1 rounded-full border border-[#D8BFAF] mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 fill-[#6D1F32] text-[#6D1F32]" />
              <span>Feelings & Occasions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D201D] tracking-tight text-balance">
              Shop by Theme
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#79665C] font-light max-w-2xl leading-relaxed">
              Every feeling has its own story. Explore our 9 dedicated occasion collections, or create a custom hamper tailored for someone special.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6D1F32] bg-[#FFF9F2] px-3 py-1.5 rounded-full border border-[#D8BFAF] font-semibold">
              {themes.length} Occasion Collections
            </span>
          </div>
        </div>

        {/* Dedicated Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {themes.map((theme) => {
            const productCount = products.filter(
              (p) =>
                theme.linkedProductIds.includes(p.id) ||
                (p.themeIds && p.themeIds.includes(theme.id))
            ).length;

            return (
              <div
                key={theme.id}
                className="bg-[#FFF9F2] rounded-2xl border border-[#D8BFAF] hover:border-[#6D1F32] overflow-hidden shadow-xs hover:shadow-xl hover:shadow-[#2D201D]/10 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Distinct Aesthetic Theme Artwork or Custom Image */}
                  <div
                    onClick={theme.isComingSoon ? undefined : () => onSelectTheme(theme.slug || theme.id)}
                    className={`relative overflow-hidden ${theme.isComingSoon ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {theme.coverImage ? (
                      <div className="w-full aspect-[16/9] bg-[#F3E9DC] overflow-hidden">
                        <img
                          src={theme.coverImage}
                          alt={theme.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <ThemeArtwork themeId={theme.id} />
                    )}

                    <div className="absolute top-3 left-3 bg-[#FFF9F2]/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#D8BFAF] shadow-xs">
                      <span className={`text-[11px] font-semibold tracking-wide ${theme.accentText}`}>
                        {theme.badge}
                      </span>
                    </div>

                    {theme.isComingSoon ? (
                      <div className="absolute top-3 right-3 bg-[#4A1423] text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs uppercase border border-[#D8BFAF]/40 flex items-center gap-1">
                        <span>COMING SOON</span>
                      </div>
                    ) : productCount > 0 ? (
                      <div className="absolute top-3 right-3 bg-[#6D1F32] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                        {productCount} {productCount === 1 ? 'Hamper' : 'Hampers'}
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-[#FFF9F2] text-[#6D1F32] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#D8BFAF] shadow-xs">
                        Bespoke Studio
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-[#2D201D] group-hover:text-[#6D1F32] transition-colors mb-2">
                      {theme.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#79665C] font-light leading-relaxed mb-4 line-clamp-2">
                      {theme.description}
                    </p>

                    {theme.heroHeadline && (
                      <div className="p-2.5 bg-[#F3E9DC] rounded-lg border border-[#D8BFAF] mb-3 text-[11px] text-[#6D1F32] font-serif italic">
                        "{theme.heroHeadline}"
                      </div>
                    )}

                    <div className="text-[11px] text-[#79665C] border-t border-[#D8BFAF]/50 pt-3">
                      <span className="font-semibold text-[#6D1F32]">Theme Visual Direction: </span>
                      <span className="font-light">{theme.visualDirection}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0">
                  {theme.isComingSoon ? (
                    <div className="p-3 bg-[#F3E9DC] rounded-xl border border-[#D8BFAF] text-center">
                      <p className="text-xs font-semibold text-[#6D1F32]">
                        {theme.comingSoonMessage || 'Something special for him is on its way. Stay tuned!'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectTheme(theme.slug || theme.id)}
                        className="flex-1 py-2.5 px-3 bg-[#6D1F32] hover:bg-[#4A1423] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                      >
                        <span>View Collection</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenCustomBuilder(theme.name)}
                        className="py-2.5 px-3 bg-[#FFF9F2] hover:bg-[#F3E9DC] text-[#6D1F32] rounded-lg text-xs font-semibold border border-[#D8BFAF] transition-colors cursor-pointer"
                        title={`Customise a hamper for ${theme.name}`}
                      >
                        Customise
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
