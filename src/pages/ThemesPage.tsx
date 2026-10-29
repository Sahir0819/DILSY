import React from 'react';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { ThemeCategory } from '../types';
import { ThemeArtwork } from '../components/ThemeArtwork';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface ThemesPageProps {
  themes: ThemeCategory[];
  onNavigate: (path: string) => void;
}

export const ThemesPage: React.FC<ThemesPageProps> = ({ themes, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FCE7ED] text-[#3B2028] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'Shop by Theme' }]}
            onNavigate={onNavigate}
          />
        </div>

        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#9F2343] bg-[#FFFAF8] px-3 py-1 rounded-full border border-[#F1C5D1] mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 fill-[#9F2343] text-[#9F2343]" />
            <span>9 Occasion Collections</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3B2028] tracking-tight">
            Shop by Theme
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#79665C] font-light leading-relaxed">
            Every feeling has its own mood and story. Explore our 9 occasion-based collections, each thoughtfully styled and matched with handwritten sentiments.
          </p>
        </div>

        {/* Clean Responsive Grid of all 9 Theme Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {themes.map((theme) => {
            const collectionPath = `/collections/${theme.slug || theme.id}`;

            return (
              <div
                key={theme.id}
                className="bg-[#FFFAF8] rounded-2xl border border-[#F1C5D1] hover:border-[#9F2343] overflow-hidden shadow-xs hover:shadow-xl hover:shadow-[#72172F]/10 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Cover Artwork or Image */}
                  <div
                    onClick={() => onNavigate(collectionPath)}
                    className="relative aspect-[16/10] overflow-hidden bg-[#FFF1F4] cursor-pointer"
                  >
                    {theme.coverImage ? (
                      <img
                        src={theme.coverImage}
                        alt={theme.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <ThemeArtwork themeId={theme.id} />
                    )}

                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-[#FFFAF8]/95 px-2.5 py-1 rounded-full border border-[#F1C5D1] text-[11px] font-semibold text-[#9F2343] shadow-xs">
                      {theme.badge}
                    </div>

                    {/* Coming Soon status */}
                    {theme.isComingSoon && (
                      <div className="absolute top-3 right-3 bg-[#72172F] text-white text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs uppercase border border-[#F1C5D1]/30">
                        COMING SOON
                      </div>
                    )}
                  </div>

                  {/* Card Content: Theme Name & One short realistic description */}
                  <div className="p-6">
                    <h2
                      onClick={() => onNavigate(collectionPath)}
                      className="text-xl font-serif font-bold text-[#3B2028] group-hover:text-[#9F2343] transition-colors mb-2 cursor-pointer"
                    >
                      {theme.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#79665C] font-light leading-relaxed">
                      {theme.description}
                    </p>
                  </div>
                </div>

                {/* Card Action: View Collection Button */}
                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => onNavigate(collectionPath)}
                    className="w-full py-2.5 px-4 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>View Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
