import React from 'react';
import { Hero } from './Hero';
import { ProductCard } from './ProductCard';
import { ThemeArtwork } from './ThemeArtwork';
import { Product, ThemeCategory, ProductCustomisation } from '../types';
import { ArrowRight, Heart, Sparkles, Feather, MessageCircle, Truck, Gift, Star, CheckCircle } from 'lucide-react';

interface HomePageProps {
  products: Product[];
  themes: ThemeCategory[];
  onNavigateToHampers: () => void;
  onNavigateToThemes: () => void;
  onNavigateToCustomHamper: () => void;
  onNavigateToCollection: (slug: string) => void;
  onNavigateToProduct: (productId: string) => void;
  onNavigateToStory: () => void;
  onAddToCart: (product: Product, customisation: ProductCustomisation) => void;
  onOrderWhatsApp: (product: Product, customisation: ProductCustomisation) => void;
  activePromoText?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  themes,
  onNavigateToHampers,
  onNavigateToThemes,
  onNavigateToCustomHamper,
  onNavigateToCollection,
  onNavigateToProduct,
  onNavigateToStory,
  onAddToCart,
  onOrderWhatsApp,
  activePromoText,
}) => {
  // Highlight 4 popular occasion themes for the homepage
  const popularThemeSlugs = ['i-love-you-for-her', 'anniversary', 'birthday', 'valentine'];
  const popularThemes = themes.filter((t) =>
    popularThemeSlugs.includes(t.slug) || popularThemeSlugs.includes(t.id)
  ).slice(0, 4);

  // Hampers to highlight (Small Box, Loved Box, Large Box - no duplicates)
  const publishedProducts = products.filter((p) => p.stockStatus !== 'unpublished');
  const featuredHampers = publishedProducts.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <Hero
        onExploreHampers={onNavigateToHampers}
        onCreateYourOwn={onNavigateToCustomHamper}
      />

      {/* 2. Shop by Occasion — Concise Featured Themes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9F2343] bg-[#FFFAF8] px-3 py-1 rounded-full border border-[#F1C5D1] mb-2 shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-[#9F2343] text-[#9F2343]" />
              <span>Shop by Occasion</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#3B2028]">
              Meaningful Moments, Beautifully Packaged
            </h2>
            <p className="mt-1 text-sm text-[#795A63] font-light max-w-xl">
              From everyday gestures to milestone celebrations, choose a curated theme tailored for your person.
            </p>
          </div>

          <button
            onClick={onNavigateToThemes}
            className="self-start sm:self-auto px-5 py-2.5 bg-[#FFFAF8] hover:bg-[#FCE7ED] text-[#9F2343] border border-[#F1C5D1] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer group"
          >
            <span>View All 9 Themes</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Featured Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularThemes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => onNavigateToCollection(theme.slug)}
              className="bg-[#FFFAF8] rounded-2xl border border-[#F1C5D1] p-4 flex flex-col justify-between hover:border-[#9F2343] hover:shadow-lg hover:shadow-[#72172F]/5 transition-all cursor-pointer group"
            >
              <div>
                <ThemeArtwork themeId={theme.id} className="mb-4" />
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9F2343] bg-[#FCE7ED] px-2 py-0.5 rounded-full border border-[#F1C5D1]">
                    {theme.badge || 'Occasion'}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#3B2028] group-hover:text-[#9F2343] transition-colors">
                  {theme.name}
                </h3>
                <p className="text-xs text-[#795A63] font-light line-clamp-2 mt-1">
                  {theme.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-[#F1C5D1]/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#9F2343] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>View Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <Heart className="w-3.5 h-3.5 text-[#F1C5D1] group-hover:text-[#9F2343] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Hampers Section — ₹799, ₹969, ₹1,199 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9F2343] bg-[#FFFAF8] px-3 py-1 rounded-full border border-[#F1C5D1] mb-2 shadow-2xs">
              <Gift className="w-3.5 h-3.5 text-[#9F2343]" />
              <span>Official Hampers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#3B2028]">
              Featured Curations
            </h2>
            <p className="mt-1 text-sm text-[#795A63] font-light max-w-xl">
              Each hamper is individually hand-assembled with transparent base pricing and customisation options.
            </p>
          </div>

          <button
            onClick={onNavigateToHampers}
            className="self-start sm:self-auto px-5 py-2.5 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-[#9F2343]/20 cursor-pointer group"
          >
            <span>Shop All Hampers</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Hampers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featuredHampers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOrderWhatsApp={onOrderWhatsApp}
              onViewDetails={(prod) => onNavigateToProduct(prod.id)}
              activePromoText={activePromoText}
            />
          ))}
        </div>

        {/* Custom studio banner */}
        <div className="mt-10 p-6 rounded-2xl bg-[#FFFAF8] border border-[#F1C5D1] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm shadow-[#72172F]/5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#FCE7ED] border border-[#F1C5D1] flex items-center justify-center text-[#9F2343] shrink-0 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-base text-[#3B2028]">Looking for a bespoke surprise or specific budget?</p>
              <p className="text-xs text-[#795A63]">Select your box size, choose your favourite add-ons, and craft a one-of-a-kind hamper.</p>
            </div>
          </div>
          <button
            onClick={onNavigateToCustomHamper}
            className="px-6 py-2.5 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Custom Hamper Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 4. How It Works — 3 Simple Steps */}
      <section className="bg-[#FFFAF8] py-14 border-y border-[#F1C5D1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9F2343] bg-[#FCE7ED] px-3 py-1 rounded-full border border-[#F1C5D1]">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3B2028] mt-3">
              How DILSY Gifting Works
            </h2>
            <p className="text-sm text-[#795A63] mt-2">
              Three easy steps to make someone feel deeply loved, with zero guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#FFF1F4] rounded-2xl p-6 border border-[#F1C5D1] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#9F2343] text-white font-serif font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-[#9F2343]/20">
                1
              </div>
              <h3 className="font-serif font-bold text-lg text-[#3B2028] mb-2">Choose Your Box</h3>
              <p className="text-xs text-[#795A63] leading-relaxed">
                Select from our curated Loved Box (Medium — ₹969), Small Box (₹799), Large Box (₹1,199), or build your own custom combination.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FFF1F4] rounded-2xl p-6 border border-[#F1C5D1] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#9F2343] text-white font-serif font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-[#9F2343]/20">
                2
              </div>
              <h3 className="font-serif font-bold text-lg text-[#3B2028] mb-2">Make It Personal</h3>
              <p className="text-xs text-[#795A63] leading-relaxed">
                Add your heartfelt words for our handwritten greeting card, upload your favorite memory for a polaroid print, or select sweet add-ons.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FFF1F4] rounded-2xl p-6 border border-[#F1C5D1] text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#9F2343] text-white font-serif font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-[#9F2343]/20">
                3
              </div>
              <h3 className="font-serif font-bold text-lg text-[#3B2028] mb-2">Preview & Deliver</h3>
              <p className="text-xs text-[#795A63] leading-relaxed">
                We review everything directly on WhatsApp, show you a photo of your finished box before dispatch, and coordinate local delivery around CU & Mohali.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Brand Introduction — Handcrafted with Love */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#FFFAF8] via-[#FFF1F4] to-[#FCE7ED] rounded-3xl border border-[#F1C5D1] p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#9F2343]">
              <Heart className="w-4 h-4 fill-[#9F2343]" />
              <span>About DILSY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#3B2028]">
              Because gifting is an expression of heart, not an assembly line.
            </h2>
            <p className="text-sm text-[#795A63] leading-relaxed">
              DILSY started right around the Chandigarh University campus to solve a real problem: mass-produced gifts feel generic. We craft romantic, aesthetically styled hampers with real handwritten notes, warm touches, and honest personal care.
            </p>
            <div className="pt-2">
              <button
                onClick={onNavigateToStory}
                className="px-6 py-2.5 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <span>Read Our Story & Promises</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
            <div className="bg-[#FFFAF8] p-5 rounded-2xl border border-[#F1C5D1] text-center shadow-2xs">
              <p className="font-serif font-bold text-2xl text-[#9F2343]">100%</p>
              <p className="text-xs text-[#795A63] mt-1">Hand-assembled with care</p>
            </div>
            <div className="bg-[#FFFAF8] p-5 rounded-2xl border border-[#F1C5D1] text-center shadow-2xs">
              <p className="font-serif font-bold text-2xl text-[#9F2343]">CU & Mohali</p>
              <p className="text-xs text-[#795A63] mt-1">Direct gate delivery</p>
            </div>
            <div className="bg-[#FFFAF8] p-5 rounded-2xl border border-[#F1C5D1] text-center shadow-2xs">
              <p className="font-serif font-bold text-2xl text-[#9F2343]">Handwritten</p>
              <p className="text-xs text-[#795A63] mt-1">Personal card included</p>
            </div>
            <div className="bg-[#FFFAF8] p-5 rounded-2xl border border-[#F1C5D1] text-center shadow-2xs">
              <p className="font-serif font-bold text-2xl text-[#9F2343]">WhatsApp</p>
              <p className="text-xs text-[#795A63] mt-1">Pre-dispatch confirmation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
