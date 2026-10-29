import React from 'react';
import { ArrowLeft, Sparkles, Heart, ArrowRight, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { ThemeCategory, Product, ProductCustomisation } from '../types';
import { THEME_CATEGORIES } from '../data/themes';
import { ThemeArtwork } from './ThemeArtwork';
import { ProductCard } from './ProductCard';
import { Breadcrumbs } from './Breadcrumbs';

interface CollectionPageProps {
  collection: ThemeCategory;
  allProducts: Product[];
  onNavigate: (path: string) => void;
  onAddToCart: (product: Product, customisation: ProductCustomisation) => void;
  onOrderWhatsApp: (product: Product, customisation: ProductCustomisation) => void;
  onViewProductDetails: (product: Product) => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  collection,
  allProducts,
  onNavigate,
  onAddToCart,
  onOrderWhatsApp,
  onViewProductDetails,
}) => {
  // Products assigned specifically to this collection
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
    <div className="min-h-screen bg-[#FCE7ED] text-[#3B2028] py-8 sm:py-12 animate-in fade-in-50 duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Breadcrumbs
            items={[
              { label: 'Shop by Theme', path: '/themes' },
              { label: collection.name },
            ]}
            onNavigate={onNavigate}
          />

          <button
            onClick={() => onNavigate('/themes')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFFAF8] hover:bg-[#FFF1F4] text-[#9F2343] rounded-xl text-xs font-semibold border border-[#F1C5D1] shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Explore All Themes</span>
          </button>
        </div>

        {/* Occasion Hero Header Banner */}
        <div className="mb-12 p-6 sm:p-10 rounded-3xl bg-[#FFFAF8] border border-[#F1C5D1] shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-wider font-bold text-[#9F2343] bg-[#FFF1F4] px-3 py-1 rounded-full border border-[#F1C5D1]">
                  {collection.badge}
                </span>
                {collection.isComingSoon && (
                  <span className="text-xs font-bold text-white bg-[#72172F] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Coming Soon</span>
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#3B2028] tracking-tight">
                {collection.name}
              </h1>

              <p className="text-base sm:text-lg text-[#79665C] font-light leading-relaxed">
                "{collection.description}"
              </p>

              {collection.heroHeadline && (
                <p className="text-sm font-serif font-semibold text-[#9F2343]">
                  {collection.heroHeadline}
                </p>
              )}

              {collection.heroStory && (
                <p className="text-xs sm:text-sm text-[#79665C] font-light leading-relaxed max-w-xl">
                  {collection.heroStory}
                </p>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {collection.isComingSoon ? (
                  <div className="p-3.5 bg-[#FFF1F4] text-[#9F2343] rounded-xl text-xs font-semibold border border-[#F1C5D1] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#9F2343]" />
                    <span>{collection.comingSoonMessage || 'Something special for him is on its way. Stay tuned!'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate(`/custom-hamper?occasion=${encodeURIComponent(collection.name)}`)}
                    className="px-5 py-3 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Customise a Hamper for {collection.name}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Cover Artwork */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-[#F1C5D1] shadow-md bg-[#FFF1F4]">
                {collection.coverImage ? (
                  <img
                    src={collection.coverImage}
                    alt={collection.name}
                    className="w-full aspect-[16/10] object-cover"
                  />
                ) : (
                  <ThemeArtwork themeId={collection.id} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Products in this Collection */}
        <div className="mb-14">
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-[#3B2028]">
              Available Hampers for {collection.name}
            </h2>
            <p className="text-xs text-[#79665C] mt-1">
              Curated gift boxes suited for this occasion. Exact treats, handwritten cards, and personal details confirmed on WhatsApp.
            </p>
          </div>

          {collection.isComingSoon ? (
            <div className="p-8 sm:p-12 bg-[#FFFAF8] rounded-2xl border border-[#F1C5D1] text-center space-y-4 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#FFF1F4] border border-[#F1C5D1] text-[#9F2343] flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#3B2028]">
                Coming Soon
              </h3>
              <p className="text-xs text-[#79665C] leading-relaxed">
                We are curating refined goodies and gifts specifically designed for him. Ordering for this collection will be enabled once inventory is ready!
              </p>
              <button
                onClick={() => onNavigate('/themes')}
                className="px-5 py-2.5 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Browse Other Available Occasions
              </button>
            </div>
          ) : assignedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {assignedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onOrderWhatsApp={onOrderWhatsApp}
                  onViewDetails={onViewProductDetails}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 sm:p-12 bg-[#FFFAF8] rounded-2xl border border-[#F1C5D1] text-center space-y-4 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#FFF1F4] border border-[#F1C5D1] text-[#9F2343] flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 fill-[#9F2343]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#3B2028]">
                Handcrafted Studio Hamper
              </h3>
              <p className="text-xs text-[#79665C] leading-relaxed">
                For this occasion, we handcraft custom hampers based on your budget and personal preferences. Use our Hamper Studio to select your box size and treats.
              </p>
              <button
                onClick={() => onNavigate(`/custom-hamper?occasion=${encodeURIComponent(collection.name)}`)}
                className="px-6 py-3 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Build Custom {collection.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Related Collections Section */}
        {relatedCollections.length > 0 && (
          <div className="pt-8 border-t border-[#F1C5D1]">
            <h3 className="text-xl font-serif font-bold text-[#3B2028] mb-6">
              You Might Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedCollections.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onNavigate(`/collections/${rel.slug || rel.id}`)}
                  className="p-4 bg-[#FFFAF8] hover:bg-[#FFF1F4] rounded-xl border border-[#F1C5D1] hover:border-[#9F2343] text-left transition-all shadow-2xs group cursor-pointer"
                >
                  <span className="text-[10px] font-semibold text-[#9F2343] uppercase tracking-wider block mb-1">
                    {rel.badge}
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#3B2028] group-hover:text-[#9F2343] transition-colors">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-[#79665C] line-clamp-1 mt-1">
                    {rel.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
