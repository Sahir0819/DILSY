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
  badgeLabel?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOrderWhatsApp,
  onViewDetails,
  activePromoText,
  badgeLabel,
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

  // Determine badge text according to Stitch aesthetic
  const displayedBadge =
    badgeLabel ||
    product.badge ||
    (product.id === 'loved-box'
      ? 'SIGNATURE'
      : product.id === 'the-little-affair'
      ? 'BESPOKE KEEPSAKE'
      : 'CELEBRATION');

  // Default to Stitch editorial photography if customImage is not set
  const productImage =
    product.customImage ||
    (product.id === 'loved-box'
      ? '/assets/images/product-loved-box.jpg'
      : product.id === 'the-little-affair'
      ? '/assets/images/product-anniversary-box.jpg'
      : product.id === 'the-everything-box'
      ? '/assets/images/product-birthday-box.jpg'
      : null);

  return (
    <div
      className={`bg-[#FFFFFF] border transition-all flex flex-col justify-between group overflow-hidden ${
        isOutOfStock
          ? 'border-[#EADBDB] opacity-85'
          : 'border-[#EADBDB] hover:border-[#3E101D]/40'
      }`}
    >
      <div>
        {/* Product Image Area */}
        <div className="relative aspect-[4/3] bg-[#FAF7F5] overflow-hidden border-b border-[#EADBDB]">
          {productImage ? (
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
            />
          ) : (
            <ProductArtwork type={product.illustrationType} />
          )}

          {/* Floating Category Badge (Stitch Mockup Top Left) */}
          {displayedBadge && (
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[9px] font-sans uppercase tracking-[0.18em] text-[#3E101D] border border-[#EADBDB]/60 shadow-2xs">
              {displayedBadge}
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-[#2A0D15]/40 backdrop-blur-[1px] flex items-center justify-center p-4">
              <span className="bg-[#991B1B] text-white text-[10px] font-sans font-semibold px-3 py-1 uppercase tracking-widest flex items-center gap-1.5 border border-white/20">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Out of Stock</span>
              </span>
            </div>
          )}

          {/* Coming Soon Overlay */}
          {isComingSoon && (
            <div className="absolute inset-0 bg-[#2A0D15]/40 backdrop-blur-[1px] flex items-center justify-center p-4">
              <span className="bg-[#3E101D] text-white text-[10px] font-sans font-semibold px-3 py-1 uppercase tracking-widest flex items-center gap-1.5 border border-white/20">
                <Clock className="w-3.5 h-3.5" />
                <span>Coming Soon</span>
              </span>
            </div>
          )}
        </div>

        {/* Product Meta & Description */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div>
              <h3
                onClick={() => onViewDetails && onViewDetails(product)}
                className={`text-lg font-serif font-normal text-[#2A0D15] group-hover:text-[#4A1423] transition-colors ${
                  onViewDetails ? 'cursor-pointer' : ''
                }`}
              >
                {product.name}
                {product.size && (
                  <span className="text-sm font-sans font-light text-[#7A6368] ml-1.5">
                    / {product.size}
                  </span>
                )}
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#7A6368] font-sans font-light line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Recipient Choice for Loved Box */}
          {product.allowRecipientChoice && isPurchasable && (
            <div className="mb-4 p-3 bg-[#FAF7F5] border border-[#EADBDB]">
              <label className="block text-[11px] font-sans uppercase tracking-[0.1em] text-[#2A0D15] mb-1.5">
                Who is this box for?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRecipientChoice('For Her')}
                  className={`py-1.5 px-3 text-xs font-sans tracking-wide border transition-all cursor-pointer ${
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
                  className={`py-1.5 px-3 text-xs font-sans tracking-wide border transition-all cursor-pointer ${
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

          {/* Personalisation Accordion */}
          {isPurchasable && (
            <div className="border-t border-[#EADBDB] pt-3 mt-1">
              <button
                type="button"
                onClick={() => setIsCustomising(!isCustomising)}
                className="w-full flex items-center justify-between text-xs font-sans text-[#4A1423] hover:text-[#2A0D15] py-1 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#4A1423]" />
                  <span>Personalise wax-sealed greeting note</span>
                </span>
                {isCustomising ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#4A1423]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#4A1423]" />
                )}
              </button>

              {isCustomising && (
                <div className="mt-2 space-y-3 bg-[#FAF7F5] p-3 border border-[#EADBDB] animate-in fade-in slide-in-from-top-1 font-sans">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2A0D15] mb-1">
                      Recipient's Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Priya Sharma, Ananya..."
                      className="w-full px-3 py-1.5 bg-white border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2A0D15] mb-1">
                      Handwritten Note Sentiment
                    </label>
                    <textarea
                      rows={2}
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                      placeholder="Write your words to be calligraphed on cotton paper..."
                      className="w-full px-3 py-1.5 bg-white border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-medium text-[#2A0D15] mb-1">
                      Special Requests / Landmark
                    </label>
                    <input
                      type="text"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g. Campus delivery gate, room delivery..."
                      className="w-full px-3 py-1.5 bg-white border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Price & Actions */}
      <div className="p-5 sm:p-6 pt-0 border-t border-[#EADBDB]">
        {/* Bottom Price & Curate Row (Stitch Reference) */}
        <div className="flex items-center justify-between pt-4 mb-4">
          <div>
            <span className="text-base font-sans font-semibold text-[#2A0D15] tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-xs text-[#7A6368] line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(product)}
              className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-[#3E101D] hover:underline cursor-pointer"
            >
              Curate
            </button>
          )}
        </div>

        {/* Purchase & Order Actions */}
        {isOutOfStock ? (
          <div className="w-full py-2.5 px-3 bg-[#FAF7F5] border border-[#EADBDB] text-[#7A5A63] text-xs font-sans tracking-wide text-center cursor-not-allowed uppercase">
            Out of Stock
          </div>
        ) : isComingSoon ? (
          <div className="w-full py-2.5 px-3 bg-[#FAF7F5] border border-[#EADBDB] text-[#3E101D] text-xs font-sans tracking-wide text-center cursor-not-allowed uppercase">
            Coming Soon
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAdd}
                className="w-full py-2.5 px-3 bg-[#FAF7F5] hover:bg-[#F5ECE7] border border-[#EADBDB] text-[#3E101D] text-[10px] font-sans uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#3E101D]" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full py-2.5 px-3 bg-[#3E101D] hover:bg-[#2A0B13] text-white text-[10px] font-sans uppercase tracking-[0.15em] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
