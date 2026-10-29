import React, { useState } from 'react';
import { Gift, Check, Sparkles, MessageCircle, AlertCircle, Info, Calendar, Clock, MapPin, User, Heart, Plus, Minus, Trash2, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { CustomHamperForm, AddOnItem, SelectedAddOn } from '../types';
import { AddOnThumbnail } from './AddOnThumbnail';
import { generateCustomHamperWhatsAppMessage, EXACT_DELIVERY_POLICY, getThemePackagingGuidance, getBaseHamperPrice } from '../utils/whatsapp';
import { useStore } from '../context/StoreContext';
import { Breadcrumbs } from './Breadcrumbs';

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
    budget: 'Medium Box — ₹969',
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

  const [activeAddOnTab, setActiveAddOnTab] = useState<'All' | 'Flowers' | 'Chocolates & Treats' | 'Cute Extras'>('All');
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync if prefilledOccasion changes
  React.useEffect(() => {
    if (prefilledOccasion) {
      setFormData((prev) => ({ ...prev, occasion: prefilledOccasion }));
    }
  }, [prefilledOccasion]);

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
    { label: 'Small Box — ₹799', size: 'Small', desc: 'A budget-friendly sweet gesture' },
    { label: 'Medium / Loved Box — ₹969', size: 'Medium', desc: 'Our signature balanced hamper' },
    { label: 'Large Box — ₹1,199', size: 'Large', desc: 'Generous hamper with extra room' },
    { label: 'Custom Budget', size: 'Custom', desc: 'Specify your target budget' },
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

  const handleRemoveAddOn = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.filter((a) => a.id !== id),
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
    <div className="min-h-screen bg-[#FCE7ED] text-[#3B2028] py-8 sm:py-12">
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
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9F2343] bg-[#FFFAF8] px-3 py-1 rounded-full border border-[#F1C5D1] mb-2 shadow-2xs">
            <Heart className="w-3.5 h-3.5 fill-[#9F2343] text-[#9F2343]" />
            <span>Personalised Hamper Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3B2028] tracking-tight">
            Create Your Custom Hamper
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#79665C] font-light leading-relaxed">
            Follow our 6 simple steps to tailor a personalised gift hamper. Packaging is styled to your chosen occasion, accompanied by your handwritten card and verified on WhatsApp before dispatch.
          </p>
        </div>

        {/* Mobile Collapsible Live Summary Button */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="w-full p-4 bg-[#FFFAF8] border border-[#F1C5D1] rounded-2xl flex items-center justify-between text-xs font-semibold text-[#9F2343] shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9F2343]" />
              <span>Live Blueprint Summary</span>
              {estimatedTotal !== null && (
                <span className="font-serif font-bold text-sm text-[#3B2028]">
                  · ₹{finalAmount.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {mobileSummaryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* 2-Column Layout: 6 Steps on Left, Sticky Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form: 6 Steps */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8 bg-[#FFFAF8] p-6 sm:p-8 rounded-3xl border border-[#F1C5D1] shadow-xs">
            {/* STEP 1: Choose Occasion / Theme */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#F1C5D1]">
                <span className="w-6 h-6 rounded-full bg-[#9F2343] text-white text-xs font-serif flex items-center justify-center font-bold">1</span>
                <h3 className="font-serif font-bold text-lg text-[#3B2028]">Choose Occasion / Theme</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3B2028] uppercase tracking-wider mb-2">
                  What is the occasion?
                </label>
                <select
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] focus:ring-1 focus:ring-[#9F2343] focus:border-[#9F2343] outline-none"
                >
                  {occasionOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-[#79665C]">
                  Box packaging & styling automatically follows this occasion theme.
                </p>
              </div>
            </div>

            {/* STEP 2: Choose Recipient */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#F1C5D1]">
                <span className="w-6 h-6 rounded-full bg-[#9F2343] text-white text-xs font-serif flex items-center justify-center font-bold">2</span>
                <h3 className="font-serif font-bold text-lg text-[#3B2028]">Choose the Recipient</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {recipientOptions.map((opt) => {
                  const selected = formData.recipientType === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, recipientType: opt })}
                      className={`p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#9F2343] text-white border-[#72172F] shadow-xs'
                          : 'bg-[#FFF1F4] text-[#3B2028] border-[#F1C5D1] hover:border-[#9F2343]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Box Size & Budget */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#F1C5D1]">
                <span className="w-6 h-6 rounded-full bg-[#9F2343] text-white text-xs font-serif flex items-center justify-center font-bold">3</span>
                <h3 className="font-serif font-bold text-lg text-[#3B2028]">Choose Box Size & Budget</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {budgetOptions.map((b) => {
                  const selected = formData.budget === b.label || (b.label === 'Custom Budget' && formData.budget === 'Custom Budget');
                  return (
                    <div
                      key={b.label}
                      onClick={() => setFormData({ ...formData, budget: b.label })}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selected
                          ? 'bg-[#FFF1F4] border-[#9F2343] shadow-xs ring-1 ring-[#9F2343]'
                          : 'bg-[#FFFAF8] border-[#F1C5D1] hover:border-[#9F2343]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-bold text-sm text-[#3B2028]">
                          {b.label}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selected ? 'bg-[#9F2343] border-[#9F2343] text-white' : 'border-[#F1C5D1]'
                        }`}>
                          {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-xs text-[#79665C]">{b.desc}</p>
                    </div>
                  );
                })}
              </div>

              {isCustomBudget && (
                <div className="p-4 bg-[#FFF1F4] rounded-xl border border-[#F1C5D1] space-y-2">
                  <label className="block text-xs font-semibold text-[#3B2028]">
                    Target Budget Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.customBudgetAmount}
                    onChange={(e) => setFormData({ ...formData, customBudgetAmount: e.target.value })}
                    placeholder="Enter amount (e.g. 1500)"
                    className="w-full px-3.5 py-2.5 bg-[#FFFAF8] border border-[#F1C5D1] rounded-lg text-sm text-[#3B2028] outline-none"
                  />
                  <p className="text-[11px] text-[#79665C]">
                    Custom budget requests are subject to confirmation on WhatsApp based on your chosen items.
                  </p>
                </div>
              )}
            </div>

            {/* STEP 4: Choose Add-ons */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#F1C5D1]">
                <span className="w-6 h-6 rounded-full bg-[#9F2343] text-white text-xs font-serif flex items-center justify-center font-bold">4</span>
                <h3 className="font-serif font-bold text-lg text-[#3B2028]">Choose Add-ons (Optional)</h3>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
                {(['All', 'Flowers', 'Chocolates & Treats', 'Cute Extras'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveAddOnTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-all ${
                      activeAddOnTab === tab
                        ? 'bg-[#9F2343] text-white font-semibold'
                        : 'bg-[#FFF1F4] text-[#79665C] hover:text-[#9F2343] border border-[#F1C5D1]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Add-on Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredAddOns.map((addon) => {
                  const selected = formData.selectedAddOns.find((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddOn(addon)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        selected
                          ? 'bg-[#FFF1F4] border-[#9F2343] shadow-xs'
                          : 'bg-[#FFFAF8] border-[#F1C5D1] hover:border-[#9F2343]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <AddOnThumbnail type={addon.illustrationType} className="w-12 h-12 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#3B2028] truncate">{addon.name}</p>
                          <p className="text-xs font-bold text-[#9F2343] tabular-nums mt-0.5">₹{addon.price}</p>
                        </div>
                      </div>

                      {selected ? (
                        <div className="flex items-center gap-1.5 bg-[#FFFAF8] p-1 rounded-lg border border-[#F1C5D1]" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => handleUpdateAddOnQty(addon.id, -1, e)}
                            className="p-1 text-[#79665C] hover:text-[#9F2343] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-[#3B2028] px-1 tabular-nums">
                            {selected.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleUpdateAddOnQty(addon.id, 1, e)}
                            className="p-1 text-[#79665C] hover:text-[#9F2343] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="px-2.5 py-1 bg-[#FFF1F4] text-[#9F2343] rounded-lg text-xs font-semibold border border-[#F1C5D1] hover:bg-[#9F2343] hover:text-white transition-colors cursor-pointer"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 5: Recipient Name & Handwritten Card Message */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#F1C5D1]">
                <span className="w-6 h-6 rounded-full bg-[#9F2343] text-white text-xs font-serif flex items-center justify-center font-bold">5</span>
                <h3 className="font-serif font-bold text-lg text-[#3B2028]">Recipient Name & Card Message</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3B2028] uppercase tracking-wider mb-1.5">
                    Recipient's Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="e.g. Ananya, Kabir, etc."
                    className="w-full px-4 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3B2028] uppercase tracking-wider mb-1.5">
                    Handwritten Card Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.personalNote}
                    onChange={(e) => setFormData({ ...formData, personalNote: e.target.value })}
                    placeholder="Write the message you would like us to handwrite on a personal card..."
                    className="w-full px-4 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3B2028] uppercase tracking-wider mb-1.5">
                    Special Packaging or Delivery Instructions
                  </label>
                  <input
                    type="text"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    placeholder="e.g. Midnight delivery request, specific chocolate preference"
                    className="w-full px-4 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* STEP 6: Delivery Area & Contact Details */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#F1C5D1]">
                <span className="w-6 h-6 rounded-full bg-[#9F2343] text-white text-xs font-serif flex items-center justify-center font-bold">6</span>
                <h3 className="font-serif font-bold text-lg text-[#3B2028]">Delivery Area & Contact Details</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3B2028] uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Your full name"
                      className={`w-full px-4 py-2.5 bg-[#FFF1F4] border rounded-xl text-sm text-[#3B2028] outline-none ${
                        errors.customerName ? 'border-red-500 ring-1 ring-red-500' : 'border-[#F1C5D1]'
                      }`}
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-xs text-red-600">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3B2028] uppercase tracking-wider mb-1.5">
                      Your WhatsApp Phone Number *
                    </label>
                    <input
                      id="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className={`w-full px-4 py-2.5 bg-[#FFF1F4] border rounded-xl text-sm text-[#3B2028] outline-none ${
                        errors.customerPhone ? 'border-red-500 ring-1 ring-red-500' : 'border-[#F1C5D1]'
                      }`}
                    />
                    {errors.customerPhone && (
                      <p className="mt-1 text-xs text-red-600">{errors.customerPhone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3B2028] uppercase tracking-wider mb-1.5">
                      Delivery Area (CU & Mohali)
                    </label>
                    <select
                      value={formData.deliveryArea}
                      onChange={(e) => setFormData({ ...formData, deliveryArea: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] outline-none"
                    >
                      {settings.deliveryAreas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3B2028] uppercase tracking-wider mb-1.5">
                      Preferred Delivery Date *
                    </label>
                    <input
                      id="deliveryDate"
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      className={`w-full px-4 py-2.5 bg-[#FFF1F4] border rounded-xl text-sm text-[#3B2028] outline-none ${
                        errors.deliveryDate ? 'border-red-500 ring-1 ring-red-500' : 'border-[#F1C5D1]'
                      }`}
                    />
                    {errors.deliveryDate && (
                      <p className="mt-1 text-xs text-red-600">{errors.deliveryDate}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3B2028] uppercase tracking-wider mb-1.5">
                    Specific Landmark / Hostel / PG Details
                  </label>
                  <input
                    type="text"
                    value={formData.specificLandmark}
                    onChange={(e) => setFormData({ ...formData, specificLandmark: e.target.value })}
                    placeholder="e.g. Block C Hostel Gate, Sunny Enclave PG 4"
                    className="w-full px-4 py-2.5 bg-[#FFF1F4] border border-[#F1C5D1] rounded-xl text-sm text-[#3B2028] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#F1C5D1]">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-sm font-semibold tracking-wide transition-all shadow-md shadow-[#9F2343]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Review & Order on WhatsApp</span>
              </button>
              <p className="mt-2 text-center text-xs text-[#79665C]">
                Final contents, pricing, delivery charges, and timing are confirmed with you on WhatsApp before acceptance.
              </p>
            </div>
          </form>

          {/* Sticky Live Blueprint Order Summary (Right Column) */}
          <div className={`lg:col-span-4 ${mobileSummaryOpen ? 'block' : 'hidden lg:block'} sticky top-24 space-y-4`}>
            <div className="bg-[#FFFAF8] p-6 rounded-3xl border border-[#F1C5D1] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F1C5D1]">
                <Sparkles className="w-4 h-4 text-[#9F2343]" />
                <h3 className="font-serif font-bold text-lg text-[#3B2028]">Order Blueprint</h3>
              </div>

              <div className="space-y-3 text-xs text-[#79665C]">
                <div className="flex justify-between py-1 border-b border-[#F1C5D1]/50">
                  <span>Occasion:</span>
                  <span className="font-semibold text-[#3B2028] text-right">{formData.occasion}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F1C5D1]/50">
                  <span>Recipient:</span>
                  <span className="font-semibold text-[#3B2028]">{formData.recipientType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F1C5D1]/50">
                  <span>Box Target:</span>
                  <span className="font-semibold text-[#3B2028]">{formData.budget}</span>
                </div>

                {formData.selectedAddOns.length > 0 && (
                  <div className="py-1 border-b border-[#F1C5D1]/50 space-y-1">
                    <span className="font-semibold text-[#3B2028] block">Add-ons ({formData.selectedAddOns.length}):</span>
                    {formData.selectedAddOns.map((addon) => (
                      <div key={addon.id} className="flex justify-between pl-2 text-[11px]">
                        <span>{addon.quantity}x {addon.name}</span>
                        <span className="tabular-nums font-semibold text-[#9F2343]">₹{addon.price * addon.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}

                {formData.recipientName && (
                  <div className="flex justify-between py-1 border-b border-[#F1C5D1]/50">
                    <span>Card Name:</span>
                    <span className="font-semibold text-[#3B2028]">{formData.recipientName}</span>
                  </div>
                )}

                <div className="pt-2 space-y-1.5 text-sm">
                  <div className="flex justify-between font-semibold text-[#3B2028]">
                    <span>Estimated Total:</span>
                    <span className="font-serif font-bold text-xl text-[#9F2343] tabular-nums">
                      {estimatedTotal !== null ? `₹${finalAmount.toLocaleString('en-IN')}` : 'To be confirmed'}
                    </span>
                  </div>
                  {appliedOffer && (
                    <p className="text-[11px] text-emerald-800">
                      Applied Promo: {appliedOffer.code} (-₹{discountAmount})
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-3 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send Order via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Disclaimer & Policy Pill */}
            <div className="p-4 bg-[#FFFAF8] rounded-2xl border border-[#F1C5D1] text-[11px] text-[#79665C] space-y-1">
              <p className="font-semibold text-[#3B2028]">Notice:</p>
              <p>
                Stock and exact items are verified directly on WhatsApp before payment. We deliver directly to Chandigarh University and Mohali PGs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
