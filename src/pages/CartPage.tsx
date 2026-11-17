import React, { useState } from 'react';
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  MessageCircle,
  Tag,
  Check,
  X,
} from 'lucide-react';
import { CartItem } from '../types';
import { ProductArtwork } from '../components/ProductArtwork';
import { ThemeArtwork } from '../components/ThemeArtwork';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CartCheckoutModal } from '../components/CartCheckoutModal';
import { useStore } from '../context/StoreContext';
import {
  GENERIC_BOX_PRODUCT_IDS,
  getCartItemSubtotal,
  getCartItemUnitPrice,
  getCollectionDefaultImage,
  getOfficialBoxPrice,
} from '../utils/cart';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onNavigate: (path: string) => void;
  onOpenReviewModal?: (title: string, message: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
}) => {
  const { products, offers, activeOffer, calculateDiscount, validatePromoCode } = useStore();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedManualCode, setAppliedManualCode] = useState<string | undefined>(undefined);
  const [promoFeedback, setPromoFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Preserve distinct hamper identity & selected size while verifying official variant pricing
  const validatedItems: CartItem[] = items.map((item) => {
    const selectedSize = item.selectedSize || item.product.size || 'Medium';
    const isCustomProduct =
      !item.collectionId &&
      !GENERIC_BOX_PRODUCT_IDS.has(item.productId || item.product.id);
    const catalogMatch = isCustomProduct
      ? products.find((p) => p.id === (item.productId || item.product.id))
      : undefined;

    const unitPrice = catalogMatch
      ? Number(catalogMatch.price)
      : item.collectionId || GENERIC_BOX_PRODUCT_IDS.has(item.product.id)
      ? getOfficialBoxPrice(selectedSize)
      : Number(item.unitPrice ?? item.product.price ?? getOfficialBoxPrice(selectedSize));

    const resolvedImage =
      item.product.customImage ||
      catalogMatch?.customImage ||
      getCollectionDefaultImage(item.collectionId || item.productId);

    return {
      ...item,
      selectedSize,
      unitPrice,
      product: {
        ...item.product,
        size: selectedSize,
        price: unitPrice,
        customImage: resolvedImage,
      },
    };
  });

  const rawSubtotal = validatedItems.reduce(
    (acc, item) => acc + getCartItemSubtotal(item),
    0
  );

  const { discountAmount, finalAmount, appliedOffer } = calculateDiscount(
    rawSubtotal,
    appliedManualCode
  );

  const totalItemCount = validatedItems.reduce((acc, i) => acc + i.quantity, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validatePromoCode(promoInput, rawSubtotal);
    if (res.valid && res.offer) {
      setAppliedManualCode(res.offer.code);
      setPromoFeedback({ type: 'success', text: res.message });
    } else {
      setPromoFeedback({ type: 'error', text: res.message });
    }
  };

  const handleRemovePromo = () => {
    setAppliedManualCode('');
    setPromoInput('');
    setPromoFeedback(null);
  };

  const handleProceedToWhatsApp = () => {
    if (validatedItems.length === 0) return;
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2A0D15] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'Shopping Bag' }]}
            onNavigate={onNavigate}
          />
        </div>

        {/* Page Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EADBDB]">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2A0D15]">
              Your Shopping Bag
            </h1>
            <p className="text-xs text-[#7A5A63] mt-1 font-light">
              {totalItemCount} {totalItemCount === 1 ? 'hamper' : 'hampers'} in your curation
            </p>
          </div>

          {validatedItems.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-xs text-[#7A5A63] hover:text-[#3E101D] transition-colors cursor-pointer uppercase tracking-wider"
            >
              Clear Bag
            </button>
          )}
        </div>

        {/* Empty Bag State */}
        {validatedItems.length === 0 ? (
          <div className="p-12 sm:p-16 bg-white border border-[#EADBDB] text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-[#FAF7F5] border border-[#EADBDB] text-[#3E101D] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif text-[#2A0D15]">Your bag is empty</h2>
            <p className="text-xs text-[#7A5A63] leading-relaxed max-w-sm mx-auto font-light">
              Looks like you haven't added any hampers to your bag yet. Explore our curated
              occasion hampers or build your custom gift.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => onNavigate('/hampers')}
                className="px-6 py-3.5 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Explore Hampers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('/custom-hamper')}
                className="px-6 py-3.5 bg-white hover:bg-[#FAF7F5] text-[#3E101D] border border-[#EADBDB] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
              >
                Custom Hamper Studio
              </button>
            </div>
          </div>
        ) : (
          /* 2-Column Bag Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {validatedItems.map((item) => {
                const selectedSize = item.selectedSize || item.product.size;
                const unitPrice = getCartItemUnitPrice(item);
                const itemTotalPrice = getCartItemSubtotal(item);
                const addOnsCost = (item.customisation.selectedAddOns || []).reduce(
                  (cost, a) => cost + a.price * a.quantity,
                  0
                );

                return (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 bg-white border border-[#EADBDB] flex flex-col sm:flex-row gap-5 items-start justify-between"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-24 h-20 sm:w-28 sm:h-24 overflow-hidden border border-[#EADBDB] bg-[#FAF7F5] shrink-0">
                      {item.product.customImage ? (
                        <img
                          src={item.product.customImage}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : item.collectionId ? (
                        <ThemeArtwork
                          themeId={item.collectionId}
                          className="w-full h-full rounded-none border-0"
                        />
                      ) : (
                        <ProductArtwork
                          type={item.product.illustrationType}
                          className="scale-75 origin-top-left"
                        />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h3 className="font-serif text-lg sm:text-xl text-[#2A0D15]">
                        {item.product.name}
                      </h3>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#3E101D] bg-[#FAF7F5] px-2.5 py-0.5 border border-[#EADBDB]">
                          Size: {selectedSize}
                        </span>
                        <span className="text-xs text-[#7A5A63] tabular-nums">
                          Price: ₹{item.unitPrice.toLocaleString('en-IN')}
                          {addOnsCost > 0
                            ? ` (+₹${addOnsCost.toLocaleString('en-IN')} add-ons)`
                            : ''}
                        </span>
                      </div>

                      {/* Customisation Notes Preview */}
                      {item.customisation.recipientName && (
                        <p className="text-xs text-[#2A0D15]">
                          <strong>Recipient:</strong> {item.customisation.recipientName}
                        </p>
                      )}
                      {item.customisation.personalNote && (
                        <p className="text-xs text-[#7A5A63] italic line-clamp-2 font-light">
                          "{item.customisation.personalNote}"
                        </p>
                      )}
                      {item.customisation.specialInstructions && (
                        <p className="text-[11px] text-[#7A5A63]">
                          Note: {item.customisation.specialInstructions}
                        </p>
                      )}

                      {/* Selected Add-ons */}
                      {item.customisation.selectedAddOns &&
                        item.customisation.selectedAddOns.length > 0 && (
                          <div className="pt-1 text-[11px] text-[#3E101D] space-y-0.5">
                            <span className="font-semibold text-[#2A0D15]">Add-ons:</span>
                            {item.customisation.selectedAddOns.map((addon) => (
                              <span key={addon.id} className="block pl-1">
                                + {addon.quantity}x {addon.name} (₹
                                {(addon.price * addon.quantity).toLocaleString('en-IN')})
                              </span>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* Quantity & Individual Subtotal Controls */}
                    <div className="flex flex-col items-end gap-2.5 shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-[#7A5A63] block">
                          Item Subtotal
                        </span>
                        <span className="text-lg font-serif font-medium text-[#3E101D] tabular-nums">
                          ₹{itemTotalPrice.toLocaleString('en-IN')}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-[#7A5A63] tabular-nums">
                            {item.quantity} × ₹{unitPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 bg-[#FAF7F5] p-1 border border-[#EADBDB]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 text-[#7A5A63] hover:text-[#3E101D] cursor-pointer"
                          aria-label={`Decrease quantity for ${item.product.name} (${selectedSize})`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-medium text-[#2A0D15] px-2 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 text-[#7A5A63] hover:text-[#3E101D] cursor-pointer"
                          aria-label={`Increase quantity for ${item.product.name} (${selectedSize})`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[11px] text-[#7A5A63] hover:text-[#3E101D] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/hampers')}
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#3E101D] hover:text-[#2A0D15] cursor-pointer uppercase tracking-wider"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping Hampers</span>
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary & Promo Code Card */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">
              <div className="bg-white p-6 border border-[#EADBDB] space-y-4">
                <h3 className="font-serif text-lg text-[#2A0D15] pb-3 border-b border-[#EADBDB]">
                  Order Summary
                </h3>

                {/* Promo Code Input */}
                {(offers.some((o) => o.isActive) || activeOffer) && (
                  <div className="pb-3 border-b border-[#EADBDB] space-y-2">
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-[#7A5A63] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          placeholder={
                            activeOffer
                              ? `Promo code (e.g. ${activeOffer.code})`
                              : 'Enter promo code'
                          }
                          className="w-full pl-8 pr-2.5 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs uppercase tracking-wider text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-[#FAF7F5] hover:bg-[#F5ECE7] border border-[#3E101D] text-[#3E101D] text-[10px] uppercase tracking-widest font-semibold cursor-pointer transition-colors"
                      >
                        Apply
                      </button>
                    </form>

                    {promoFeedback && (
                      <p
                        className={`text-[11px] flex items-center gap-1 ${
                          promoFeedback.type === 'success'
                            ? 'text-emerald-800'
                            : 'text-red-600'
                        }`}
                      >
                        {promoFeedback.type === 'success' && <Check className="w-3 h-3" />}
                        <span>{promoFeedback.text}</span>
                      </p>
                    )}

                    {appliedOffer && discountAmount > 0 && (
                      <div className="flex items-center justify-between text-[11px] bg-[#FAF7F5] px-2.5 py-1.5 border border-[#EADBDB] text-[#3E101D]">
                        <span>
                          Active Promo: <strong>{appliedOffer.code}</strong> (-₹
                          {discountAmount.toLocaleString('en-IN')})
                        </span>
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          aria-label="Remove promo code"
                          className="text-[#7A5A63] hover:text-[#2A0D15] cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2.5 text-xs text-[#7A5A63]">
                  <div className="flex justify-between">
                    <span>Total Hampers:</span>
                    <span className="font-medium text-[#2A0D15] tabular-nums">
                      {totalItemCount}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-[#2A0D15] tabular-nums">
                      ₹{rawSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {appliedOffer && discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800">
                      <span>Discount ({appliedOffer.code}):</span>
                      <span className="font-semibold tabular-nums">
                        -₹{discountAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Area:</span>
                    <span className="text-right text-[#2A0D15]">CU & Mohali</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="text-[#3E101D] font-medium">Confirmed on WhatsApp</span>
                  </div>

                  <div className="pt-3 border-t border-[#EADBDB] flex justify-between items-baseline text-sm">
                    <span className="font-serif text-[#2A0D15] text-base">
                      Estimated Total:
                    </span>
                    <span className="font-serif font-medium text-2xl text-[#3E101D] tabular-nums">
                      ₹{finalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToWhatsApp}
                  className="w-full py-3.5 px-4 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Proceed to WhatsApp Order</span>
                </button>

                <p className="text-[11px] text-center text-[#7A5A63] font-light">
                  Enter your delivery details first; orders are verified directly on WhatsApp
                  before payment or dispatch.
                </p>
              </div>

              {/* Delivery Assurance Notice */}
              <div className="p-4 bg-white border border-[#EADBDB] text-[11px] text-[#7A5A63] space-y-1">
                <p className="font-semibold text-[#2A0D15]">Handcrafted in Mohali:</p>
                <p className="font-light">
                  We coordinate timing directly with you to ensure a smooth surprise handover at
                  hostel or campus gates.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bag Checkout / Customer & Delivery Details Modal */}
      <CartCheckoutModal
        isOpen={isCheckoutModalOpen}
        items={validatedItems}
        subtotal={rawSubtotal}
        discountAmount={discountAmount}
        finalAmount={finalAmount}
        appliedOffer={appliedOffer}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </div>
  );
};
