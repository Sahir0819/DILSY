import React from 'react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
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
  activePromoText,
}) => {
  // Only published products
  const publishedProducts = products.filter((p) => p.stockStatus !== 'unpublished');

  // Official base box configurations (fallback metadata)
  const smallBox =
    publishedProducts.find((p) => p.id === 'the-little-affair') || publishedProducts[0];
  const mediumBox =
    publishedProducts.find((p) => p.id === 'loved-box') || publishedProducts[1] || smallBox;
  const largeBox =
    publishedProducts.find((p) => p.id === 'the-everything-box') || publishedProducts[2] || mediumBox;

  // Fixed Signature Collection for Timeless Sentiments with canonical collection identity
  const curatedEditions = [
    {
      baseProduct: mediumBox,
      collectionId: 'i-love-you-for-her',
      slug: 'i-love-you-for-her',
      title: 'I Love You — For Her',
      size: 'Medium' as const,
      badge: 'ROMANTIC',
      image: '/assets/images/product-for-her.jpg',
      description:
        'Thoughtfully styled romantic keepsakes, sweet treats, and a wax-sealed handwritten card made to make her feel deeply loved.',
      price: 969,
    },
    {
      baseProduct: largeBox,
      collectionId: 'birthday',
      slug: 'birthday',
      title: 'Birthday Box',
      size: 'Large' as const,
      badge: 'CELEBRATION',
      image: '/assets/images/product-birthday-box.jpg',
      description:
        'Generously curated birthday surprises with celebratory keepsakes, sweet indulgences, and a personal birthday wish.',
      price: 1199,
    },
    {
      baseProduct: smallBox,
      collectionId: 'apology-box',
      slug: 'apology',
      title: 'Apology Box',
      size: 'Small' as const,
      badge: 'HEARTFELT GESTURE',
      image: '/assets/images/theme-comfort.jpg',
      description:
        'A quiet, sincere gesture with thoughtful details and a handwritten card to say what words sometimes struggle to.',
      price: 799,
    },
    {
      baseProduct: mediumBox,
      collectionId: 'anniversary',
      slug: 'anniversary',
      title: 'Anniversary Box',
      size: 'Medium' as const,
      badge: 'BESPOKE KEEPSAKE',
      image: '/assets/images/product-anniversary-box.jpg',
      description:
        'Celebrate your milestones and shared memories with timeless keepsakes, warm details, and a wax-sealed note.',
      price: 969,
    },
  ];

  return (
    <div className="bg-[#FAF7F5] text-[#2A0D15]">
      {/* 1. EDITORIAL HERO SECTION */}
      <Hero
        onExploreHampers={() => onNavigate('/hampers')}
        onCreateYourOwn={() => onNavigate('/custom-hamper')}
      />

      {/* 2. SIGNATURE COLLECTION: Timeless Sentiments */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#EADBDB]">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5A63] mb-2">
              Signature Collection
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#2A0D15] tracking-tight">
              Timeless Sentiments
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/hampers')}
            className="text-[11px] uppercase tracking-[0.18em] font-sans font-medium text-[#2A0D15] hover:text-[#4A1423] pb-1 border-b border-[#2A0D15] hover:border-[#4A1423] self-start sm:self-auto transition-colors cursor-pointer"
          >
            View All Editions ({themes.length})
          </button>
        </div>

        {/* 4-Column Fixed Signature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {curatedEditions.map((edition) => {
            const product = edition.baseProduct;
            if (!product) return null;

            const signatureProduct: Product = {
              ...product,
              id: edition.collectionId,
              collectionId: edition.collectionId,
              name: edition.title,
              size: edition.size,
              description: edition.description,
              customImage: edition.image,
              price: edition.price,
              allowRecipientChoice: false,
            };

            return (
              <ProductCard
                key={edition.collectionId}
                product={signatureProduct}
                badgeLabel={edition.badge}
                isSignatureEdition={true}
                onAddToCart={onAddToCart}
                onOrderWhatsApp={onOrderWhatsApp}
                onViewDetails={() => onNavigate(`/collections/${edition.slug}`)}
                activePromoText={activePromoText}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};
