import React from 'react';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Heart, ArrowLeft, MessageCircle, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';
import { ProductArtwork } from '../components/ProductArtwork';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useStore } from '../context/StoreContext';
import { generateCartWhatsAppMessage, EXACT_DELIVERY_POLICY } from '../utils/whatsapp';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onNavigate: (path: string) => void;
  onOpenReviewModal: (title: string, message: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
  onOpenReviewModal,
}) => {
  const { products, calculateDiscount, recordOrderInquiry, settings } = useStore();

  // Validate items against authoritative product database to avoid client-tampered prices
  const validatedItems = items.map((item) => {
    const verifiedProduct = products.find((p) => p.id === item.product.id) || item.product;
    return {
      ...item,
      product: verifiedProduct,
    };
  });

  const rawSubtotal = validatedItems.reduce((acc, item) => {
    const addOnsCost = (item.customisation.selectedAddOns || []).reduce(
      (aCost, a) => aCost + a.price * a.quantity,
      0
    );
    return acc + (item.product.price + addOnsCost) * item.quantity;
  }, 0);

  const { discountAmount, finalAmount, appliedOffer } = calculateDiscount(rawSubtotal);
  const totalItemCount = validatedItems.reduce((acc, i) => acc + i.quantity, 0);

  const handleCheckoutWhatsApp = () => {
    if (validatedItems.length === 0) return;

    const discountInfo = appliedOffer
      ? { code: appliedOffer.code, amount: discountAmount, total: finalAmount }
      : null;

    const deliveryDetails = {
      customerName: 'Valued Gifting Customer',
      customerPhone: '',
      deliveryArea: settings.deliveryAreas[0] || 'Chandigarh University Area',
      specificLandmark: '',
      deliveryDate: 'Standard Delivery',
      timeWindow: 'Afternoon (12:00 PM – 4:00 PM)',
    };

    const message = generateCartWhatsAppMessage(validatedItems, rawSubtotal, deliveryDetails as any, discountInfo);

    // Save order inquiry to backend
    recordOrderInquiry({
      source: 'cart',
      customerName: 'Valued Gifting Customer',
      customerPhone: '',
      deliveryArea: settings.deliveryAreas[0] || 'Chandigarh University Area',
      specificLandmark: '',
      deliveryDate: 'Standard Delivery',
      timeWindow: 'Afternoon (12:00 PM – 4:00 PM)',
      items: validatedItems.map((item) => ({
        title: `${item.product.name} (${item.product.size})`,
        quantity: item.quantity,
        price: item.product.price,
        customisation: item.customisation as any,
      })),
      subtotal: rawSubtotal,
      discountAmount,
      total: finalAmount,
      appliedOffer: appliedOffer
        ? { code: appliedOffer.code, title: appliedOffer.title, discountAmount }
        : null,
      rawWhatsappMessage: message,
    });

    onOpenReviewModal('Complete Bag WhatsApp Inquiry', message);
  };

  return (
    <div className="min-h-screen bg-[#FCE7ED] text-[#3B2028] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'Shopping Bag' }]}
            onNavigate={onNavigate}
          />
        </div>

        {/* Page Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#F1C5D1]">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#3B2028]">
              Your Shopping Bag
            </h1>
            <p className="text-xs text-[#79665C] mt-1">
              {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in your bag
            </p>
          </div>

          {validatedItems.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-xs text-[#79665C] hover:text-[#9F2343] transition-colors cursor-pointer"
            >
              Clear Bag
            </button>
          )}
        </div>

        {/* Empty Bag State */}
        {validatedItems.length === 0 ? (
          <div className="p-12 sm:p-16 bg-[#FFFAF8] rounded-3xl border border-[#F1C5D1] text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FFF1F4] border border-[#F1C5D1] text-[#9F2343] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#3B2028]">
              Your bag is empty
            </h2>
            <p className="text-xs text-[#79665C] leading-relaxed max-w-sm mx-auto">
              Looks like you haven't added any hampers to your bag yet. Explore our curated occasion hampers or build your custom gift.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => onNavigate('/hampers')}
                className="px-6 py-3 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Explore Hampers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('/custom-hamper')}
                className="px-6 py-3 bg-[#FFFAF8] hover:bg-[#FFF1F4] text-[#9F2343] border border-[#F1C5D1] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
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
                const addOnsCost = (item.customisation.selectedAddOns || []).reduce(
                  (cost, a) => cost + a.price * a.quantity,
                  0
                );
                const itemTotalPrice = (item.product.price + addOnsCost) * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 bg-[#FFFAF8] rounded-2xl border border-[#F1C5D1] shadow-xs flex flex-col sm:flex-row gap-5 items-start justify-between"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[#F1C5D1] bg-[#FFF1F4] shrink-0">
                      {item.product.customImage ? (
                        <img
                          src={item.product.customImage}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ProductArtwork type={item.product.illustrationType} className="scale-75 origin-top-left" />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-[#9F2343] bg-[#FFF1F4] px-2 py-0.5 rounded-full border border-[#F1C5D1]">
                          Size: {item.product.size}
                        </span>
                        {item.customisation.recipientChoice && (
                          <span className="text-[10px] font-semibold text-[#72172F] bg-[#FFF1F4] px-2 py-0.5 rounded-full border border-[#F1C5D1]">
                            {item.customisation.recipientChoice}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#3B2028]">
                        {item.product.name}
                      </h3>

                      <p className="text-xs text-[#79665C]">
                        Base Price: ₹{item.product.price.toLocaleString('en-IN')}
                      </p>

                      {/* Customisation Notes Preview */}
                      {item.customisation.recipientName && (
                        <p className="text-xs text-[#3B2028]">
                          <strong>Recipient:</strong> {item.customisation.recipientName}
                        </p>
                      )}
                      {item.customisation.personalNote && (
                        <p className="text-xs text-[#79665C] italic line-clamp-1">
                          "{item.customisation.personalNote}"
                        </p>
                      )}

                      {/* Selected Add-ons */}
                      {item.customisation.selectedAddOns && item.customisation.selectedAddOns.length > 0 && (
                        <div className="pt-1 text-[11px] text-[#9F2343] space-y-0.5">
                          <span className="font-semibold text-[#3B2028]">Add-ons:</span>
                          {item.customisation.selectedAddOns.map((addon) => (
                            <span key={addon.id} className="block pl-1">
                              + {addon.quantity}x {addon.name} (₹{addon.price * addon.quantity})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quantity & Price Controls */}
                    <div className="flex flex-col items-end gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-lg font-serif font-bold text-[#9F2343] tabular-nums">
                        ₹{itemTotalPrice.toLocaleString('en-IN')}
                      </span>

                      <div className="flex items-center gap-2 bg-[#FFF1F4] p-1 rounded-xl border border-[#F1C5D1]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 text-[#79665C] hover:text-[#9F2343] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-[#3B2028] px-2 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 text-[#79665C] hover:text-[#9F2343] cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[11px] text-red-600 hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
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
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#9F2343] hover:text-[#72172F] cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Shopping Hampers</span>
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">
              <div className="bg-[#FFFAF8] p-6 rounded-3xl border border-[#F1C5D1] shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#3B2028] pb-3 border-b border-[#F1C5D1]">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs text-[#79665C]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-[#3B2028] tabular-nums">
                      ₹{rawSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {appliedOffer && (
                    <div className="flex justify-between text-emerald-800">
                      <span>Discount ({appliedOffer.code}):</span>
                      <span className="font-semibold tabular-nums">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Area:</span>
                    <span className="text-right text-[#3B2028]">CU & Mohali</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Delivery Fee:</span>
                    <span className="text-[#9F2343] font-medium">Confirmed on WhatsApp</span>
                  </div>

                  <div className="pt-3 border-t border-[#F1C5D1] flex justify-between items-baseline text-sm">
                    <span className="font-bold text-[#3B2028]">Estimated Total:</span>
                    <span className="font-serif font-bold text-2xl text-[#9F2343] tabular-nums">
                      ₹{finalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-3.5 px-4 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md shadow-[#9F2343]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Proceed to WhatsApp Order</span>
                </button>

                <p className="text-[11px] text-center text-[#79665C]">
                  Every order is verified directly on WhatsApp before payment or dispatch.
                </p>
              </div>

              {/* Delivery Assurance Notice */}
              <div className="p-4 bg-[#FFFAF8] rounded-2xl border border-[#F1C5D1] text-[11px] text-[#79665C] space-y-1">
                <p className="font-semibold text-[#3B2028]">Handcrafted in Mohali:</p>
                <p>
                  We coordinate timing directly with you to ensure a smooth surprise handover at hostel or campus gates.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
