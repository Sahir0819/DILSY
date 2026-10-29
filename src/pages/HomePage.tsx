import React from 'react';
import { ArrowRight, Sparkles, Heart, Package, Feather, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { ThemeArtwork } from '../components/ThemeArtwork';
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
  // Show popular themes (3-4 themes for a clean, concise homepage)
  const popularThemes = themes.slice(0, 4);

  // Available products for the featured section (only 1 Loved Box!)
  const publishedProducts = products.filter((p) => p.stockStatus !== 'unpublished');

  return (
    <div className="bg-[#FCE7ED] text-[#3B2028]">
      {/* 1. Concise Hero Section */}
      <Hero
        onExploreHampers={() => onNavigate('/hampers')}
        onCreateYourOwn={() => onNavigate('/custom-hamper')}
      />

      {/* 2. Shop by Occasion (Featured Themes Preview) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#F1C5D1]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9F2343] bg-[#FFFAF8] px-3 py-1 rounded-full border border-[#F1C5D1] mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 fill-[#9F2343] text-[#9F2343]" />
              <span>Occasion Collections</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#3B2028] tracking-tight">
              Shop by Occasion
            </h2>
            <p className="mt-1 text-sm text-[#79665C] font-light max-w-xl">
              Curated gift boxes tailored for birthdays, romantic gestures, anniversaries, and gentle comfort.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/themes')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFFAF8] hover:bg-[#FFF1F4] text-[#9F2343] rounded-xl text-xs font-semibold border border-[#F1C5D1] transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            <span>View All 9 Themes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Grid of 4 popular theme cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularThemes.map((theme) => (
            <div
              key={theme.id}
              onClick={() => onNavigate(`/collections/${theme.slug || theme.id}`)}
              className="bg-[#FFFAF8] rounded-2xl border border-[#F1C5D1] hover:border-[#9F2343] overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#FFF1F4]">
                  {theme.coverImage ? (
                    <img
                      src={theme.coverImage}
                      alt={theme.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ThemeArtwork themeId={theme.id} />
                  )}

                  <div className="absolute top-2.5 left-2.5 bg-[#FFFAF8]/95 px-2.5 py-0.5 rounded-full border border-[#F1C5D1] text-[10px] font-semibold text-[#9F2343]">
                    {theme.badge}
                  </div>

                  {theme.isComingSoon && (
                    <div className="absolute top-2.5 right-2.5 bg-[#72172F] text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider">
                      COMING SOON
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-serif font-bold text-lg text-[#3B2028] group-hover:text-[#9F2343] transition-colors">
                    {theme.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#79665C] line-clamp-2 leading-relaxed">
                    {theme.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#9F2343] group-hover:text-[#72172F]">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Hamper Section (Small Box ₹799, Loved Box ₹969, Large Box ₹1,199) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#F1C5D1]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9F2343] bg-[#FFFAF8] px-3 py-1 rounded-full border border-[#F1C5D1] mb-2 shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-[#9F2343] text-[#9F2343]" />
              <span>Official Curations</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#3B2028] tracking-tight">
              Curated Gift Hampers
            </h2>
            <p className="mt-1 text-sm text-[#79665C] font-light max-w-xl">
              From our compact Small Box (₹799) to our signature Loved Box (₹969) and generous Large Box (₹1,199).
            </p>
          </div>

          <button
            onClick={() => onNavigate('/hampers')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
          >
            <span>Shop All Hampers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {publishedProducts.map((product) => (
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
      </section>

      {/* 4. How It Works (Short 3-Step Section) */}
      <section className="py-16 bg-[#FFF1F4] border-t border-b border-[#F1C5D1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9F2343]">
              Simple & Personal
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#3B2028] mt-1">
              How DILSY Gifting Works
            </h2>
            <p className="text-sm text-[#79665C] mt-2 font-light">
              We make campus surprises and heartfelt gifting seamless and personal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FFFAF8] p-6 rounded-2xl border border-[#F1C5D1] shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF1F4] border border-[#F1C5D1] text-[#9F2343] flex items-center justify-center font-serif font-bold text-xl mx-auto">
                1
              </div>
              <h3 className="font-serif font-bold text-lg text-[#3B2028]">
                Choose or Customise
              </h3>
              <p className="text-xs text-[#79665C] leading-relaxed">
                Select from our curated occasion hampers (₹799–₹1,199) or build your custom box with your preferred budget and treats.
              </p>
            </div>

            <div className="bg-[#FFFAF8] p-6 rounded-2xl border border-[#F1C5D1] shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF1F4] border border-[#F1C5D1] text-[#9F2343] flex items-center justify-center font-serif font-bold text-xl mx-auto">
                2
              </div>
              <h3 className="font-serif font-bold text-lg text-[#3B2028]">
                Add Your Personal Touch
              </h3>
              <p className="text-xs text-[#79665C] leading-relaxed">
                Share your personal words for a handwritten greeting card, add Polaroid photos, sweet treats, and tell us who it's for.
              </p>
            </div>

            <div className="bg-[#FFFAF8] p-6 rounded-2xl border border-[#F1C5D1] shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFF1F4] border border-[#F1C5D1] text-[#9F2343] flex items-center justify-center font-serif font-bold text-xl mx-auto">
                3
              </div>
              <h3 className="font-serif font-bold text-lg text-[#3B2028]">
                WhatsApp Confirmation & Delivery
              </h3>
              <p className="text-xs text-[#79665C] leading-relaxed">
                We review contents and timing on WhatsApp, handcraft your hamper, and deliver directly to Chandigarh University and Mohali PGs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Brand Introduction Card */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFAF8] p-8 sm:p-12 rounded-3xl border border-[#F1C5D1] shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9F2343] bg-[#FFF1F4] px-3 py-1 rounded-full border border-[#F1C5D1]">
              <Heart className="w-3.5 h-3.5 fill-[#9F2343] text-[#9F2343]" />
              <span>Our Philosophy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3B2028]">
              "We don't just put items in a box. We preserve feelings that deserve to be felt."
            </h2>
            <p className="text-sm text-[#79665C] font-light leading-relaxed">
              Every DILSY box is handcrafted with love in Mohali. Whether near Chandigarh University or sending a surprise from miles away, your gesture arrives with sincere care.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigate('/our-story')}
              className="px-6 py-3 bg-[#FFFAF8] hover:bg-[#FFF1F4] text-[#9F2343] border border-[#F1C5D1] rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              Read Our Story
            </button>
            <button
              onClick={() => onNavigate('/custom-hamper')}
              className="px-6 py-3 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer text-center"
            >
              Create a Hamper
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
