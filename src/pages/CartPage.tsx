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
              {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in your curation
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
            <h2 className="text-2xl font-serif text-[#2A0D15]">
              Your bag is empty
            </h2>
            <p className="text-xs text-[#7A5A63] leading-relaxed max-w-sm mx-auto font-light">
              Looks like you haven't added any hampers to your bag yet. Explore our curated occasion hampers or build your custom gift.
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
                const addOnsCost = (item.customisation.selectedAddOns || []).reduce(
                  (cost, a) => cost + a.price * a.quantity,
                  0
                );
                const itemTotalPrice = (item.product.price + addOnsCost) * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 bg-white border border-[#EADBDB] flex flex-col sm:flex-row gap-5 items-start justify-between"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden border border-[#EADBDB] bg-[#FAF7F5] shrink-0">
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
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#3E101D] bg-[#FAF7F5] px-2 py-0.5 border border-[#EADBDB]">
                          Size: {item.product.size}
                        </span>
                        {item.customisation.recipientChoice && (
                          <span className="text-[10px] font-medium text-[#7A5A63] bg-[#FAF7F5] px-2 py-0.5 border border-[#EADBDB]">
                            {item.customisation.recipientChoice}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-lg text-[#2A0D15]">
                        {item.product.name}
                      </h3>

                      <p className="text-xs text-[#7A5A63]">
                        Base Price: ₹{item.product.price.toLocaleString('en-IN')}
                      </p>

                      {/* Customisation Notes Preview */}
                      {item.customisation.recipientName && (
                        <p className="text-xs text-[#2A0D15]">
                          <strong>Recipient:</strong> {item.customisation.recipientName}
                        </p>
                      )}
                      {item.customisation.personalNote && (
                        <p className="text-xs text-[#7A5A63] italic line-clamp-1 font-light">
                          "{item.customisation.personalNote}"
                        </p>
                      )}

                      {/* Selected Add-ons */}
                      {item.customisation.selectedAddOns && item.customisation.selectedAddOns.length > 0 && (
                        <div className="pt-1 text-[11px] text-[#3E101D] space-y-0.5">
                          <span className="font-semibold text-[#2A0D15]">Add-ons:</span>
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
                      <span className="text-lg font-serif font-medium text-[#3E101D] tabular-nums">
                        ₹{itemTotalPrice.toLocaleString('en-IN')}
                      </span>

                      <div className="flex items-center gap-2 bg-[#FAF7F5] p-1 border border-[#EADBDB]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 text-[#7A5A63] hover:text-[#3E101D] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-medium text-[#2A0D15] px-2 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 text-[#7A5A63] hover:text-[#3E101D] cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
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

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">
              <div className="bg-white p-6 border border-[#EADBDB] space-y-4">
                <h3 className="font-serif text-lg text-[#2A0D15] pb-3 border-b border-[#EADBDB]">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs text-[#7A5A63]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-[#2A0D15] tabular-nums">
                      ₹{rawSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {appliedOffer && (
                    <div className="flex justify-between text-[#3E101D]">
                      <span>Discount ({appliedOffer.code}):</span>
                      <span className="font-semibold tabular-nums">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Area:</span>
                    <span className="text-right text-[#2A0D15]">CU & Mohali</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Delivery Fee:</span>
                    <span className="text-[#3E101D] font-medium">Confirmed on WhatsApp</span>
                  </div>

                  <div className="pt-3 border-t border-[#EADBDB] flex justify-between items-baseline text-sm">
                    <span className="font-serif text-[#2A0D15] text-base">Estimated Total:</span>
                    <span className="font-serif font-medium text-2xl text-[#3E101D] tabular-nums">
                      ₹{finalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-3.5 px-4 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Proceed to WhatsApp Order</span>
                </button>

                <p className="text-[11px] text-center text-[#7A5A63] font-light">
                  Every order is verified directly on WhatsApp before payment or dispatch.
                </p>
              </div>

              {/* Delivery Assurance Notice */}
              <div className="p-4 bg-white border border-[#EADBDB] text-[11px] text-[#7A5A63] space-y-1">
                <p className="font-semibold text-[#2A0D15]">Handcrafted in Mohali:</p>
                <p className="font-light">
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
