import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  ShoppingBag,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  ArrowLeft,
} from 'lucide-react';
import { CartItem, DeliveryDetails, Offer } from '../types';
import { useStore } from '../context/StoreContext';
import { getCustomerSession } from '../utils/api';
import {
  buildWhatsAppLink,
  EXACT_DELIVERY_POLICY,
  formatProductDisplayTitle,
  generateCartWhatsAppMessage,
  WHATSAPP_PHONE_INTERNATIONAL,
} from '../utils/whatsapp';
import { getCartItemSubtotal, getCartItemUnitPrice } from '../utils/cart';

interface CartCheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
  appliedOffer: Offer | null;
  onClose: () => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  items,
  subtotal,
  discountAmount,
  finalAmount,
  appliedOffer,
  onClose,
}) => {
  const { settings, recordOrderInquiry } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [deliveryArea, setDeliveryArea] = useState(
    settings.deliveryAreas[0] || 'Chandigarh University (North & South Gate)'
  );
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState(
    settings.timeWindows[0] || 'Morning (9:00 AM – 12:00 PM)'
  );
  const [personalNote, setPersonalNote] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedState, setSubmittedState] = useState<{
    whatsappUrl: string;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const wasOpenRef = React.useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      const session = getCustomerSession();
      setCustomerName(session?.name || '');
      setCustomerPhone(session?.phone || '');
      const firstRecipient =
        items.find((i) => i.customisation.recipientName)?.customisation.recipientName || '';
      setRecipientName(firstRecipient);
      setDeliveryArea(
        settings.deliveryAreas[0] || 'Chandigarh University (North & South Gate)'
      );
      setDeliveryLocation('');
      setDeliveryDate('');
      setDeliveryTime(
        settings.timeWindows[0] || 'Morning (9:00 AM – 12:00 PM)'
      );
      setPersonalNote('');
      setAdditionalInstructions('');
      setErrors({});
      setSubmittedState(null);
      setCopied(false);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, items, settings.deliveryAreas, settings.timeWindows]);

  if (!isOpen || items.length === 0) return null;

  const totalHampers = items.reduce((acc, i) => acc + i.quantity, 0);
  const todayIso = new Date().toISOString().split('T')[0];

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      nextErrors.customerName = 'Please enter your full name.';
    }

    const digitsOnly = customerPhone.replace(/\D/g, '');
    if (!customerPhone.trim() || digitsOnly.length < 10) {
      nextErrors.customerPhone = 'Please enter a valid 10-digit WhatsApp or contact number.';
    }

    if (!recipientName.trim()) {
      nextErrors.recipientName = 'Please enter the recipient’s name.';
    }

    if (!deliveryLocation.trim()) {
      nextErrors.deliveryLocation =
        'Please enter the delivery address, PG, hostel, or campus location.';
    }

    if (!deliveryDate) {
      nextErrors.deliveryDate = 'Please select a preferred delivery date.';
    }

    if (!deliveryTime) {
      nextErrors.deliveryTime = 'Please select a preferred delivery time.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const deliveryDetails: DeliveryDetails = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      recipientName: recipientName.trim(),
      deliveryArea,
      specificLandmark: deliveryLocation.trim(),
      deliveryDate,
      timeWindow: deliveryTime,
      additionalNotes: additionalInstructions.trim(),
    };

    const discountInfo =
      appliedOffer && discountAmount > 0
        ? { code: appliedOffer.code, amount: discountAmount, total: finalAmount }
        : null;

    const message = generateCartWhatsAppMessage(
      items,
      subtotal,
      deliveryDetails,
      discountInfo,
      personalNote
    );

    recordOrderInquiry({
      source: 'cart',
      customerName: deliveryDetails.customerName,
      customerPhone: deliveryDetails.customerPhone,
      deliveryArea: deliveryDetails.deliveryArea,
      specificLandmark: deliveryDetails.specificLandmark,
      deliveryDate: deliveryDetails.deliveryDate,
      timeWindow: deliveryDetails.timeWindow,
      items: items.map((item) => ({
        title: formatProductDisplayTitle(
          item.product.name,
          item.selectedSize || item.product.size
        ),
        quantity: item.quantity,
        price: getCartItemUnitPrice(item),
        customisation: {
          ...item.customisation,
          selectedSize: item.selectedSize || item.product.size,
          collectionId: item.collectionId,
        },
      })),
      subtotal,
      discountAmount,
      total: finalAmount,
      appliedOffer:
        appliedOffer && discountAmount > 0
          ? { code: appliedOffer.code, title: appliedOffer.title, discountAmount }
          : null,
      specialInstructions: [
        personalNote.trim() ? `Note: ${personalNote.trim()}` : '',
        additionalInstructions.trim(),
      ]
        .filter(Boolean)
        .join(' | '),
      rawWhatsappMessage: message,
    });

    const whatsappUrl = buildWhatsAppLink(message, settings.whatsappPhone);
    setSubmittedState({ whatsappUrl, message });

    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    if (!submittedState) return;
    navigator.clipboard.writeText(submittedState.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayPhone = settings.whatsappPhone
    ? `+91 ${settings.whatsappPhone}`
    : WHATSAPP_PHONE_INTERNATIONAL;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-checkout-modal-title"
    >
      <div className="bg-white max-w-2xl w-full border border-[#EADBDB] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in-50 zoom-in-95 font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EADBDB] flex items-center justify-between bg-[#FAF7F5] shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#3E101D]" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A5A63]">
                Bag WhatsApp Checkout
              </p>
              <h2
                id="cart-checkout-modal-title"
                className="font-serif text-lg sm:text-xl text-[#2A0D15]"
              >
                Complete Your Delivery & Order Details
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout modal"
            className="p-1.5 text-[#7A5A63] hover:text-[#2A0D15] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Accurate Order Summary Section */}
          <div className="p-5 sm:p-6 bg-[#FAF7F5]/75 border-b border-[#EADBDB] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#3E101D]">
                Order Summary ({totalHampers} {totalHampers === 1 ? 'Hamper' : 'Hampers'})
              </span>
              <span className="text-[11px] text-[#7A5A63]">
                Individual items preserved
              </span>
            </div>

            <div className="divide-y divide-[#EADBDB] bg-white border border-[#EADBDB]">
              {items.map((item) => {
                const unitPrice = getCartItemUnitPrice(item);
                const itemSubtotal = getCartItemSubtotal(item);
                const size = item.selectedSize || item.product.size;

                return (
                  <div
                    key={item.id}
                    className="p-3 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-sm text-[#2A0D15] truncate">
                        {item.product.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#7A5A63] mt-0.5">
                        <span>Size: {size}</span>
                        <span>Qty: {item.quantity}</span>
                        <span className="tabular-nums">
                          Unit: ₹{unitPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {item.customisation.selectedAddOns &&
                        item.customisation.selectedAddOns.length > 0 && (
                          <p className="text-[10px] text-[#3E101D] mt-0.5 truncate">
                            Add-ons:{' '}
                            {item.customisation.selectedAddOns
                              .map((a) => `${a.quantity}x ${a.name}`)
                              .join(', ')}
                          </p>
                        )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif text-sm font-medium text-[#3E101D] tabular-nums">
                        ₹{itemSubtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-1 text-xs pt-1">
              <div className="flex justify-between text-[#7A5A63]">
                <span>Total Hampers:</span>
                <span className="font-medium text-[#2A0D15] tabular-nums">{totalHampers}</span>
              </div>
              <div className="flex justify-between text-[#7A5A63]">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#2A0D15] tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {appliedOffer && discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Promo Discount ({appliedOffer.code}):</span>
                  <span className="font-semibold tabular-nums">
                    -₹{discountAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#7A5A63]">
                <span>Delivery Fee:</span>
                <span className="text-[#3E101D] font-medium">Confirmed on WhatsApp</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#EADBDB]">
                <span className="font-serif text-base text-[#2A0D15]">
                  Final Estimated Total:
                </span>
                <span className="font-serif text-xl sm:text-2xl text-[#3E101D] tabular-nums">
                  ₹{finalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {submittedState ? (
            /* Post-submit WhatsApp handoff view */
            <div className="p-6 sm:p-8 space-y-5">
              <div className="p-4 bg-[#FAF7F5] border border-[#EADBDB] flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#3E101D] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-serif text-[#2A0D15]">
                    Your bag order is ready for WhatsApp
                  </p>
                  <p className="text-xs text-[#7A5A63] mt-1 leading-relaxed">
                    We have prepared your complete order summary for{' '}
                    <strong className="text-[#2A0D15]">{displayPhone}</strong>. If
                    WhatsApp did not open automatically, click below to send your
                    order.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#2A0D15]">
                    Generated WhatsApp Message
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-xs text-[#3E101D] hover:text-[#2A0D15] flex items-center gap-1 font-medium cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? 'Copied' : 'Copy Message'}</span>
                  </button>
                </div>
                <div className="bg-[#FAF7F5] border border-[#EADBDB] p-3.5 text-[11px] font-mono text-[#2A0D15] whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                  {submittedState.message}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittedState(null)}
                  className="w-full sm:w-auto px-5 py-3 border border-[#EADBDB] text-xs uppercase tracking-wider font-semibold text-[#7A5A63] hover:text-[#2A0D15] bg-white cursor-pointer"
                >
                  Edit Details
                </button>
                <a
                  href={submittedState.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#3E101D] hover:bg-[#2A0B13] text-white text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open WhatsApp Chat</span>
                </a>
              </div>
            </div>
          ) : (
            /* Customer & Delivery Form */
            <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
              {Object.keys(errors).length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Please complete all required customer and delivery fields below.</span>
                </div>
              )}

              {/* Row 1: Customer Name & Contact Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#2A0D15] mb-1.5">
                    Customer Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#7A5A63] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (errors.customerName) {
                          setErrors((prev) => ({ ...prev, customerName: '' }));
                        }
                      }}
                      placeholder="Your full name"
                      className={`w-full pl-9 pr-3 py-2.5 bg-[#FAF7F5] border text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D] ${
                        errors.customerName ? 'border-red-500' : 'border-[#EADBDB]'
                      }`}
                    />
                  </div>
                  {errors.customerName && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#2A0D15] mb-1.5">
                    WhatsApp / Contact Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#7A5A63] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (errors.customerPhone) {
                          setErrors((prev) => ({ ...prev, customerPhone: '' }));
                        }
                      }}
                      placeholder="+91 98765 43210"
                      className={`w-full pl-9 pr-3 py-2.5 bg-[#FAF7F5] border text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D] ${
                        errors.customerPhone ? 'border-red-500' : 'border-[#EADBDB]'
                      }`}
                    />
                  </div>
                  {errors.customerPhone && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.customerPhone}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Recipient Name & Service Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#2A0D15] mb-1.5">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => {
                      setRecipientName(e.target.value);
                      if (errors.recipientName) {
                        setErrors((prev) => ({ ...prev, recipientName: '' }));
                      }
                    }}
                    placeholder="Who is receiving this order?"
                    className={`w-full px-3 py-2.5 bg-[#FAF7F5] border text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D] ${
                      errors.recipientName ? 'border-red-500' : 'border-[#EADBDB]'
                    }`}
                  />
                  {errors.recipientName && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.recipientName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#2A0D15] mb-1.5">
                    Service Area
                  </label>
                  <select
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                  >
                    {settings.deliveryAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Delivery Address / PG / Hostel / Location */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#2A0D15] mb-1.5">
                  Delivery Address / PG / Hostel / Location *
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#7A5A63] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={deliveryLocation}
                    onChange={(e) => {
                      setDeliveryLocation(e.target.value);
                      if (errors.deliveryLocation) {
                        setErrors((prev) => ({ ...prev, deliveryLocation: '' }));
                      }
                    }}
                    placeholder="e.g. CU South Gate, Nek Chand Hostel Tower 3, Sunny Enclave PG 12..."
                    className={`w-full pl-9 pr-3 py-2.5 bg-[#FAF7F5] border text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D] ${
                      errors.deliveryLocation ? 'border-red-500' : 'border-[#EADBDB]'
                    }`}
                  />
                </div>
                {errors.deliveryLocation && (
                  <p className="mt-1 text-[11px] text-red-600">{errors.deliveryLocation}</p>
                )}
              </div>

              {/* Row 4: Preferred Delivery Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#2A0D15] mb-1.5">
                    Preferred Delivery Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-[#7A5A63] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      min={todayIso}
                      value={deliveryDate}
                      onChange={(e) => {
                        setDeliveryDate(e.target.value);
                        if (errors.deliveryDate) {
                          setErrors((prev) => ({ ...prev, deliveryDate: '' }));
                        }
                      }}
                      className={`w-full pl-9 pr-3 py-2.5 bg-[#FAF7F5] border text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D] ${
                        errors.deliveryDate ? 'border-red-500' : 'border-[#EADBDB]'
                      }`}
                    />
                  </div>
                  {errors.deliveryDate && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.deliveryDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#2A0D15] mb-1.5">
                    Preferred Delivery Time *
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-[#7A5A63] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={deliveryTime}
                      onChange={(e) => {
                        setDeliveryTime(e.target.value);
                        if (errors.deliveryTime) {
                          setErrors((prev) => ({ ...prev, deliveryTime: '' }));
                        }
                      }}
                      className={`w-full pl-9 pr-3 py-2.5 bg-[#FAF7F5] border text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D] ${
                        errors.deliveryTime ? 'border-red-500' : 'border-[#EADBDB]'
                      }`}
                    >
                      {settings.timeWindows.map((win) => (
                        <option key={win} value={win}>
                          {win}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.deliveryTime && (
                    <p className="mt-1 text-[11px] text-red-600">{errors.deliveryTime}</p>
                  )}
                </div>
              </div>

              {/* Row 5: Personal Message / Handwritten Note (Optional) */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#2A0D15] mb-1.5">
                  Personal Message or Handwritten Note{' '}
                  <span className="text-[#7A5A63] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="Write any overarching personal message or note for the gift card..."
                  className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                />
              </div>

              {/* Row 6: Additional Instructions (Optional) */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#2A0D15] mb-1.5">
                  Additional Instructions{' '}
                  <span className="text-[#7A5A63] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Surprise handover cues, ribbon styling preferences, gate instructions..."
                  className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                />
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 bg-[#FAF7F5] border-l-2 border-[#3E101D] text-[11px] text-[#7A5A63] leading-relaxed">
                <p className="font-semibold text-[#2A0D15] uppercase tracking-wider text-[10px] mb-1">
                  Order Confirmation & Delivery Policy
                </p>
                <p className="font-light">{EXACT_DELIVERY_POLICY}</p>
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-[#EADBDB]">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 border border-[#EADBDB] text-xs uppercase tracking-wider font-semibold text-[#7A5A63] hover:text-[#2A0D15] bg-white transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Go Back & Edit</span>
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 bg-[#3E101D] hover:bg-[#2A0B13] text-white text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Continue to WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
