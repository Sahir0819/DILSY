import React from 'react';
import { Truck, MapPin, ShieldCheck, Clock, AlertCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { EXACT_DELIVERY_POLICY, WHATSAPP_PHONE_INTERNATIONAL } from '../utils/whatsapp';

interface DeliveryPolicyPageProps {
  onNavigate: (path: string) => void;
}

export const DeliveryPolicyPage: React.FC<DeliveryPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2A0D15] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'Delivery Policy' }]}
            onNavigate={onNavigate}
          />
        </div>

        {/* Content Card */}
        <div className="bg-white p-8 sm:p-14 border border-[#EADBDB] space-y-8 shadow-xs">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-[#3E101D] bg-[#FAF7F5] px-3 py-1 border border-[#EADBDB]">
              <Truck className="w-3.5 h-3.5 text-[#3E101D]" />
              <span>Official Service Standards</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2A0D15] tracking-tight">
              Delivery Policy & Disclaimers
            </h1>
            <p className="text-sm text-[#7A5A63] font-light">
              Clear, honest guidelines regarding our coverage, timings, confirmation, and handovers.
            </p>
          </div>

          {/* Official Core Policy Quote */}
          <div className="p-6 bg-[#FAF7F5] border border-[#EADBDB]">
            <h2 className="text-[10px] uppercase tracking-widest font-semibold text-[#3E101D] mb-2">
              Official Policy Statement
            </h2>
            <p className="text-sm sm:text-base text-[#2A0D15] font-serif italic leading-relaxed">
              "{EXACT_DELIVERY_POLICY}"
            </p>
          </div>

          {/* Detailed Points */}
          <div className="space-y-6 text-xs sm:text-sm text-[#7A5A63] leading-relaxed border-t border-[#EADBDB] pt-6 font-light">
            <div className="space-y-2">
              <h3 className="font-serif font-medium text-base text-[#2A0D15] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#3E101D]" />
                <span>1. Service Area</span>
              </h3>
              <p>
                DILSY currently serves <strong className="text-[#2A0D15] font-medium">Chandigarh University (North & South Gate)</strong>, Gharuan village, student PGs along Landran-Kharar road, and nearby Mohali sectors, subject to actual route coverage and logistics availability.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-medium text-base text-[#2A0D15] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3E101D]" />
                <span>2. Order Confirmation Process</span>
              </h3>
              <p>
                Submitting an inquiry on our website or sending a pre-filled WhatsApp message does not constitute immediate order acceptance. An order is confirmed <strong className="text-[#2A0D15] font-medium">only after DILSY reviews your request, verifies stock availability, and confirms final pricing, delivery charges, and timing directly with you on WhatsApp.</strong>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-medium text-base text-[#2A0D15] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3E101D]" />
                <span>3. Delivery Timing & Cut-off Policy</span>
              </h3>
              <p>
                Same-day and next-morning delivery requests depend on item availability, order cut-off times, preparation duration, and delivery location. We do not promise same-day delivery unless explicitly agreed upon during WhatsApp confirmation. For planned surprises or midnight requests, please coordinate in advance.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-medium text-base text-[#2A0D15] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#3E101D]" />
                <span>4. Delivery Charges & Stock Availability</span>
              </h3>
              <p>
                Delivery charges depend on drop-off proximity (e.g. campus gate vs. distant student accommodation) and are kept student-friendly. All items, confections, and treats are subject to active stock. If any requested item is out of stock, we propose suitable alternatives for your approval before proceeding.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-medium text-base text-[#2A0D15] flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#3E101D]" />
                <span>5. Modifications & Inquiries</span>
              </h3>
              <p>
                Need to change a handwritten card message, delivery time, or drop-off contact? Chat directly with us on WhatsApp at <strong className="text-[#2A0D15] font-medium">{WHATSAPP_PHONE_INTERNATIONAL}</strong> as early as possible before your hamper enters packaging.
              </p>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="pt-4 border-t border-[#EADBDB] flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate('/hampers')}
              className="px-6 py-3.5 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Hampers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('/custom-hamper')}
              className="px-6 py-3.5 bg-white hover:bg-[#FAF7F5] text-[#3E101D] border border-[#EADBDB] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer text-center"
            >
              Custom Hamper Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
