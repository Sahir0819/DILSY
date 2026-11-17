import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { Product, ProductCustomisation } from '../types';
import { useStore } from '../context/StoreContext';
import { getCustomerSession } from '../utils/api';
import {
  buildWhatsAppLink,
  EXACT_DELIVERY_POLICY,
  formatProductDisplayTitle,
  generateSingleProductWhatsAppMessage,
  WHATSAPP_PHONE_INTERNATIONAL,
} from '../utils/whatsapp';
import { ProductArtwork } from './ProductArtwork';

interface SignatureOrderModalProps {
  isOpen: boolean;
  product: Product | null;
  initialCustomisation?: ProductCustomisation;
  onClose: () => void;
}

export const SignatureOrderModal: React.FC<SignatureOrderModalProps> = ({
  isOpen,
  product,
  initialCustomisation,
  onClose,
}) => {
  const { settings, calculateDiscount, recordOrderInquiry } = useStore();

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

  // Reset and prefill whenever modal opens for a product
  useEffect(() => {
    if (!isOpen || !product) return;

    const session = getCustomerSession();
    setCustomerName(session?.name || '');
    setCustomerPhone(session?.phone || '');
    setRecipientName(initialCustomisation?.recipientName || '');
    setDeliveryArea(
      settings.deliveryAreas[0] || 'Chandigarh University (North & South Gate)'
    );
    setDeliveryLocation('');
    setDeliveryDate('');
    setDeliveryTime(
      settings.timeWindows[0] || 'Morning (9:00 AM – 12:00 PM)'
    );
    setPersonalNote(initialCustomisation?.personalNote || '');
    setAdditionalInstructions(initialCustomisation?.specialInstructions || '');
    setErrors({});
    setSubmittedState(null);
    setCopied(false);
  }, [isOpen, product, initialCustomisation, settings.deliveryAreas, settings.timeWindows]);

  if (!isOpen || !product) return null;

  const selectedAddOns = initialCustomisation?.selectedAddOns || [];
  const addOnsTotal = selectedAddOns.reduce((acc, a) => acc + a.price * a.quantity, 0);
  const subtotal = product.price + addOnsTotal;
  const { discountAmount, finalAmount, appliedOffer } = calculateDiscount(subtotal);

  const todayIso = new Date().toISOString().split('T')[0];

  const productImage =
    product.customImage ||
    (product.id === 'loved-box'
      ? '/assets/images/product-loved-box.jpg'
      : product.id === 'the-little-affair'
      ? '/assets/images/product-anniversary-box.jpg'
      : product.id === 'the-everything-box'
      ? '/assets/images/product-birthday-box.jpg'
      : null);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!customerName.trim()) {
      nextErrors.customerName = 'Please enter your name.';
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
        'Please enter your delivery address, PG, hostel, or campus gate.';
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

    const customisation: ProductCustomisation = {
      recipientName: recipientName.trim(),
      personalNote: personalNote.trim(),
      specialInstructions: additionalInstructions.trim(),
      polaroidCaption: initialCustomisation?.polaroidCaption,
      selectedAddOns: selectedAddOns.length > 0 ? selectedAddOns : undefined,
    };

    const discountInfo = appliedOffer
      ? { code: appliedOffer.code, amount: discountAmount, finalPrice: finalAmount }
      : null;

    const deliveryDetails = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryArea,
      specificLandmark: deliveryLocation.trim(),
      deliveryDate,
      timeWindow: deliveryTime,
      additionalNotes: additionalInstructions.trim(),
    };

    const message = generateSingleProductWhatsAppMessage(
      product,
      customisation,
      deliveryDetails,
      discountInfo
    );

    const displayTitle = formatProductDisplayTitle(product.name, product.size);

    recordOrderInquiry({
      source: 'single_product',
      customerName: deliveryDetails.customerName,
      customerPhone: deliveryDetails.customerPhone,
      deliveryArea: deliveryDetails.deliveryArea,
      specificLandmark: deliveryDetails.specificLandmark,
      deliveryDate: deliveryDetails.deliveryDate,
      timeWindow: deliveryDetails.timeWindow,
      items: [
        {
          title: displayTitle,
          quantity: 1,
          price: product.price,
          customisation: { ...customisation },
        },
      ],
      addOns: selectedAddOns.length > 0 ? selectedAddOns : undefined,
      subtotal,
      discountAmount,
      total: finalAmount,
      appliedOffer: appliedOffer
        ? { code: appliedOffer.code, title: appliedOffer.title, discountAmount }
        : null,
      specialInstructions: additionalInstructions.trim(),
      rawWhatsappMessage: message,
    });

    const whatsappUrl = buildWhatsAppLink(message, settings.whatsappPhone);
    setSubmittedState({ whatsappUrl, message });

    // Trigger new-tab navigation from an anchor click inside the submit handler
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
      aria-labelledby="signature-order-modal-title"
    >
      <div className="bg-white max-w-2xl w-full border border-[#EADBDB] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in-50 zoom-in-95 font-sans">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#EADBDB] flex items-center justify-between bg-[#FAF7F5] shrink-0">
          <div className="flex items-center gap-2.5">
            <Heart className="w-4 h-4 fill-[#3E101D] text-[#3E101D]" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A5A63]">
                WhatsApp Concierge Order
              </p>
              <h2
                id="signature-order-modal-title"
                className="font-serif text-lg sm:text-xl text-[#2A0D15]"
              >
                Complete Your Order Details
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order modal"
            className="p-1.5 text-[#7A5A63] hover:text-[#2A0D15] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Auto-displayed Selected Hamper Summary */}
          <div className="p-5 sm:p-6 bg-[#FAF7F5]/70 border-b border-[#EADBDB] flex items-center gap-4">
            <div className="w-20 h-16 sm:w-24 sm:h-20 border border-[#EADBDB] bg-white overflow-hidden shrink-0">
              {productImage ? (
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ProductArtwork
                  type={product.illustrationType}
                  className="w-full h-full scale-75 origin-top-left"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#3E101D] bg-white px-2 py-0.5 border border-[#EADBDB]">
                  Size: {product.size}
                </span>
                {appliedOffer && discountAmount > 0 && (
                  <span className="text-[10px] uppercase tracking-wider font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    {appliedOffer.code} Applied (-₹{discountAmount})
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg text-[#2A0D15] truncate">
                {product.name}
              </h3>
              {selectedAddOns.length > 0 && (
                <p className="text-[11px] text-[#7A5A63] mt-0.5 truncate">
                  Includes {selectedAddOns.length} add-on
                  {selectedAddOns.length === 1 ? '' : 's'} (+₹{addOnsTotal})
                </p>
              )}
            </div>

            <div className="text-right shrink-0">
              <span className="block font-serif text-xl sm:text-2xl text-[#3E101D] tabular-nums">
                ₹{finalAmount.toLocaleString('en-IN')}
              </span>
              {discountAmount > 0 && (
                <span className="text-[11px] text-[#7A5A63] line-through tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {submittedState ? (
            /* Post-submit WhatsApp handoff view */
            <div className="p-6 sm:p-8 space-y-5">
              <div className="p-4 bg-[#FAF7F5] border border-[#EADBDB] flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#3E101D] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-serif text-[#2A0D15]">
                    Your order details are ready for WhatsApp
                  </p>
                  <p className="text-xs text-[#7A5A63] mt-1 leading-relaxed">
                    We have prepared your personalised inquiry for{' '}
                    <strong className="text-[#2A0D15]">{displayPhone}</strong>. If
                    WhatsApp did not open automatically, click the button below to
                    send your order.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#2A0D15]">
                    Formatted WhatsApp Order Summary
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
            /* Order Details Form */
            <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
              {Object.keys(errors).length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Please complete all required order and delivery fields below.</span>
                </div>
              )}

              {/* Row 1: Customer Name & Contact Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.16em] font-semibold text-[#2A0D15] mb-1.5">
                    Customer Name *
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

              {/* Row 2: Recipient Name & Delivery Area */}
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
                    placeholder="Who is receiving this hamper?"
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
                  placeholder="Write your heartfelt note to be hand-calligraphed on our wax-sealed card..."
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
                  placeholder="Any surprise handover cues, ribbon notes, or dietary preferences..."
                  className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none focus:border-[#3E101D]"
                />
              </div>

              {/* Confirmation & Delivery Policy Disclaimer */}
              <div className="p-3.5 bg-[#FAF7F5] border-l-2 border-[#3E101D] text-[11px] text-[#7A5A63] leading-relaxed">
                <p className="font-semibold text-[#2A0D15] uppercase tracking-wider text-[10px] mb-1">
                  Order Confirmation & Delivery Policy
                </p>
                <p className="font-light">{EXACT_DELIVERY_POLICY}</p>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-[#EADBDB]">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 border border-[#EADBDB] text-xs uppercase tracking-wider font-semibold text-[#7A5A63] hover:text-[#2A0D15] bg-white transition-colors cursor-pointer"
                >
                  Cancel
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
