import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Heart,
  ArrowRight,
  Clock,
  ShoppingBag,
  MessageCircle,
  Check,
  Plus,
} from 'lucide-react';
import {
  BoxSize,
  ThemeCategory,
  Product,
  ProductCustomisation,
  AddOnItem,
  SelectedAddOn,
} from '../types';
import { THEME_CATEGORIES, getAvailableSizesForTheme } from '../data/themes';
import { ThemeArtwork } from './ThemeArtwork';
import { ProductCard } from './ProductCard';
import { Breadcrumbs } from './Breadcrumbs';
import { AddOnThumbnail } from './AddOnThumbnail';
import { useStore } from '../context/StoreContext';
import {
  BOX_SIZE_DIMENSIONS,
  GENERIC_BOX_PRODUCT_IDS,
  getCollectionDefaultImage,
  getOfficialBoxPrice,
} from '../utils/cart';

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
  const { addons, activeOffer } = useStore();
  const availableSizes = getAvailableSizesForTheme(collection);

  const [selectedSize, setSelectedSize] = useState<BoxSize>(availableSizes[0] || 'Small');
  const [recipientName, setRecipientName] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);
  const [showAddOns, setShowAddOns] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Reset selected size when switching collections so unavailable sizes are never stale
  useEffect(() => {
    const nextSizes = getAvailableSizesForTheme(collection);
    setSelectedSize(nextSizes[0] || 'Small');
    setAddedFeedback(false);
  }, [collection]);

  const effectiveSize: BoxSize = availableSizes.includes(selectedSize)
    ? selectedSize
    : availableSizes[0] || 'Small';

  const basePrice = getOfficialBoxPrice(effectiveSize);
  const addOnsTotal = selectedAddOns.reduce((acc, a) => acc + a.price * a.quantity, 0);
  const estimatedSubtotal = basePrice + addOnsTotal;

  const availableAddons = addons.filter((a) => a.isAvailable);

  const handleToggleAddOn = (addon: AddOnItem) => {
    if (!addon.isAvailable) return;
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      }
      return [...prev, { id: addon.id, name: addon.name, price: addon.price, quantity: 1 }];
    });
  };

  // Build unified hamper variant Product preserving collection identity and hamper name
  const buildHamperVariantProduct = (): Product => ({
    id: collection.id,
    collectionId: collection.id,
    name: collection.name,
    size: effectiveSize,
    availableSizes,
    tagline: collection.heroHeadline || collection.description,
    price: basePrice,
    description: collection.description,
    badge: collection.badge,
    categories: ['all'],
    themeIds: [collection.id],
    idealFor: collection.visualDirection,
    packaging: collection.visualDirection || 'Thoughtfully styled gift box with satin ribbon and personal handwritten card.',
    accentColor: '#3E101D',
    illustrationType:
      effectiveSize === 'Small'
        ? 'little-affair'
        : effectiveSize === 'Large'
        ? 'everything-box'
        : 'loved-box',
    customImage: collection.coverImage || getCollectionDefaultImage(collection.id),
    stockStatus: 'available',
    allowRecipientChoice: false,
  });

  const buildCustomisation = (): ProductCustomisation => ({
    recipientName: recipientName.trim(),
    personalNote: personalNote.trim(),
    specialInstructions: specialInstructions.trim(),
    selectedAddOns: selectedAddOns.length > 0 ? selectedAddOns : undefined,
  });

  const handleAddHamperToBag = () => {
    if (collection.isComingSoon) return;
    onAddToCart(buildHamperVariantProduct(), buildCustomisation());
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleOrderHamperWhatsApp = () => {
    if (collection.isComingSoon) return;
    onOrderWhatsApp(buildHamperVariantProduct(), buildCustomisation());
  };

  // Custom non-generic admin products explicitly assigned to this collection (excluding generic Small/Medium/Large Box)
  const customAssignedProducts = allProducts.filter(
    (product) =>
      !GENERIC_BOX_PRODUCT_IDS.has(product.id) &&
      (collection.linkedProductIds.includes(product.id) ||
        (product.themeIds && product.themeIds.includes(collection.id)))
  );

  // Related collections
  const relatedCollections = (collection.relatedThemeIds || [])
    .map((id) => THEME_CATEGORIES.find((t) => t.id === id || t.slug === id))
    .filter(Boolean) as ThemeCategory[];

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2A0D15] py-8 sm:py-12 animate-in fade-in-50 duration-300">
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
            onClick={() => onNavigate('/hampers')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#FAF7F5] text-[#3E101D] text-xs font-medium border border-[#EADBDB] transition-colors cursor-pointer tracking-wide"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Explore All Hampers</span>
          </button>
        </div>

        {/* Occasion Hero Header Banner */}
        <div className="mb-12 p-6 sm:p-10 bg-white border border-[#EADBDB] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#3E101D] bg-[#FAF7F5] px-2.5 py-1 border border-[#EADBDB]">
                  {collection.badge}
                </span>
                {collection.isComingSoon && (
                  <span className="text-[10px] font-semibold text-white bg-[#3E101D] px-2.5 py-0.5 uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Coming Soon</span>
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2A0D15] tracking-tight">
                {collection.name}
              </h1>

              <p className="text-base sm:text-lg text-[#7A5A63] font-light leading-relaxed">
                "{collection.description}"
              </p>

              {collection.heroHeadline && (
                <p className="text-sm font-serif italic text-[#3E101D]">
                  {collection.heroHeadline}
                </p>
              )}

              {collection.heroStory && (
                <p className="text-xs sm:text-sm text-[#7A5A63] font-light leading-relaxed max-w-xl">
                  {collection.heroStory}
                </p>
              )}

              {/* Coming Soon notice for For Him, otherwise Customise link */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {collection.isComingSoon ? (
                  <div className="p-3.5 bg-[#FAF7F5] text-[#3E101D] border border-[#EADBDB] text-xs font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#3E101D]" />
                    <span>
                      {collection.comingSoonMessage ||
                        'Something special for him is on its way. Stay tuned!'}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      onNavigate(`/custom-hamper?occasion=${encodeURIComponent(collection.name)}`)
                    }
                    className="px-5 py-3 bg-[#FAF7F5] hover:bg-[#F5ECE7] text-[#3E101D] border border-[#EADBDB] text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-[#3E101D]" />
                    <span>Open Bespoke Studio for {collection.name}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Cover Artwork */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden border border-[#EADBDB] bg-[#FAF7F5]">
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

        {/* Collection Hamper Size Selector & Ordering Section */}
        <div className="mb-14">
          {collection.isComingSoon ? (
            <div className="p-8 sm:p-12 bg-white border border-[#EADBDB] text-center space-y-4 max-w-xl mx-auto">
              <div className="w-12 h-12 bg-[#FAF7F5] border border-[#EADBDB] text-[#3E101D] flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-serif text-[#2A0D15]">Coming Soon</h2>
              <p className="text-xs text-[#7A5A63] leading-relaxed font-light">
                We are curating refined goodies and gifts specifically designed for him. Ordering
                for this collection will be enabled once inventory is ready!
              </p>
              <button
                onClick={() => onNavigate('/hampers')}
                className="px-5 py-2.5 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
              >
                Browse Other Available Occasions
              </button>
            </div>
          ) : (
            <div className="bg-white border border-[#EADBDB] p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Selected Hamper Visual & Gifting Tips */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="overflow-hidden border border-[#EADBDB] bg-[#FAF7F5]">
                    {collection.coverImage || getCollectionDefaultImage(collection.id) ? (
                      <img
                        src={collection.coverImage || getCollectionDefaultImage(collection.id)}
                        alt={collection.name}
                        className="w-full aspect-[4/3] object-cover"
                      />
                    ) : (
                      <ThemeArtwork themeId={collection.id} />
                    )}
                  </div>

                  {collection.giftingTips && collection.giftingTips.length > 0 && (
                    <div className="p-4 bg-[#FAF7F5] border border-[#EADBDB] space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#3E101D]">
                        Curation Notes
                      </p>
                      <ul className="space-y-1.5 text-xs text-[#7A5A63] font-light">
                        {collection.giftingTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#3E101D] mt-0.5">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right: Variant Size Selector, Personalisation & Cart/WhatsApp Actions */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#3E101D] bg-[#FAF7F5] px-2.5 py-1 border border-[#EADBDB]">
                        {collection.badge}
                      </span>
                      {activeOffer && (
                        <span className="text-[10px] uppercase tracking-wider font-medium text-[#3E101D] bg-[#FAF7F5] px-2.5 py-1 border border-[#EADBDB]">
                          {activeOffer.badgeText || activeOffer.code}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif text-[#2A0D15]">
                      {collection.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#7A5A63] font-light mt-1.5 leading-relaxed">
                      {collection.description}
                    </p>
                  </div>

                  {/* Select Available Box Size Variant */}
                  <div className="pt-4 border-t border-[#EADBDB] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2A0D15]">
                        Select Box Size
                      </label>
                      <span className="text-[11px] text-[#7A5A63]">
                        {availableSizes.length === 1
                          ? `${availableSizes[0]} edition only`
                          : `${availableSizes.length} sizes available`}
                      </span>
                    </div>

                    <div
                      className={`grid gap-3 ${
                        availableSizes.length === 1
                          ? 'grid-cols-1 max-w-xs'
                          : availableSizes.length === 2
                          ? 'grid-cols-2'
                          : 'grid-cols-1 sm:grid-cols-3'
                      }`}
                    >
                      {availableSizes.map((size) => {
                        const isSelected = effectiveSize === size;
                        const sizePrice = getOfficialBoxPrice(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`p-4 border text-left transition-all cursor-pointer relative ${
                              isSelected
                                ? 'border-2 border-[#3E101D] bg-[#FAF7F5]'
                                : 'border-[#EADBDB] bg-white hover:border-[#3E101D]/60'
                            }`}
                          >
                            {isSelected && (
                              <span className="absolute top-2 right-2 w-4 h-4 bg-[#3E101D] text-white flex items-center justify-center text-[10px]">
                                ✓
                              </span>
                            )}
                            <span className="block font-serif text-lg text-[#2A0D15]">
                              {size}
                            </span>
                            <span className="block text-[10px] text-[#7A5A63] mt-0.5">
                              {BOX_SIZE_DIMENSIONS[size]}
                            </span>
                            <span className="block text-sm font-semibold text-[#3E101D] mt-2 tabular-nums">
                              ₹{sizePrice.toLocaleString('en-IN')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Keepsake Add-ons */}
                  {availableAddons.length > 0 && (
                    <div className="pt-4 border-t border-[#EADBDB] space-y-3">
                      <button
                        type="button"
                        onClick={() => setShowAddOns((prev) => !prev)}
                        className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-[0.15em] text-[#3E101D] cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5" />
                          <span>
                            Optional Keepsake Add-ons{' '}
                            {selectedAddOns.length > 0 ? `(${selectedAddOns.length} selected)` : ''}
                          </span>
                        </span>
                        <span className="text-[11px] font-normal underline">
                          {showAddOns ? 'Hide' : 'Select Add-ons'}
                        </span>
                      </button>

                      {showAddOns && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                          {availableAddons.slice(0, 6).map((addon) => {
                            const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                            return (
                              <div
                                key={addon.id}
                                onClick={() => handleToggleAddOn(addon)}
                                className={`p-2.5 border flex items-center gap-2.5 cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-[#FAF7F5] border-[#3E101D]'
                                    : 'bg-white border-[#EADBDB] hover:border-[#3E101D]'
                                }`}
                              >
                                <AddOnThumbnail
                                  type={addon.illustrationType}
                                  className="w-9 h-9 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-[#2A0D15] truncate">
                                    {addon.name}
                                  </p>
                                  <p className="text-[11px] text-[#3E101D] font-semibold tabular-nums">
                                    +₹{addon.price}
                                  </p>
                                </div>
                                <div
                                  className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'bg-[#3E101D] border-[#3E101D] text-white'
                                      : 'border-[#EADBDB]'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Personalisation Note Fields */}
                  <div className="pt-4 border-t border-[#EADBDB] space-y-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3E101D] uppercase tracking-[0.15em]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Personalise Handwritten Card (Optional)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Recipient's Name (optional)"
                        className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                      />
                      <input
                        type="text"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Special request or ribbon note (optional)"
                        className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                      placeholder="Write your heartfelt message to be handwritten on cotton cardstock..."
                      className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                    />
                  </div>

                  {/* Price Summary & Action Buttons */}
                  <div className="pt-4 border-t border-[#EADBDB] space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs uppercase tracking-[0.16em] text-[#7A5A63] block">
                          {collection.name} · Size: {effectiveSize}
                        </span>
                        {addOnsTotal > 0 && (
                          <span className="text-[11px] text-[#7A5A63]">
                            Base ₹{basePrice.toLocaleString('en-IN')} + Add-ons ₹
                            {addOnsTotal.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-2xl sm:text-3xl font-serif font-medium text-[#3E101D] tabular-nums">
                        ₹{estimatedSubtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={handleAddHamperToBag}
                        className="py-3.5 px-4 bg-white hover:bg-[#FAF7F5] border border-[#3E101D] text-[#3E101D] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        {addedFeedback ? (
                          <>
                            <Check className="w-4 h-4 text-[#3E101D]" />
                            <span>Added to Bag</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4 text-[#3E101D]" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleOrderHamperWhatsApp}
                        className="py-3.5 px-4 bg-[#3E101D] hover:bg-[#2A0B13] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 text-white" />
                        <span>Order on WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Non-Generic Admin Products Linked to This Collection (if any) */}
        {!collection.isComingSoon && customAssignedProducts.length > 0 && (
          <div className="mb-14">
            <div className="mb-6">
              <h3 className="text-xl font-serif text-[#2A0D15]">
                Special Editions for {collection.name}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {customAssignedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onOrderWhatsApp={onOrderWhatsApp}
                  onViewDetails={onViewProductDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* Related Collections Section */}
        {relatedCollections.length > 0 && (
          <div className="pt-8 border-t border-[#EADBDB]">
            <h3 className="text-xl font-serif text-[#2A0D15] mb-6">You Might Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedCollections.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onNavigate(`/collections/${rel.slug || rel.id}`)}
                  className="p-4 bg-white hover:bg-[#FAF7F5] border border-[#EADBDB] hover:border-[#3E101D] text-left transition-all group cursor-pointer"
                >
                  <span className="text-[10px] font-semibold text-[#3E101D] uppercase tracking-widest block mb-1">
                    {rel.badge}
                  </span>
                  <h4 className="font-serif text-base text-[#2A0D15] group-hover:text-[#3E101D] transition-colors">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-[#7A5A63] line-clamp-1 mt-1 font-light">
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
