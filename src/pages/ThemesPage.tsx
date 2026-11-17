import React from 'react';
import { ThemeCategory } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface ThemesPageProps {
  themes: ThemeCategory[];
  onNavigate: (path: string) => void;
}

const curatedThemeSeries = [
  {
    number: '01 / CORE SERIES',
    title: 'Romance & Forever',
    description:
      'Intimate tokens of longevity, anniversary memories, and pure undying commitment designed to outlive ephemeral trends.',
    action: 'DISCOVER COLLECTION',
    slug: 'anniversary',
    image: '/assets/images/theme-romance.jpg',
  },
  {
    number: '02 / MILESTONES',
    title: 'Milestone Birthdays',
    description:
      'Honoring another trip around the sun with tactile, mature celebratory artifacts.',
    action: 'EXPLORE SETS',
    slug: 'birthday',
    image: '/assets/images/theme-birthdays.jpg',
  },
  {
    number: '03 / EMPATHY',
    title: 'Comfort & Care',
    description:
      'Featuring our acclaimed Periods Box, Healing Rituals, and sincere Apology curations.',
    action: 'VIEW CARE HAMPERS',
    slug: 'periods-box',
    image: '/assets/images/theme-comfort.jpg',
  },
  {
    number: '04 / CULTURAL',
    title: 'Festive & Cultural',
    description:
      'The festive Diwali Box and regional celebrations re-imagined through haute-couture restraint and architectural beauty.',
    action: 'DISCOVER FESTIVE',
    slug: 'diwali-box',
    image: '/assets/images/theme-festive.jpg',
  },
];

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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div className="max-w-3xl">
            <p className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#7A5A63] mb-2">
              Curated Taxonomies
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#2A0D15] tracking-tight">
              Shop by Occasion & Theme
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#6E565D] font-light leading-relaxed font-sans">
              Every feeling has its own mood and story. Explore our curated theme series, each thoughtfully styled and matched with handwritten sentiments.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/hampers')}
            className="text-[11px] uppercase tracking-[0.18em] font-sans font-medium text-[#2A0D15] hover:text-[#4A1423] pb-1 border-b border-[#2A0D15] self-start sm:self-auto transition-colors cursor-pointer shrink-0"
          >
            All Hampers ({themes.length})
          </button>
        </div>

        {/* 2x2 Grid of Theme Cards Moved from Home Page */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {curatedThemeSeries.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(`/collections/${item.slug}`)}
              className="relative h-72 sm:h-80 border border-[#EADBDB] overflow-hidden group cursor-pointer flex flex-col justify-between p-7 sm:p-9 bg-[#FAF7F5]"
            >
              {/* Background Photography with Warm Ivory Wash */}
              <div className="absolute inset-0 z-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#FAF7F5]/75 group-hover:bg-[#FAF7F5]/65 transition-colors duration-500" />
              </div>

              {/* Top Tag */}
              <div className="relative z-10 self-start">
                <span className="bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[9px] font-sans uppercase tracking-[0.2em] text-[#3E101D] border border-[#EADBDB]/60">
                  {item.number}
                </span>
              </div>

              {/* Content & Action */}
              <div className="relative z-10 space-y-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#2A0D15] group-hover:text-[#3E101D] transition-colors">
                  {item.title}
                </h2>
                <p className="text-xs text-[#6E565D] font-light leading-relaxed max-w-md line-clamp-2">
                  {item.description}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-sans font-medium tracking-[0.2em] text-[#3E101D] group-hover:translate-x-1 transition-transform">
                    <span>{item.action}</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
