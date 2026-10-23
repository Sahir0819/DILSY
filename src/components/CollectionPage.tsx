import React from 'react';
import { ArrowLeft, Sparkles, Heart, Gift, ArrowRight, ShieldCheck, Check, Info } from 'lucide-react';
import { ThemeCategory, Product, ProductCustomisation } from '../types';
import { THEME_CATEGORIES } from '../data/themes';
import { ThemeArtwork } from './ThemeArtwork';
import { ProductCard } from './ProductCard';

interface CollectionPageProps {
  collection: ThemeCategory;
  allProducts: Product[];
  onBackToThemes: () => void;
  onNavigateToCollection: (slugOrId: string) => void;
  onOpenCustomBuilder: (occasionTitle: string) => void;
  onAddToCart: (product: Product, customisation: ProductCustomisation) => void;
  onOrderWhatsApp: (product: Product, customisation: ProductCustomisation) => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  collection,
  allProducts,
  onBackToThemes,
  onNavigateToCollection,
  onOpenCustomBuilder,
  onAddToCart,
  onOrderWhatsApp,
}) => {
  // Products assigned to this collection only
  const assignedProducts = allProducts.filter(
    (product) =>
      collection.linkedProductIds.includes(product.id) ||
      (product.themeIds && product.themeIds.includes(collection.id))
  );

  // Related collections
  const relatedCollections = (collection.relatedThemeIds || [])
    .map((id) => THEME_CATEGORIES.find((t) => t.id === id || t.slug === id))
    .filter(Boolean) as ThemeCategory[];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2A1E1A] pt-4 pb-20 animate-in fade-in-50 duration-300">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8D0D6] pb-4">
          <nav className="flex items-center gap-2 text-xs text-[#6B424E]">
            <button
              onClick={onBackToThemes}
              className="hover:text-[#99223A] transition-colors flex items-center gap-1 font-medium"
            >
              <span>Home</span>
            </button>
            <span>/</span>
            <button
              onClick={onBackToThemes}
              className="hover:text-[#99223A] transition-colors font-medium"
            >
              <span>Shop by Theme</span>
            </button>
            <span>/</span>
            <span className="text-[#99223A] font-semibold">{collection.name}</span>
          </nav>

          <button
            onClick={onBackToThemes}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#FFF5F8] text-[#7A1E31] rounded-lg text-xs font-semibold border border-[#FFCCD5] shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Themes</span>
          </button>
        </div>
      </div>

      {/* Occasion-Specific Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div
          className={`p-6 sm:p-10 md:p-12 rounded-3xl bg-gradient-to-br ${collection.accentBg} border ${collection.accentBorder} shadow-sm relative overflow-hidden`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs uppercase tracking-wider font-bold ${collection.accentText} bg-white/90 px-3 py-1 rounded-full border border-current/20 shadow-2xs`}
                >
                  {collection.badge}
                </span>
                <span className="text-xs text-[#6B424E] font-medium">
                  Occasion Collection
                </span>
                <span className="text-xs text-[#A32842] bg-[#FFEBF0] px-2 py-0.5 rounded-full border border-[#FFCCD5]">
                  /collections/{collection.slug}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2D1B22] tracking-tight leading-[1.15]">
                {collection.name}
              </h1>

              <p className="text-base sm:text-lg text-[#52333D] font-light italic leading-relaxed">
                "{collection.description}"
              </p>

              {collection.heroHeadline && (
                <p className="text-sm sm:text-base font-serif font-semibold text-[#3D141C]">
                  {collection.heroHeadline}
                </p>
              )}

              {collection.heroStory && (
                <p className="text-xs sm:text-sm text-[#52333D] font-light leading-relaxed max-w-xl">
                  {collection.heroStory}
                </p>
              )}

              {/* Occasion Visual Direction */}
              <div className="p-3.5 bg-white/75 rounded-2xl border border-current/15 text-xs text-[#52333D] space-y-1">
                <strong className="text-[#3D141C] block">Occasion Visual Direction:</strong>
                <p className="font-light">{collection.visualDirection}</p>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {collection.isComingSoon ? (
                  <>
                    <div className="px-4 py-2.5 bg-white/90 text-[#8C283B] rounded-xl text-xs font-semibold border border-[#FFCCD5] flex items-center gap-2 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-[#C73858] animate-pulse" />
                      <span>Inventory in Preparation · Coming Soon</span>
                    </div>
                    <button
                      type="button"
                      onClick={onBackToThemes}
                      className="px-4 py-2.5 bg-white hover:bg-[#FFF5F8] text-[#7A1E31] rounded-xl text-xs font-semibold border border-[#E8C2CC] transition-colors"
                    >
                      <span>Explore Other Available Themes</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onOpenCustomBuilder(collection.name)}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#99223A]/25 transition-all"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>Customise a {collection.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={onBackToThemes}
                      className="px-4 py-2.5 bg-white hover:bg-[#FFF5F8] text-[#7A1E31] rounded-xl text-xs font-semibold border border-[#E8C2CC] transition-colors"
                    >
                      <span>Explore Other 8 Themes</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right Artwork Column */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-sm">
                <div className="bg-white p-2.5 rounded-2xl shadow-xl shadow-[#A82841]/10 border border-[#E8C2CC]">
                  <ThemeArtwork themeId={collection.id} className="shadow-xs" />
                  <div className="p-3 bg-[#FFFDFE] border-t border-[#E8D0D6] flex items-center justify-between">
                    <div>
                      <p className="font-serif font-bold text-sm text-[#2D1B22]">{collection.name}</p>
                      <p className="text-[10px] text-[#6B424E]">Curated Studio Aesthetic</p>
                    </div>
                    {collection.isComingSoon ? (
                      <span className="text-[10px] text-[#8C283B] font-bold uppercase tracking-wider bg-[#FFEBF0] px-2 py-0.5 rounded-full border border-[#FFCCD5]">
                        Coming Soon
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#A32842] italic font-medium">
                        Sample illustrative
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasion Gifting Tips Strip (if available) */}
      {collection.giftingTips && collection.giftingTips.length > 0 && !collection.isComingSoon && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-[#FFF8FA] rounded-2xl p-5 border border-[#FFCCD5] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#FFE5EC] border border-[#FFB3C6] flex items-center justify-center text-[#99223A]">
                <Heart className="w-4 h-4 fill-[#C73858] text-[#C73858]" />
              </div>
              <span className="font-serif font-bold text-sm text-[#2D1B22]">
                Curator's Gifting Tips:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#52333D] flex-1">
              {collection.giftingTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#C73858] font-bold text-xs">♥</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section for This Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-3 border-b border-[#E8D0D6]">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#A32842] block mb-1">
              {collection.isComingSoon ? 'Collection Status' : 'Curated Hampers'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D1B22]">
              Hampers for {collection.name}
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#6B424E]">
            {collection.isComingSoon ? (
              <span className="font-bold text-[#8C283B] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5] uppercase tracking-wider text-[10px]">
                Coming Soon
              </span>
            ) : (
              <span className="font-semibold text-[#99223A] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5]">
                {assignedProducts.length} {assignedProducts.length === 1 ? 'Hamper' : 'Hampers'} Assigned
              </span>
            )}
          </div>
        </div>

        {collection.isComingSoon ? (
          /* Polished Coming Soon Message State for For Him */
          <div className="p-8 sm:p-14 rounded-3xl bg-white border border-[#FFCCD5] text-center max-w-2xl mx-auto space-y-6 shadow-sm shadow-[#FFCCD5]/20">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFF0F4] to-[#FFE5EC] border border-[#FFCCD5] flex items-center justify-center text-[#99223A] mx-auto shadow-xs">
              <Sparkles className="w-8 h-8 text-[#C73858] animate-pulse" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#99223A] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5]">
                <span>COMING SOON</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D1B22]">
                {collection.comingSoonMessage || 'Something special for him is on its way. Stay tuned!'}
              </h3>
              <p className="text-sm text-[#52333D] font-light leading-relaxed max-w-md mx-auto">
                We currently do not have the inventory ready for the “{collection.name}” collection. Our studio team is preparing custom keepsakes, masculine aromatics, and personalized details to give him an unforgettable surprise.
              </p>
            </div>

            <div className="p-4 bg-[#FFF5F8] rounded-2xl border border-[#FFCCD5] text-xs text-[#6B424E] text-left max-w-md mx-auto space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#3D141C] font-semibold">
                <Info className="w-3.5 h-3.5 text-[#C73858] shrink-0" />
                <span>Inventory Status:</span>
              </div>
              <p className="leading-relaxed">
                Ordering and purchase actions for this collection are temporarily paused while our studio inventory is being prepared. In the meantime, explore our other loved collections!
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onBackToThemes}
                className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#99223A]/25 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Explore Other Available Themes</span>
              </button>
            </div>
          </div>
        ) : assignedProducts.length > 0 ? (
          /* Products Grid for this collection */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assignedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onOrderWhatsApp={onOrderWhatsApp}
              />
            ))}
          </div>
        ) : (
          /* Honest Studio Customisation State for collections without confirmed pre-packaged stock */
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8D0D6] text-center max-w-2xl mx-auto space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FFE5EC] border border-[#FFB3C6] flex items-center justify-center text-[#99223A] mx-auto shadow-xs">
              <Gift className="w-8 h-8 opacity-90" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A32842] block">
                Personalised Hamper Studio
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D1B22]">
                Customise Your {collection.name}
              </h3>
              <p className="text-sm text-[#52333D] font-light leading-relaxed max-w-lg mx-auto">
                We assemble custom hampers for this occasion through our studio. Select your budget, optional add-ons, and a personal message, and let us help create a hamper made with care.
              </p>
            </div>

            <div className="p-4 bg-[#FFF5F8] rounded-xl border border-[#FFCCD5] text-xs text-[#6B424E] text-left max-w-md mx-auto space-y-1">
              <strong className="text-[#3D141C] block">DILSY Honest Promise:</strong>
              <p>We do not fabricate fake stock or artificial countdowns. Every hamper is curated directly with the store owner before payment or delivery.</p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onOpenCustomBuilder(collection.name)}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#99223A]/25 transition-all"
              >
                <Gift className="w-4 h-4" />
                <span>Create a Custom {collection.name}</span>
              </button>
              <button
                type="button"
                onClick={onBackToThemes}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-[#FAF0F3] border border-[#E8C2CC] text-[#7A1E31] rounded-xl text-xs font-semibold transition-colors"
              >
                Explore Other Collections
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Customise Your Box CTA Banner (Only for active collections) */}
      {!collection.isComingSoon && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#FFEBF0] via-[#FFF0F4] to-[#FFE8EE] border border-[#FFCCD5] flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm shadow-[#FFCCD5]/20">
            <div className="space-y-2 text-center lg:text-left">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#A32842] flex items-center justify-center lg:justify-start gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-[#C73858] text-[#C73858]" />
                Need Something Completely Unique?
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D1B22]">
                Commission a Custom {collection.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B424E] max-w-xl">
                Choose your budget (Small Box ₹799, Loved Box / Medium ₹969, Large Box ₹1,199), select optional add-ons, and include your personal handwritten card.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenCustomBuilder(collection.name)}
              className="px-6 py-3.5 bg-gradient-to-r from-[#99223A] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 shadow-md shadow-[#99223A]/20"
            >
              <span>Open Custom Hamper Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Related Collections Section */}
      {relatedCollections.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E8D0D6]">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#A32842] block mb-1">
                More Feelings to Explore
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#2D1B22]">
                Related Theme Collections
              </h3>
            </div>
            <button
              onClick={onBackToThemes}
              className="text-xs font-semibold text-[#99223A] hover:text-[#C73858] flex items-center gap-1"
            >
              <span>View All 9 Themes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCollections.map((relTheme) => {
              const relProductCount = allProducts.filter(
                (p) =>
                  relTheme.linkedProductIds.includes(p.id) ||
                  (p.themeIds && p.themeIds.includes(relTheme.id))
              ).length;

              return (
                <div
                  key={relTheme.id}
                  className="bg-[#FFFCFD] rounded-2xl border border-[#E8C2CC] hover:border-[#C73858] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative">
                      <ThemeArtwork themeId={relTheme.id} />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-black/5 shadow-xs">
                        <span className={`text-[10px] font-semibold ${relTheme.accentText}`}>
                          {relTheme.badge}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-serif font-bold text-lg text-[#2D1B22] group-hover:text-[#99223A] transition-colors">
                        {relTheme.name}
                      </h4>
                      <p className="mt-1 text-xs text-[#52333D] font-light line-clamp-2">
                        {relTheme.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      onClick={() => onNavigateToCollection(relTheme.slug)}
                      className="w-full py-2 px-3 bg-[#FFF5F8] hover:bg-[#FFEBF0] text-[#7A1E31] rounded-lg text-xs font-semibold border border-[#FFCCD5] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>View Collection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
