import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Product, ThemeCategory, ProductCustomisation } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ThemeArtwork } from '../components/ThemeArtwork';
import { Breadcrumbs } from '../components/Breadcrumbs';

const GENERIC_BOX_PRODUCT_IDS = new Set([
  'the-little-affair',
  'loved-box',
  'the-everything-box',
]);

interface AllHampersPageProps {
  products: Product[];
  themes: ThemeCategory[];
  searchQuery?: string;
  onNavigate: (path: string) => void;
  onAddToCart: (product: Product, customisation: ProductCustomisation) => void;
  onOrderWhatsApp: (product: Product, customisation: ProductCustomisation) => void;
  onViewProductDetails: (product: Product) => void;
  activePromoText?: string;
}

export const AllHampersPage: React.FC<AllHampersPageProps> = ({
  products,
  themes,
  searchQuery = '',
  onNavigate,
  onAddToCart,
  onOrderWhatsApp,
  onViewProductDetails,
  activePromoText,
}) => {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'for-him' | 'for-her' | 'celebration' | 'care'
  >('all');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Occasion-based collection cards moved from Shop by Theme
  const displayedThemes = themes.filter((theme) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'for-him'
        ? ['i-love-you-for-him', 'anniversary', 'valentine-box', 'miss-you-box', 'exam-good-luck', 'graduation-farewell'].includes(theme.id)
        : activeFilter === 'for-her'
        ? ['i-love-you-for-her', 'anniversary', 'birthday', 'valentine-box', 'periods-box', 'exam-good-luck', 'graduation-farewell'].includes(theme.id)
        : activeFilter === 'celebration'
        ? ['birthday', 'anniversary', 'diwali-box', 'graduation-farewell'].includes(theme.id)
        : ['periods-box', 'apology-box', 'miss-you-box', 'exam-good-luck'].includes(theme.id);

    if (!matchesFilter) return false;

    if (!normalizedQuery) return true;
    return (
      theme.name.toLowerCase().includes(normalizedQuery) ||
      theme.description.toLowerCase().includes(normalizedQuery) ||
      (theme.badge && theme.badge.toLowerCase().includes(normalizedQuery))
    );
  });

  // Any additional custom admin-created products (excluding the three generic box sizes)
  const additionalProducts = products.filter(
    (p) => p.stockStatus !== 'unpublished' && !GENERIC_BOX_PRODUCT_IDS.has(p.id)
  );

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2A0D15] py-8 sm:py-14 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'All Hampers' }]}
            onNavigate={onNavigate}
          />
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5A63] mb-2">
              Curated Editions
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#2A0D15] tracking-tight">
              All Hampers
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#6E565D] font-light max-w-xl">
              Every feeling has its own mood and story. Explore our {themes.length} occasion-based collections, each thoughtfully styled and matched with handwritten sentiments.
            </p>
            {normalizedQuery && (
              <div className="mt-3 flex items-center gap-2 text-xs text-[#3E101D]">
                <span>Showing results for "{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/hampers')}
                  className="underline hover:text-[#2A0B13] cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Filtering Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center flex-wrap gap-1 p-1 bg-white border border-[#EADBDB]">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'for-him', label: 'For Him' },
                  { id: 'for-her', label: 'For Her' },
                  { id: 'celebration', label: 'Celebration' },
                  { id: 'care', label: 'Care' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-3 py-1.5 text-xs font-sans tracking-wide uppercase transition-colors cursor-pointer ${
                    activeFilter === cat.id
                      ? 'bg-[#3E101D] text-white font-medium'
                      : 'text-[#6E565D] hover:text-[#2A0D15]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Occasion-Based Collection Cards Grid (Moved from Shop by Theme) */}
        {displayedThemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedThemes.map((theme) => {
              const collectionPath = `/collections/${theme.slug || theme.id}`;

              return (
                <div
                  key={theme.id}
                  className="bg-white border border-[#EADBDB] hover:border-[#3E101D]/40 overflow-hidden transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover Artwork or Image */}
                    <div
                      onClick={() => onNavigate(collectionPath)}
                      className="relative aspect-[16/10] overflow-hidden bg-[#FAF7F5] cursor-pointer border-b border-[#EADBDB]"
                    >
                      {theme.coverImage ? (
                        <img
                          src={theme.coverImage}
                          alt={theme.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                        />
                      ) : (
                        <ThemeArtwork themeId={theme.id} />
                      )}

                      {/* Badge */}
                      <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] font-medium text-[#3E101D] border border-[#EADBDB]/60">
                        {theme.badge}
                      </div>

                      {/* Coming Soon status */}
                      {theme.isComingSoon && (
                        <div className="absolute top-3 right-3 bg-[#3E101D] text-white text-[9px] font-bold tracking-widest px-2.5 py-0.5 uppercase">
                          COMING SOON
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h2
                        onClick={() => onNavigate(collectionPath)}
                        className="text-xl font-serif font-normal text-[#2A0D15] group-hover:text-[#3E101D] transition-colors mb-2 cursor-pointer"
                      >
                        {theme.name}
                      </h2>
                      <p className="text-xs text-[#7A6368] font-light leading-relaxed line-clamp-3">
                        {theme.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="p-6 pt-0 border-t border-[#EADBDB]/60">
                    <button
                      type="button"
                      onClick={() => onNavigate(collectionPath)}
                      className="w-full mt-4 py-2.5 px-4 bg-[#3E101D] hover:bg-[#2A0B13] text-white text-[11px] font-medium uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>View Collection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 bg-white border border-[#EADBDB] text-center space-y-3">
            <p className="font-serif text-xl text-[#2A0D15]">No collections matched your filter</p>
            <p className="text-xs text-[#6E565D] font-light">
              Try resetting your filters or build a custom hamper tailored to your occasion.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('all');
                if (normalizedQuery) onNavigate('/hampers');
              }}
              className="px-5 py-2.5 bg-[#3E101D] text-white text-[11px] uppercase tracking-[0.18em] cursor-pointer"
            >
              Show All Collections
            </button>
          </div>
        )}

        {/* Any Additional Non-Box-Size Products Added in Admin */}
        {additionalProducts.length > 0 && (
          <div className="mt-14 pt-12 border-t border-[#EADBDB]">
            <div className="mb-8">
              <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5A63] mb-1">
                Special Releases
              </p>
              <h2 className="text-2xl font-serif font-normal text-[#2A0D15]">
                Additional Curated Editions
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {additionalProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onOrderWhatsApp={onOrderWhatsApp}
                  onViewDetails={onViewProductDetails}
                  activePromoText={activePromoText}
                />
              ))}
            </div>
          </div>
        )}

        {/* Custom Hamper Callout Banner */}
        <div className="mt-16 p-8 bg-white border border-[#EADBDB] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#7A5A63]">
              Bespoke Studio
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#2A0D15]">
              Looking for a custom combination or specific budget?
            </h3>
            <p className="text-xs text-[#6E565D] font-light max-w-xl">
              Mix and match curated goodies, scents, handwritten cards, and keepsake touches in our Bespoke Atelier.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/custom-hamper')}
            className="px-7 py-3.5 bg-[#3E101D] hover:bg-[#2A0B13] text-white text-[11px] font-medium uppercase tracking-[0.18em] transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
          >
            <span>Custom Hamper Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
