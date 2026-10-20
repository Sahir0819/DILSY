import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Heart, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';
import { Product, ProductCustomisation } from '../types';
import { ProductArtwork } from './ProductArtwork';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, customisation: ProductCustomisation) => void;
  onOrderWhatsApp: (product: Product, customisation: ProductCustomisation) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOrderWhatsApp,
}) => {
  const [isCustomising, setIsCustomising] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [polaroidCaption, setPolaroidCaption] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const getCustomisation = (): ProductCustomisation => ({
    recipientName: recipientName.trim(),
    personalNote: personalNote.trim(),
    polaroidCaption: polaroidCaption.trim(),
    specialInstructions: specialInstructions.trim(),
  });

  const handleAdd = () => {
    onAddToCart(product, getCustomisation());
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleWhatsApp = () => {
    onOrderWhatsApp(product, getCustomisation());
  };

  return (
    <div className="bg-[#FAF7F2] rounded-2xl border border-[#2A1E1A]/10 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Top Product Artwork Illustration */}
        <div className="relative">
          <ProductArtwork type={product.illustrationType} />
        </div>

        {/* Product Details Header */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#8C5A4F] font-semibold">
                Boutique Hamper
              </span>
              <h3 className="text-xl font-serif font-bold text-[#2A1E1A] mt-0.5">
                {product.name}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xl font-serif font-bold text-[#2A1E1A] tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="block text-[11px] text-[#4A352F]/70">Base price</span>
            </div>
          </div>

          <p className="text-sm text-[#4A352F] font-light leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Included Items - Proposed Concept */}
          <div className="mb-4 bg-[#F5EFEB]/70 rounded-xl p-3.5 border border-[#2A1E1A]/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#2A1E1A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B87A68]" />
                Proposed Box Elements
              </span>
              <span className="text-[10px] text-[#8C5A4F] italic">
                *Subject to owner confirmation
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#4A352F]">
              {product.itemsOverview.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#B87A68] mt-0.5 text-xs">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Personalisation Toggle */}
          <div className="border-t border-[#2A1E1A]/10 pt-3">
            <button
              type="button"
              onClick={() => setIsCustomising(!isCustomising)}
              className="w-full flex items-center justify-between py-1.5 text-xs font-medium text-[#8C5A4F] hover:text-[#2A1E1A] transition-colors focus-visible:outline-none"
            >
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#B87A68]" />
                {isCustomising ? 'Hide Personalisation Form' : 'Add Recipient & Card Note (Recommended)'}
              </span>
              {isCustomising ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Expandable Personalisation Fields */}
            {isCustomising && (
              <div className="mt-3 space-y-3 bg-[#FAF4ED] p-3.5 rounded-xl border border-[#D4A39A]/30 text-xs animate-in fade-in-50">
                <div>
                  <label className="block text-[11px] font-medium text-[#2A1E1A] mb-1">
                    Recipient Name / Nickname
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Sahil, Muskaan, Bunny"
                    className="w-full px-3 py-1.5 bg-white border border-[#2A1E1A]/15 rounded-lg text-xs text-[#2A1E1A] focus:ring-1 focus:ring-[#B87A68] focus:border-[#B87A68] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#2A1E1A] mb-1">
                    Handwritten Greeting Card Note
                  </label>
                  <textarea
                    rows={2}
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                    placeholder="Write your heartfelt message here. We handwrite this on luxury textured stationery..."
                    className="w-full px-3 py-1.5 bg-white border border-[#2A1E1A]/15 rounded-lg text-xs text-[#2A1E1A] focus:ring-1 focus:ring-[#B87A68] focus:border-[#B87A68] outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#2A1E1A] mb-1">
                    Polaroid Photo Caption / Details
                  </label>
                  <input
                    type="text"
                    value={polaroidCaption}
                    onChange={(e) => setPolaroidCaption(e.target.value)}
                    placeholder="e.g. 'Shimla Trip 2024' (Send actual photo to our WhatsApp after)"
                    className="w-full px-3 py-1.5 bg-white border border-[#2A1E1A]/15 rounded-lg text-xs text-[#2A1E1A] focus:ring-1 focus:ring-[#B87A68] focus:border-[#B87A68] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#2A1E1A] mb-1">
                    Special Instructions
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Include eggless cookies, specific candle fragrance preference"
                    className="w-full px-3 py-1.5 bg-white border border-[#2A1E1A]/15 rounded-lg text-xs text-[#2A1E1A] focus:ring-1 focus:ring-[#B87A68] focus:border-[#B87A68] outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-2.5 px-3 bg-[#FAF7F2] hover:bg-[#EAE0D6] border border-[#2A1E1A]/20 text-[#2A1E1A] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B87A68]"
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-emerald-800">Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full py-2.5 px-3 bg-[#2A1E1A] hover:bg-[#3D2C26] text-[#FAF7F2] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B87A68]"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#D4A39A]" />
            <span>Order on WhatsApp</span>
          </button>
        </div>

        <p className="text-[10px] text-center text-[#4A352F]/70">
          Delivery around CU & Mohali · WhatsApp review before sending
        </p>
      </div>
    </div>
  );
};
