import React, { useState, useMemo } from 'react';
import { Product, ProductCustomisation } from '../types';
import { ProductCard } from './ProductCard';
import { Gift, Heart, ArrowUpDown, Filter, Sparkles, ArrowRight } from 'lucide-react';

interface HampersCatalogPageProps {
  products: Product[];
  onAddToCart: (product: Product, customisation: ProductCustomisation) => void;
  onOrderWhatsApp: (product: Product, customisation: ProductCustomisation) => void;
  onViewProductDetails: (productId: string) => void;
  onNavigateToCustomHamper: () => void;
  activePromoText?: string;
}

export const HampersCatalogPage: React.FC<HampersCatalogPageProps> = ({
  products,
  onAddToCart,
  onOrderWhatsApp,
  onViewProductDetails,
  onNavigateToCustomHamper,
  activePromoText,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'for-her' | 'for-him' | 'besties'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Filter out unpublished and deduplicate by ID so Loved Box is displayed only ONCE
  const publishedProducts = useMemo(() => {
    const list = products.filter((p) => p.stockStatus !== 'unpublished');
    const seen = new Set<string>();
    const unique: Product[] = [];
    for (const p of list) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        unique.push(p);
      }
    }
    return unique;
  }, [products]);

  // Filter by category
  const filteredProducts = useMemo(() => {
    let result = publishedProducts.filter((p) => {
      if (selectedCategory === 'all') return true;
      return p.categories.includes(selectedCategory);
    });

    // Sort by price
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [publishedProducts, selectedCategory, sortBy]);

  return (
    <div className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#9F2343] bg-[#FFFAF8] px-3.5 py-1.5 rounded-full border border-[#F1C5D1] shadow-2xs mb-3">
          <Gift className="w-3.5 h-3.5 text-[#9F2343]" />
          <span>Official Hamper Range</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#3B2028] tracking-tight">
          Shop All Hampers
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#795A63] font-light leading-relaxed">
          Explore our official collection: Small Box (₹799), our signature Loved Box (Medium — ₹969), and the generous Large Box (₹1,199).
        </p>
      </div>

      {/* Filter & Sort Controls */}
      <div className="bg-[#FFFAF8] p-4 rounded-2xl border border-[#F1C5D1] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FFF1F4] rounded-xl border border-[#F1C5D1] overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#9F2343] text-white shadow-xs font-semibold'
                : 'text-[#795A63] hover:text-[#9F2343]'
            }`}
          >
            All Sizes
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('for-her')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'for-her'
                ? 'bg-[#9F2343] text-white shadow-xs font-semibold'
                : 'text-[#795A63] hover:text-[#9F2343]'
            }`}
          >
            For Her
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('for-him')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'for-him'
                ? 'bg-[#9F2343] text-white shadow-xs font-semibold'
                : 'text-[#795A63] hover:text-[#9F2343]'
            }`}
          >
            For Him
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('besties')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'besties'
                ? 'bg-[#9F2343] text-white shadow-xs font-semibold'
                : 'text-[#795A63] hover:text-[#9F2343]'
            }`}
          >
            Besties
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto justify-end">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#795A63]" />
          <span className="text-xs text-[#795A63]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-lg text-xs text-[#3B2028] outline-none cursor-pointer focus:ring-1 focus:ring-[#9F2343]"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onOrderWhatsApp={onOrderWhatsApp}
            onViewDetails={(prod) => onViewProductDetails(prod.id)}
            activePromoText={activePromoText}
          />
        ))}
      </div>

      {/* Custom Studio Banner */}
      <div className="p-6 rounded-2xl bg-[#FFFAF8] border border-[#F1C5D1] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm shadow-[#72172F]/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFF1F4] border border-[#F1C5D1] flex items-center justify-center text-[#9F2343] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="font-serif font-bold text-base text-[#3B2028]">Looking for custom add-ons or special treats?</p>
            <p className="text-xs text-[#795A63]">Our studio builder lets you combine roses, gourmet treats, keychains, and polaroids.</p>
          </div>
        </div>
        <button
          onClick={onNavigateToCustomHamper}
          className="px-5 py-2.5 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>Open Custom Builder</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
