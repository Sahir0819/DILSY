import React from 'react';
import { Heart, ArrowRight, MapPin, Feather, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface OurStoryPageProps {
  onNavigate: (path: string) => void;
}

export const OurStoryPage: React.FC<OurStoryPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FCE7ED] text-[#3B2028] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'Our Story' }]}
            onNavigate={onNavigate}
          />
        </div>

        {/* Story Card */}
        <div className="bg-[#FFFAF8] p-8 sm:p-12 rounded-3xl border border-[#F1C5D1] shadow-xs space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9F2343] bg-[#FFF1F4] px-3 py-1 rounded-full border border-[#F1C5D1]">
              <Heart className="w-3.5 h-3.5 fill-[#9F2343]" />
              <span>Behind The Box</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3B2028] tracking-tight">
              A Little Box Full of Feelings
            </h1>
            <p className="text-sm font-serif italic text-[#9F2343]">
              Personalised, thoughtful gifting born right here around Chandigarh University & Mohali.
            </p>
          </div>

          <div className="space-y-5 text-sm sm:text-base text-[#79665C] font-light leading-relaxed border-t border-[#F1C5D1] pt-6">
            <p>
              DILSY started from a very simple observation among university students and friends: gifts often feel either too hurried or completely impersonal. Plastic-wrapped generic confections or rushed deliveries rarely convey how deeply you appreciate someone.
            </p>
            <p>
              We believe every meaningful moment deserves care. Whether it’s expressing love to your partner, thanking a roommate who helped you survive semester exams, or surprising a friend across distance, the experience should feel like someone stopped time just to prepare it for them.
            </p>
            <p>
              In our local Mohali studio, we hand-assemble every hamper: packing thoughtful items, printing your keepsake memories, and hand-writing your heartfelt words on a custom card.
            </p>
            <p>
              No automated templates. Just sincere, handmade gestures delivered directly to hostel gates, campus desks, and student accommodations.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F1C5D1]">
            <div className="p-4 bg-[#FFF1F4] rounded-2xl border border-[#F1C5D1] text-center space-y-1">
              <span className="block font-serif font-bold text-2xl text-[#9F2343]">100%</span>
              <span className="text-xs text-[#79665C]">Handcrafted by Hand</span>
            </div>
            <div className="p-4 bg-[#FFF1F4] rounded-2xl border border-[#F1C5D1] text-center space-y-1">
              <span className="block font-serif font-bold text-2xl text-[#9F2343]">₹799–₹1,199</span>
              <span className="text-xs text-[#79665C]">Official Box Pricing</span>
            </div>
            <div className="p-4 bg-[#FFF1F4] rounded-2xl border border-[#F1C5D1] text-center space-y-1">
              <span className="block font-serif font-bold text-2xl text-[#9F2343]">CU & Mohali</span>
              <span className="text-xs text-[#79665C]">Direct Local Handover</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#F1C5D1] flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate('/hampers')}
              className="px-6 py-3.5 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold transition-all shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Official Hampers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('/custom-hamper')}
              className="px-6 py-3.5 bg-[#FFFAF8] hover:bg-[#FFF1F4] text-[#9F2343] border border-[#F1C5D1] rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              Create a Custom Hamper
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
