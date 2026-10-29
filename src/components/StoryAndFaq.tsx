import React, { useState } from 'react';
import { Heart, Truck, ShieldCheck, ChevronDown, ChevronUp, MessageCircle, MapPin, Mail, ArrowRight } from 'lucide-react';
import { EXACT_DELIVERY_POLICY, WHATSAPP_PHONE_INTERNATIONAL } from '../utils/whatsapp';

/**
 * Editorial Manifesto Section (Screenshot 5)
 */
export const ManifestoSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#FBF4F2] border-t border-b border-[#EADBDB] text-center px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5A63] mb-6">
          The Manifesto of DILSY
        </p>
        <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2A0D15] font-normal leading-[1.35] tracking-tight max-w-3xl mx-auto">
          “We believe gifts should not merely be exchanged, but felt. Each DILSY box is an archive of unspoken affection, packaged with bespoke intention.”
        </blockquote>
        <div className="w-16 h-px bg-[#C9A89B] mx-auto my-7" />
        <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#7A5A63]">
          Handcrafted in our Atelier • Since 2024
        </p>
      </div>
    </section>
  );
};

export const OurStory: React.FC = () => {
  return (
    <section id="our-story" className="py-16 md:py-24 bg-[#FAF7F5] border-t border-[#EADBDB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5A63]">
              Behind The Box
            </p>

            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#2A0D15] tracking-tight text-balance leading-snug">
              Thoughtful gifting, personal touches, and real feelings.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#6E565D] font-light leading-relaxed font-sans">
              <p>
                DILSY began with a simple belief right here around Chandigarh University and Mohali: gifts shouldn't be plastic-wrapped items or rushed convenience confections. When you want to surprise someone—whether your partner, a hostel roommate who supported you through exams, or a best friend miles away—the gesture should feel thoughtful, intimate, and deeply personal.
              </p>
              <p>
                We assemble each hamper with care in our local studio: preparing chosen items, personalising keepsake photos, and hand-writing your words onto 300gsm cold-pressed cotton cardstock to make someone feel truly cherished.
              </p>
              <p>
                No automated templates. Just <em>A Little Box Full of Feelings</em>, delivered straight to campus gates, hostel desks, and local PGs.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-6 text-[#2A0D15] font-sans">
              <div>
                <span className="block font-serif font-normal text-2xl text-[#3E101D]">100%</span>
                <span className="text-[11px] text-[#7A5A63] tracking-wide uppercase">Handcrafted</span>
              </div>
              <div className="w-px h-8 bg-[#EADBDB]" />
              <div>
                <span className="block font-serif font-normal text-2xl text-[#3E101D]">₹799–₹1,199</span>
                <span className="text-[11px] text-[#7A5A63] tracking-wide uppercase">Box Pricing</span>
              </div>
              <div className="w-px h-8 bg-[#EADBDB]" />
              <div>
                <span className="block font-serif font-normal text-2xl text-[#3E101D]">Mohali & CU</span>
                <span className="text-[11px] text-[#7A5A63] tracking-wide uppercase">Local Handover</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Box */}
          <div className="lg:col-span-5 bg-white p-8 border border-[#EADBDB] relative overflow-hidden">
            <div className="space-y-5">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#7A5A63]">
                Atelier Creed
              </span>
              <blockquote className="font-serif italic text-xl text-[#2A0D15] leading-relaxed">
                "We don't just put items in a box. We preserve feelings that deserve to be felt."
              </blockquote>
              <div className="pt-4 border-t border-[#EADBDB] text-xs font-sans text-[#7A5A63] space-y-1">
                <p className="font-medium text-[#2A0D15]">DILSY Studio Atelier</p>
                <p>Personalised gifting for him, for her, and besties</p>
                <p className="text-[11px] text-[#3E101D]">Chandigarh University & Mohali, Punjab</p>
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
    <section id="delivery-policy" className="py-14 bg-[#FAF7F5] border-t border-[#EADBDB]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-10 border border-[#EADBDB]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-[#EADBDB] bg-[#FAF7F5] flex items-center justify-center text-[#3E101D] shrink-0 mt-1">
              <Truck className="w-5 h-5" />
            </div>

            <div className="space-y-4 font-sans">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-serif text-2xl font-normal text-[#2A0D15]">Official Delivery Policy</h3>
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 bg-[#FAF7F5] text-[#3E101D] border border-[#EADBDB] font-medium">
                  CU Campus & Mohali
                </span>
              </div>

              <div className="p-5 bg-[#FAF7F5] border border-[#EADBDB]">
                <p className="text-sm sm:text-base text-[#2A0D15] font-serif italic leading-relaxed">
                  "{EXACT_DELIVERY_POLICY}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#7A5A63] pt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#3E101D] shrink-0" />
                  <span>Service area: Chandigarh University and nearby student PGs around Mohali.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3E101D] shrink-0" />
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
      a: 'When you click "WhatsApp Order" or check out your bag, our website generates a clean, complete summary of your chosen hamper, customisation notes, and delivery preferences. You get to review the message before opening WhatsApp to chat with us at +91 8360958844. We confirm item availability, handover timing, delivery charges, and final pricing directly with you.',
    },
    {
      q: 'Can I personalise the greeting card note and include photos?',
      a: 'Yes, absolutely! Every DILSY hamper includes a personal greeting card hand-transcribed with your message. You can also share your photo with us on WhatsApp right after submitting your inquiry to include it with your hamper.',
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
    <section className="py-16 sm:py-20 bg-[#FAF7F5] border-t border-[#EADBDB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#7A5A63]">
            Common Inquiries
          </p>
          <h2 className="text-3xl font-serif font-normal text-[#2A0D15] mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#7A5A63] mt-2 font-light">
            Everything you need to know about our hampers, handwritten calligraphy notes, and Mohali deliveries.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-[#EADBDB] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 focus-visible:outline-none cursor-pointer"
                >
                  <span className="font-serif font-normal text-base text-[#2A0D15]">
                    {faq.q}
                  </span>
                  <span className="p-1 text-[#3E101D] shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-[#6E565D] font-light leading-relaxed border-t border-[#EADBDB]">
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

/**
 * Editorial Footer matching Google Stitch Screenshot 5
 */
export const Footer: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSent(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setNewsletterSent(false);
      }, 4000);
    }
  };

  return (
    <footer className="bg-[#FAF7F5] text-[#2A0D15] pt-16 pb-12 border-t border-[#EADBDB] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 pb-14 border-b border-[#EADBDB]">
          {/* Brand Column (Screenshot 5 Left) */}
          <div className="md:col-span-4 space-y-4">
            <button
              onClick={() => onNavigate('/')}
              className="text-2xl font-serif font-normal tracking-[0.25em] text-[#2A0D15] hover:opacity-85 transition-opacity text-left cursor-pointer"
            >
              DILSY
            </button>
            <p className="text-xs text-[#6E565D] font-light leading-relaxed max-w-sm">
              High-fashion personal gifting created for enduring sentiment. Handcrafted with bespoke intention in Mohali for university milestones, romantic keepsakes, and lifelong friends.
            </p>
            <div className="text-xs text-[#7A5A63] space-y-1.5 pt-2">
              <p className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-[#3E101D]" />
                <span>WhatsApp Concierge: <strong className="text-[#2A0D15]">{WHATSAPP_PHONE_INTERNATIONAL}</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#3E101D]" />
                <span>Serving Chandigarh University & Mohali PGs (Punjab)</span>
              </p>
            </div>
          </div>

          {/* Collections Column (Screenshot 5 Column 2) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-serif font-semibold uppercase tracking-[0.15em] text-[#2A0D15]">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#6E565D]">
              <li>
                <button
                  onClick={() => onNavigate('/themes')}
                  className="hover:text-[#2A0D15] transition-colors cursor-pointer"
                >
                  Curated Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/themes')}
                  className="hover:text-[#2A0D15] transition-colors cursor-pointer"
                >
                  Shop by Theme
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/custom-hamper')}
                  className="hover:text-[#2A0D15] transition-colors cursor-pointer"
                >
                  Custom Hamper
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/hampers')}
                  className="hover:text-[#2A0D15] transition-colors cursor-pointer"
                >
                  All Editions (₹799–₹1,199)
                </button>
              </li>
            </ul>
          </div>

          {/* Concierge Column (Screenshot 5 Column 3) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-serif font-semibold uppercase tracking-[0.15em] text-[#2A0D15]">
              Concierge
            </h4>
            <ul className="space-y-2 text-xs text-[#6E565D]">
              <li>
                <button
                  onClick={() => onNavigate('/our-story')}
                  className="hover:text-[#2A0D15] transition-colors cursor-pointer"
                >
                  Customer Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/delivery-policy')}
                  className="hover:text-[#2A0D15] transition-colors cursor-pointer"
                >
                  Shipping & Returns
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/918360958844`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2A0D15] transition-colors cursor-pointer"
                >
                  WhatsApp Atelier
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/our-story')}
                  className="hover:text-[#2A0D15] transition-colors cursor-pointer"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/login')}
                  className="hover:text-[#2A0D15] transition-colors cursor-pointer"
                >
                  Account Access
                </button>
              </li>
            </ul>
          </div>

          {/* Private Dispatch Column (Screenshot 5 Column 4) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-serif font-semibold uppercase tracking-[0.15em] text-[#2A0D15]">
              Private Dispatch
            </h4>
            <p className="text-xs text-[#6E565D] font-light leading-relaxed">
              Receive intimate edition announcements and seasonal catalog dispatch directly from our Mohali atelier.
            </p>

            <form onSubmit={handleNewsletter} className="pt-1">
              <div className="flex border border-[#EADBDB] bg-white">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full px-3 py-2 text-xs text-[#2A0D15] placeholder-[#7A5A63] focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3E101D] hover:bg-[#2A0B13] text-white text-[10px] font-sans font-medium uppercase tracking-[0.18em] whitespace-nowrap transition-colors cursor-pointer"
                >
                  {newsletterSent ? 'Subscribed' : 'Join'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A5A63] gap-4">
          <p>© {new Date().getFullYear()} DILSY Gifting Atelier. All rights reserved.</p>
          <p className="text-[11px] tracking-wide">
            A Little Box Full of Feelings • Mohali & Chandigarh University
          </p>
        </div>
      </div>
    </footer>
  );
};
