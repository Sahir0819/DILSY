import React, { useState } from 'react';
import { Product, ProductCustomisation, AddOnItem } from '../types';
import { ProductArtwork } from './ProductArtwork';
import { AddOnThumbnail } from './AddOnThumbnail';
import { ADD_ONS } from '../data/addons';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  ArrowLeft,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  MapPin,
  Feather,
  Plus,
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product, customisation: ProductCustomisation) => void;
  onOrderWhatsApp: (product: Product, customisation: ProductCustomisation) => void;
  onBackToHampers: () => void;
  activePromoText?: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onAddToCart,
  onOrderWhatsApp,
  onBackToHampers,
  activePromoText,
}) => {
  const [recipientChoice, setRecipientChoice] = useState<'For Him' | 'For Her'>('For Her');
  const [recipientName, setRecipientName] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [polaroidCaption, setPolaroidCaption] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const isComingSoon = product.stockStatus === 'coming_soon';
  const isPurchasable = !isOutOfStock && !isComingSoon;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate total price with add-ons
  const addonsTotal = selectedAddons.reduce((acc, id) => {
    const item = ADD_ONS.find((a) => a.id === id);
    return acc + (item ? item.price : 0);
  }, 0);

  const totalPrice = product.price + addonsTotal;

  const getCustomisation = (): ProductCustomisation => ({
    recipientName: recipientName.trim(),
    recipientChoice: product.allowRecipientChoice ? recipientChoice : undefined,
    personalNote: personalNote.trim(),
    polaroidCaption: polaroidCaption.trim(),
    specialInstructions: [
      specialInstructions.trim(),
      selectedAddons.length > 0
        ? `Selected Add-ons: ${selectedAddons
            .map((id) => ADD_ONS.find((a) => a.id === id)?.name)
            .filter(Boolean)
            .join(', ')} (+₹${addonsTotal})`
        : '',
    ]
      .filter(Boolean)
      .join(' | '),
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

  return (
    <div className="py-8 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHampers}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#9F2343] hover:text-[#72172F] transition-colors bg-[#FFFAF8] px-3.5 py-1.5 rounded-xl border border-[#F1C5D1] shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Hampers</span>
        </button>

        <div className="text-xs text-[#795A63] hidden sm:block">
          <span>Home</span> <span className="mx-1">/</span> <span>Hampers</span>{' '}
          <span className="mx-1">/</span>{' '}
          <span className="text-[#3B2028] font-medium">{product.name}</span>
        </div>
      </div>

      {/* Main Two-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Visual Artwork Anchor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#FFFAF8] rounded-3xl border border-[#F1C5D1] overflow-hidden p-3 shadow-lg shadow-[#72172F]/5 relative">
            {product.customImage ? (
              <div className="w-full aspect-[4/3] bg-[#FFF1F4] overflow-hidden rounded-2xl flex items-center justify-center">
                <img
                  src={product.customImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <ProductArtwork type={product.illustrationType} className="rounded-2xl" />
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 bg-[#3B2028]/40 backdrop-blur-[1px] flex items-center justify-center p-4 rounded-3xl">
                <span className="bg-[#991B1B] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-white/20 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Out of Stock</span>
                </span>
              </div>
            )}

            {isComingSoon && (
              <div className="absolute inset-0 bg-[#3B2028]/40 backdrop-blur-[1px] flex items-center justify-center p-4 rounded-3xl">
                <span className="bg-[#9F2343] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-white/20 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>Coming Soon</span>
                </span>
              </div>
            )}
          </div>

          {/* Reassurance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#795A63]">
            <div className="p-3 bg-[#FFFAF8] rounded-xl border border-[#F1C5D1] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#9F2343] shrink-0" />
              <span>Direct delivery in CU & Mohali</span>
            </div>
            <div className="p-3 bg-[#FFFAF8] rounded-xl border border-[#F1C5D1] flex items-center gap-2">
              <Feather className="w-4 h-4 text-[#9F2343] shrink-0" />
              <span>Handwritten card included</span>
            </div>
            <div className="p-3 bg-[#FFFAF8] rounded-xl border border-[#F1C5D1] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#9F2343] shrink-0" />
              <span>WhatsApp preview before sending</span>
            </div>
          </div>
        </div>

        {/* Right Column: Configuration & Details */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Pricing */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {product.badge ? (
                <span className="text-xs uppercase tracking-wider text-[#9F2343] font-bold bg-[#FCE7ED] px-3 py-1 rounded-full border border-[#F1C5D1] shadow-2xs">
                  {product.badge}
                </span>
              ) : (
                <span className="text-xs uppercase tracking-wider text-[#9F2343] font-semibold bg-[#FCE7ED] px-3 py-1 rounded-full border border-[#F1C5D1] flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-[#9F2343]" />
                  Curated With Love
                </span>
              )}
              <span className="text-xs font-semibold text-[#3B2028] bg-[#FCE7ED] px-3 py-1 rounded-full border border-[#F1C5D1]">
                Size: {product.size}
              </span>
              {activePromoText && isPurchasable && (
                <span className="text-xs font-semibold text-[#1B4332] bg-[#EBF7EE] px-2.5 py-1 rounded-full border border-[#B7E4C7]">
                  {activePromoText}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3B2028]">
              {product.name}
            </h1>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-serif font-bold text-[#9F2343] tabular-nums">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
              {addonsTotal > 0 && (
                <span className="text-xs text-[#795A63]">
                  (Base ₹{product.price} + Add-ons ₹{addonsTotal})
                </span>
              )}
              {product.originalPrice && (
                <span className="text-sm text-[#795A63] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="mt-4 text-sm text-[#795A63] font-light leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Recipient Choice for Loved Box */}
          {product.allowRecipientChoice && isPurchasable && (
            <div className="p-4 bg-[#FFFAF8] rounded-2xl border border-[#F1C5D1] space-y-2">
              <label className="block text-xs font-semibold text-[#3B2028]">
                Who is this hamper for?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRecipientChoice('For Her')}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
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
                  className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
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

          {/* Add-ons Picker */}
          {isPurchasable && (
            <div className="p-4 bg-[#FFFAF8] rounded-2xl border border-[#F1C5D1] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#9F2343]">
                    Available Add-ons & Treats
                  </h3>
                  <p className="text-[11px] text-[#795A63]">Select optional extras to pair inside your hamper</p>
                </div>
                {selectedAddons.length > 0 && (
                  <span className="text-xs font-bold text-[#9F2343] bg-[#FCE7ED] px-2 py-0.5 rounded-full border border-[#F1C5D1]">
                    {selectedAddons.length} selected (+₹{addonsTotal})
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {ADD_ONS.filter((a) => a.isAvailable).map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);

                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#FCE7ED] border-[#9F2343] shadow-xs'
                          : 'bg-[#FFF1F4] border-[#F1C5D1] hover:border-[#E88AA4]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <AddOnThumbnail type={addon.illustrationType} className="w-10 h-10 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#3B2028] truncate">{addon.name}</p>
                          <p className="text-[10px] text-[#795A63] truncate">{addon.category}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-2">
                        <span className="text-xs font-bold text-[#9F2343]">+₹{addon.price}</span>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-[#9F2343] border-[#72172F] text-white'
                              : 'bg-white border-[#F1C5D1]'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Personalisation Form */}
          {isPurchasable && (
            <div className="p-4 bg-[#FFFAF8] rounded-2xl border border-[#F1C5D1] space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9F2343]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalisation Details</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#3B2028] mb-1">
                  Recipient's Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Kabir, Ananya, etc."
                  className="w-full px-3.5 py-2 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-xs text-[#3B2028] outline-none focus:ring-1 focus:ring-[#9F2343]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#3B2028] mb-1">
                  Handwritten Card Note
                </label>
                <textarea
                  rows={3}
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="Your heartfelt message to be handwritten on our stationery card..."
                  className="w-full px-3.5 py-2 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-xs text-[#3B2028] outline-none focus:ring-1 focus:ring-[#9F2343]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#3B2028] mb-1">
                    Polaroid Photo Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={polaroidCaption}
                    onChange={(e) => setPolaroidCaption(e.target.value)}
                    placeholder="e.g. Our first trip · 2024"
                    className="w-full px-3.5 py-2 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-xs text-[#3B2028] outline-none focus:ring-1 focus:ring-[#9F2343]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#3B2028] mb-1">
                    Delivery Notes / Preferences
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Afternoon delivery at CU Gate 2"
                    className="w-full px-3.5 py-2 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-xs text-[#3B2028] outline-none focus:ring-1 focus:ring-[#9F2343]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            {isOutOfStock ? (
              <div className="w-full py-3 px-4 bg-[#FCE7ED] border border-[#F1C5D1] text-[#795A63] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                <AlertCircle className="w-4 h-4 text-[#795A63]" />
                <span>Currently Out of Stock</span>
              </div>
            ) : isComingSoon ? (
              <div className="w-full py-3 px-4 bg-[#FCE7ED] border border-[#F1C5D1] text-[#9F2343] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                <Clock className="w-4 h-4 text-[#9F2343]" />
                <span>Coming Soon — Stay Tuned</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full py-3.5 px-4 bg-[#FFFAF8] hover:bg-[#FFF1F4] border border-[#F1C5D1] text-[#9F2343] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span className="text-emerald-800">Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#9F2343]" />
                      <span>Add to Bag (₹{totalPrice})</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full py-3.5 px-4 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#9F2343]/25 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Order on WhatsApp (₹{totalPrice})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
