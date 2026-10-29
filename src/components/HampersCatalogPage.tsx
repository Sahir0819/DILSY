import React, { useState, useMemo } from 'react';
import { Product, ProductCustomisation } from '../types';
import { ProductCard } from './ProductCard';
import { Gift, ArrowUpDown, Sparkles, ArrowRight } from 'lucide-react';

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

  // Filter out unpublished and deduplicate by ID
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
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-[#3E101D] bg-white px-3.5 py-1.5 border border-[#EADBDB] mb-3">
          <Gift className="w-3.5 h-3.5 text-[#3E101D]" />
          <span>Official Hamper Range</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2A0D15] tracking-tight">
          Shop All Hampers
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#7A5A63] font-light leading-relaxed">
          Explore our official collection: Small Box (₹799), our signature Loved Box (Medium — ₹969), and the generous Large Box (₹1,199).
        </p>
      </div>

      {/* Filter & Sort Controls */}
      <div className="bg-white p-4 border border-[#EADBDB] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F5] border border-[#EADBDB] overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#3E101D] text-white font-semibold'
                : 'text-[#7A5A63] hover:text-[#3E101D]'
            }`}
          >
            All Sizes
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('for-her')}
            className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'for-her'
                ? 'bg-[#3E101D] text-white font-semibold'
                : 'text-[#7A5A63] hover:text-[#3E101D]'
            }`}
          >
            For Her
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('for-him')}
            className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'for-him'
                ? 'bg-[#3E101D] text-white font-semibold'
                : 'text-[#7A5A63] hover:text-[#3E101D]'
            }`}
          >
            For Him
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('besties')}
            className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === 'besties'
                ? 'bg-[#3E101D] text-white font-semibold'
                : 'text-[#7A5A63] hover:text-[#3E101D]'
            }`}
          >
            Besties
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto justify-end">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#7A5A63]" />
          <span className="text-xs uppercase tracking-wider text-[#7A5A63]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] outline-none cursor-pointer focus:border-[#3E101D]"
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
      <div className="p-6 bg-white border border-[#EADBDB] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FAF7F5] border border-[#EADBDB] flex items-center justify-center text-[#3E101D] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="font-serif text-base text-[#2A0D15]">Looking for custom add-ons or special treats?</p>
            <p className="text-xs text-[#7A5A63] font-light">Our studio builder lets you combine roses, gourmet treats, keychains, and polaroids.</p>
          </div>
        </div>
        <button
          onClick={onNavigateToCustomHamper}
          className="px-5 py-3 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
        >
          <span>Open Custom Builder</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
