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
    <div className="min-h-screen bg-[#FCE7ED] text-[#3B2028] py-8 sm:py-12 animate-in fade-in-50 duration-300">
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFFAF8] hover:bg-[#FFF1F4] text-[#9F2343] rounded-xl text-xs font-semibold border border-[#F1C5D1] shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Hampers</span>
          </button>
        </div>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image / Artwork */}
          <div className="lg:col-span-6 bg-[#FFFAF8] p-4 sm:p-6 rounded-3xl border border-[#F1C5D1] shadow-xs sticky top-24">
            <div className="rounded-2xl overflow-hidden border border-[#F1C5D1] relative">
              {product.customImage ? (
                <div className="w-full aspect-[4/3] bg-[#FFF1F4] overflow-hidden">
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
                <div className="absolute inset-0 bg-[#3B2028]/40 backdrop-blur-[1px] flex items-center justify-center p-4">
                  <span className="bg-[#991B1B] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Currently Out of Stock</span>
                  </span>
                </div>
              )}

              {isComingSoon && (
                <div className="absolute inset-0 bg-[#3B2028]/40 backdrop-blur-[1px] flex items-center justify-center p-4">
                  <span className="bg-[#9F2343] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Coming Soon — Stay Tuned</span>
                  </span>
                </div>
              )}
            </div>

            {/* Packaging and Local Handover Notice */}
            <div className="mt-4 p-4 bg-[#FFF1F4] rounded-2xl border border-[#F1C5D1] space-y-1.5 text-xs text-[#79665C]">
              <div className="flex items-center gap-2 text-[#9F2343] font-semibold">
                <Heart className="w-3.5 h-3.5 fill-[#9F2343]" />
                <span>Handcrafted Gifting Guarantee</span>
              </div>
              <p>
                <strong>Packaging:</strong> {product.packaging}
              </p>
              <p>
                <strong>Delivery:</strong> Handcrafted locally and delivered directly to Chandigarh University and nearby Mohali PGs.
              </p>
            </div>
          </div>

          {/* Right Column: Information, Add-ons, Personalisation & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#FFFAF8] p-6 sm:p-8 rounded-3xl border border-[#F1C5D1] shadow-xs space-y-6">
              {/* Product Header */}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {product.badge && (
                    <span className="text-xs uppercase tracking-wider text-[#9F2343] font-bold bg-[#FFF1F4] px-3 py-1 rounded-full border border-[#F1C5D1]">
                      {product.badge}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-[#3B2028] bg-[#FFF1F4] px-2.5 py-1 rounded-full border border-[#F1C5D1]">
                    Size: {product.size}
                  </span>
                  {activePromoText && (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {activePromoText}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-serif font-bold text-[#3B2028]">
                  {product.name}
                </h1>
                <p className="text-xs text-[#79665C] font-serif italic mt-0.5">
                  {product.tagline}
                </p>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-serif font-bold text-[#9F2343] tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#79665C] line-through tabular-nums">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs text-[#79665C]">Base price</span>
                </div>
              </div>

              {/* Realistic Description */}
              <div className="border-t border-[#F1C5D1] pt-4 text-sm text-[#3B2028] font-light leading-relaxed space-y-2">
                <p>{product.description}</p>
                {product.idealFor && (
                  <p className="text-xs text-[#79665C]">
                    <strong className="text-[#3B2028]">Ideal for:</strong> {product.idealFor}
                  </p>
                )}
              </div>

              {/* Recipient Option (if supported) */}
              {product.allowRecipientChoice && isPurchasable && (
                <div className="border-t border-[#F1C5D1] pt-4">
                  <label className="block text-xs font-semibold text-[#3B2028] mb-2 uppercase tracking-wider">
                    Who is this hamper for?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRecipientChoice('For Her')}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        recipientChoice === 'For Her'
                          ? 'bg-[#9F2343] text-white border-[#72172F] shadow-xs'
                          : 'bg-[#FFF1F4] text-[#3B2028] border-[#F1C5D1] hover:border-[#9F2343]'
                      }`}
                    >
                      For Her
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecipientChoice('For Him')}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        recipientChoice === 'For Him'
                          ? 'bg-[#9F2343] text-white border-[#72172F] shadow-xs'
                          : 'bg-[#FFF1F4] text-[#3B2028] border-[#F1C5D1] hover:border-[#9F2343]'
                      }`}
                    >
                      For Him
                    </button>
                  </div>
                </div>
              )}

              {/* Available Add-Ons Selector */}
              {isPurchasable && availableAddons.length > 0 && (
                <div className="border-t border-[#F1C5D1] pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#3B2028] uppercase tracking-wider">
                      Available Add-ons (Optional)
                    </label>
                    <span className="text-[11px] text-[#79665C]">
                      {selectedAddOns.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {availableAddons.slice(0, 6).map((addon) => {
                      const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => handleToggleAddOn(addon)}
                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#FFF1F4] border-[#9F2343] shadow-xs'
                              : 'bg-[#FFFAF8] border-[#F1C5D1] hover:border-[#9F2343]'
                          }`}
                        >
                          <AddOnThumbnail type={addon.illustrationType} className="w-10 h-10 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#3B2028] truncate">
                              {addon.name}
                            </p>
                            <p className="text-[11px] text-[#9F2343] font-semibold tabular-nums">
                              +₹{addon.price}
                            </p>
                          </div>
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#9F2343] border-[#9F2343] text-white' : 'border-[#F1C5D1]'
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
                <div className="border-t border-[#F1C5D1] pt-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#9F2343]">
                    <Sparkles className="w-3.5 h-3.5 text-[#9F2343]" />
                    <span>Personalise Your Greeting Card</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#3B2028] mb-1">
                      Recipient's Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Ananya, Kabir, etc."
                      className="w-full px-3 py-2 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-xs text-[#3B2028] focus:ring-1 focus:ring-[#9F2343] focus:border-[#9F2343] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#3B2028] mb-1">
                      Greeting-card Message (Handwritten by DILSY)
                    </label>
                    <textarea
                      rows={3}
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                      placeholder="Write the message you'd like us to handwrite on a card..."
                      className="w-full px-3 py-2 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-xs text-[#3B2028] focus:ring-1 focus:ring-[#9F2343] focus:border-[#9F2343] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Price Breakdown & Actions */}
              <div className="border-t border-[#F1C5D1] pt-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#3B2028]">Estimated Total:</span>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-[#9F2343] tabular-nums">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                    {addOnsTotal > 0 && (
                      <span className="block text-[11px] text-[#79665C]">
                        (Base ₹{product.price} + Add-ons ₹{addOnsTotal})
                      </span>
                    )}
                  </div>
                </div>

                {isOutOfStock ? (
                  <div className="p-4 bg-[#FFF1F4] border border-[#F1C5D1] text-[#79665C] rounded-xl text-xs text-center font-medium">
                    This hamper is currently out of stock. Please message us on WhatsApp or choose another box.
                  </div>
                ) : isComingSoon ? (
                  <div className="p-4 bg-[#FFF1F4] border border-[#F1C5D1] text-[#9F2343] rounded-xl text-xs text-center font-medium">
                    This hamper is coming soon. Stay tuned!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleAdd}
                      className="py-3.5 px-4 bg-[#FFFAF8] hover:bg-[#FFF1F4] border border-[#F1C5D1] text-[#9F2343] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                    >
                      {addedAnimation ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span className="text-emerald-800">Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 text-[#9F2343]" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="py-3.5 px-4 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                      <span>Order on WhatsApp</span>
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-center text-[#79665C]">
                  Final contents, pricing, delivery charges, and timing are confirmed on WhatsApp before dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
