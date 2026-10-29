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
    <div className="min-h-screen bg-[#FCE7ED] text-[#3B2028] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'All Hampers' }]}
            onNavigate={onNavigate}
          />
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9F2343] bg-[#FFFAF8] px-3 py-1 rounded-full border border-[#F1C5D1] mb-2 shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-[#9F2343] text-[#9F2343]" />
              <span>Official Curations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3B2028] tracking-tight">
              All Hampers
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#79665C] font-light max-w-xl">
              Featuring our recommended Loved Box (Medium — ₹969) alongside our official Small Box (₹799) and Large Box (₹1,199).
            </p>
          </div>

          {/* Filtering & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-[#FFFAF8] rounded-xl border border-[#F1C5D1] shadow-2xs">
              {(['all', 'for-him', 'for-her', 'besties'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize cursor-pointer ${
                    activeFilter === cat
                      ? 'bg-[#9F2343] text-white font-semibold shadow-xs'
                      : 'text-[#79665C] hover:text-[#9F2343]'
                  }`}
                >
                  {cat === 'all' ? 'All Hampers' : cat.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 bg-[#FFFAF8] border border-[#F1C5D1] rounded-xl text-xs font-medium text-[#3B2028] focus:outline-none focus:ring-1 focus:ring-[#9F2343] cursor-pointer shadow-2xs"
              >
                <option value="default">Default Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid: Small Box ₹799, Loved Box ₹969 (ONCE!), Large Box ₹1,199 */}
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
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#FFFAF8] border border-[#F1C5D1] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1F4] border border-[#F1C5D1] flex items-center justify-center text-[#9F2343] shrink-0">
              <Sparkles className="w-6 h-6 fill-[#9F2343]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#3B2028]">
                Looking for a custom combination or specific budget?
              </h3>
              <p className="text-xs text-[#79665C] mt-0.5">
                Mix and match goodies, polaroid memories, scents, and keepsakes in our Hamper Studio.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/custom-hamper')}
            className="px-6 py-3 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
          >
            <span>Custom Hamper Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
