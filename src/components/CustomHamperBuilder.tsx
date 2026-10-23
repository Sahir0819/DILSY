import React, { useState } from 'react';
import { Gift, Check, Sparkles, MessageCircle, AlertCircle, Info, Calendar, Clock, MapPin, User, Heart, Plus, Minus, Trash2 } from 'lucide-react';
import { CustomHamperForm, AddOnItem, SelectedAddOn } from '../types';
import { SERVICE_AREAS, TIME_WINDOWS } from '../data/products';
import { ADD_ONS } from '../data/addons';
import { AddOnThumbnail } from './AddOnThumbnail';
import { generateCustomHamperWhatsAppMessage, EXACT_DELIVERY_POLICY, getThemePackagingGuidance, getBaseHamperPrice } from '../utils/whatsapp';

interface CustomHamperBuilderProps {
  onOpenReviewModal: (title: string, message: string) => void;
  prefilledOccasion?: string;
}

export const CustomHamperBuilder: React.FC<CustomHamperBuilderProps> = ({
  onOpenReviewModal,
  prefilledOccasion,
}) => {
  const [formData, setFormData] = useState<CustomHamperForm>({
    recipientType: 'Girlfriend / Partner',
    occasion: prefilledOccasion || 'Birthday Celebration',
    budget: 'Medium Box — ₹969',
    customBudgetAmount: '',
    selectedAddOns: [],
    recipientName: '',
    personalNote: '',
    specialInstructions: '',
    deliveryArea: 'Chandigarh University (North & South Gate)',
    specificLandmark: '',
    deliveryDate: '',
    timeWindow: 'Afternoon (12:00 PM – 4:00 PM)',
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
            const newQty = a.quantity + delta;
            return newQty > 0 ? { ...a, quantity: newQty } : null;
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = "Recipient's name or nickname is required";
    }
    if (!formData.personalNote.trim()) {
      newErrors.personalNote = 'A greeting card message or note is required';
    }
    if (!formData.deliveryArea) {
      newErrors.deliveryArea = 'Please select a delivery area or campus location';
    }
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Please enter your name';
    }
    if (!formData.customerPhone.trim() || formData.customerPhone.trim().length < 8) {
      newErrors.customerPhone = 'Valid contact number is required for WhatsApp coordination';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const message = generateCustomHamperWhatsAppMessage(formData);
    onOpenReviewModal('Custom Hamper Order Blueprint', message);
  };

  const isCustomBudget = formData.budget === 'Custom Budget';
  const displayBudgetSummary = isCustomBudget
    ? formData.customBudgetAmount
      ? `Custom target: ₹${formData.customBudgetAmount} (Price to be confirmed)`
      : 'Price to be confirmed with DILSY owner'
    : `${formData.budget} (Base target)`;

  return (
    <section id="custom-builder" className="py-16 md:py-24 bg-gradient-to-b from-[#FFF5F7] via-[#FDF9F7] to-[#FFF8FA] border-t border-b border-[#E8D0D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#A32842] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5] mb-2 shadow-2xs">
            <Heart className="w-3.5 h-3.5 fill-[#C73858] text-[#C73858]" />
            <span>Bespoke Love Hamper Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D1B22] tracking-tight text-balance">
            Create Your Custom DILSY Hamper
          </h2>
          <p className="mt-2 text-base text-[#52333D] font-light leading-relaxed">
            Every connection is unique. Choose your preferred recipient, occasion theme, goodies, and budget. DILSY will style and theme-match your packaging with a personalized handwritten letter, wax seal, and direct delivery across Chandigarh University & Mohali.
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

            {/* Step 2: Official Box Size & Target Budget */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E8D0D6]">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#99223A] to-[#C73858] text-white text-xs font-serif flex items-center justify-center font-bold shadow-2xs">2</span>
                <h3 className="font-serif font-bold text-lg text-[#2D1B22]">Select Official Box Size & Budget Target</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {budgetOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, budget: opt })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      formData.budget === opt
                        ? 'border-[#99223A] bg-gradient-to-r from-[#99223A] to-[#801B30] text-white shadow-xs font-semibold'
                        : 'border-[#E8C2CC] bg-white text-[#3D141C] hover:bg-[#FFF5F8]'
                    }`}
                  >
                    <span className="block text-xs font-bold tabular-nums">{opt}</span>
                    <span className="block text-[10px] opacity-80 mt-1">
                      {opt === 'Small Box — ₹799'
                        ? 'A little box, filled with details'
                        : opt === 'Medium Box — ₹969'
                        ? 'Our just-right box'
                        : opt === 'Large Box — ₹1,199'
                        ? 'More little surprises'
                        : 'Price to be confirmed'}
                    </span>
                  </button>
                ))}
              </div>

              {isCustomBudget && (
                <div className="mt-3 p-3.5 bg-[#FFF0F4] rounded-xl border border-[#FFCCD5] text-xs">
                  <label className="block font-semibold text-[#3D141C] mb-1">
                    Enter your custom budget target (₹):
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="50"
                    placeholder="e.g. 1800"
                    value={formData.customBudgetAmount}
                    onChange={(e) => setFormData({ ...formData, customBudgetAmount: e.target.value })}
                    className="w-full sm:w-48 px-3 py-1.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] outline-none"
                  />
                  <p className="mt-1 text-[11px] text-[#6B424E]">
                    *Note: For custom budgets, the final price is confirmed with the DILSY owner based on your chosen items.
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Add-ons */}
            <div>
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#E8D0D6]">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#99223A] to-[#C73858] text-white text-xs font-serif flex items-center justify-center font-bold shadow-2xs">3</span>
                <h3 className="font-serif font-bold text-lg text-[#2D1B22]">Add-ons</h3>
                <span className="text-[11px] font-semibold text-[#99223A] bg-[#FFEBF0] px-2 py-0.5 rounded-full border border-[#FFCCD5] ml-auto">
                  Optional Extras
                </span>
              </div>

              <p className="text-xs text-[#52333D] mb-1">
                Make your hamper extra special with a few little extras. Select any add-ons you'd like to include.
              </p>
              <p className="text-[11px] text-[#A32842] italic mb-4">
                *Add-ons are optional extras added to your selected hamper (not included in base price). Stock & final pricing verified by DILSY on WhatsApp.
              </p>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#FAF0F3] rounded-xl border border-[#E8C2CC] mb-4 overflow-x-auto shadow-2xs">
                {(['All', 'Flowers', 'Chocolates & Treats', 'Cute Extras'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveAddOnTab(tab)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap font-medium ${
                      activeAddOnTab === tab
                        ? 'bg-gradient-to-r from-[#99223A] to-[#801B30] text-white shadow-xs font-semibold'
                        : 'text-[#6B3241] hover:text-[#99223A]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Add-ons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADD_ONS.filter((item) => activeAddOnTab === 'All' || item.category === activeAddOnTab).map((item) => {
                  const selectedAddOn = formData.selectedAddOns.find((a) => a.id === item.id);
                  const isSelected = !!selectedAddOn;

                  return (
                    <div
                      key={item.id}
                      onClick={() => item.isAvailable && handleToggleAddOn(item)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-left relative cursor-pointer ${
                        !item.isAvailable
                          ? 'border-neutral-200 bg-neutral-50 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'border-[#99223A] bg-[#FFF0F4] shadow-xs ring-1 ring-[#99223A]'
                          : 'border-[#E8C2CC] bg-white hover:bg-[#FFF8FA] hover:border-[#F2BDCA]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Custom Thumbnail Illustration */}
                        <AddOnThumbnail type={item.illustrationType} />

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-semibold text-[#8C283B] bg-[#FFEBF0] px-1.5 py-0.2 rounded border border-[#FFCCD5]">
                              {item.category}
                            </span>
                            {!item.isAvailable && (
                              <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-200 px-1.5 py-0.2 rounded">
                                Unavailable
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-[#2D1B22] truncate mt-0.5">
                            {item.name}
                          </h4>
                          {item.description && (
                            <p className="text-[10px] text-[#6B424E] line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          )}
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="font-serif font-bold text-sm text-[#99223A] tabular-nums">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-[#6B424E]">/ item</span>
                          </div>
                        </div>
                      </div>

                      {/* Add Button or Quantity Controls */}
                      <div className="shrink-0 flex items-center">
                        {isSelected ? (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 bg-white border border-[#FFCCD5] rounded-xl p-1 shadow-2xs"
                          >
                            <button
                              type="button"
                              onClick={(e) => handleUpdateAddOnQty(item.id, -1, e)}
                              aria-label="Decrease quantity"
                              className="w-6 h-6 flex items-center justify-center text-[#7A1E31] hover:bg-[#FFE5EC] rounded-lg transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-[#99223A] tabular-nums">
                              {selectedAddOn.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleUpdateAddOnQty(item.id, 1, e)}
                              aria-label="Increase quantity"
                              className="w-6 h-6 flex items-center justify-center text-[#7A1E31] hover:bg-[#FFE5EC] rounded-lg transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={!item.isAvailable}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (item.isAvailable) handleToggleAddOn(item);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                              item.isAvailable
                                ? 'bg-[#FFF5F8] hover:bg-[#99223A] text-[#7A1E31] hover:text-white border border-[#FFCCD5]'
                                : 'bg-neutral-200 text-neutral-400 border border-neutral-300 cursor-not-allowed'
                            }`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: The Personal Touch */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E8D0D6]">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#99223A] to-[#C73858] text-white text-xs font-serif flex items-center justify-center font-bold shadow-2xs">4</span>
                <h3 className="font-serif font-bold text-lg text-[#2D1B22]">The Personal Touch</h3>
              </div>

              <div className="space-y-4">
                <div id="recipientName">
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1">
                    Recipient's Name / Nickname <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="e.g. Muskaan, Kabir, Aman, My Love"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] outline-none"
                  />
                  {errors.recipientName && (
                    <p className="text-xs text-red-600 mt-1">{errors.recipientName}</p>
                  )}
                </div>

                <div id="personalNote">
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1">
                    Handwritten Love / Greeting Card Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.personalNote}
                    onChange={(e) => setFormData({ ...formData, personalNote: e.target.value })}
                    placeholder="Write the message you'd like us to handwrite on a card. Keep it as long or short as your feelings demand..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] outline-none resize-none"
                  />
                  {errors.personalNote && (
                    <p className="text-xs text-red-600 mt-1">{errors.personalNote}</p>
                  )}
                </div>

                {/* Automatic Theme-Matched Packaging Info Card */}
                <div className="p-4 bg-gradient-to-r from-[#FFF0F4] via-[#FFEBF0] to-[#FFF5F8] rounded-xl border border-[#FFCCD5] text-xs space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[#99223A] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 fill-[#C73858] text-[#C73858]" />
                    <span>Automatic Theme-Matched Packaging</span>
                  </div>
                  <p className="text-[#52333D] text-[11px] leading-relaxed">
                    DILSY automatically designs and styles the packaging based on your chosen theme (<strong>{formData.occasion}</strong>).
                  </p>
                  <p className="text-[#7A1E31] text-[11px] italic bg-white/70 p-2 rounded-lg border border-[#FFCCD5]/60">
                    Studio styling guidance: <em>"{getThemePackagingGuidance(formData.occasion, formData.recipientType)}"</em>
                  </p>
                  <p className="text-[10px] text-[#6B424E] italic pt-0.5">
                    *Actual packaging presentation depends on confirmed studio availability.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1">
                    Special Instructions / Dietary / Colour preferences
                  </label>
                  <input
                    type="text"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    placeholder="e.g. Vegetarian/eggless chocolates, prefers silver jewelry, red/blush ribbon"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Delivery & Customer Details */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E8D0D6]">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#99223A] to-[#C73858] text-white text-xs font-serif flex items-center justify-center font-bold shadow-2xs">5</span>
                <h3 className="font-serif font-bold text-lg text-[#2D1B22]">Delivery Area & Contact Details</h3>
              </div>

              <div className="space-y-4">
                <div id="deliveryArea">
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1">
                    Service Area / Landmark <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.deliveryArea}
                    onChange={(e) => setFormData({ ...formData, deliveryArea: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] outline-none"
                  >
                    {SERVICE_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {errors.deliveryArea && (
                    <p className="text-xs text-red-600 mt-1">{errors.deliveryArea}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1">
                    Specific PG Name / Hostel Block / Room / Landmark
                  </label>
                  <input
                    type="text"
                    value={formData.specificLandmark}
                    onChange={(e) => setFormData({ ...formData, specificLandmark: e.target.value })}
                    placeholder="e.g. NC-3 Hostel Gate, Royal PG Gharuan, Sector 71 House #124"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1">
                      Preferred Delivery Date
                    </label>
                    <input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1">
                      Preferred Time Window
                    </label>
                    <select
                      value={formData.timeWindow}
                      onChange={(e) => setFormData({ ...formData, timeWindow: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] outline-none"
                    >
                      {TIME_WINDOWS.map((window) => (
                        <option key={window} value={window}>
                          {window}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div id="customerName">
                    <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1">
                      Your Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Rohan Sharma"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] outline-none"
                    />
                    {errors.customerName && (
                      <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div id="customerPhone">
                    <label className="block text-xs font-semibold text-[#3D141C] uppercase tracking-wider mb-1">
                      Your Contact / WhatsApp Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8C2CC] rounded-lg text-sm text-[#2D1B22] focus:ring-1 focus:ring-[#C73858] outline-none"
                    />
                    {errors.customerPhone && (
                      <p className="text-xs text-red-600 mt-1">{errors.customerPhone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Trigger with Romantic Wine Gradient */}
            <div className="pt-4 border-t border-[#E8D0D6]">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-[#99223A] via-[#A82841] to-[#801B30] hover:from-[#A82841] hover:to-[#8F1F36] text-[#FFF0F3] rounded-xl font-medium text-sm tracking-wide transition-all shadow-md shadow-[#99223A]/25 flex items-center justify-center gap-2 group"
              >
                <Heart className="w-4 h-4 fill-[#FF85A1] text-[#FF85A1]" />
                <span>Review Custom Blueprint & Order on WhatsApp</span>
              </button>
            </div>
          </form>

          {/* Right Column: Live Order Summary Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-[#FFFCFD] rounded-2xl border border-[#FFCCD5] p-6 shadow-sm shadow-[#FFCCD5]/20">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8D0D6]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A32842] flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-[#C73858] text-[#C73858]" />
                  Live Love Blueprint
                </span>
                <span className="text-[11px] font-serif italic text-[#7A1E31]">DILSY Studio</span>
              </div>

              {(() => {
                const basePrice = getBaseHamperPrice(formData.budget, formData.customBudgetAmount);
                const addOnsSubtotal = formData.selectedAddOns.reduce((acc, a) => acc + a.price * a.quantity, 0);
                const estimatedTotal = basePrice !== null ? basePrice + addOnsSubtotal : null;
                const totalAddOnQuantity = formData.selectedAddOns.reduce((acc, a) => acc + a.quantity, 0);

                return (
                  <div className="py-4 space-y-3.5 text-xs text-[#2D1B22]">
                    <div>
                      <span className="text-[#6B424E] block text-[11px]">Recipient & Occasion</span>
                      <p className="font-semibold">{formData.recipientType} · {formData.occasion}</p>
                    </div>

                    {/* Base Hamper Target */}
                    <div>
                      <span className="text-[#6B424E] block text-[11px]">Base Hamper Box</span>
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-[#2D1B22]">{formData.budget}</span>
                        <span className="text-[#99223A] tabular-nums">
                          {basePrice !== null ? `₹${basePrice.toLocaleString('en-IN')}` : 'Custom'}
                        </span>
                      </div>
                    </div>

                    {/* Selected Add-ons List */}
                    <div className="pt-2 border-t border-[#FFCCD5]/60">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[#6B424E] text-[11px] font-medium">
                          Selected Add-ons ({totalAddOnQuantity})
                        </span>
                        {formData.selectedAddOns.length > 0 && (
                          <span className="text-[11px] text-[#99223A] font-semibold tabular-nums">
                            ₹{addOnsSubtotal.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {formData.selectedAddOns.length > 0 ? (
                        <div className="space-y-1.5 bg-[#FFF0F4]/70 p-2.5 rounded-xl border border-[#FFCCD5]">
                          {formData.selectedAddOns.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1 text-[#3D141C] truncate pr-2">
                                <span className="text-[#C73858] font-bold">♥</span>
                                <span className="truncate">{item.name}</span>
                                <span className="text-[#7A1E31] font-semibold">× {item.quantity}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="font-semibold text-[#99223A] tabular-nums">
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAddOn(item.id)}
                                  aria-label={`Remove ${item.name}`}
                                  className="text-neutral-400 hover:text-red-700 transition-colors p-0.5"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="italic text-[#6B424E]/70 text-[11px] bg-[#FFF8FA] p-2 rounded-lg border border-dashed border-[#FFCCD5]">
                          No optional add-ons selected yet (Base hamper only)
                        </p>
                      )}
                    </div>

                    {/* Functional Pricing Breakdown with Combined Estimated Total */}
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
                      <div className="pt-1.5 border-t border-[#FFCCD5] flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-[#2D1B22]">Combined Estimated Total:</span>
                        <span className="font-serif font-bold text-base text-[#99223A] tabular-nums">
                          {estimatedTotal !== null ? `₹${estimatedTotal.toLocaleString('en-IN')}*` : 'Custom target'}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#6B424E] italic pt-1 leading-tight">
                        *Estimated total. Stock availability, exact custom item details, and delivery charges are confirmed on WhatsApp by DILSY.
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
                );
              })()}

              {/* Exact Delivery Policy Note */}
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
                WhatsApp us anytime at <span className="font-mono font-semibold text-[#99223A]">+91 8360958844</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
