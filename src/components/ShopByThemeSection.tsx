import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
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
    <section id="shop-by-theme" className="py-16 md:py-24 bg-[#FAF7F5] border-t border-[#EADBDB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-[#3E101D] bg-white px-3 py-1 border border-[#EADBDB] mb-2">
              <Sparkles className="w-3.5 h-3.5 fill-[#3E101D] text-[#3E101D]" />
              <span>Curated Occasions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#2A0D15] tracking-tight">
              Shop by Theme
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#7A5A63] font-light max-w-2xl leading-relaxed">
              Every feeling has its own story. Explore our dedicated occasion collections, or create a custom hamper tailored for someone special.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#3E101D] bg-white px-3 py-1.5 border border-[#EADBDB] font-semibold">
              {themes.length} Occasion Editions
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
                className="bg-white border border-[#EADBDB] hover:border-[#3E101D] overflow-hidden transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Distinct Aesthetic Theme Artwork or Custom Image */}
                  <div
                    onClick={theme.isComingSoon ? undefined : () => onSelectTheme(theme.slug || theme.id)}
                    className={`relative overflow-hidden ${theme.isComingSoon ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {theme.coverImage ? (
                      <div className="w-full aspect-[16/9] bg-[#FAF7F5] overflow-hidden">
                        <img
                          src={theme.coverImage}
                          alt={theme.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <ThemeArtwork themeId={theme.id} />
                    )}

                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 border border-[#EADBDB]">
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-[#3E101D]">
                        {theme.badge}
                      </span>
                    </div>

                    {theme.isComingSoon ? (
                      <div className="absolute top-3 right-3 bg-[#3E101D] text-white text-[10px] font-semibold tracking-widest px-2.5 py-0.5 uppercase flex items-center gap-1">
                        <span>COMING SOON</span>
                      </div>
                    ) : productCount > 0 ? (
                      <div className="absolute top-3 right-3 bg-[#3E101D] text-white text-[10px] font-semibold px-2 py-0.5 tracking-wider">
                        {productCount} {productCount === 1 ? 'Hamper' : 'Hampers'}
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-white text-[#3E101D] text-[10px] font-semibold px-2 py-0.5 border border-[#EADBDB]">
                        Bespoke Studio
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-serif text-[#2A0D15] group-hover:text-[#3E101D] transition-colors mb-2">
                      {theme.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#7A5A63] font-light leading-relaxed mb-4 line-clamp-2">
                      {theme.description}
                    </p>

                    {theme.heroHeadline && (
                      <div className="p-2.5 bg-[#FAF7F5] border border-[#EADBDB] mb-3 text-[11px] text-[#3E101D] font-serif italic">
                        "{theme.heroHeadline}"
                      </div>
                    )}

                    <div className="text-[11px] text-[#7A5A63] border-t border-[#EADBDB] pt-3">
                      <span className="font-semibold text-[#3E101D]">Theme Visual Direction: </span>
                      <span className="font-light">{theme.visualDirection}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0">
                  {theme.isComingSoon ? (
                    <div className="p-3 bg-[#FAF7F5] border border-[#EADBDB] text-center">
                      <p className="text-xs font-semibold text-[#3E101D]">
                        {theme.comingSoonMessage || 'Something special for him is on its way. Stay tuned!'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectTheme(theme.slug || theme.id)}
                        className="flex-1 py-2.5 px-3 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>View Collection</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenCustomBuilder(theme.name)}
                        className="py-2.5 px-3 bg-white hover:bg-[#FAF7F5] text-[#3E101D] text-xs uppercase tracking-wider font-semibold border border-[#EADBDB] transition-colors cursor-pointer"
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
