import React, { useState } from 'react';
import { Heart, Truck, ShieldCheck, ChevronDown, ChevronUp, MessageCircle, MapPin, Feather, Sparkles } from 'lucide-react';
import { EXACT_DELIVERY_POLICY, WHATSAPP_PHONE_INTERNATIONAL } from '../utils/whatsapp';

export const OurStory: React.FC = () => {
  return (
    <section id="our-story" className="py-16 md:py-24 bg-gradient-to-b from-[#FDF9F7] to-[#FFF5F8] border-t border-[#E8D0D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#A32842] bg-[#FFEBF0] px-3 py-1 rounded-full border border-[#FFCCD5] shadow-2xs">
              <Heart className="w-3.5 h-3.5 fill-[#C73858] text-[#C73858]" />
              <span>Behind The Box</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D1B22] tracking-tight text-balance">
              Born from late nights, honest friendships, and unsaid love.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#52333D] font-light leading-relaxed">
              <p>
                DILSY began with a simple belief right here around Chandigarh University and Mohali: gifts shouldn't be plastic wrapped junk or rushed convenience chocolates. When you love someone—whether it’s your partner, your hostel roommate who got you through exams, or your best friend miles away—the gift should feel like you stopped time just for them.
              </p>
              <p>
                We handcraft each hamper from scratch in our local studio: hand-pouring soy candles with warm crackling wicks, printing your favorite polaroid memory, and hand-penning your words onto heavy-stock stationery with a warm wax seal.
              </p>
              <p>
                No automated robots, no cookie-cutter templates. Just <em>A Little Box Full of Feelings</em>, delivered straight to campus gates, hostel desks, and local PGs.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-6">
              <div>
                <span className="block font-serif font-bold text-2xl text-[#99223A]">100%</span>
                <span className="text-xs text-[#6B424E]">Personalised by Hand</span>
              </div>
              <div className="w-px h-8 bg-[#E8D0D6]" />
              <div>
                <span className="block font-serif font-bold text-2xl text-[#99223A]">₹999–₹1,499</span>
                <span className="text-xs text-[#6B424E]">Fair Student Budgets</span>
              </div>
              <div className="w-px h-8 bg-[#E8D0D6]" />
              <div>
                <span className="block font-serif font-bold text-2xl text-[#99223A]">Mohali & CU</span>
                <span className="text-xs text-[#6B424E]">Direct Local Handover</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Box with Romantic Love Accent */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#FFF0F4] via-[#FFEBF0] to-[#FFF5F8] p-8 rounded-2xl border border-[#FFCCD5] relative overflow-hidden shadow-sm shadow-[#FFCCD5]/20">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFE5EC] border border-[#FFB3C6] flex items-center justify-center text-[#99223A] font-serif font-bold text-xl shadow-xs">
                ♥
              </div>
              <blockquote className="font-serif italic text-lg text-[#2D1B22] leading-relaxed">
                "We don't sell boxes. We preserve feelings that deserve to be felt."
              </blockquote>
              <div className="pt-4 border-t border-[#FFCCD5] text-xs text-[#52333D] space-y-1">
                <p className="font-semibold text-[#2D1B22]">DILSY Studio</p>
                <p>Gifting for him, for her, and besties</p>
                <p className="text-[11px] text-[#A32842]">Chandigarh University & Mohali, Punjab</p>
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
    <section id="delivery-policy" className="py-12 bg-[#FFF8FA] border-t border-[#E8D0D6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFCFD] rounded-2xl p-6 sm:p-8 border border-[#FFCCD5] shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F4] border border-[#FFCCD5] flex items-center justify-center text-[#99223A] shrink-0 mt-1">
              <Truck className="w-5 h-5" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-[#2D1B22]">Official Delivery Policy</h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#FFEBF0] text-[#99223A] font-medium border border-[#FFCCD5]">
                  Service Area: CU & Mohali
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#FFCCD5] shadow-2xs">
                <p className="text-sm sm:text-base text-[#2D1B22] font-serif italic leading-relaxed">
                  "{EXACT_DELIVERY_POLICY}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#52333D] pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C73858] shrink-0" />
                  <span>Service area: Chandigarh University and nearby PGs around Mohali.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C73858] shrink-0" />
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
      a: 'When you click "Order on WhatsApp" or check out your bag, our website generates a clean, complete summary of your chosen hamper, customisation notes, and delivery preferences. You get to review the message in a preview window before opening WhatsApp to message us at +91 8360958844. We will confirm item availability, exact handover timing, delivery charges, and final pricing directly with you.',
    },
    {
      q: 'Can I personalise the greeting card note and include photos?',
      a: 'Yes, absolutely! Every DILSY hamper includes a bespoke handwritten greeting card penned on premium textured stationery with an authentic wax seal. For hampers featuring polaroid prints (like The Little Affair or The Everything Box), you can share your photo with us on WhatsApp right after submitting your inquiry.',
    },
    {
      q: 'Can I request same-day or next-morning delivery?',
      a: 'Same-day and next-morning delivery requests depend on item availability, order cut-off times, preparation time, and delivery location. Orders are confirmed only after DILSY verifies availability, final pricing, delivery charges, and timing with the customer. If you have an urgent surprise, message us early on WhatsApp!',
    },
    {
      q: 'What are the delivery charges around Chandigarh University and Mohali?',
      a: 'Delivery charges depend on the exact drop-off spot (e.g., CU Campus North/South gate, Gharuan PGs, Kharar, Landran, or specific Mohali sectors). We keep student delivery charges nominal and confirm the exact fee with you on WhatsApp prior to starting your hamper.',
    },
    {
      q: 'Are the items inside launch hampers customizable?',
      a: 'Yes! The included items in our launch hampers (The Little Affair ₹999, The DILSY Edit ₹1,249, The Everything Box ₹1,499) are curated proposed concepts. You can customize fragrances, dietary preferences (e.g. eggless treats), initials on keychains, and packaging style during checkout or via our Custom Hamper Builder.',
    },
    {
      q: 'Are orders confirmed immediately upon clicking WhatsApp?',
      a: 'No. Clicking WhatsApp opens a conversation with your pre-filled inquiry. An order is confirmed only after our DILSY owner reviews your requirements, confirms item availability, clarifies any custom notes, and agrees on delivery timing and total charges with you.',
    },
  ];

  return (
    <section className="py-16 bg-[#FAF7F2] border-t border-[#2A1E1A]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8C5A4F]">
            Common Questions
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#2A1E1A] mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#4A352F]/80 mt-2 font-light">
            Everything you need to know about our hampers, handwritten cards, and Mohali campus deliveries.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-[#2A1E1A]/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus-visible:outline-none"
                >
                  <span className="font-serif font-semibold text-base text-[#2A1E1A]">
                    {faq.q}
                  </span>
                  <span className="p-1 rounded text-[#8C5A4F] hover:bg-[#F5EFEB] shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-[#4A352F] font-light leading-relaxed border-t border-[#2A1E1A]/5">
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

export const Footer: React.FC<{ onNavigate: (id: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#260C12] text-[#FFF0F3] pt-14 pb-8 border-t border-[#4A1622]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-2xl text-[#FFF0F3] tracking-tight">DILSY</span>
              <span className="w-2 h-2 rounded-full bg-[#E56B85]" />
            </div>
            <p className="font-serif italic text-[#FFB3C6] text-sm">
              A Little Box Full of Feelings.
            </p>
            <p className="text-xs text-[#FFE5EC]/70 font-light leading-relaxed max-w-sm">
              Boutique personalised handmade gift hampers. Thoughtfully crafted with love in Mohali for university students, couples, best friends, and everyone who treasures meaningful surprises.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FF85A1]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#FFE5EC]/80">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  Shop Launch Hampers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom-builder')} className="hover:text-white transition-colors">
                  Custom Hamper Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('our-story')} className="hover:text-white transition-colors">
                  Our Brand Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('delivery-policy')} className="hover:text-white transition-colors">
                  Delivery Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Service Info */}
          <div className="md:col-span-4 space-y-3 text-xs text-[#FFE5EC]/80">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FF85A1]">
              Connect & Coordinate
            </h4>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp: <strong>{WHATSAPP_PHONE_INTERNATIONAL}</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF85A1]" />
                <span>Serving: Chandigarh University & Mohali PGs (Punjab)</span>
              </p>
              <p className="text-[11px] text-[#FFE5EC]/60 pt-1">
                Hamper Price Range: ₹999 – ₹1,499
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFE5EC]/50 gap-4">
          <p>© {new Date().getFullYear()} DILSY Gifting Studio. All rights reserved.</p>
          <p className="text-[11px] flex items-center gap-1">
            <span>Handcrafted with</span>
            <span className="text-[#FF85A1]">♥</span>
            <span>for real moments</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
