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
              Every feeling has its own story. Explore our 9 dedicated occasion collections, or create a custom hamper tailored for someone special.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7A1E31] bg-[#FFEBF0] px-3 py-1.5 rounded-full border border-[#FFCCD5] font-semibold">
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
                className="bg-[#FFFCFD] rounded-2xl border border-[#E8D0D6] hover:border-[#C73858] overflow-hidden shadow-xs hover:shadow-xl hover:shadow-[#FFB3C6]/25 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Distinct Aesthetic Theme Artwork or Custom Image */}
                  <div
                    onClick={theme.isComingSoon ? undefined : () => onSelectTheme(theme.slug || theme.id)}
                    className={`relative overflow-hidden ${theme.isComingSoon ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {theme.coverImage ? (
                      <div className="w-full aspect-[16/9] bg-[#FAF0F3] overflow-hidden">
                        <img
                          src={theme.coverImage}
                          alt={theme.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <ThemeArtwork themeId={theme.id} />
                    )}

                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-black/5 shadow-xs">
                      <span className={`text-[11px] font-semibold tracking-wide ${theme.accentText}`}>
                        {theme.badge}
                      </span>
                    </div>

                    {theme.isComingSoon ? (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-[#8C283B] to-[#591020] text-[#FFF0F3] text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs uppercase border border-[#FFCCD5]/50 flex items-center gap-1">
                        <span>COMING SOON</span>
                      </div>
                    ) : productCount > 0 ? (
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
                    <h3 className="text-xl font-serif font-bold text-[#2D1B22] group-hover:text-[#99223A] transition-colors mb-2">
                      {theme.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#52333D] font-light leading-relaxed mb-4 line-clamp-2">
                      {theme.description}
                    </p>

                    {theme.heroHeadline && (
                      <div className="p-2.5 bg-[#FAF0F3] rounded-lg border border-[#FFCCD5]/60 mb-3 text-[11px] text-[#7A1E31] font-serif italic">
                        "{theme.heroHeadline}"
                      </div>
                    )}

                    <div className="text-[11px] text-[#6B424E] border-t border-[#F2BDCA]/50 pt-3">
                      <span className="font-semibold text-[#801B30]">Theme Visual Direction: </span>
                      <span className="font-light">{theme.visualDirection}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0">
                  {theme.isComingSoon ? (
                    <div className="p-3 bg-[#FFF5F8] rounded-xl border border-[#FFCCD5] text-center">
                      <p className="text-xs font-semibold text-[#8C283B]">
                        {theme.comingSoonMessage || 'Something special for him is on its way. Stay tuned!'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectTheme(theme.slug || theme.id)}
                        className="flex-1 py-2.5 px-3 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs shadow-[#99223A]/20 cursor-pointer"
                      >
                        <span>View Collection</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenCustomBuilder(theme.name)}
                        className="py-2.5 px-3 bg-[#FAF0F3] hover:bg-[#FFEBF0] text-[#7A1E31] rounded-lg text-xs font-semibold border border-[#E8C2CC] transition-colors cursor-pointer"
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
