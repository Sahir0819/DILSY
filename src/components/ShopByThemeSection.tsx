import React from 'react';
import { ArrowRight, Sparkles, Heart, Gift, Compass } from 'lucide-react';
import { ThemeCategory, Product, ProductCustomisation } from '../types';
import { THEME_CATEGORIES } from '../data/themes';
import { ThemeArtwork } from './ThemeArtwork';
import { ProductCard } from './ProductCard';

interface ShopByThemeSectionProps {
  products: Product[];
  selectedThemeId: string | null;
  onSelectTheme: (themeId: string | null) => void;
  onOpenCustomBuilder: (themeOccasion?: string) => void;
  onAddToCart: (product: Product, customisation: ProductCustomisation) => void;
  onOrderWhatsApp: (product: Product, customisation: ProductCustomisation) => void;
}

export const ShopByThemeSection: React.FC<ShopByThemeSectionProps> = ({
  products,
  selectedThemeId,
  onSelectTheme,
  onOpenCustomBuilder,
  onAddToCart,
  onOrderWhatsApp,
}) => {
  const activeTheme = THEME_CATEGORIES.find((t) => t.id === selectedThemeId);

  // Products belonging to the selected theme
  const themeProducts = activeTheme
    ? products.filter(
        (p) =>
          activeTheme.linkedProductIds.includes(p.id) ||
          (p.themeIds && p.themeIds.includes(activeTheme.id))
      )
    : [];

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
              Every feeling has its own story. Browse our curated launch collections or commission a bespoke box handcrafted for someone special.
            </p>
          </div>

          {/* Quick Filter Pill to reset to all themes if a specific collection is active */}
          {selectedThemeId && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectTheme(null)}
                className="px-4 py-2 bg-white hover:bg-[#FFF5F8] text-[#7A1E31] border border-[#FFCCD5] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>← View All 9 Themes</span>
              </button>
            </div>
          )}
        </div>

        {/* --- VIEW 1: DEDICATED THEME COLLECTION VIEW (WHEN A THEME IS SELECTED) --- */}
        {activeTheme ? (
          <div className="space-y-10 animate-in fade-in-50 duration-300">
            {/* Theme Hero Banner */}
            <div className={`p-8 sm:p-10 rounded-2xl bg-gradient-to-r ${activeTheme.accentBg} border ${activeTheme.accentBorder} shadow-sm flex flex-col md:flex-row items-center justify-between gap-8`}>
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className={`text-xs uppercase tracking-wider font-bold ${activeTheme.accentText} bg-white/80 px-2.5 py-1 rounded-full border border-current/20 shadow-2xs`}>
                    {activeTheme.badge}
                  </span>
                  <span className="text-xs text-[#6B424E] font-medium">Curated Collection</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D1B22]">
                  {activeTheme.name}
                </h3>
                <p className="text-base text-[#52333D] font-light leading-relaxed italic">
                  "{activeTheme.description}"
                </p>
                <div className="pt-2 text-xs text-[#6B424E] bg-white/60 p-3 rounded-xl border border-current/15 max-w-lg">
                  <strong className="text-[#3D141C]">Visual Direction:</strong> {activeTheme.visualDirection}
                </div>
              </div>

              {/* Theme Artwork Showcase */}
              <div className="w-full md:w-80 shrink-0">
                <ThemeArtwork themeId={activeTheme.id} className="shadow-md" />
              </div>
            </div>

            {/* Products inside this theme */}
            {themeProducts.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-serif font-bold text-xl text-[#2D1B22] flex items-center gap-2">
                    <span>Confirmed Hampers in this Collection</span>
                    <span className="text-xs font-sans font-medium text-[#7A1E31] bg-[#FFEBF0] px-2 py-0.5 rounded-full border border-[#FFCCD5]">
                      {themeProducts.length} {themeProducts.length === 1 ? 'Box' : 'Boxes'} Available
                    </span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => onOpenCustomBuilder(activeTheme.name)}
                    className="text-xs font-semibold text-[#99223A] hover:text-[#C73858] flex items-center gap-1"
                  >
                    <span>Or Customise from Scratch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {themeProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={onAddToCart}
                      onOrderWhatsApp={onOrderWhatsApp}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Polished "Customise Your Box" / Coming Soon State (No fake inventory or invented prices) */
              <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[#E8D0D6] text-center max-w-2xl mx-auto space-y-5 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#FFE5EC] border border-[#FFB3C6] flex items-center justify-center text-[#99223A] mx-auto shadow-xs">
                  <Gift className="w-8 h-8 opacity-90" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A32842] block mb-1">
                    Bespoke Curation Available
                  </span>
                  <h4 className="text-2xl font-serif font-bold text-[#2D1B22]">
                    Customise Your {activeTheme.name}
                  </h4>
                  <p className="mt-2 text-sm text-[#52333D] font-light leading-relaxed">
                    While our pre-packaged launch batches for this theme are hand-assembled to order, we handcraft custom hampers for this exact occasion via our bespoke studio! Select your budget, favorite keepsakes, chocolates, and personalized handwritten cards.
                  </p>
                </div>

                <div className="p-4 bg-[#FFF5F8] rounded-xl border border-[#FFCCD5] text-xs text-[#6B424E] text-left">
                  <strong className="text-[#3D141C] block mb-1">Studio Assurance:</strong>
                  Included items are treated as proposed concepts and confirmed directly with the DILSY owner before payment or delivery. No generic mass-market stock.
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenCustomBuilder(activeTheme.name)}
                    className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#99223A]/25 transition-all"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Create a Custom {activeTheme.name}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectTheme(null)}
                    className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#FAF0F3] border border-[#E8C2CC] text-[#7A1E31] rounded-xl text-xs font-semibold transition-colors"
                  >
                    Explore Other Themes
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* --- VIEW 2: 9 THEME CARDS GRID --- */
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
                  onClick={() => onSelectTheme(theme.id)}
                  className="bg-[#FFFCFD] rounded-2xl border border-[#E8C2CC] hover:border-[#C73858] overflow-hidden shadow-xs hover:shadow-xl hover:shadow-[#FFB3C6]/25 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Top Distinct Aesthetic Theme Artwork */}
                    <div className="relative overflow-hidden">
                      <ThemeArtwork themeId={theme.id} />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-black/5 shadow-xs">
                        <span className={`text-[11px] font-semibold tracking-wide ${theme.accentText}`}>
                          {theme.badge}
                        </span>
                      </div>
                      {productCount > 0 && (
                        <div className="absolute top-3 right-3 bg-[#99223A]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                          {productCount} {productCount === 1 ? 'Hamper' : 'Hampers'}
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-serif font-bold text-[#2D1B22] group-hover:text-[#99223A] transition-colors">
                        {theme.name}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#52333D] font-light leading-relaxed line-clamp-2">
                        {theme.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#E8D0D6]/60 flex items-center justify-between text-xs">
                        <span className="text-[#6B424E] text-[11px] italic">
                          {productCount > 0 ? 'Confirmed launch hampers' : 'Customise via Studio'}
                        </span>
                        <span className="font-semibold text-[#99223A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="px-6 pb-6 pt-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTheme(theme.id);
                      }}
                      className="flex-1 py-2.5 px-3 bg-[#FFF5F8] hover:bg-[#FFEBF0] text-[#7A1E31] border border-[#E598A9] rounded-lg text-xs font-semibold text-center transition-colors"
                    >
                      View Collection
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCustomBuilder(theme.name);
                      }}
                      title={`Create a custom ${theme.name}`}
                      className="py-2.5 px-3 bg-white hover:bg-[#FAF0F3] border border-[#E8C2CC] text-[#99223A] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Customise</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Global Action Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#FFEBF0] via-[#FFF0F4] to-[#FFE8EE] border border-[#FFCCD5] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm shadow-[#FFCCD5]/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FFD1DC] border border-[#FFB3C6] flex items-center justify-center text-[#99223A] shrink-0 shadow-2xs">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-[#2D1B22]">
                Have a unique vision or specific occasion?
              </h4>
              <p className="text-xs sm:text-sm text-[#6B424E] font-light mt-0.5">
                Build your own bespoke gift box with personalized handwritten notes, polaroids, scents, and packaging styles.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenCustomBuilder()}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-2 shadow-xs shadow-[#99223A]/20"
          >
            <Gift className="w-4 h-4" />
            <span>Create a Custom Box</span>
          </button>
        </div>
      </div>
    </section>
  );
};
