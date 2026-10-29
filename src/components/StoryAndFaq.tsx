import React, { useState } from 'react';
import { Heart, Truck, ShieldCheck, ChevronDown, ChevronUp, MessageCircle, MapPin, Lock } from 'lucide-react';
import { EXACT_DELIVERY_POLICY, WHATSAPP_PHONE_INTERNATIONAL } from '../utils/whatsapp';

export const OurStory: React.FC = () => {
  return (
    <section id="our-story" className="py-16 md:py-24 bg-[#FCE7ED] border-t border-[#F1C5D1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9F2343] bg-[#FFFAF8] px-3 py-1 rounded-full border border-[#F1C5D1] shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-[#9F2343] text-[#9F2343]" />
              <span>Behind The Box</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#3B2028] tracking-tight text-balance">
              Thoughtful gifting, personal touches, and real feelings.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#795A63] font-light leading-relaxed">
              <p>
                DILSY began with a simple belief right here around Chandigarh University and Mohali: gifts shouldn't be plastic wrapped items or rushed convenience confections. When you want to surprise someone—whether your partner, a hostel roommate who supported you through exams, or a best friend miles away—the gesture should feel thoughtful and personal.
              </p>
              <p>
                We assemble each hamper with care in our local studio: preparing chosen items, personalising keepsake photos, and hand-writing your words onto a card to make someone feel truly cherished.
              </p>
              <p>
                No automated templates. Just <em>A Little Box Full of Feelings</em>, delivered straight to campus gates, hostel desks, and local PGs.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-6">
              <div>
                <span className="block font-serif font-bold text-2xl text-[#9F2343]">100%</span>
                <span className="text-xs text-[#795A63]">Personalised by Hand</span>
              </div>
              <div className="w-px h-8 bg-[#F1C5D1]" />
              <div>
                <span className="block font-serif font-bold text-2xl text-[#9F2343]">₹799–₹1,199</span>
                <span className="text-xs text-[#795A63]">Official Box Pricing</span>
              </div>
              <div className="w-px h-8 bg-[#F1C5D1]" />
              <div>
                <span className="block font-serif font-bold text-2xl text-[#9F2343]">Mohali & CU</span>
                <span className="text-xs text-[#795A63]">Direct Local Handover</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Box */}
          <div className="lg:col-span-5 bg-[#FFFAF8] p-8 rounded-2xl border border-[#F1C5D1] relative overflow-hidden shadow-sm">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF1F4] border border-[#F1C5D1] flex items-center justify-center text-[#9F2343] font-serif font-bold text-xl shadow-xs">
                ♥
              </div>
              <blockquote className="font-serif italic text-lg text-[#3B2028] leading-relaxed">
                "We don't just put items in a box. We preserve feelings that deserve to be felt."
              </blockquote>
              <div className="pt-4 border-t border-[#F1C5D1] text-xs text-[#795A63] space-y-1">
                <p className="font-semibold text-[#3B2028]">DILSY Studio</p>
                <p>Personalised gifting for him, for her, and besties</p>
                <p className="text-[11px] text-[#9F2343]">Chandigarh University & Mohali, Punjab</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const DeliveryPolicySection: React.FC = () => {
  return (
    <section id="delivery-policy" className="py-12 bg-[#FCE7ED] border-t border-[#F1C5D1]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFAF8] rounded-2xl p-6 sm:p-8 border border-[#F1C5D1] shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1F4] border border-[#F1C5D1] flex items-center justify-center text-[#9F2343] shrink-0 mt-1">
              <Truck className="w-5 h-5" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-[#3B2028]">Official Delivery Policy</h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#FFF1F4] text-[#9F2343] font-medium border border-[#F1C5D1]">
                  Service Area: CU & Mohali
                </span>
              </div>

              <div className="p-4 bg-[#FFF1F4] rounded-xl border border-[#F1C5D1] shadow-2xs">
                <p className="text-sm sm:text-base text-[#3B2028] font-serif italic leading-relaxed">
                  "{EXACT_DELIVERY_POLICY}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#795A63] pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#9F2343] shrink-0" />
                  <span>Service area: Chandigarh University and nearby PGs around Mohali.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#9F2343] shrink-0" />
                  <span>Every order verified manually on WhatsApp before payment or dispatch.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does ordering on WhatsApp work?',
      a: 'When you click "Order on WhatsApp" or check out your bag, our website generates a clean, complete summary of your chosen hamper, customisation notes, and delivery preferences. You get to review the message before opening WhatsApp to chat with us at +91 8360958844. We confirm item availability, handover timing, delivery charges, and final pricing directly with you.',
    },
    {
      q: 'Can I personalise the greeting card note and include photos?',
      a: 'Yes, absolutely! Every DILSY hamper includes a personal greeting card hand-written with your message. You can also share your photo with us on WhatsApp right after submitting your inquiry to include it with your hamper.',
    },
    {
      q: 'Can I request same-day or next-morning delivery?',
      a: 'Same-day and next-morning delivery requests depend on item availability, order cut-off times, preparation time, and delivery location. Orders are confirmed only after DILSY verifies availability, final pricing, delivery charges, and timing with the customer. If you have an urgent surprise, message us early on WhatsApp!',
    },
    {
      q: 'What are the delivery charges around Chandigarh University and Mohali?',
      a: 'Delivery charges depend on the drop-off location (e.g., CU Campus North/South gate, Gharuan PGs, Kharar, Landran, or specific Mohali sectors). We keep student delivery charges nominal and confirm the exact fee with you on WhatsApp prior to starting your hamper.',
    },
    {
      q: 'Are the items inside launch hampers customizable?',
      a: 'Yes! We discuss and confirm the exact hamper contents, dietary preferences (such as eggless treats), personal notes, and any optional add-ons (roses, chocolates, cards) with you directly on WhatsApp before your order is finalised.',
    },
    {
      q: 'Are orders confirmed immediately upon clicking WhatsApp?',
      a: 'No. Clicking WhatsApp opens a conversation with your pre-filled inquiry. An order is confirmed only after our DILSY owner reviews your requirements, confirms item availability, clarifies any custom notes, and agrees on delivery timing and total charges with you.',
    },
  ];

  return (
    <section className="py-16 bg-[#FCE7ED] border-t border-[#F1C5D1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9F2343]">
            Common Questions
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#3B2028] mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#795A63] mt-2 font-light">
            Everything you need to know about our hampers, handwritten cards, and Mohali campus deliveries.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-[#FFFAF8] rounded-xl border border-[#F1C5D1] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus-visible:outline-none cursor-pointer"
                >
                  <span className="font-serif font-semibold text-base text-[#3B2028]">
                    {faq.q}
                  </span>
                  <span className="p-1 rounded text-[#9F2343] hover:bg-[#FFF1F4] shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-[#795A63] font-light leading-relaxed border-t border-[#F1C5D1]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const Footer: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#72172F] text-[#FFFAF8] pt-14 pb-8 border-t border-[#9F2343]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#F1C5D1]/20">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-2xl text-[#FFFAF8] tracking-tight">DILSY</span>
              <span className="w-2 h-2 rounded-full bg-[#E88AA4]" />
            </div>
            <p className="font-serif italic text-[#E88AA4] text-sm">
              A Little Box Full of Feelings.
            </p>
            <p className="text-xs text-[#FFFAF8]/80 font-light leading-relaxed max-w-sm">
              Boutique personalised handmade gift hampers. Thoughtfully crafted with love in Mohali for university students, couples, best friends, and everyone who treasures meaningful surprises.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E88AA4]">
              Explore DILSY
            </h4>
            <ul className="space-y-2 text-xs text-[#FFFAF8]/80">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/themes')} className="hover:text-white transition-colors cursor-pointer">
                  Shop by Theme
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/hampers')} className="hover:text-white transition-colors cursor-pointer">
                  All Hampers (₹799–₹1,199)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/custom-hamper')} className="hover:text-white transition-colors cursor-pointer">
                  Custom Hamper Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/our-story')} className="hover:text-white transition-colors cursor-pointer">
                  Our Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/delivery-policy')} className="hover:text-white transition-colors cursor-pointer">
                  Delivery Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/login')} className="hover:text-white transition-colors cursor-pointer">
                  Customer Sign In / Register
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Service Info */}
          <div className="md:col-span-4 space-y-3 text-xs text-[#FFFAF8]/80">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E88AA4]">
              Connect & Coordinate
            </h4>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#E88AA4]" />
                <span>WhatsApp: <strong>{WHATSAPP_PHONE_INTERNATIONAL}</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E88AA4]" />
                <span>Serving: Chandigarh University & Mohali PGs (Punjab)</span>
              </p>
              <p className="text-[11px] text-[#FFFAF8]/60 pt-1">
                Official Box Price Range: ₹799 – ₹1,199
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFFAF8]/60 gap-4">
          <p>© {new Date().getFullYear()} DILSY Gifting Studio. All rights reserved.</p>
          <p className="text-[11px] flex items-center gap-1">
            <span>Made with</span>
            <span className="text-[#E88AA4]">♥</span>
            <span>for real feelings</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
