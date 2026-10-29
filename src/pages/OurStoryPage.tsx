import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface OurStoryPageProps {
  onNavigate: (path: string) => void;
}

export const OurStoryPage: React.FC<OurStoryPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2A0D15] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'Our Story' }]}
            onNavigate={onNavigate}
          />
        </div>

        {/* Story Card */}
        <div className="bg-white p-8 sm:p-14 border border-[#EADBDB] space-y-8 shadow-xs">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-[#3E101D] bg-[#FAF7F5] px-3 py-1 border border-[#EADBDB]">
              <Heart className="w-3 h-3 fill-[#3E101D]" />
              <span>Behind The Atelier</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2A0D15] tracking-tight">
              A Little Box Full of Feelings
            </h1>
            <p className="text-sm font-serif italic text-[#3E101D]">
              Personalised, thoughtful gifting born right here around Chandigarh University & Mohali.
            </p>
          </div>

          <div className="space-y-5 text-sm sm:text-base text-[#7A5A63] font-light leading-relaxed border-t border-[#EADBDB] pt-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EADBDB]">
            <div className="p-5 bg-[#FAF7F5] border border-[#EADBDB] text-center space-y-1">
              <span className="block font-serif font-medium text-2xl text-[#3E101D]">100%</span>
              <span className="text-xs text-[#7A5A63] uppercase tracking-wider">Handcrafted in Studio</span>
            </div>
            <div className="p-5 bg-[#FAF7F5] border border-[#EADBDB] text-center space-y-1">
              <span className="block font-serif font-medium text-2xl text-[#3E101D]">₹799–₹1,199</span>
              <span className="text-xs text-[#7A5A63] uppercase tracking-wider">Official Box Pricing</span>
            </div>
            <div className="p-5 bg-[#FAF7F5] border border-[#EADBDB] text-center space-y-1">
              <span className="block font-serif font-medium text-2xl text-[#3E101D]">CU & Mohali</span>
              <span className="text-xs text-[#7A5A63] uppercase tracking-wider">Direct Local Handover</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#EADBDB] flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate('/hampers')}
              className="px-6 py-3.5 bg-[#3E101D] hover:bg-[#2A0D15] text-white text-xs uppercase tracking-widest font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Official Hampers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('/custom-hamper')}
              className="px-6 py-3.5 bg-white hover:bg-[#FAF7F5] text-[#3E101D] border border-[#EADBDB] text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer text-center"
            >
              Create a Custom Hamper
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
