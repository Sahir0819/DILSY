import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ThemeCategory } from '../types';
import { ThemeArtwork } from '../components/ThemeArtwork';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface ThemesPageProps {
  themes: ThemeCategory[];
  onNavigate: (path: string) => void;
}

export const ThemesPage: React.FC<ThemesPageProps> = ({ themes, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2A0D15] py-8 sm:py-14 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'Shop by Theme' }]}
            onNavigate={onNavigate}
          />
        </div>

        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5A63] mb-2">
            Curated Taxonomies
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#2A0D15] tracking-tight">
            Shop by Occasion & Theme
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6E565D] font-light leading-relaxed font-sans">
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
                className="bg-white border border-[#EADBDB] hover:border-[#3E101D]/40 overflow-hidden transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Cover Artwork or Image */}
                  <div
                    onClick={() => onNavigate(collectionPath)}
                    className="relative aspect-[16/10] overflow-hidden bg-[#FAF7F5] cursor-pointer border-b border-[#EADBDB]"
                  >
                    {theme.coverImage ? (
                      <img
                        src={theme.coverImage}
                        alt={theme.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                      />
                    ) : (
                      <ThemeArtwork themeId={theme.id} />
                    )}

                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] font-medium text-[#3E101D] border border-[#EADBDB]/60">
                      {theme.badge}
                    </div>

                    {/* Coming Soon status */}
                    {theme.isComingSoon && (
                      <div className="absolute top-3 right-3 bg-[#3E101D] text-white text-[9px] font-bold tracking-widest px-2.5 py-0.5 uppercase">
                        COMING SOON
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h2
                      onClick={() => onNavigate(collectionPath)}
                      className="text-xl font-serif font-normal text-[#2A0D15] group-hover:text-[#3E101D] transition-colors mb-2 cursor-pointer"
                    >
                      {theme.name}
                    </h2>
                    <p className="text-xs text-[#7A6368] font-light leading-relaxed line-clamp-3">
                      {theme.description}
                    </p>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 pt-0 border-t border-[#EADBDB]/60">
                  <button
                    type="button"
                    onClick={() => onNavigate(collectionPath)}
                    className="w-full mt-4 py-2.5 px-4 bg-[#3E101D] hover:bg-[#2A0B13] text-white text-[11px] font-medium uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
