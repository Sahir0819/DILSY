import React from 'react';
import { ArrowRight, Sparkles, Heart, Check, Clock, AlertCircle } from 'lucide-react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { ManifestoSection } from '../components/StoryAndFaq';
import { Product, ThemeCategory, ProductCustomisation } from '../types';

interface HomePageProps {
  products: Product[];
  themes: ThemeCategory[];
  onNavigate: (path: string) => void;
  onAddToCart: (product: Product, customisation: ProductCustomisation) => void;
  onOrderWhatsApp: (product: Product, customisation: ProductCustomisation) => void;
  onViewProductDetails: (product: Product) => void;
  activePromoText?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  themes,
  onNavigate,
  onAddToCart,
  onOrderWhatsApp,
  onViewProductDetails,
  activePromoText,
}) => {
  // Only published products
  const publishedProducts = products.filter((p) => p.stockStatus !== 'unpublished');

  // Find products matching the 4 curated editions from Screenshot 2
  // 1. Loved Box (Medium ₹969)
  const lovedBox = publishedProducts.find((p) => p.id === 'loved-box') || publishedProducts[0];
  // 2. Small Box / Little Affair (₹799)
  const smallBox = publishedProducts.find((p) => p.id === 'the-little-affair') || publishedProducts[1];
  // 3. Large Box / Everything Box (₹1,199)
  const largeBox = publishedProducts.find((p) => p.id === 'the-everything-box') || publishedProducts[2];

  // Curated editions array matching Screenshot 2: Anniversary, Loved Box, Birthday, For Her
  const curatedEditions = [
    {
      product: smallBox,
      title: 'Anniversary Box',
      badge: 'BESPOKE KEEPSAKE',
      image: '/assets/images/product-anniversary-box.jpg',
      description: 'Bespoke keepsake curation with preserved botanicals, custom brass token & personalized atelier card.',
      price: 1199,
    },
    {
      product: lovedBox,
      title: 'Loved Box / Medium',
      badge: 'SIGNATURE',
      image: '/assets/images/product-loved-box.jpg',
      description: 'Hand-poured amber soy candle, silk scarf, and personalized atelier wax-sealed card.',
      price: 969,
    },
    {
      product: largeBox,
      title: 'Birthday Box',
      badge: 'CELEBRATION',
      image: '/assets/images/product-birthday-box.jpg',
      description: 'Curated celebratory essentials with gourmet confectionery, celebratory sparklers & vintage keepsake.',
      price: 1199,
    },
    {
      product: lovedBox,
      title: 'I Love You — For Her',
      badge: 'ROMANTIC',
      image: '/assets/images/product-for-her.jpg',
      description: 'Raw rose quartz specimen, artisan confectionery, and sealed sentiment deckle-edge note.',
      price: 969,
    },
  ];

  // 4 Curated Occasions from Screenshot 3
  const occasionThemes = [
    {
      number: '01 / CORE SERIES',
      title: 'Romance & Forever',
      description: 'Intimate tokens of longevity, anniversary memories, and pure undying commitment designed to outlive ephemeral trends.',
      action: 'DISCOVER COLLECTION',
      slug: 'anniversary',
      image: '/assets/images/theme-romance.jpg',
    },
    {
      number: '02 / MILESTONES',
      title: 'Milestone Birthdays',
      description: 'Honoring another trip around the sun with tactile, mature celebratory artifacts.',
      action: 'EXPLORE SETS',
      slug: 'birthday',
      image: '/assets/images/theme-birthdays.jpg',
    },
    {
      number: '03 / EMPATHY',
      title: 'Comfort & Care',
      description: 'Featuring our acclaimed Periods Box, Healing Rituals, and sincere Apology curations.',
      action: 'VIEW CARE HAMPERS',
      slug: 'periods-box',
      image: '/assets/images/theme-comfort.jpg',
    },
    {
      number: '04 / CULTURAL',
      title: 'Festive & Cultural',
      description: 'The festive Diwali Box and regional celebrations re-imagined through haute-couture restraint and architectural beauty.',
      action: 'DISCOVER FESTIVE',
      slug: 'diwali-box',
      image: '/assets/images/theme-festive.jpg',
    },
  ];

  return (
    <div className="bg-[#FAF7F5] text-[#2A0D15]">
      {/* 1. EDITORIAL HERO SECTION (Screenshot 1) */}
      <Hero
        onExploreHampers={() => onNavigate('/hampers')}
        onCreateYourOwn={() => onNavigate('/custom-hamper')}
      />

      {/* 2. CURATED EDITIONS (Screenshot 2: Timeless Sentiments) */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#EADBDB]">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5A63] mb-2">
              Curated Editions
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#2A0D15] tracking-tight">
              Timeless Sentiments
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/hampers')}
            className="text-[11px] uppercase tracking-[0.18em] font-sans font-medium text-[#2A0D15] hover:text-[#4A1423] pb-1 border-b border-[#2A0D15] hover:border-[#4A1423] self-start sm:self-auto transition-colors cursor-pointer"
          >
            View All Editions ({publishedProducts.length})
          </button>
        </div>

        {/* 4-Column Product Grid (Screenshot 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {curatedEditions.map((edition, idx) => {
            const product = edition.product;
            if (!product) return null;

            return (
              <ProductCard
                key={`${product.id}-${idx}`}
                product={{
                  ...product,
                  name: edition.title,
                  description: edition.description,
                  customImage: edition.image,
                  price: edition.price,
                }}
                badgeLabel={edition.badge}
                onAddToCart={onAddToCart}
                onOrderWhatsApp={onOrderWhatsApp}
                onViewDetails={onViewProductDetails}
                activePromoText={activePromoText}
              />
            );
          })}
        </div>
      </section>

      {/* 3. CURATED TAXONOMIES (Screenshot 3: Shop by Occasion & Theme) */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#EADBDB]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5A63] mb-2">
              Curated Taxonomies
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#2A0D15] tracking-tight">
              Shop by Occasion & Theme
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/themes')}
            className="text-[11px] uppercase tracking-[0.18em] font-sans font-medium text-[#2A0D15] hover:text-[#4A1423] pb-1 border-b border-[#2A0D15] self-start sm:self-auto transition-colors cursor-pointer"
          >
            All Collections ({themes.length})
          </button>
        </div>

        {/* 2x2 Grid of Theme Cards (Screenshot 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {occasionThemes.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(`/collections/${item.slug}`)}
              className="relative h-72 sm:h-80 border border-[#EADBDB] overflow-hidden group cursor-pointer flex flex-col justify-between p-7 sm:p-9 bg-[#FAF7F5]"
            >
              {/* Background Photography with Warm Ivory Wash */}
              <div className="absolute inset-0 z-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#FAF7F5]/75 group-hover:bg-[#FAF7F5]/65 transition-colors duration-500" />
              </div>

              {/* Top Tag */}
              <div className="relative z-10 self-start">
                <span className="bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[9px] font-sans uppercase tracking-[0.2em] text-[#3E101D] border border-[#EADBDB]/60">
                  {item.number}
                </span>
              </div>

              {/* Content & Action */}
              <div className="relative z-10 space-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#2A0D15] group-hover:text-[#3E101D] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6E565D] font-light leading-relaxed max-w-md line-clamp-2">
                  {item.description}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-sans font-medium tracking-[0.2em] text-[#3E101D] group-hover:translate-x-1 transition-transform">
                    <span>{item.action}</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BESPOKE ATELIER / CUSTOM HAMPER EXPERIENCE (Screenshot 4) */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#EADBDB]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          {/* Left Column: Atelier Overview & Spec Summary */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5A63]">
              Bespoke Atelier
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#2A0D15] tracking-tight leading-snug">
              The Custom Hamper Experience
            </h2>
            <p className="text-sm text-[#6E565D] font-light leading-relaxed max-w-md">
              Construct an intimate archive of your personal relationship. From selecting the tactile container proportions to typing the exact words we hand-scribe in sealing wax.
            </p>

            {/* Spec Box */}
            <div className="p-6 bg-white border border-[#EADBDB] space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#EADBDB]/60">
                <span className="text-[10px] uppercase tracking-wider text-[#7A5A63]">Selected Box:</span>
                <span className="font-medium text-[#2A0D15]">Medium Box (₹969)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#EADBDB]/60">
                <span className="text-[10px] uppercase tracking-wider text-[#7A5A63]">Wax Seal Finish:</span>
                <span className="font-medium text-[#3E101D]">Bordeaux Red #4A101D</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#EADBDB]/60">
                <span className="text-[10px] uppercase tracking-wider text-[#7A5A63]">Personal Note:</span>
                <span className="font-medium text-[#2A0D15]">Calligraphed Free</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/custom-hamper')}
                  className="w-full py-3.5 bg-[#3E101D] hover:bg-[#2A0B13] text-white text-[11px] font-medium tracking-[0.2em] uppercase transition-all text-center cursor-pointer"
                >
                  Start Creating
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Steps Preview */}
          <div className="lg:col-span-7 space-y-6 font-sans">
            {/* Step 01 */}
            <div className="p-6 bg-white border border-[#EADBDB]">
              <div className="flex items-center justify-between text-xs mb-4">
                <span className="font-medium text-[#2A0D15] tracking-wider uppercase text-[11px]">
                  01 Choose Box Dimension
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#7A5A63]">
                  Architectural Vessel
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => onNavigate('/custom-hamper')}
                  className="p-4 border border-[#EADBDB] text-center hover:border-[#3E101D] transition-colors cursor-pointer"
                >
                  <span className="block font-serif text-base text-[#2A0D15]">Small</span>
                  <span className="block text-[10px] text-[#7A5A63] mt-0.5">18 × 14 × 6 cm</span>
                  <span className="block text-xs font-semibold text-[#2A0D15] mt-2">₹799</span>
                </button>
                <button
                  onClick={() => onNavigate('/custom-hamper')}
                  className="p-4 border-2 border-[#3E101D] text-center bg-[#FAF7F5] relative cursor-pointer"
                >
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#3E101D] text-white rounded-none flex items-center justify-center text-[9px]">
                    ✓
                  </span>
                  <span className="block font-serif text-base text-[#2A0D15]">Medium</span>
                  <span className="block text-[10px] text-[#7A5A63] mt-0.5">24 × 20 × 9 cm</span>
                  <span className="block text-xs font-semibold text-[#2A0D15] mt-2">₹969</span>
                </button>
                <button
                  onClick={() => onNavigate('/custom-hamper')}
                  className="p-4 border border-[#EADBDB] text-center hover:border-[#3E101D] transition-colors cursor-pointer"
                >
                  <span className="block font-serif text-base text-[#2A0D15]">Large</span>
                  <span className="block text-[10px] text-[#7A5A63] mt-0.5">32 × 26 × 12 cm</span>
                  <span className="block text-xs font-semibold text-[#2A0D15] mt-2">₹1,199</span>
                </button>
              </div>
            </div>

            {/* Step 02 */}
            <div className="p-6 bg-white border border-[#EADBDB]">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-medium text-[#2A0D15] tracking-wider uppercase text-[11px]">
                  02 Theme & Color Palette
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#7A5A63]">
                  Silk Ribbon Swatches
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                <div className="p-2 border border-[#3E101D] bg-[#FAF7F5] text-center">
                  <div className="w-full h-7 bg-[#4A1423] mb-1.5" />
                  <span className="text-[9px] uppercase tracking-wider text-[#2A0D15] block font-medium">Bordeaux Wine</span>
                </div>
                <div className="p-2 border border-[#EADBDB] text-center">
                  <div className="w-full h-7 bg-[#F7D8DF] mb-1.5" />
                  <span className="text-[9px] uppercase tracking-wider text-[#7A5A63] block">Blush Silk</span>
                </div>
                <div className="p-2 border border-[#EADBDB] text-center">
                  <div className="w-full h-7 bg-[#EFE8DF] mb-1.5" />
                  <span className="text-[9px] uppercase tracking-wider text-[#7A5A63] block">Raw Linen</span>
                </div>
                <div className="p-2 border border-[#EADBDB] text-center">
                  <div className="w-full h-7 bg-[#1C1819] mb-1.5" />
                  <span className="text-[9px] uppercase tracking-wider text-[#7A5A63] block">Nocturne Black</span>
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="p-6 bg-white border border-[#EADBDB]">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-medium text-[#2A0D15] tracking-wider uppercase text-[11px]">
                  03 Curated Artisan Add-Ons
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#7A5A63]">
                  Tactile Elements
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 text-[11px]">
                <div className="p-3 border border-[#3E101D] bg-[#FAF7F5] flex items-start gap-2">
                  <span className="text-[#3E101D] font-bold">✓</span>
                  <div>
                    <span className="font-medium text-[#2A0D15] block">Hand-Poured Soy Candle</span>
                    <span className="text-[10px] text-[#7A5A63]">Fig & Amber / +₹350</span>
                  </div>
                </div>
                <div className="p-3 border border-[#3E101D] bg-[#FAF7F5] flex items-start gap-2">
                  <span className="text-[#3E101D] font-bold">✓</span>
                  <div>
                    <span className="font-medium text-[#2A0D15] block">Raw Botanicals Bouquet</span>
                    <span className="text-[10px] text-[#7A5A63]">Dried White Rose / +₹200</span>
                  </div>
                </div>
                <div className="p-3 border border-[#EADBDB] flex items-start gap-2 opacity-75">
                  <span className="text-[#7A5A63]">□</span>
                  <div>
                    <span className="font-medium text-[#2A0D15] block">Brass Keepsake Locket</span>
                    <span className="text-[10px] text-[#7A5A63]">Custom Photo / +₹450</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 04 */}
            <div className="p-6 bg-white border border-[#EADBDB]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-[#2A0D15] tracking-wider uppercase text-[11px]">
                  04 Handwritten Wax-Sealed Note
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#7A5A63]">
                  Deckle-Edge Cotton Paper
                </span>
              </div>
              <p className="text-xs text-[#7A5A63] mb-3">
                Our resident calligrapher will hand-transcribe your exact sentiment onto 300gsm cold-pressed cotton cardstock:
              </p>
              <div className="p-3 bg-[#FAF7F5] border border-[#EADBDB] font-serif italic text-xs text-[#2A0D15]">
                "To the one who makes ordinary moments feel monumental. Happy anniversary, my heart..."
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-[#7A5A63]">
                <span>Included complimentary with Medium & Large boxes</span>
                <span>Max 240 characters</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE MANIFESTO OF DILSY (Screenshot 5) */}
      <ManifestoSection />
    </div>
  );
};
