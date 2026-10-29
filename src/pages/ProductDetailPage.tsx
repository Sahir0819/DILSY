import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Heart, ArrowLeft, Check, Sparkles, AlertCircle, Clock, Plus, Minus } from 'lucide-react';
import { Product, ProductCustomisation, AddOnItem, SelectedAddOn } from '../types';
import { ProductArtwork } from '../components/ProductArtwork';
import { AddOnThumbnail } from '../components/AddOnThumbnail';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../context/StoreContext';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (path: string) => void;
  onAddToCart: (product: Product, customisation: ProductCustomisation) => void;
  onOrderWhatsApp: (product: Product, customisation: ProductCustomisation) => void;
  activePromoText?: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onNavigate,
  onAddToCart,
  onOrderWhatsApp,
  activePromoText,
}) => {
  const { addons, calculateDiscount } = useStore();

  const [recipientChoice, setRecipientChoice] = useState<'For Him' | 'For Her'>('For Her');
  const [recipientName, setRecipientName] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const isComingSoon = product.stockStatus === 'coming_soon';
  const isPurchasable = !isOutOfStock && !isComingSoon;

  const handleToggleAddOn = (addon: AddOnItem) => {
    if (!addon.isAvailable) return;
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, { id: addon.id, name: addon.name, price: addon.price, quantity: 1 }];
      }
    });
  };

  const addOnsTotal = selectedAddOns.reduce((acc, a) => acc + a.price * a.quantity, 0);
  const subtotal = product.price + addOnsTotal;
  const { discountAmount, finalAmount, appliedOffer } = calculateDiscount(subtotal);

  const getCustomisation = (): ProductCustomisation => ({
    recipientName: recipientName.trim(),
    recipientChoice: product.allowRecipientChoice ? recipientChoice : undefined,
    personalNote: personalNote.trim(),
    specialInstructions: specialInstructions.trim(),
    selectedAddOns: selectedAddOns.length > 0 ? selectedAddOns : undefined,
  });

  const handleAdd = () => {
    if (!isPurchasable) return;
    onAddToCart(product, getCustomisation());
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!isPurchasable) return;
    onOrderWhatsApp(product, getCustomisation());
  };

  const availableAddons = addons.filter((a) => a.isAvailable);

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2A0D15] py-8 sm:py-12 animate-in fade-in-50 duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Breadcrumbs
            items={[
              { label: 'All Hampers', path: '/hampers' },
              { label: product.name },
            ]}
            onNavigate={onNavigate}
          />

          <button
            onClick={() => onNavigate('/hampers')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#FAF7F5] text-[#3E101D] text-xs font-medium border border-[#EADBDB] transition-colors cursor-pointer tracking-wide"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Catalog</span>
          </button>
        </div>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image / Artwork */}
          <div className="lg:col-span-6 bg-white p-4 sm:p-6 border border-[#EADBDB] sticky top-24">
            <div className="overflow-hidden border border-[#EADBDB] relative">
              {product.customImage ? (
                <div className="w-full aspect-[4/3] bg-[#FAF7F5] overflow-hidden">
                  <img
                    src={product.customImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <ProductArtwork type={product.illustrationType} />
              )}

              {/* Status Overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-[#2A0D15]/40 backdrop-blur-[1px] flex items-center justify-center p-4">
                  <span className="bg-[#3E101D] text-white text-xs font-semibold px-4 py-2 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Currently Out of Stock</span>
                  </span>
                </div>
              )}

              {isComingSoon && (
                <div className="absolute inset-0 bg-[#2A0D15]/40 backdrop-blur-[1px] flex items-center justify-center p-4">
                  <span className="bg-[#3E101D] text-white text-xs font-semibold px-4 py-2 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Coming Soon — Stay Tuned</span>
                  </span>
                </div>
              )}
            </div>

            {/* Packaging and Local Handover Notice */}
            <div className="mt-4 p-4 bg-[#FAF7F5] border border-[#EADBDB] space-y-1.5 text-xs text-[#7A5A63]">
              <div className="flex items-center gap-2 text-[#3E101D] font-medium tracking-wide">
                <Heart className="w-3.5 h-3.5 fill-[#3E101D]" />
                <span className="uppercase text-[11px] tracking-wider">Atelier Gifting Guarantee</span>
              </div>
              <p>
                <strong className="text-[#2A0D15]">Packaging:</strong> {product.packaging}
              </p>
              <p>
                <strong className="text-[#2A0D15]">Delivery:</strong> Handcrafted locally and delivered directly to Chandigarh University and nearby Mohali residences.
              </p>
            </div>
          </div>

          {/* Right Column: Information, Add-ons, Personalisation & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-6 sm:p-8 border border-[#EADBDB] space-y-6">
              {/* Product Header */}
              <div>
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  {product.badge && (
                    <span className="text-[10px] uppercase tracking-widest text-[#3E101D] font-semibold bg-[#FAF7F5] px-2.5 py-1 border border-[#EADBDB]">
                      {product.badge}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-wider font-medium text-[#7A5A63] bg-[#FAF7F5] px-2.5 py-1 border border-[#EADBDB]">
                    Size: {product.size}
                  </span>
                  {activePromoText && (
                    <span className="text-[10px] uppercase tracking-wider font-medium text-[#3E101D] bg-[#FAF7F5] px-2.5 py-1 border border-[#EADBDB]">
                      {activePromoText}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-serif text-[#2A0D15] leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-[#7A5A63] font-serif italic mt-1">
                  {product.tagline}
                </p>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-serif font-medium text-[#3E101D] tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#7A5A63] line-through tabular-nums">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs text-[#7A5A63]">Base edition</span>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-[#EADBDB] pt-4 text-sm text-[#2A0D15] font-light leading-relaxed space-y-2">
                <p>{product.description}</p>
                {product.idealFor && (
                  <p className="text-xs text-[#7A5A63]">
                    <strong className="text-[#2A0D15]">Ideal for:</strong> {product.idealFor}
                  </p>
                )}
              </div>

              {/* Recipient Option (if supported) */}
              {product.allowRecipientChoice && isPurchasable && (
                <div className="border-t border-[#EADBDB] pt-4">
                  <label className="block text-[11px] font-semibold text-[#2A0D15] mb-2 uppercase tracking-widest">
                    Who is this curation for?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRecipientChoice('For Her')}
                      className={`py-2.5 px-3 text-xs uppercase tracking-wider font-medium border transition-all cursor-pointer ${
                        recipientChoice === 'For Her'
                          ? 'bg-[#3E101D] text-white border-[#3E101D]'
                          : 'bg-white text-[#2A0D15] border-[#EADBDB] hover:border-[#3E101D]'
                      }`}
                    >
                      For Her
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecipientChoice('For Him')}
                      className={`py-2.5 px-3 text-xs uppercase tracking-wider font-medium border transition-all cursor-pointer ${
                        recipientChoice === 'For Him'
                          ? 'bg-[#3E101D] text-white border-[#3E101D]'
                          : 'bg-white text-[#2A0D15] border-[#EADBDB] hover:border-[#3E101D]'
                      }`}
                    >
                      For Him
                    </button>
                  </div>
                </div>
              )}

              {/* Available Add-Ons Selector */}
              {isPurchasable && availableAddons.length > 0 && (
                <div className="border-t border-[#EADBDB] pt-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-[11px] font-semibold text-[#2A0D15] uppercase tracking-widest">
                      Curated Keepsake Add-ons (Optional)
                    </label>
                    <span className="text-[11px] text-[#7A5A63]">
                      {selectedAddOns.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
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
                          <AddOnThumbnail type={addon.illustrationType} className="w-10 h-10 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#2A0D15] truncate">
                              {addon.name}
                            </p>
                            <p className="text-[11px] text-[#3E101D] font-semibold tabular-nums">
                              +₹{addon.price}
                            </p>
                          </div>
                          <div className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#3E101D] border-[#3E101D] text-white' : 'border-[#EADBDB]'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Personalisation Fields */}
              {isPurchasable && (
                <div className="border-t border-[#EADBDB] pt-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3E101D] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#3E101D]" />
                    <span>Complimentary Wax-Sealed Calligraphy Note</span>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-medium text-[#7A5A63] mb-1">
                      Recipient's Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Ananya, Kabir..."
                      className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:border-[#3E101D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-medium text-[#7A5A63] mb-1">
                      Personal Message (Inscribed by Hand)
                    </label>
                    <textarea
                      rows={3}
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                      placeholder="Write the message you'd like us to inscribe on the textured card..."
                      className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:border-[#3E101D] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Price Breakdown & Actions */}
              <div className="border-t border-[#EADBDB] pt-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-serif text-[#2A0D15] text-base">Estimated Total:</span>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-medium text-[#3E101D] tabular-nums">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                    {addOnsTotal > 0 && (
                      <span className="block text-[11px] text-[#7A5A63]">
                        (Base ₹{product.price} + Add-ons ₹{addOnsTotal})
                      </span>
                    )}
                  </div>
                </div>

                {isOutOfStock ? (
                  <div className="p-4 bg-[#FAF7F5] border border-[#EADBDB] text-[#7A5A63] text-xs text-center font-medium">
                    This hamper is currently out of stock. Please message us on WhatsApp or choose another box.
                  </div>
                ) : isComingSoon ? (
                  <div className="p-4 bg-[#FAF7F5] border border-[#EADBDB] text-[#3E101D] text-xs text-center font-medium">
                    This hamper is coming soon. Stay tuned!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="py-3.5 px-4 bg-white hover:bg-[#FAF7F5] border border-[#3E101D] text-[#3E101D] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {addedAnimation ? (
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
                      onClick={handleWhatsApp}
                      className="py-3.5 px-4 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                      <span>Order on WhatsApp</span>
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-center text-[#7A5A63] font-light">
                  Final contents, packaging details, and handover times are confirmed with our concierge on WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
