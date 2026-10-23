import React, { useState } from 'react';
import { Gift, Check, Sparkles, MessageCircle, AlertCircle, Info, Calendar, Clock, MapPin, User, Heart, Plus, Minus, Trash2, Tag } from 'lucide-react';
import { CustomHamperForm, AddOnItem, SelectedAddOn } from '../types';
import { AddOnThumbnail } from './AddOnThumbnail';
import { generateCustomHamperWhatsAppMessage, EXACT_DELIVERY_POLICY, getThemePackagingGuidance, getBaseHamperPrice } from '../utils/whatsapp';
import { useStore } from '../context/StoreContext';

interface CustomHamperBuilderProps {
  onOpenReviewModal: (title: string, message: string) => void;
  prefilledOccasion?: string;
}

export const CustomHamperBuilder: React.FC<CustomHamperBuilderProps> = ({
  onOpenReviewModal,
  prefilledOccasion,
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

  // Sync if prefilledOccasion changes
  React.useEffect(() => {
    if (prefilledOccasion) {
      setFormData((prev) => ({ ...prev, occasion: prefilledOccasion }));
    }
  }, [prefilledOccasion]);

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    'Small Box — ₹799',
    'Medium Box — ₹969',
    'Large Box — ₹1,199',
    'Custom Budget',
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
  const displayBudgetSummary = isCustomBudget
    ? formData.customBudgetAmount
      ? `Custom target: ₹${formData.customBudgetAmount} (Price to be confirmed)`
      : 'Price to be confirmed with DILSY owner'
    : `${formData.budget} (Base target)`;

  const availableAddons = addons.filter((a) => a.isAvailable);
  const filteredAddOns = availableAddons.filter((item) => {
    if (activeAddOnTab === 'All') return true;
    return item.category === activeAddOnTab;
  });

  return (
    <section id="custom-builder" className="py-16 md:py-24 bg-gradient-to-b from-[#FFF5F7] via-[#FDF9F7] to-[#FFF8FA] border-t border-b border-[#E8D0D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#A32842] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5] mb-2 shadow-2xs">
            <Heart className="w-3.5 h-3.5 fill-[#C73858] text-[#C73858]" />
            <span>Personalised Hamper Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D1B22] tracking-tight text-balance">
            Create Your Custom DILSY Hamper
          </h2>
          <p className="mt-2 text-base text-[#52333D] font-light leading-relaxed">
            Every connection is unique. Choose your recipient, occasion theme, add-ons, and budget. DILSY will prepare your hamper with theme-matched packaging, a personal handwritten card, and direct delivery across Chandigarh University & Mohali.
          </p>
        </div>

        {/* 2-Column Layout: Form on Left, Live Order Blueprint Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Fields */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8 bg-[#FFFCFD] p-6 sm:p-8 rounded-2xl border border-[#E8C2CC] shadow-xs">
            {/* Step 1: Recipient & Occasion */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E8D0D6]">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#99223A] to-[#C73858] text-white text-xs font-serif flex items-center justify-center font-bold shadow-2xs">1</span>
                <h3 className="font-serif font-bold text-lg text-[#2D1B22]">Recipient & Occasion</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1.5">
                    Who is this for?
                  </label>
                  <select
                    value={formData.recipientType}
                    onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] focus:border-[#C73858] outline-none"
                  >
                    {recipientOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1.5">
                    What are we celebrating?
                  </label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] focus:border-[#C73858] outline-none"
                  >
                    {occasionOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Target Hamper Size & Budget */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E8D0D6]">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#99223A] to-[#C73858] text-white text-xs font-serif flex items-center justify-center font-bold shadow-2xs">2</span>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#2D1B22]">Select Hamper Size & Budget</h3>
                  <p className="text-xs text-[#6B424E]">Choose one of our official box sizes or provide a custom budget target.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {budgetOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, budget: opt })}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                      formData.budget === opt
                        ? 'border-[#99223A] bg-[#FFF0F4] text-[#2D1B22] shadow-xs'
                        : 'border-[#E8C2CC] bg-white hover:border-[#F29CAE] text-[#52333D]'
                    }`}
                  >
                    <div>
                      <span className="font-serif font-bold text-sm block text-[#2D1B22]">{opt}</span>
                      <span className="text-[11px] text-[#6B424E] mt-0.5 block">
                        {opt.includes('799')
                          ? 'A sweet, budget-friendly box for thoughtful gestures.'
                          : opt.includes('969')
                          ? 'Recommended: balanced surprises and personal touches.'
                          : opt.includes('1,199')
                          ? 'Generous celebration hamper with extra room.'
                          : 'Custom target budget to be discussed with DILSY.'}
                      </span>
                    </div>
                    {formData.budget === opt && (
                      <div className="w-5 h-5 rounded-full bg-[#99223A] text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {formData.budget === 'Custom Budget' && (
                <div id="customBudgetAmount" className="p-3.5 bg-[#FFF0F4] rounded-xl border border-[#FFCCD5]">
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1">
                    Your Target Budget Amount (in ₹) *
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="50"
                    value={formData.customBudgetAmount}
                    onChange={(e) => setFormData({ ...formData, customBudgetAmount: e.target.value })}
                    placeholder="e.g. 1500"
                    className="w-full px-3.5 py-2 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] outline-none"
                  />
                  {errors.customBudgetAmount && (
                    <p className="text-xs text-[#99223A] mt-1">{errors.customBudgetAmount}</p>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Add-ons Catalogue */}
            <div>
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#E8D0D6]">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#99223A] to-[#C73858] text-white text-xs font-serif flex items-center justify-center font-bold shadow-2xs">3</span>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#2D1B22]">Add-ons</h3>
                  <p className="text-xs text-[#6B424E]">
                    Make your hamper extra special with a few little extras. Select any add-ons you'd like to include.
                  </p>
                </div>
              </div>

              {/* Add-on Categories Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-[#FAF0F3] rounded-xl border border-[#E8C2CC] overflow-x-auto mb-4">
                {(['All', 'Flowers', 'Chocolates & Treats', 'Cute Extras'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveAddOnTab(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      activeAddOnTab === tab
                        ? 'bg-gradient-to-r from-[#99223A] to-[#801B30] text-white shadow-xs'
                        : 'text-[#6B3241] hover:text-[#99223A]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Add-ons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredAddOns.map((item) => {
                  const selected = formData.selectedAddOns.find((a) => a.id === item.id);
                  const isSelected = !!selected;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleAddOn(item)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#99223A] bg-[#FFF0F4] shadow-xs'
                          : 'border-[#E8C2CC] bg-white hover:border-[#F29CAE]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#FAF0F3] border border-[#FFCCD5] overflow-hidden flex items-center justify-center shrink-0">
                          {item.customImage ? (
                            <img src={item.customImage} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <AddOnThumbnail type={item.illustrationType} className="w-8 h-8 object-contain" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-xs text-[#2D1B22] block leading-tight">
                            {item.name}
                          </span>
                          <span className="text-xs font-bold text-[#99223A] mt-0.5 block tabular-nums">
                            ₹{item.price}
                          </span>
                          {item.description && (
                            <span className="text-[10px] text-[#6B424E] line-clamp-1">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => handleUpdateAddOnQty(item.id, -1, e)}
                            className="w-6 h-6 rounded-md bg-white border border-[#FFCCD5] text-[#99223A] hover:bg-[#FFE5EC] flex items-center justify-center text-xs font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono text-[#2D1B22] w-5 text-center">
                            {selected.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleUpdateAddOnQty(item.id, 1, e)}
                            className="w-6 h-6 rounded-md bg-[#99223A] text-white hover:bg-[#801B30] flex items-center justify-center text-xs font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg border border-[#FFCCD5] text-xs font-semibold text-[#99223A] bg-[#FFF5F8] hover:bg-[#FFEBF0] shrink-0"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Personalisation & Special Instructions */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E8D0D6]">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#99223A] to-[#C73858] text-white text-xs font-serif flex items-center justify-center font-bold shadow-2xs">4</span>
                <h3 className="font-serif font-bold text-lg text-[#2D1B22]">Personal Notes & Special Instructions</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1.5">
                    Recipient's Name / Pet Name
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="e.g. Ananya, Kabir, etc."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] focus:border-[#C73858] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1.5">
                    Greeting-Card Message
                  </label>
                  <textarea
                    rows={3}
                    value={formData.personalNote}
                    onChange={(e) => setFormData({ ...formData, personalNote: e.target.value })}
                    placeholder="Write the message you'd like us to handwrite on a card. Keep it as long or short as your feelings demand..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] focus:border-[#C73858] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1.5">
                    Special Instructions / Dietary / Colour Preferences
                  </label>
                  <input
                    type="text"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    placeholder="e.g. Vegetarian snacks only, preferred ribbon colour, midnight surprise, etc."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] focus:border-[#C73858] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Delivery & Customer Contact */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E8D0D6]">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#99223A] to-[#C73858] text-white text-xs font-serif flex items-center justify-center font-bold shadow-2xs">5</span>
                <h3 className="font-serif font-bold text-lg text-[#2D1B22]">Delivery Details & Contact</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div id="customerName">
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] outline-none"
                  />
                  {errors.customerName && (
                    <p className="text-xs text-[#99223A] mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div id="customerPhone">
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1.5">
                    Your Phone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] outline-none"
                  />
                  {errors.customerPhone && (
                    <p className="text-xs text-[#99223A] mt-1">{errors.customerPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1.5">
                    Service Area / Zone
                  </label>
                  <select
                    value={formData.deliveryArea}
                    onChange={(e) => setFormData({ ...formData, deliveryArea: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] outline-none"
                  >
                    {settings.deliveryAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1.5">
                    Hostel / PG / Landmark
                  </label>
                  <input
                    type="text"
                    value={formData.specificLandmark}
                    onChange={(e) => setFormData({ ...formData, specificLandmark: e.target.value })}
                    placeholder="e.g. NC4 Hostel, Gate 2, or Sunny Enclave Flat"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] outline-none"
                  />
                </div>

                <div id="deliveryDate">
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1.5">
                    Preferred Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] outline-none"
                  />
                  {errors.deliveryDate && (
                    <p className="text-xs text-[#99223A] mt-1">{errors.deliveryDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1.5">
                    Preferred Time Window
                  </label>
                  <select
                    value={formData.timeWindow}
                    onChange={(e) => setFormData({ ...formData, timeWindow: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] outline-none"
                  >
                    {settings.timeWindows.map((win) => (
                      <option key={win} value={win}>
                        {win}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#E8D0D6]">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-[#99223A] via-[#A82841] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-[#99223A]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-[#FFB3C6]" />
                <span>Review & Submit Blueprint via WhatsApp</span>
              </button>
            </div>
          </form>

          {/* Right Column: Live Order Blueprint Summary */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-[#FFFCFD] p-6 rounded-2xl border border-[#E8C2CC] shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E8D0D6]">
                <Heart className="w-4 h-4 text-[#99223A] fill-[#FFB3C6]" />
                <h3 className="font-serif font-bold text-base text-[#2D1B22]">Live Hamper Blueprint</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#6B424E] block text-[11px]">Occasion & Theme</span>
                  <p className="font-semibold text-sm text-[#2D1B22]">{formData.occasion}</p>
                </div>

                {/* Automatic Theme-Matched Packaging Direction */}
                <div className="p-3 bg-gradient-to-r from-[#FFF5F8] to-[#FFF0F4] rounded-xl border border-[#FFCCD5]">
                  <span className="text-[10px] uppercase font-bold text-[#99223A] tracking-wider block">
                    Automatic Theme Packaging
                  </span>
                  <p className="font-serif font-semibold text-xs text-[#2D1B22] mt-0.5">
                    {getThemePackagingGuidance(formData.occasion, formData.recipientType)}
                  </p>
                </div>

                {/* Add-ons list in live summary */}
                <div>
                  <span className="text-[#6B424E] block text-[11px]">
                    Selected Add-ons ({formData.selectedAddOns.length})
                  </span>
                  {formData.selectedAddOns.length > 0 ? (
                    <div className="space-y-1.5 mt-1 bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E8D0D6]">
                      {formData.selectedAddOns.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-[11px] text-[#2D1B22]">
                          <span>
                            {item.name} <strong className="text-[#99223A]">x{item.quantity}</strong>
                          </span>
                          <span className="tabular-nums font-semibold">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#8C6B75] italic mt-0.5">
                      No optional add-ons selected yet.
                    </p>
                  )}
                </div>

                {/* Functional Pricing Breakdown */}
                <div className="p-3 bg-gradient-to-r from-[#FFF0F4] to-[#FFEBF0] rounded-xl border border-[#FFCCD5] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#52333D]">
                    <span>Base Box Price:</span>
                    <span className="tabular-nums font-medium">
                      {basePrice !== null ? `₹${basePrice.toLocaleString('en-IN')}` : displayBudgetSummary}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#52333D]">
                    <span>Add-ons Subtotal:</span>
                    <span className="tabular-nums font-semibold text-[#99223A]">
                      + ₹{addOnsSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {discountAmount > 0 && appliedOffer && (
                    <div className="flex items-center justify-between text-[11px] text-[#2D6A4F] font-semibold">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>Promo ({appliedOffer.code})</span>
                      </span>
                      <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="pt-1.5 border-t border-[#FFCCD5] flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-[#2D1B22]">Combined Total:</span>
                    <span className="font-serif font-bold text-base text-[#99223A] tabular-nums">
                      {estimatedTotal !== null ? `₹${finalAmount.toLocaleString('en-IN')}*` : 'Custom target'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#6B424E] italic pt-1 leading-tight">
                    *Estimated total. Stock availability and delivery charges confirmed on WhatsApp.
                  </p>
                </div>

                <div>
                  <span className="text-[#6B424E] block text-[11px]">For Recipient</span>
                  <p className="font-semibold text-[#99223A]">{formData.recipientName || '(Name not provided yet)'}</p>
                </div>

                {formData.personalNote && (
                  <div>
                    <span className="text-[#6B424E] block text-[11px]">Personal Note Preview</span>
                    <p className="italic text-[#52333D] bg-[#FFF0F4] p-2 rounded border border-[#FFCCD5] mt-0.5 line-clamp-3">
                      "{formData.personalNote}"
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-[#6B424E] block text-[11px]">Delivery Location</span>
                  <p className="font-semibold">{formData.deliveryArea}</p>
                  {formData.specificLandmark && (
                    <p className="text-[11px] text-[#52333D]">{formData.specificLandmark}</p>
                  )}
                </div>
              </div>

              {/* Delivery Policy Note */}
              <div className="pt-3 border-t border-[#E8D0D6]">
                <div className="p-3 bg-[#FFF5F8] rounded-xl text-[11px] text-[#52333D] leading-normal flex items-start gap-2 border border-[#FFCCD5]">
                  <Info className="w-3.5 h-3.5 text-[#C73858] shrink-0 mt-0.5" />
                  <span>
                    "{EXACT_DELIVERY_POLICY}"
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FFF8FA] rounded-xl border border-[#FFCCD5] text-center shadow-2xs">
              <p className="text-xs font-medium text-[#2D1B22] flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 text-[#C73858] fill-[#FFB3C6]" />
                <span>Need a rapid surprise consultation?</span>
              </p>
              <p className="text-[11px] text-[#6B424E] mt-0.5">
                WhatsApp us anytime at <span className="font-mono font-semibold text-[#99223A]">+91 {settings.whatsappPhone}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
