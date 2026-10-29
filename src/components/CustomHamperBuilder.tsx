import React, { useState } from 'react';
import { Gift, Check, Sparkles, MessageCircle, AlertCircle, Info, Calendar, Clock, MapPin, User, Heart, Plus, Minus, Trash2, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { CustomHamperForm, AddOnItem, SelectedAddOn } from '../types';
import { AddOnThumbnail } from './AddOnThumbnail';
import { generateCustomHamperWhatsAppMessage, EXACT_DELIVERY_POLICY, getBaseHamperPrice } from '../utils/whatsapp';
import { useStore } from '../context/StoreContext';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface CustomHamperBuilderProps {
  onOpenReviewModal: (title: string, message: string) => void;
  prefilledOccasion?: string;
  onNavigate?: (path: string) => void;
  isStandalonePage?: boolean;
}

export const CustomHamperBuilder: React.FC<CustomHamperBuilderProps> = ({
  onOpenReviewModal,
  prefilledOccasion,
  onNavigate,
  isStandalonePage = true,
}) => {
  const { addons, settings, calculateDiscount, recordOrderInquiry } = useStore();

  const [formData, setFormData] = useState<CustomHamperForm>({
    recipientType: 'Girlfriend / Partner',
    occasion: prefilledOccasion || 'Birthday Box',
    budget: 'Medium / Loved Box — ₹969',
    customBudgetAmount: '',
    selectedAddOns: [],
    recipientName: '',
    personalNote: '',
    specialInstructions: '',
    deliveryArea: settings.deliveryAreas[0] || 'Chandigarh University (North & South Gate)',
    specificLandmark: '',
    deliveryDate: '',
    timeWindow: settings.timeWindows[0] || 'Afternoon (12:00 PM – 4:00 PM)',
    customerName: '',
    customerPhone: '',
  });

  const [selectedRibbon, setSelectedRibbon] = useState('Bordeaux Wine');
  const [activeAddOnTab, setActiveAddOnTab] = useState<'All' | 'Flowers' | 'Chocolates & Treats' | 'Cute Extras'>('All');
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync if prefilledOccasion changes
  React.useEffect(() => {
    if (prefilledOccasion) {
      setFormData((prev) => ({ ...prev, occasion: prefilledOccasion }));
    }
  }, [prefilledOccasion]);

  const ribbonSwatches = [
    { name: 'Bordeaux Wine', hex: '#4A1423' },
    { name: 'Blush Silk', hex: '#F7D8DF' },
    { name: 'Raw Linen', hex: '#EFE8DF' },
    { name: 'Nocturne Black', hex: '#1C1819' },
  ];

  const recipientOptions = [
    'Girlfriend / Partner',
    'Boyfriend / Partner',
    'Best Friend / Hostel Mate',
    'Roommate / PG Friend',
    'Sibling / Family',
    'Self-Care Box',
  ];

  const occasionOptions = [
    'I Love You — For Him',
    'I Love You — For Her',
    'Anniversary Box',
    'Birthday Box',
    'Periods Box (Care & Comfort)',
    'Apology Box (Heartfelt Gesture)',
    'Miss You Box (Long Distance)',
    'Valentine Box (Romance)',
    'Diwali Box (Festive Lights)',
    'Hostel Room Care Package',
    'Exam Good Luck & Motivation',
    'Graduation / Farewell',
  ];

  const budgetOptions = [
    { label: 'Small Box — ₹799', size: 'Small', dim: '18 × 14 × 6 cm', price: 799, desc: 'Compact sweet gesture' },
    { label: 'Medium / Loved Box — ₹969', size: 'Medium', dim: '24 × 20 × 9 cm', price: 969, desc: 'Our signature balanced curation' },
    { label: 'Large Box — ₹1,199', size: 'Large', dim: '32 × 26 × 12 cm', price: 1199, desc: 'Generous keepsake curation' },
    { label: 'Custom Budget', size: 'Custom', dim: 'Custom dimension', price: null, desc: 'Specify custom budget' },
  ];

  const handleToggleAddOn = (addon: AddOnItem) => {
    if (!addon.isAvailable) return;
    setFormData((prev) => {
      const existing = prev.selectedAddOns.find((a) => a.id === addon.id);
      if (existing) {
        return {
          ...prev,
          selectedAddOns: prev.selectedAddOns.filter((a) => a.id !== addon.id),
        };
      } else {
        return {
          ...prev,
          selectedAddOns: [
            ...prev.selectedAddOns,
            { id: addon.id, name: addon.name, price: addon.price, quantity: 1 },
          ],
        };
      }
    });
  };

  const handleUpdateAddOnQty = (id: string, delta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns
        .map((a) => {
          if (a.id === id) {
            const nextQty = a.quantity + delta;
            return nextQty > 0 ? { ...a, quantity: nextQty } : null;
          }
          return a;
        })
        .filter(Boolean) as SelectedAddOn[],
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Please enter your name';
    }

    if (!formData.customerPhone.trim() || formData.customerPhone.trim().length < 8) {
      newErrors.customerPhone = 'Please provide a valid phone number for WhatsApp order updates';
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Please select a preferred delivery date';
    }

    if (formData.budget === 'Custom Budget') {
      const num = Number(formData.customBudgetAmount);
      if (!formData.customBudgetAmount || isNaN(num) || num <= 0) {
        newErrors.customBudgetAmount = 'Please enter a target budget amount';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Pricing calculations
  const addOnsSubtotal = (formData.selectedAddOns || []).reduce(
    (acc, a) => acc + a.price * a.quantity,
    0
  );
  const basePrice = getBaseHamperPrice(formData.budget, formData.customBudgetAmount);
  const estimatedTotal = basePrice !== null ? basePrice + addOnsSubtotal : null;
  const { discountAmount, finalAmount, appliedOffer } = calculateDiscount(estimatedTotal || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const discountInfo = appliedOffer
      ? { code: appliedOffer.code, amount: discountAmount, total: finalAmount }
      : null;

    const message = generateCustomHamperWhatsAppMessage(formData, discountInfo);

    // Save order inquiry into backend
    recordOrderInquiry({
      source: 'custom_builder',
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      deliveryArea: formData.deliveryArea,
      specificLandmark: formData.specificLandmark,
      deliveryDate: formData.deliveryDate,
      timeWindow: formData.timeWindow,
      items: [
        {
          title: `Custom Hamper: ${formData.budget} (${formData.occasion})`,
          quantity: 1,
          price: basePrice || 0,
          customisation: {
            recipientType: formData.recipientType,
            recipientName: formData.recipientName,
            personalNote: formData.personalNote,
          },
        },
      ],
      addOns: formData.selectedAddOns,
      subtotal: estimatedTotal || 0,
      discountAmount,
      total: finalAmount,
      appliedOffer: appliedOffer
        ? { code: appliedOffer.code, title: appliedOffer.title, discountAmount }
        : null,
      specialInstructions: formData.specialInstructions,
      rawWhatsappMessage: message,
    });

    onOpenReviewModal('Custom Hamper Order Blueprint', message);
  };

  const isCustomBudget = formData.budget === 'Custom Budget';
  const availableAddons = addons.filter((a) => a.isAvailable);
  const filteredAddOns = availableAddons.filter((item) => {
    if (activeAddOnTab === 'All') return true;
    return item.category === activeAddOnTab;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2A0D15] py-8 sm:py-14 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {onNavigate && (
          <div className="mb-6">
            <Breadcrumbs
              items={[{ label: 'Custom Hamper' }]}
              onNavigate={onNavigate}
            />
          </div>
        )}

        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5A63] mb-2">
            Bespoke Atelier
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#2A0D15] tracking-tight">
            The Custom Hamper Experience
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6E565D] font-light leading-relaxed">
            Construct an intimate archive of your personal relationship. From selecting the tactile container proportions to typing the exact words we hand-scribe in sealing wax.
          </p>
        </div>

        {/* Mobile Live Summary Pill */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="w-full p-4 bg-white border border-[#EADBDB] flex items-center justify-between text-xs font-sans tracking-wide uppercase text-[#3E101D] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3E101D]" />
              <span>Blueprint Summary</span>
              {estimatedTotal !== null && (
                <span className="font-semibold text-sm text-[#2A0D15]">
                  · ₹{finalAmount.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {mobileSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* 2-Column Layout (Matching Screenshot 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
          {/* Main Form on Left (lg:col-span-8) */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
            {/* STEP 01: Box Dimension */}
            <div className="bg-white p-6 sm:p-8 border border-[#EADBDB]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EADBDB]">
                <span className="text-[11px] font-sans uppercase tracking-[0.2em] font-medium text-[#2A0D15]">
                  01 Choose Box Dimension
                </span>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#7A5A63]">
                  Architectural Vessel
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {budgetOptions.slice(0, 3).map((b) => {
                  const selected = formData.budget === b.label;
                  return (
                    <div
                      key={b.label}
                      onClick={() => setFormData({ ...formData, budget: b.label })}
                      className={`p-4 border transition-all cursor-pointer relative text-center ${
                        selected
                          ? 'border-2 border-[#3E101D] bg-[#FAF7F5]'
                          : 'border-[#EADBDB] hover:border-[#3E101D]'
                      }`}
                    >
                      {selected && (
                        <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#3E101D] text-white flex items-center justify-center text-[9px]">
                          ✓
                        </span>
                      )}
                      <span className="block font-serif text-lg text-[#2A0D15]">{b.size}</span>
                      <span className="block text-[10px] text-[#7A5A63] mt-0.5">{b.dim}</span>
                      <span className="block text-xs font-semibold text-[#2A0D15] mt-2 font-sans">
                        ₹{b.price}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Custom Budget Toggle Option */}
              <div
                onClick={() => setFormData({ ...formData, budget: 'Custom Budget' })}
                className={`p-3 border transition-all cursor-pointer text-xs flex items-center justify-between ${
                  isCustomBudget
                    ? 'border-2 border-[#3E101D] bg-[#FAF7F5]'
                    : 'border-[#EADBDB] hover:border-[#3E101D]'
                }`}
              >
                <span>Or propose a Custom Budget amount</span>
                <span className="font-semibold">{isCustomBudget ? 'Selected' : 'Select'}</span>
              </div>

              {isCustomBudget && (
                <div className="mt-3 p-4 bg-[#FAF7F5] border border-[#EADBDB] space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-[#2A0D15]">
                    Target Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.customBudgetAmount}
                    onChange={(e) => setFormData({ ...formData, customBudgetAmount: e.target.value })}
                    placeholder="e.g. 1500"
                    className="w-full px-3.5 py-2 bg-white border border-[#EADBDB] text-xs text-[#2A0D15] outline-none"
                  />
                </div>
              )}
            </div>

            {/* STEP 02: Theme & Color Palette */}
            <div className="bg-white p-6 sm:p-8 border border-[#EADBDB]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EADBDB]">
                <span className="text-[11px] font-sans uppercase tracking-[0.2em] font-medium text-[#2A0D15]">
                  02 Theme & Color Palette
                </span>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#7A5A63]">
                  Silk Ribbon Swatches
                </span>
              </div>

              {/* Silk Ribbon Swatches from Screenshot 4 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {ribbonSwatches.map((swatch) => {
                  const selected = selectedRibbon === swatch.name;
                  return (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => setSelectedRibbon(swatch.name)}
                      className={`p-2.5 border text-center transition-all cursor-pointer ${
                        selected
                          ? 'border-2 border-[#3E101D] bg-[#FAF7F5]'
                          : 'border-[#EADBDB] hover:border-[#3E101D]'
                      }`}
                    >
                      <div
                        className="w-full h-8 mb-2 border border-black/10"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span className="text-[10px] uppercase tracking-wider text-[#2A0D15] block font-medium">
                        {swatch.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Occasion & Recipient Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.1em] text-[#2A0D15] mb-1.5">
                    Occasion Sentiment
                  </label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none"
                  >
                    {occasionOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.1em] text-[#2A0D15] mb-1.5">
                    Recipient Relation
                  </label>
                  <select
                    value={formData.recipientType}
                    onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none"
                  >
                    {recipientOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* STEP 03: Curated Artisan Add-Ons */}
            <div className="bg-white p-6 sm:p-8 border border-[#EADBDB]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EADBDB]">
                <span className="text-[11px] font-sans uppercase tracking-[0.2em] font-medium text-[#2A0D15]">
                  03 Curated Artisan Add-Ons
                </span>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#7A5A63]">
                  Tactile Elements
                </span>
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs">
                {(['All', 'Flowers', 'Chocolates & Treats', 'Cute Extras'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveAddOnTab(tab)}
                    className={`px-3 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                      activeAddOnTab === tab
                        ? 'bg-[#3E101D] text-white font-medium'
                        : 'border border-[#EADBDB] text-[#6E565D] hover:text-[#2A0D15]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Add-ons list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredAddOns.map((addon) => {
                  const selected = formData.selectedAddOns.find((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddOn(addon)}
                      className={`p-3.5 border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        selected
                          ? 'border-2 border-[#3E101D] bg-[#FAF7F5]'
                          : 'border-[#EADBDB] hover:border-[#3E101D]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <AddOnThumbnail type={addon.illustrationType} className="w-10 h-10 shrink-0 border border-[#EADBDB]" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[#2A0D15] truncate">{addon.name}</p>
                          <p className="text-xs font-semibold text-[#3E101D] tabular-nums mt-0.5 font-sans">
                            +₹{addon.price}
                          </p>
                        </div>
                      </div>

                      {selected ? (
                        <div
                          className="flex items-center gap-1.5 bg-white px-2 py-1 border border-[#EADBDB]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => handleUpdateAddOnQty(addon.id, -1, e)}
                            className="p-0.5 text-[#7A5A63] hover:text-[#2A0D15] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold text-[#2A0D15] px-1 tabular-nums">
                            {selected.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleUpdateAddOnQty(addon.id, 1, e)}
                            className="p-0.5 text-[#7A5A63] hover:text-[#2A0D15] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider text-[#3E101D] font-medium border border-[#EADBDB] px-2 py-1">
                          + Select
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 04: Handwritten Wax-Sealed Note */}
            <div className="bg-white p-6 sm:p-8 border border-[#EADBDB]">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EADBDB]">
                <span className="text-[11px] font-sans uppercase tracking-[0.2em] font-medium text-[#2A0D15]">
                  04 Handwritten Wax-Sealed Note
                </span>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#7A5A63]">
                  Deckle-Edge Cotton Paper
                </span>
              </div>

              <p className="text-xs text-[#7A5A63] mb-4">
                Our resident calligrapher will hand-transcribe your exact sentiment onto 300gsm cold-pressed cotton cardstock:
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2A0D15] mb-1">
                    Recipient's Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="e.g. Priya Sharma, Kabir..."
                    className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2A0D15] mb-1">
                    Card Sentiment Note
                  </label>
                  <textarea
                    rows={3}
                    value={formData.personalNote}
                    onChange={(e) => setFormData({ ...formData, personalNote: e.target.value })}
                    placeholder="To the one who makes ordinary moments feel monumental. Happy anniversary, my heart..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#EADBDB] text-xs font-serif italic text-[#2A0D15] focus:outline-none"
                  />
                  <div className="mt-1 flex items-center justify-between text-[10px] text-[#7A5A63]">
                    <span>Included complimentary with Medium & Large boxes</span>
                    <span>Max 240 characters</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2A0D15] mb-1">
                    Special Packaging / Surprise Instructions
                  </label>
                  <input
                    type="text"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    placeholder="e.g. Midnight surprise delivery, specific ribbon preference"
                    className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* STEP 05: Delivery & Contact Details */}
            <div className="bg-white p-6 sm:p-8 border border-[#EADBDB]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#EADBDB]">
                <span className="text-[11px] font-sans uppercase tracking-[0.2em] font-medium text-[#2A0D15]">
                  05 Delivery & Dispatch
                </span>
                <span className="text-[10px] font-sans uppercase tracking-widest text-[#7A5A63]">
                  Campus & Local Handover
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#2A0D15] mb-1">
                      Your Name *
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Your full name"
                      className={`w-full px-3.5 py-2 bg-[#FAF7F5] border text-xs text-[#2A0D15] outline-none ${
                        errors.customerName ? 'border-red-500' : 'border-[#EADBDB]'
                      }`}
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#2A0D15] mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      id="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className={`w-full px-3.5 py-2 bg-[#FAF7F5] border text-xs text-[#2A0D15] outline-none ${
                        errors.customerPhone ? 'border-red-500' : 'border-[#EADBDB]'
                      }`}
                    />
                    {errors.customerPhone && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.customerPhone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#2A0D15] mb-1">
                      Delivery Area (CU & Mohali)
                    </label>
                    <select
                      value={formData.deliveryArea}
                      onChange={(e) => setFormData({ ...formData, deliveryArea: e.target.value })}
                      className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] outline-none"
                    >
                      {settings.deliveryAreas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#2A0D15] mb-1">
                      Preferred Date *
                    </label>
                    <input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      className={`w-full px-3.5 py-2 bg-[#FAF7F5] border text-xs text-[#2A0D15] outline-none ${
                        errors.deliveryDate ? 'border-red-500' : 'border-[#EADBDB]'
                      }`}
                    />
                    {errors.deliveryDate && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.deliveryDate}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#2A0D15] mb-1">
                    Specific Landmark / Campus Gate / PG Details
                  </label>
                  <input
                    type="text"
                    value={formData.specificLandmark}
                    onChange={(e) => setFormData({ ...formData, specificLandmark: e.target.value })}
                    placeholder="e.g. CU North Gate, Kharar Road PG 12..."
                    className="w-full px-3.5 py-2 bg-[#FAF7F5] border border-[#EADBDB] text-xs text-[#2A0D15] outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 mt-6 border-t border-[#EADBDB]">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#3E101D] hover:bg-[#2A0B13] text-white text-[11px] uppercase tracking-[0.2em] font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Review Blueprint & Order on WhatsApp</span>
                </button>
                <p className="mt-2 text-center text-[10px] text-[#7A5A63]">
                  All items, timing, and handover specifics are personally verified on WhatsApp before dispatch.
                </p>
              </div>
            </div>
          </form>

          {/* Sticky Summary Card on Right (Matching Screenshot 4) */}
          <div className={`lg:col-span-4 ${mobileSummaryOpen ? 'block' : 'hidden lg:block'} sticky top-24 space-y-4`}>
            <div className="bg-white p-6 sm:p-7 border border-[#EADBDB] space-y-4">
              <div className="pb-3 border-b border-[#EADBDB]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7A5A63]">
                  Atelier Receipt
                </p>
                <h3 className="font-serif text-xl font-normal text-[#2A0D15] mt-1">
                  Blueprint Summary
                </h3>
              </div>

              <div className="space-y-3 text-xs text-[#6E565D]">
                <div className="flex justify-between py-1 border-b border-[#EADBDB]/50">
                  <span className="text-[10px] uppercase tracking-wider text-[#7A5A63]">Selected Box:</span>
                  <span className="font-medium text-[#2A0D15]">{formData.budget.split('—')[0]}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EADBDB]/50">
                  <span className="text-[10px] uppercase tracking-wider text-[#7A5A63]">Wax Seal Finish:</span>
                  <span className="font-medium text-[#3E101D]">{selectedRibbon}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EADBDB]/50">
                  <span className="text-[10px] uppercase tracking-wider text-[#7A5A63]">Occasion:</span>
                  <span className="font-medium text-[#2A0D15]">{formData.occasion}</span>
                </div>

                {formData.selectedAddOns.length > 0 && (
                  <div className="py-2 border-b border-[#EADBDB]/50 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#7A5A63] block">
                      Artisan Add-ons ({formData.selectedAddOns.length}):
                    </span>
                    {formData.selectedAddOns.map((addon) => (
                      <div key={addon.id} className="flex justify-between pl-1 text-[11px]">
                        <span>{addon.quantity}x {addon.name}</span>
                        <span className="font-medium text-[#2A0D15] tabular-nums">
                          ₹{addon.price * addon.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-[#EADBDB]/50">
                  <span className="text-[10px] uppercase tracking-wider text-[#7A5A63]">Personal Note:</span>
                  <span className="font-medium text-[#2A0D15]">
                    {formData.personalNote ? 'Calligraphed Free' : 'Not Added'}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-wider text-[#7A5A63]">Estimated Total:</span>
                    <span className="text-2xl font-serif font-normal text-[#2A0D15] tabular-nums">
                      {estimatedTotal !== null ? `₹${finalAmount.toLocaleString('en-IN')}` : 'To be confirmed'}
                    </span>
                  </div>
                  {appliedOffer && (
                    <p className="text-[11px] text-emerald-800 mt-1">
                      Applied: {appliedOffer.code} (-₹{discountAmount})
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-3.5 bg-[#3E101D] hover:bg-[#2A0B13] text-white text-[11px] font-medium uppercase tracking-[0.2em] transition-all cursor-pointer shadow-xs"
                >
                  Start Creating
                </button>
              </div>
            </div>

            {/* Atelier Policy Notice */}
            <div className="p-4 bg-white border border-[#EADBDB] text-[11px] text-[#7A5A63] space-y-1">
              <p className="font-medium text-[#2A0D15] uppercase tracking-wider text-[10px]">Atelier Promise:</p>
              <p className="font-light leading-relaxed">
                Personalized preview sent on WhatsApp before final handover. Delivered directly to Chandigarh University & Mohali PGs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
