import React, { useState } from 'react';
import { Gift, Check, Sparkles, MessageCircle, AlertCircle, Info, Calendar, Clock, MapPin, User, Heart } from 'lucide-react';
import { CustomHamperForm } from '../types';
import { GIFT_CATEGORY_OPTIONS, PACKAGING_STYLES, SERVICE_AREAS, TIME_WINDOWS } from '../data/products';
import { generateCustomHamperWhatsAppMessage, EXACT_DELIVERY_POLICY } from '../utils/whatsapp';

interface CustomHamperBuilderProps {
  onOpenReviewModal: (title: string, message: string) => void;
}

export const CustomHamperBuilder: React.FC<CustomHamperBuilderProps> = ({
  onOpenReviewModal,
}) => {
  const [formData, setFormData] = useState<CustomHamperForm>({
    recipientType: 'Girlfriend / Partner',
    occasion: 'Birthday Celebration',
    budget: '₹1,249',
    customBudgetAmount: '',
    giftCategories: ['Artisanal Soy Candles & Aromatics', 'Bespoke Polaroid Keepsakes & Photos'],
    recipientName: '',
    personalNote: '',
    packagingStyle: 'Minimalist Warm Ivory Box',
    specialInstructions: '',
    deliveryArea: 'Chandigarh University (North & South Gate)',
    specificLandmark: '',
    deliveryDate: '',
    timeWindow: 'Afternoon (12:00 PM – 4:00 PM)',
    customerName: '',
    customerPhone: '',
  });

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
    'Birthday Celebration',
    'Anniversary / Monthiversary',
    'Hostel Room Care Package',
    'Exam Good Luck & Motivation',
    'Miss You / Long Distance',
    'Apology / Make-up Gesture',
    'Graduation / Farewell',
  ];

  const budgetOptions = ['₹999', '₹1,249', '₹1,499', 'Custom Budget'];

  const handleCategoryToggle = (label: string) => {
    setFormData((prev) => {
      const exists = prev.giftCategories.includes(label);
      if (exists) {
        return { ...prev, giftCategories: prev.giftCategories.filter((c) => c !== label) };
      } else {
        return { ...prev, giftCategories: [...prev.giftCategories, label] };
      }
    });
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
    <section id="custom-builder" className="py-16 md:py-24 bg-[#F5EFEB]/50 border-t border-b border-[#2A1E1A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8C5A4F] mb-2">
            <Gift className="w-3.5 h-3.5" />
            <span>Bespoke Hamper Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1E1A] tracking-tight text-balance">
            Create Your Custom DILSY Hamper
          </h2>
          <p className="mt-2 text-base text-[#4A352F]/90 font-light leading-relaxed">
            Every connection is unique. Choose your preferred recipient, goodies, budget, and packaging. We'll handcraft your box with a personalized letter, wax seal, and deliver it directly across Chandigarh University & Mohali.
          </p>
        </div>

        {/* 2-Column Layout: Form on Left, Live Order Blueprint Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Fields */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8 bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#2A1E1A]/10 shadow-xs">
            {/* Step 1: Recipient & Occasion */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2A1E1A]/10">
                <span className="w-6 h-6 rounded-full bg-[#2A1E1A] text-[#FAF7F2] text-xs font-serif flex items-center justify-center font-bold">1</span>
                <h3 className="font-serif font-bold text-lg text-[#2A1E1A]">Recipient & Occasion</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2A1E1A] uppercase tracking-wider mb-1.5">
                    Who is this for?
                  </label>
                  <select
                    value={formData.recipientType}
                    onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#2A1E1A]/20 rounded-lg text-sm text-[#2A1E1A] focus:ring-1 focus:ring-[#B87A68] focus:border-[#B87A68] outline-none"
                  >
                    {recipientOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E1A] uppercase tracking-wider mb-1.5">
                    What are we celebrating?
                  </label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#2A1E1A]/20 rounded-lg text-sm text-[#2A1E1A] focus:ring-1 focus:ring-[#B87A68] focus:border-[#B87A68] outline-none"
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

            {/* Step 2: Target Budget */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2A1E1A]/10">
                <span className="w-6 h-6 rounded-full bg-[#2A1E1A] text-[#FAF7F2] text-xs font-serif flex items-center justify-center font-bold">2</span>
                <h3 className="font-serif font-bold text-lg text-[#2A1E1A]">Budget Preference</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {budgetOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, budget: opt })}
                    className={`py-3 px-3 rounded-xl border text-center transition-all ${
                      formData.budget === opt
                        ? 'border-[#2A1E1A] bg-[#2A1E1A] text-white shadow-xs font-semibold'
                        : 'border-[#2A1E1A]/20 bg-white text-[#2A1E1A] hover:bg-[#F5EFEB]'
                    }`}
                  >
                    <span className="block text-sm tabular-nums">{opt}</span>
                    <span className="block text-[10px] opacity-80 mt-0.5">
                      {opt === '₹999' ? 'Starter token' : opt === '₹1,249' ? 'Signature edit' : opt === '₹1,499' ? 'Deluxe box' : 'Custom value'}
                    </span>
                  </button>
                ))}
              </div>

              {isCustomBudget && (
                <div className="mt-3 p-3.5 bg-[#FAF4ED] rounded-xl border border-[#D4A39A]/40 text-xs">
                  <label className="block font-semibold text-[#2A1E1A] mb-1">
                    Enter your custom budget target (₹):
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="50"
                    placeholder="e.g. 1800"
                    value={formData.customBudgetAmount}
                    onChange={(e) => setFormData({ ...formData, customBudgetAmount: e.target.value })}
                    className="w-full sm:w-48 px-3 py-1.5 bg-white border border-[#2A1E1A]/20 rounded-lg text-sm text-[#2A1E1A] outline-none"
                  />
                  <p className="mt-1 text-[11px] text-[#4A352F]/80">
                    *Note: For custom budgets, the final price is confirmed with the DILSY owner based on your chosen items.
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Preferred Gift Categories */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2A1E1A]/10">
                <span className="w-6 h-6 rounded-full bg-[#2A1E1A] text-[#FAF7F2] text-xs font-serif flex items-center justify-center font-bold">3</span>
                <h3 className="font-serif font-bold text-lg text-[#2A1E1A]">Select Preferred Goodies</h3>
              </div>

              <p className="text-xs text-[#4A352F] mb-3">
                Choose the kind of elements you would love included in this hamper:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GIFT_CATEGORY_OPTIONS.map((item) => {
                  const selected = formData.giftCategories.includes(item.label);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleCategoryToggle(item.label)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-colors ${
                        selected
                          ? 'border-[#B87A68] bg-[#FAF4ED] text-[#2A1E1A]'
                          : 'border-[#2A1E1A]/15 bg-white text-[#4A352F] hover:bg-[#F5EFEB]'
                      }`}
                    >
                      <span className="text-xs font-medium">{item.label}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          selected ? 'bg-[#B87A68] border-[#B87A68] text-white' : 'border-[#2A1E1A]/30'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: The Personal Touch */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2A1E1A]/10">
                <span className="w-6 h-6 rounded-full bg-[#2A1E1A] text-[#FAF7F2] text-xs font-serif flex items-center justify-center font-bold">4</span>
                <h3 className="font-serif font-bold text-lg text-[#2A1E1A]">The Personal Touch & Packaging</h3>
              </div>

              <div className="space-y-4">
                <div id="recipientName">
                  <label className="block text-xs font-semibold text-[#2A1E1A] uppercase tracking-wider mb-1">
                    Recipient's Name / Nickname <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="e.g. Muskaan, Kabir, Aman"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#2A1E1A]/20 rounded-lg text-sm text-[#2A1E1A] focus:ring-1 focus:ring-[#B87A68] outline-none"
                  />
                  {errors.recipientName && (
                    <p className="text-xs text-red-600 mt-1">{errors.recipientName}</p>
                  )}
                </div>

                <div id="personalNote">
                  <label className="block text-xs font-semibold text-[#2A1E1A] uppercase tracking-wider mb-1">
                    Handwritten Greeting Card Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.personalNote}
                    onChange={(e) => setFormData({ ...formData, personalNote: e.target.value })}
                    placeholder="Write the message you want us to handwrite on luxury stationery. Keep it as long or short as your feelings demand..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#2A1E1A]/20 rounded-lg text-sm text-[#2A1E1A] focus:ring-1 focus:ring-[#B87A68] outline-none resize-none"
                  />
                  {errors.personalNote && (
                    <p className="text-xs text-red-600 mt-1">{errors.personalNote}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E1A] uppercase tracking-wider mb-1.5">
                    Packaging Style Preference
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PACKAGING_STYLES.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, packagingStyle: pkg.name })}
                        className={`p-3 rounded-xl border text-left transition-colors ${
                          formData.packagingStyle === pkg.name
                            ? 'border-[#2A1E1A] bg-[#FAF4ED] ring-1 ring-[#2A1E1A]'
                            : 'border-[#2A1E1A]/15 bg-white hover:bg-[#F5EFEB]'
                        }`}
                      >
                        <span className="block text-xs font-semibold text-[#2A1E1A]">{pkg.name}</span>
                        <span className="block text-[11px] text-[#4A352F]/80 mt-0.5">{pkg.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E1A] uppercase tracking-wider mb-1">
                    Special Instructions / Dietary / Colour preferences
                  </label>
                  <input
                    type="text"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    placeholder="e.g. Vegetarian/eggless chocolates, prefers silver jewelry/tan leather, neutral tones"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#2A1E1A]/20 rounded-lg text-sm text-[#2A1E1A] focus:ring-1 focus:ring-[#B87A68] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Delivery & Customer Details */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#2A1E1A]/10">
                <span className="w-6 h-6 rounded-full bg-[#2A1E1A] text-[#FAF7F2] text-xs font-serif flex items-center justify-center font-bold">5</span>
                <h3 className="font-serif font-bold text-lg text-[#2A1E1A]">Delivery Area & Contact Details</h3>
              </div>

              <div className="space-y-4">
                <div id="deliveryArea">
                  <label className="block text-xs font-semibold text-[#2A1E1A] uppercase tracking-wider mb-1">
                    Service Area / Landmark <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.deliveryArea}
                    onChange={(e) => setFormData({ ...formData, deliveryArea: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#2A1E1A]/20 rounded-lg text-sm text-[#2A1E1A] focus:ring-1 focus:ring-[#B87A68] outline-none"
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
                  <label className="block text-xs font-semibold text-[#2A1E1A] uppercase tracking-wider mb-1">
                    Specific PG Name / Hostel Block / Room / Landmark
                  </label>
                  <input
                    type="text"
                    value={formData.specificLandmark}
                    onChange={(e) => setFormData({ ...formData, specificLandmark: e.target.value })}
                    placeholder="e.g. NC-3 Hostel Gate, Royal PG Gharuan, Sector 71 House #124"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#2A1E1A]/20 rounded-lg text-sm text-[#2A1E1A] focus:ring-1 focus:ring-[#B87A68] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2A1E1A] uppercase tracking-wider mb-1">
                      Preferred Delivery Date
                    </label>
                    <input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#2A1E1A]/20 rounded-lg text-sm text-[#2A1E1A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2A1E1A] uppercase tracking-wider mb-1">
                      Preferred Time Window
                    </label>
                    <select
                      value={formData.timeWindow}
                      onChange={(e) => setFormData({ ...formData, timeWindow: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#2A1E1A]/20 rounded-lg text-sm text-[#2A1E1A] outline-none"
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
                    <label className="block text-xs font-semibold text-[#2A1E1A] uppercase tracking-wider mb-1">
                      Your Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Rohan Sharma"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#2A1E1A]/20 rounded-lg text-sm text-[#2A1E1A] focus:ring-1 focus:ring-[#B87A68] outline-none"
                    />
                    {errors.customerName && (
                      <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div id="customerPhone">
                    <label className="block text-xs font-semibold text-[#2A1E1A] uppercase tracking-wider mb-1">
                      Your Contact / WhatsApp Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#2A1E1A]/20 rounded-lg text-sm text-[#2A1E1A] focus:ring-1 focus:ring-[#B87A68] outline-none"
                    />
                    {errors.customerPhone && (
                      <p className="text-xs text-red-600 mt-1">{errors.customerPhone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Trigger */}
            <div className="pt-4 border-t border-[#2A1E1A]/10">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#2A1E1A] hover:bg-[#3D2C26] text-[#FAF7F2] rounded-xl font-medium text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <MessageCircle className="w-4 h-4 text-[#D4A39A]" />
                <span>Review Custom Blueprint & Order on WhatsApp</span>
              </button>
            </div>
          </form>

          {/* Right Column: Live Order Summary Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-[#FAF7F2] rounded-2xl border border-[#2A1E1A]/10 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#2A1E1A]/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8C5A4F]">
                  Live Blueprint Summary
                </span>
                <span className="text-[11px] font-serif italic text-[#4A352F]">DILSY Studio</span>
              </div>

              <div className="py-4 space-y-3 text-xs text-[#2A1E1A]">
                <div>
                  <span className="text-[#4A352F]/70 block text-[11px]">Recipient & Occasion</span>
                  <p className="font-semibold">{formData.recipientType} · {formData.occasion}</p>
                </div>

                <div>
                  <span className="text-[#4A352F]/70 block text-[11px]">Budget Target</span>
                  <p className="font-semibold text-sm text-[#8C5A4F]">{displayBudgetSummary}</p>
                </div>

                <div>
                  <span className="text-[#4A352F]/70 block text-[11px]">Selected Elements ({formData.giftCategories.length})</span>
                  {formData.giftCategories.length > 0 ? (
                    <ul className="mt-1 space-y-1">
                      {formData.giftCategories.map((cat, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px] text-[#4A352F]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B87A68]" />
                          <span>{cat}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic text-[#4A352F]/60 text-[11px]">None selected yet</p>
                  )}
                </div>

                <div>
                  <span className="text-[#4A352F]/70 block text-[11px]">Packaging</span>
                  <p className="font-semibold">{formData.packagingStyle}</p>
                </div>

                <div>
                  <span className="text-[#4A352F]/70 block text-[11px]">For Recipient</span>
                  <p className="font-semibold">{formData.recipientName || '(Name not provided yet)'}</p>
                </div>

                {formData.personalNote && (
                  <div>
                    <span className="text-[#4A352F]/70 block text-[11px]">Personal Note Preview</span>
                    <p className="italic text-[#4A352F] bg-white/70 p-2 rounded border border-[#2A1E1A]/10 mt-0.5 line-clamp-3">
                      "{formData.personalNote}"
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-[#4A352F]/70 block text-[11px]">Delivery Location</span>
                  <p className="font-semibold">{formData.deliveryArea}</p>
                  {formData.specificLandmark && (
                    <p className="text-[11px] text-[#4A352F]">{formData.specificLandmark}</p>
                  )}
                </div>
              </div>

              {/* Exact Delivery Policy Note */}
              <div className="pt-3 border-t border-[#2A1E1A]/10">
                <div className="p-3 bg-[#FAF4ED] rounded-xl text-[11px] text-[#4A352F] leading-normal flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-[#B87A68] shrink-0 mt-0.5" />
                  <span>
                    "{EXACT_DELIVERY_POLICY}"
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#2A1E1A]/10 text-center">
              <p className="text-xs font-medium text-[#2A1E1A]">Need a rapid consultation?</p>
              <p className="text-[11px] text-[#4A352F]/80 mt-0.5">
                WhatsApp us anytime at <span className="font-mono font-semibold">+91 8360958844</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
