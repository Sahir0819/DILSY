import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Heart, ChevronDown, ChevronUp, Sparkles, Check, Info } from 'lucide-react';
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
  const [recipientChoice, setRecipientChoice] = useState<'For Him' | 'For Her'>('For Her');
  const [recipientName, setRecipientName] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [polaroidCaption, setPolaroidCaption] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const getCustomisation = (): ProductCustomisation => ({
    recipientName: recipientName.trim(),
    recipientChoice: product.allowRecipientChoice ? recipientChoice : undefined,
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

  // Formatted display title according to official requirements:
  // e.g. “Loved Box — Medium — ₹969”
  const formattedDisplayTitle = `${product.name} — ${product.size} — ₹${product.price.toLocaleString('en-IN')}`;

  return (
    <div className="bg-[#FFFCFD] rounded-2xl border border-[#E8C2CC] hover:border-[#D4506D]/60 overflow-hidden shadow-xs hover:shadow-lg hover:shadow-[#FFB3C6]/25 transition-all flex flex-col justify-between group">
      <div>
        {/* Top Product Artwork Illustration with Sample Imagery Notice */}
        <div className="relative">
          <ProductArtwork type={product.illustrationType} />
        </div>

        {/* Product Details Header */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {product.badge ? (
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
              <span className="block text-[11px] text-[#6B424E]">Official base price</span>
            </div>
          </div>

          <p className="text-sm text-[#52333D] font-light leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Recipient Choice for Loved Box / Configured Products */}
          {product.allowRecipientChoice && (
            <div className="mb-4 p-3 bg-gradient-to-r from-[#FFF5F8] to-[#FFF0F4] rounded-xl border border-[#FFCCD5]">
              <label className="block text-xs font-semibold text-[#3D141C] mb-1.5 flex items-center gap-1">
                <span>Who is this box for?</span>
                <span className="text-[10px] text-[#99223A] font-normal">(Select recipient)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRecipientChoice('For Him')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    recipientChoice === 'For Him'
                      ? 'bg-gradient-to-r from-[#99223A] to-[#801B30] text-white shadow-xs'
                      : 'bg-white text-[#7A1E31] border border-[#FFCCD5] hover:bg-[#FFEBF0]'
                  }`}
                >
                  <span>For Him</span>
                  {recipientChoice === 'For Him' && <Check className="w-3 h-3 text-white" />}
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientChoice('For Her')}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    recipientChoice === 'For Her'
                      ? 'bg-gradient-to-r from-[#99223A] to-[#801B30] text-white shadow-xs'
                      : 'bg-white text-[#7A1E31] border border-[#FFCCD5] hover:bg-[#FFEBF0]'
                  }`}
                >
                  <span>For Her</span>
                  {recipientChoice === 'For Her' && <Check className="w-3 h-3 text-white" />}
                </button>
              </div>
            </div>
          )}

          {/* Included Items - Clearly labeled as proposed concept subject to confirmation */}
          <div className="mb-4 bg-[#FFF5F8] rounded-xl p-3.5 border border-[#FFCCD5]/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#3D141C] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C73858]" />
                Proposed Box Elements
              </span>
              <span className="text-[10px] text-[#A32842] italic">
                *Subject to owner confirmation
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#52333D]">
              {product.itemsOverview.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#C73858] mt-0.5 text-xs">♥</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[10px] text-[#6B424E] border-t border-[#FFCCD5]/60 pt-1.5 italic flex items-center gap-1">
              <Info className="w-3 h-3 text-[#A32842] shrink-0" />
              <span>Exact hamper contents are customized and confirmed directly on WhatsApp before dispatch.</span>
            </p>
          </div>

          {/* Personalisation Toggle */}
          <div className="border-t border-[#E8D0D6] pt-3">
            <button
              type="button"
              onClick={() => setIsCustomising(!isCustomising)}
              className="w-full flex items-center justify-between py-1.5 text-xs font-medium text-[#99223A] hover:text-[#C73858] transition-colors focus-visible:outline-none"
            >
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#C73858] fill-[#FFB3C6]" />
                {isCustomising ? 'Hide Personalisation Form' : 'Add Recipient Name & Personal Love Note'}
              </span>
              {isCustomising ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Expandable Personalisation Fields */}
            {isCustomising && (
              <div className="mt-3 space-y-3 bg-[#FFF0F4] p-3.5 rounded-xl border border-[#FFCCD5] text-xs animate-in fade-in-50">
                <div>
                  <label className="block text-[11px] font-medium text-[#3D141C] mb-1">
                    Recipient Name / Nickname
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Sahil, Muskaan, Bunny, Jaanu"
                    className="w-full px-3 py-1.5 bg-white border border-[#F2BDCA] rounded-lg text-xs text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] focus:border-[#C73858] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#3D141C] mb-1">
                    Handwritten Greeting Card / Love Note
                  </label>
                  <textarea
                    rows={2}
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                    placeholder="Write your heartfelt message here. We handwrite this on luxury textured stationery with a wax seal..."
                    className="w-full px-3 py-1.5 bg-white border border-[#F2BDCA] rounded-lg text-xs text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] focus:border-[#C73858] outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#3D141C] mb-1">
                    Polaroid Photo Caption / Details
                  </label>
                  <input
                    type="text"
                    value={polaroidCaption}
                    onChange={(e) => setPolaroidCaption(e.target.value)}
                    placeholder="e.g. 'Our first trip ♥' (Send photo to WhatsApp after)"
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
                    placeholder="e.g. Include eggless chocolates, red ribbon, keep it surprise"
                    className="w-full px-3 py-1.5 bg-white border border-[#F2BDCA] rounded-lg text-xs text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] focus:border-[#C73858] outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons with Official Price & WhatsApp Integration */}
      <div className="p-6 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-2.5 px-3 bg-[#FFF5F8] hover:bg-[#FFEBF0] border border-[#E598A9] text-[#7A1E31] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF85A1]"
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
            className="w-full py-2.5 px-3 bg-gradient-to-r from-[#99223A] to-[#7D1B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs shadow-[#99223A]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF85A1]"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#FFB3C6]" />
            <span>Order on WhatsApp</span>
          </button>
        </div>

        <p className="text-[10px] text-center text-[#6B424E] flex items-center justify-center gap-1">
          <Heart className="w-2.5 h-2.5 fill-[#E56B85] text-[#E56B85]" />
          <span>Delivery around CU & Mohali · WhatsApp preview before sending</span>
        </p>
      </div>
    </div>
  );
};
