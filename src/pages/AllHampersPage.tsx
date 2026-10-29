import React, { useState } from 'react';
import { Heart, ArrowUpDown, Filter, Sparkles, ArrowRight } from 'lucide-react';
import { Product, ProductCustomisation } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface AllHampersPageProps {
  products: Product[];
  onNavigate: (path: string) => void;
  onAddToCart: (product: Product, customisation: ProductCustomisation) => void;
  onOrderWhatsApp: (product: Product, customisation: ProductCustomisation) => void;
  onViewProductDetails: (product: Product) => void;
  activePromoText?: string;
}

export const AllHampersPage: React.FC<AllHampersPageProps> = ({
  products,
  onNavigate,
  onAddToCart,
  onOrderWhatsApp,
  onViewProductDetails,
  activePromoText,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'for-him' | 'for-her' | 'besties'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Filter out unpublished if any
  const publishedProducts = products.filter((p) => p.stockStatus !== 'unpublished');

  // Filter by category
  let displayed = publishedProducts.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.categories.includes(activeFilter);
  });

  // Sort by price
  if (sortBy === 'price-asc') {
    displayed = [...displayed].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    displayed = [...displayed].sort((a, b) => b.price - a.price);
  }

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
              Featuring our signature Loved Box (Medium — ₹969) alongside our official Small Box (₹799) and Large Box (₹1,199).
            </p>
          </div>

          {/* Filtering & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-white border border-[#EADBDB]">
              {(['all', 'for-him', 'for-her', 'besties'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-sans tracking-wide uppercase transition-colors cursor-pointer ${
                    activeFilter === cat
                      ? 'bg-[#3E101D] text-white font-medium'
                      : 'text-[#6E565D] hover:text-[#2A0D15]'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-white border border-[#EADBDB] text-xs font-sans text-[#2A0D15] focus:outline-none cursor-pointer"
              >
                <option value="default">Default Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayed.map((product) => (
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
