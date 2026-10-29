import React from 'react';
import { Truck, MapPin, ShieldCheck, Clock, AlertCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { EXACT_DELIVERY_POLICY, WHATSAPP_PHONE_INTERNATIONAL } from '../utils/whatsapp';

interface DeliveryPolicyPageProps {
  onNavigate: (path: string) => void;
}

export const DeliveryPolicyPage: React.FC<DeliveryPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FCE7ED] text-[#3B2028] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'Delivery Policy' }]}
            onNavigate={onNavigate}
          />
        </div>

        {/* Content Card */}
        <div className="bg-[#FFFAF8] p-8 sm:p-12 rounded-3xl border border-[#F1C5D1] shadow-xs space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9F2343] bg-[#FFF1F4] px-3 py-1 rounded-full border border-[#F1C5D1]">
              <Truck className="w-3.5 h-3.5 text-[#9F2343]" />
              <span>Official Service Standards</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3B2028] tracking-tight">
              Delivery Policy & Disclaimers
            </h1>
            <p className="text-sm text-[#79665C]">
              Clear, honest guidelines regarding our coverage, timings, confirmation, and handovers.
            </p>
          </div>

          {/* Official Core Policy Quote */}
          <div className="p-5 sm:p-6 bg-[#FFF1F4] rounded-2xl border border-[#F1C5D1]">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#9F2343] mb-2">
              Official Policy Statement
            </h2>
            <p className="text-sm sm:text-base text-[#3B2028] font-serif italic leading-relaxed">
              "{EXACT_DELIVERY_POLICY}"
            </p>
          </div>

          {/* Detailed Points */}
          <div className="space-y-6 text-xs sm:text-sm text-[#79665C] leading-relaxed border-t border-[#F1C5D1] pt-6">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-[#3B2028] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#9F2343]" />
                <span>1. Service Area</span>
              </h3>
              <p>
                DILSY currently serves <strong>Chandigarh University (North & South Gate)</strong>, Gharuan village, student PGs along Landran-Kharar road, and nearby Mohali sectors, subject to actual route coverage and logistics availability.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-[#3B2028] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#9F2343]" />
                <span>2. Order Confirmation Process</span>
              </h3>
              <p>
                Submitting an inquiry on our website or sending a pre-filled WhatsApp message does not constitute immediate order acceptance. An order is confirmed <strong>only after DILSY reviews your request, verifies stock availability, and confirms final pricing, delivery charges, and timing directly with you on WhatsApp.</strong>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-[#3B2028] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9F2343]" />
                <span>3. Delivery Timing & Cut-off Policy</span>
              </h3>
              <p>
                Same-day and next-morning delivery requests depend on item availability, order cut-off times, preparation duration, and delivery location. We do not promise same-day delivery unless explicitly agreed upon during WhatsApp confirmation. For planned surprises or midnight requests, please coordinate in advance.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-[#3B2028] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#9F2343]" />
                <span>4. Delivery Charges & Stock Availability</span>
              </h3>
              <p>
                Delivery charges depend on drop-off proximity (e.g. campus gate vs. distant student accommodation) and are kept student-friendly. All items, confections, and treats are subject to active stock. If any requested item is out of stock, we propose suitable alternatives for your approval before proceeding.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-[#3B2028] flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#9F2343]" />
                <span>5. Modifications & Inquiries</span>
              </h3>
              <p>
                Need to change a handwritten card message, delivery time, or drop-off contact? Chat directly with us on WhatsApp at <strong>{WHATSAPP_PHONE_INTERNATIONAL}</strong> as early as possible before your hamper enters packaging.
              </p>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="pt-4 border-t border-[#F1C5D1] flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate('/hampers')}
              className="px-6 py-3.5 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold transition-all shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Hampers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('/custom-hamper')}
              className="px-6 py-3.5 bg-[#FFFAF8] hover:bg-[#FFF1F4] text-[#9F2343] border border-[#F1C5D1] rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              Custom Hamper Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
