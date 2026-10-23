import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Heart, ChevronDown, ChevronUp, Sparkles, Check, AlertCircle, Clock } from 'lucide-react';
import { Product, ProductCustomisation } from '../types';
import { ProductArtwork } from './ProductArtwork';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, customisation: ProductCustomisation) => void;
  onOrderWhatsApp: (product: Product, customisation: ProductCustomisation) => void;
  activePromoText?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOrderWhatsApp,
  activePromoText,
}) => {
  const [isCustomising, setIsCustomising] = useState(false);
  const [recipientChoice, setRecipientChoice] = useState<'For Him' | 'For Her'>('For Her');
  const [recipientName, setRecipientName] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [polaroidCaption, setPolaroidCaption] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const isComingSoon = product.stockStatus === 'coming_soon';
  const isPurchasable = !isOutOfStock && !isComingSoon;

  const getCustomisation = (): ProductCustomisation => ({
    recipientName: recipientName.trim(),
    recipientChoice: product.allowRecipientChoice ? recipientChoice : undefined,
    personalNote: personalNote.trim(),
    polaroidCaption: polaroidCaption.trim(),
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

  const formattedDisplayTitle = `${product.name} — ${product.size} — ₹${product.price.toLocaleString('en-IN')}`;

  return (
    <div className={`bg-[#FFFCFD] rounded-2xl border transition-all flex flex-col justify-between group overflow-hidden ${
      isOutOfStock
        ? 'border-[#E8D0D6] opacity-90'
        : 'border-[#E8C2CC] hover:border-[#D4506D]/60 shadow-xs hover:shadow-lg hover:shadow-[#FFB3C6]/25'
    }`}>
      <div>
        {/* Top Product Artwork Illustration or Real Image */}
        <div className="relative">
          {product.customImage ? (
            <div className="w-full aspect-[4/3] bg-[#FAF0F3] overflow-hidden flex items-center justify-center border-b border-[#E8C2CC]">
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
            <div className="absolute inset-0 bg-[#2D1B22]/40 backdrop-blur-[1px] flex items-center justify-center p-4">
              <span className="bg-[#991B1B] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg border border-white/20 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Out of Stock</span>
              </span>
            </div>
          )}

          {/* Coming Soon Overlay / Badge */}
          {isComingSoon && (
            <div className="absolute inset-0 bg-[#2D1B22]/40 backdrop-blur-[1px] flex items-center justify-center p-4">
              <span className="bg-[#6D28D9] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg border border-white/20 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Coming Soon</span>
              </span>
            </div>
          )}
        </div>

        {/* Product Details Header */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {isOutOfStock ? (
                  <span className="text-[10px] uppercase tracking-wider text-[#991B1B] font-bold bg-[#FEE2E2] px-2 py-0.5 rounded-full border border-[#FECACA]">
                    Out of Stock
                  </span>
                ) : isComingSoon ? (
                  <span className="text-[10px] uppercase tracking-wider text-[#6D28D9] font-bold bg-[#F3E8FF] px-2 py-0.5 rounded-full border border-[#E9D5FF]">
                    Coming Soon
                  </span>
                ) : product.badge ? (
                  <span className="text-[11px] uppercase tracking-wider text-[#99223A] font-bold flex items-center gap-1 bg-gradient-to-r from-[#FFEBF0] via-[#FFDDE6] to-[#FFEBF0] px-2.5 py-0.5 rounded-full border border-[#F29CAE] shadow-2xs">
                    {product.badge}
                  </span>
                ) : (
                  <span className="text-[11px] uppercase tracking-wider text-[#A32842] font-semibold flex items-center gap-1 bg-[#FFEBF0] px-2 py-0.5 rounded-full border border-[#FFCCD5]">
                    <Heart className="w-3 h-3 fill-[#E56B85] text-[#E56B85]" />
                    Curated With Love
                  </span>
                )}
                <span className="text-[11px] font-semibold text-[#7A1E31] bg-[#FFF0F4] px-2 py-0.5 rounded-full border border-[#FFCCD5]">
                  Size: {product.size}
                </span>
                {activePromoText && isPurchasable && (
                  <span className="text-[10px] font-semibold text-[#1B4332] bg-[#EBF7EE] px-2 py-0.5 rounded-full border border-[#B7E4C7]">
                    {activePromoText}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-serif font-bold text-[#2D1B22] group-hover:text-[#99223A] transition-colors">
                {product.name}
              </h3>
              <p className="text-[11px] text-[#A32842] font-serif italic">
                {formattedDisplayTitle}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-serif font-bold text-[#99223A] tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="block text-[11px] text-[#8C6B75] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="block text-[11px] text-[#6B424E]">Official base price</span>
            </div>
          </div>

          <p className="text-sm text-[#52333D] font-light leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Recipient Choice for Loved Box / Configured Products */}
          {product.allowRecipientChoice && isPurchasable && (
            <div className="mb-4 p-3 bg-gradient-to-r from-[#FFF5F8] to-[#FFF0F4] rounded-xl border border-[#FFCCD5]">
              <label className="block text-xs font-semibold text-[#3D141C] mb-1.5 flex items-center gap-1">
                <span>Who is this box for?</span>
                <span className="text-[10px] text-[#99223A] font-normal">(Select recipient)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRecipientChoice('For Her')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                    recipientChoice === 'For Her'
                      ? 'bg-gradient-to-r from-[#801B30] to-[#99223A] text-[#FFF0F3] border-[#70162A] shadow-xs'
                      : 'bg-white text-[#52333D] border-[#FFCCD5] hover:border-[#F29CAE]'
                  }`}
                >
                  🌸 For Her
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientChoice('For Him')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-all ${
                    recipientChoice === 'For Him'
                      ? 'bg-gradient-to-r from-[#801B30] to-[#99223A] text-[#FFF0F3] border-[#70162A] shadow-xs'
                      : 'bg-white text-[#52333D] border-[#FFCCD5] hover:border-[#F29CAE]'
                  }`}
                >
                  🌿 For Him
                </button>
              </div>
            </div>
          )}

          {/* Personalisation accordion */}
          {isPurchasable && (
            <div className="border-t border-[#F2BDCA]/60 pt-3 mt-1">
              <button
                type="button"
                onClick={() => setIsCustomising(!isCustomising)}
                className="w-full flex items-center justify-between text-xs font-semibold text-[#801B30] hover:text-[#99223A] py-1 transition-colors group/btn cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E56B85]" />
                  <span>Personalise greeting card message</span>
                </span>
                {isCustomising ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#801B30]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#801B30]" />
                )}
              </button>

              {isCustomising && (
                <div className="mt-3 space-y-3 bg-[#FAF0F3]/80 p-3.5 rounded-xl border border-[#F2BDCA] animate-in fade-in slide-in-from-top-1">
                  <div>
                    <label className="block text-[11px] font-medium text-[#3D141C] mb-1">
                      Recipient's Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Ananya, Kabir, etc."
                      className="w-full px-3 py-1.5 bg-white border border-[#F2BDCA] rounded-lg text-xs text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] focus:border-[#C73858] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#3D141C] mb-1">
                      Greeting-card message
                    </label>
                    <textarea
                      rows={2}
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                      placeholder="Write the message you'd like us to handwrite on a card. Keep it as long or short as your feelings demand..."
                      className="w-full px-3 py-1.5 bg-white border border-[#F2BDCA] rounded-lg text-xs text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] focus:border-[#C73858] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#3D141C] mb-1">
                      Special Instructions
                    </label>
                    <input
                      type="text"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g. Include red ribbon, delivery surprise request"
                      className="w-full px-3 py-1.5 bg-white border border-[#F2BDCA] rounded-lg text-xs text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] focus:border-[#C73858] outline-none"
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
          <div className="w-full py-2.5 px-3 bg-[#F3F4F6] border border-[#E5E7EB] text-[#6B7280] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed">
            <AlertCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span>Currently Out of Stock</span>
          </div>
        ) : isComingSoon ? (
          <div className="w-full py-2.5 px-3 bg-[#F5F3FF] border border-[#DDD6FE] text-[#6D28D9] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed">
            <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Coming Soon — Stay Tuned</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="w-full py-2.5 px-3 bg-[#FFF5F8] hover:bg-[#FFEBF0] border border-[#E598A9] text-[#7A1E31] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF85A1] cursor-pointer"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-emerald-800">Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#99223A]" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-[#99223A] to-[#7D1B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs shadow-[#99223A]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF85A1] cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#FFB3C6]" />
              <span>Order on WhatsApp</span>
            </button>
          </div>
        )}

        <p className="text-[10px] text-center text-[#6B424E] flex items-center justify-center gap-1">
          <Heart className="w-2.5 h-2.5 fill-[#E56B85] text-[#E56B85]" />
          <span>Delivery around CU & Mohali · WhatsApp preview before sending</span>
        </p>
      </div>
    </div>
  );
};
