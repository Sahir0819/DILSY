import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Heart, ChevronDown, ChevronUp, Sparkles, Check, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { Product, ProductCustomisation } from '../types';
import { ProductArtwork } from './ProductArtwork';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, customisation: ProductCustomisation) => void;
  onOrderWhatsApp: (product: Product, customisation: ProductCustomisation) => void;
  onViewDetails?: (product: Product) => void;
  activePromoText?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOrderWhatsApp,
  onViewDetails,
  activePromoText,
}) => {
  const [isCustomising, setIsCustomising] = useState(false);
  const [recipientChoice, setRecipientChoice] = useState<'For Him' | 'For Her'>('For Her');
  const [recipientName, setRecipientName] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const isComingSoon = product.stockStatus === 'coming_soon';
  const isPurchasable = !isOutOfStock && !isComingSoon;

  const getCustomisation = (): ProductCustomisation => ({
    recipientName: recipientName.trim(),
    recipientChoice: product.allowRecipientChoice ? recipientChoice : undefined,
    personalNote: personalNote.trim(),
    specialInstructions: specialInstructions.trim(),
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

  const formattedDisplayTitle = `${product.name} (${product.size}) — ₹${product.price.toLocaleString('en-IN')}`;

  return (
    <div className={`bg-[#FFFAF8] rounded-2xl border transition-all flex flex-col justify-between group overflow-hidden ${
      isOutOfStock
        ? 'border-[#F1C5D1]/60 opacity-90'
        : 'border-[#F1C5D1] hover:border-[#9F2343] shadow-xs hover:shadow-lg hover:shadow-[#72172F]/10'
    }`}>
      <div>
        {/* Top Product Artwork Illustration or Real Image */}
        <div className="relative">
          {product.customImage ? (
            <div className="w-full aspect-[4/3] bg-[#FFF1F4] overflow-hidden flex items-center justify-center border-b border-[#F1C5D1]">
              <img
                src={product.customImage}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <ProductArtwork type={product.illustrationType} />
          )}

          {/* Out of Stock Overlay / Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-[#3B2028]/40 backdrop-blur-[1px] flex items-center justify-center p-4">
              <span className="bg-[#991B1B] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg border border-white/20 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Out of Stock</span>
              </span>
            </div>
          )}

          {/* Coming Soon Overlay / Badge */}
          {isComingSoon && (
            <div className="absolute inset-0 bg-[#3B2028]/40 backdrop-blur-[1px] flex items-center justify-center p-4">
              <span className="bg-[#9F2343] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg border border-white/20 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Coming Soon</span>
              </span>
            </div>
          )}

          {/* Clickable View Details Overlay Button */}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(product)}
              className="absolute top-3 left-3 bg-[#FFFAF8]/90 hover:bg-[#FFFAF8] text-[#9F2343] p-1.5 rounded-lg border border-[#F1C5D1] shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1 text-[11px] font-medium"
              title="View full product details"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          )}
        </div>

        {/* Product Details Header */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {isOutOfStock ? (
                  <span className="text-[10px] uppercase tracking-wider text-[#991B1B] font-bold bg-[#FEE2E2] px-2 py-0.5 rounded-full border border-[#FECACA]">
                    Out of Stock
                  </span>
                ) : isComingSoon ? (
                  <span className="text-[10px] uppercase tracking-wider text-[#9F2343] font-bold bg-[#FFF1F4] px-2 py-0.5 rounded-full border border-[#F1C5D1]">
                    Coming Soon
                  </span>
                ) : product.badge ? (
                  <span className="text-[11px] uppercase tracking-wider text-[#9F2343] font-bold flex items-center gap-1 bg-[#FFF1F4] px-2.5 py-0.5 rounded-full border border-[#F1C5D1] shadow-2xs">
                    {product.badge}
                  </span>
                ) : (
                  <span className="text-[11px] uppercase tracking-wider text-[#9F2343] font-semibold flex items-center gap-1 bg-[#FFF1F4] px-2 py-0.5 rounded-full border border-[#F1C5D1]">
                    <Heart className="w-3 h-3 fill-[#9F2343] text-[#9F2343]" />
                    Curated With Love
                  </span>
                )}
                <span className="text-[11px] font-semibold text-[#3B2028] bg-[#FFF1F4] px-2 py-0.5 rounded-full border border-[#F1C5D1]">
                  Size: {product.size}
                </span>
                {activePromoText && isPurchasable && (
                  <span className="text-[10px] font-semibold text-[#1B4332] bg-[#EBF7EE] px-2 py-0.5 rounded-full border border-[#B7E4C7]">
                    {activePromoText}
                  </span>
                )}
              </div>
              <h3
                onClick={() => onViewDetails && onViewDetails(product)}
                className={`text-xl font-serif font-bold text-[#3B2028] group-hover:text-[#9F2343] transition-colors ${onViewDetails ? 'cursor-pointer' : ''}`}
              >
                {product.name}
              </h3>
              <p className="text-[11px] text-[#795A63] font-serif italic">
                {formattedDisplayTitle}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-serif font-bold text-[#9F2343] tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="block text-[11px] text-[#795A63] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="block text-[11px] text-[#795A63]">Base price</span>
            </div>
          </div>

          <p className="text-sm text-[#3B2028] font-light leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Recipient Choice for Loved Box */}
          {product.allowRecipientChoice && isPurchasable && (
            <div className="mb-4 p-3 bg-[#FFF1F4] rounded-xl border border-[#F1C5D1]">
              <label className="block text-xs font-semibold text-[#3B2028] mb-1.5 flex items-center gap-1">
                <span>Who is this box for?</span>
                <span className="text-[10px] text-[#9F2343] font-normal">(Select recipient)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRecipientChoice('For Her')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    recipientChoice === 'For Her'
                      ? 'bg-[#9F2343] text-white border-[#72172F] shadow-xs'
                      : 'bg-[#FFFAF8] text-[#3B2028] border-[#F1C5D1] hover:border-[#9F2343]'
                  }`}
                >
                  For Her
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientChoice('For Him')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    recipientChoice === 'For Him'
                      ? 'bg-[#9F2343] text-white border-[#72172F] shadow-xs'
                      : 'bg-[#FFFAF8] text-[#3B2028] border-[#F1C5D1] hover:border-[#9F2343]'
                  }`}
                >
                  For Him
                </button>
              </div>
            </div>
          )}

          {/* Quick Details link and Personalisation accordion */}
          {isPurchasable && (
            <div className="border-t border-[#F1C5D1] pt-3 mt-1 space-y-2">
              <button
                type="button"
                onClick={() => setIsCustomising(!isCustomising)}
                className="w-full flex items-center justify-between text-xs font-semibold text-[#9F2343] hover:text-[#72172F] py-1 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#9F2343]" />
                  <span>Personalise greeting card message</span>
                </span>
                {isCustomising ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#9F2343]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#9F2343]" />
                )}
              </button>

              {isCustomising && (
                <div className="mt-2 space-y-3 bg-[#FFF1F4] p-3.5 rounded-xl border border-[#F1C5D1] animate-in fade-in slide-in-from-top-1">
                  <div>
                    <label className="block text-[11px] font-medium text-[#3B2028] mb-1">
                      Recipient's Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Ananya, Kabir, etc."
                      className="w-full px-3 py-1.5 bg-[#FFFAF8] border border-[#F1C5D1] rounded-lg text-xs text-[#3B2028] focus:ring-1 focus:ring-[#9F2343] focus:border-[#9F2343] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#3B2028] mb-1">
                      Greeting-card message
                    </label>
                    <textarea
                      rows={2}
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                      placeholder="Write your personal message to be handwritten on the card..."
                      className="w-full px-3 py-1.5 bg-[#FFFAF8] border border-[#F1C5D1] rounded-lg text-xs text-[#3B2028] focus:ring-1 focus:ring-[#9F2343] focus:border-[#9F2343] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#3B2028] mb-1">
                      Special Instructions
                    </label>
                    <input
                      type="text"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g. Include ribbon, delivery surprise request"
                      className="w-full px-3 py-1.5 bg-[#FFFAF8] border border-[#F1C5D1] rounded-lg text-xs text-[#3B2028] focus:ring-1 focus:ring-[#9F2343] focus:border-[#9F2343] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0 space-y-2">
        {isOutOfStock ? (
          <div className="w-full py-2.5 px-3 bg-[#FFF1F4] border border-[#F1C5D1] text-[#795A63] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed">
            <AlertCircle className="w-3.5 h-3.5 text-[#795A63]" />
            <span>Currently Out of Stock</span>
          </div>
        ) : isComingSoon ? (
          <div className="w-full py-2.5 px-3 bg-[#FFF1F4] border border-[#F1C5D1] text-[#9F2343] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed">
            <Clock className="w-3.5 h-3.5 text-[#9F2343]" />
            <span>Coming Soon — Stay Tuned</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAdd}
                className="w-full py-2.5 px-3 bg-[#FFFAF8] hover:bg-[#FFF1F4] border border-[#F1C5D1] text-[#9F2343] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2343] cursor-pointer"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-emerald-800">Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#9F2343]" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full py-2.5 px-3 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs shadow-[#72172F]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9F2343] cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
                <span>WhatsApp Order</span>
              </button>
            </div>

            {onViewDetails && (
              <button
                type="button"
                onClick={() => onViewDetails(product)}
                className="w-full py-1.5 text-center text-xs font-medium text-[#795A63] hover:text-[#9F2343] transition-colors cursor-pointer"
              >
                View Full Details & Add-ons →
              </button>
            )}
          </div>
        )}

        <p className="text-[10px] text-center text-[#795A63] flex items-center justify-center gap-1 pt-1">
          <Heart className="w-2.5 h-2.5 fill-[#9F2343] text-[#9F2343]" />
          <span>Delivery around CU & Mohali · WhatsApp preview before sending</span>
        </p>
      </div>
    </div>
  );
};
