import React, { useState } from 'react';
import { ThemeCategory } from '../types';
import { ThemeArtwork } from './ThemeArtwork';
import { Heart, ArrowRight, Clock, Sparkles } from 'lucide-react';

interface ThemesPageProps {
  themes: ThemeCategory[];
  onSelectTheme: (slug: string) => void;
  onOpenCustomBuilder: (occasionTitle: string) => void;
}

export const ThemesPage: React.FC<ThemesPageProps> = ({
  themes,
  onSelectTheme,
  onOpenCustomBuilder,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'romantic' | 'celebration' | 'care'>('all');

  // Filter themes if user wants to narrow down
  const filteredThemes = themes.filter((t) => {
    if (filterCategory === 'romantic') {
      return ['i-love-you-for-her', 'i-love-you-for-him', 'anniversary', 'valentine-box', 'miss-you-box'].includes(t.id);
    }
    if (filterCategory === 'celebration') {
      return ['birthday', 'diwali-box', 'anniversary'].includes(t.id);
    }
    if (filterCategory === 'care') {
      return ['periods-box', 'apology-box', 'miss-you-box'].includes(t.id);
    }
    return true;
  });

  return (
    <div className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#9F2343] bg-[#FFFAF8] px-3.5 py-1.5 rounded-full border border-[#F1C5D1] shadow-2xs mb-3">
          <Heart className="w-3.5 h-3.5 text-[#9F2343] fill-[#9F2343]" />
          <span>Occasion Collections</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#3B2028] tracking-tight">
          Shop by Theme
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#795A63] font-light leading-relaxed">
          Curated gift themes designed for real emotions. Choose an occasion below to explore the hampers curated for it.
        </p>

        {/* Filter Chips */}
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-[#9F2343] text-white border-[#72172F] shadow-xs font-semibold'
                : 'bg-[#FFFAF8] text-[#795A63] border-[#F1C5D1] hover:text-[#9F2343]'
            }`}
          >
            All 9 Themes
          </button>
          <button
            onClick={() => setFilterCategory('romantic')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              filterCategory === 'romantic'
                ? 'bg-[#9F2343] text-white border-[#72172F] shadow-xs font-semibold'
                : 'bg-[#FFFAF8] text-[#795A63] border-[#F1C5D1] hover:text-[#9F2343]'
            }`}
          >
            Romance & Love
          </button>
          <button
            onClick={() => setFilterCategory('celebration')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              filterCategory === 'celebration'
                ? 'bg-[#9F2343] text-white border-[#72172F] shadow-xs font-semibold'
                : 'bg-[#FFFAF8] text-[#795A63] border-[#F1C5D1] hover:text-[#9F2343]'
            }`}
          >
            Birthdays & Festive
          </button>
          <button
            onClick={() => setFilterCategory('care')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              filterCategory === 'care'
                ? 'bg-[#9F2343] text-white border-[#72172F] shadow-xs font-semibold'
                : 'bg-[#FFFAF8] text-[#795A63] border-[#F1C5D1] hover:text-[#9F2343]'
            }`}
          >
            Comfort & Care
          </button>
        </div>
      </div>

      {/* Responsive Grid of All 9 Themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredThemes.map((theme) => {
          const isComingSoon = !!theme.isComingSoon;

          return (
            <div
              key={theme.id}
              className={`bg-[#FFFAF8] rounded-2xl border transition-all flex flex-col justify-between overflow-hidden group shadow-2xs hover:shadow-xl hover:shadow-[#72172F]/5 ${
                isComingSoon
                  ? 'border-[#F1C5D1]/70'
                  : 'border-[#F1C5D1] hover:border-[#9F2343]'
              }`}
            >
              <div>
                {/* Artwork Banner */}
                <div className="relative overflow-hidden border-b border-[#F1C5D1]">
                  {theme.coverImage ? (
                    <div className="w-full aspect-[16/10] overflow-hidden bg-[#FFF1F4]">
                      <img
                        src={theme.coverImage}
                        alt={theme.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <ThemeArtwork themeId={theme.id} />
                  )}

                  {/* Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {isComingSoon ? (
                      <span className="bg-[#72172F] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1 border border-white/20">
                        <Clock className="w-3 h-3" />
                        <span>Coming Soon</span>
                      </span>
                    ) : (
                      <span className="bg-[#FFFAF8]/95 backdrop-blur-xs text-[#9F2343] text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-[#F1C5D1] shadow-2xs">
                        {theme.badge || 'Occasion'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Theme Content */}
                <div className="p-6">
                  <h2 className="text-xl font-serif font-bold text-[#3B2028] group-hover:text-[#9F2343] transition-colors">
                    {theme.name}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-[#795A63] font-light leading-relaxed">
                    {theme.description}
                  </p>

                  {isComingSoon && theme.comingSoonMessage && (
                    <div className="mt-3 p-2.5 rounded-xl bg-[#FFF1F4] border border-[#F1C5D1] text-[11px] text-[#9F2343] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{theme.comingSoonMessage}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => onSelectTheme(theme.slug)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isComingSoon
                      ? 'bg-[#FCE7ED] text-[#9F2343] hover:bg-[#F1C5D1] border border-[#F1C5D1]'
                      : 'bg-[#9F2343] hover:bg-[#72172F] text-white shadow-md shadow-[#9F2343]/20'
                  }`}
                >
                  <span>{isComingSoon ? 'Preview Collection' : 'View Collection'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Hamper Notice */}
      <div className="p-6 rounded-2xl bg-[#FFFAF8] border border-[#F1C5D1] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm shadow-[#72172F]/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFF1F4] border border-[#F1C5D1] flex items-center justify-center text-[#9F2343] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="font-serif font-bold text-base text-[#3B2028]">Have a different occasion in mind?</p>
            <p className="text-xs text-[#795A63]">Use our custom studio builder to create a personalized hamper for any celebration.</p>
          </div>
        </div>
        <button
          onClick={() => onOpenCustomBuilder('Special Celebration')}
          className="px-5 py-2.5 bg-[#9F2343] hover:bg-[#72172F] text-white rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>Build Custom Box</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
