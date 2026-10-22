import { ThemeCategory } from '../types';

/**
 * DILSY FINAL BUSINESS-APPROVED THEME CATEGORIES
 * 
 * NOTE FOR STORE OWNER:
 * You can easily edit names, descriptions, visual directions, and linked product IDs below.
 * When new confirmed products launch for a theme, simply add the product's ID to `linkedProductIds`.
 * Categories with empty `linkedProductIds` will automatically present a polished,
 * tasteful "Customise Your Box" studio invitation without inventing fake stock or prices.
 */
export const THEME_CATEGORIES: ThemeCategory[] = [
  {
    id: 'i-love-you-for-him',
    name: 'I Love You — For Him',
    description: 'A little something to remind him how much he means to you.',
    visualDirection: 'Romantic, thoughtful, elegant gift hamper with a personalised note.',
    accentBg: 'from-[#FFF0F4] to-[#FCE6EC]',
    accentBorder: 'border-[#F4B6C5]',
    accentText: 'text-[#99223A]',
    badge: 'For Him',
    linkedProductIds: ['the-dilsy-edit', 'the-little-affair'],
  },
  {
    id: 'i-love-you-for-her',
    name: 'I Love You — For Her',
    description: 'Little surprises, thoughtful details, and a whole lot of love.',
    visualDirection: 'A romantic, aesthetic hamper with beautiful packaging and a personal message.',
    accentBg: 'from-[#FFF0F4] to-[#FFEBF0]',
    accentBorder: 'border-[#FFCCD5]',
    accentText: 'text-[#A32842]',
    badge: 'For Her',
    linkedProductIds: ['the-little-affair', 'the-dilsy-edit', 'the-everything-box'],
  },
  {
    id: 'anniversary',
    name: 'Anniversary Box',
    description: 'Celebrate your story, one little memory at a time.',
    visualDirection: 'Elegant keepsakes, personalised messages, and romantic packaging.',
    accentBg: 'from-[#FFF5F8] to-[#FCE8EE]',
    accentBorder: 'border-[#E8A5B5]',
    accentText: 'text-[#8C1D33]',
    badge: 'Milestone Love',
    linkedProductIds: ['the-dilsy-edit', 'the-everything-box', 'the-little-affair'],
  },
  {
    id: 'birthday',
    name: 'Birthday Box',
    description: 'Make their special day feel even more special.',
    visualDirection: 'Festive packaging, colourful accents, sweet treats, and birthday cards.',
    accentBg: 'from-[#FFF8F0] to-[#FFEEDD]',
    accentBorder: 'border-[#F8CBB0]',
    accentText: 'text-[#A04022]',
    badge: 'Celebration',
    linkedProductIds: ['the-dilsy-edit', 'the-everything-box'],
  },
  {
    id: 'periods-box',
    name: 'Periods Box',
    description: 'A little extra care for the days that call for it.',
    visualDirection: 'A warm, comforting care package with thoughtful notes, snacks, and optional period-care essentials. Keep the presentation tasteful, supportive, and non-stigmatising. Clearly identify any included products and only list items whose availability has been confirmed.',
    accentBg: 'from-[#FFF5F7] to-[#F9E9ED]',
    accentBorder: 'border-[#E8B8C4]',
    accentText: 'text-[#8C283B]',
    badge: 'Comfort & Care',
    // Kept separate: No generic pre-packaged stock invented; custom curation available upon owner verification
    linkedProductIds: [],
  },
  {
    id: 'apology-box',
    name: 'Apology Box',
    description: 'Sometimes, a thoughtful gesture says what words struggle to.',
    visualDirection: 'A heartfelt message card, thoughtful keepsakes, and understated packaging. Do not promise that a gift will fix a relationship or guarantee forgiveness.',
    accentBg: 'from-[#FDFBF9] to-[#F5EFE9]',
    accentBorder: 'border-[#D9C8BC]',
    accentText: 'text-[#5C453C]',
    badge: 'Heartfelt Gesture',
    linkedProductIds: [],
  },
  {
    id: 'miss-you-box',
    name: 'Miss You Box',
    description: 'For the people you wish were a little closer.',
    visualDirection: 'Personal letters, memory cards, keepsakes, and thoughtful gift packaging.',
    accentBg: 'from-[#F7F6FB] to-[#ECE9F7]',
    accentBorder: 'border-[#CEC6EB]',
    accentText: 'text-[#4F4178]',
    badge: 'Long Distance',
    linkedProductIds: ['the-little-affair'],
  },
  {
    id: 'valentine-box',
    name: 'Valentine Box',
    description: 'A little romance, wrapped just for them.',
    visualDirection: 'Romantic gift presentation with coordinated packaging and personalised messages.',
    accentBg: 'from-[#FFF0F3] to-[#FCD5DE]',
    accentBorder: 'border-[#F29CAE]',
    accentText: 'text-[#B31D3F]',
    badge: 'Pure Romance',
    linkedProductIds: ['the-everything-box', 'the-dilsy-edit'],
  },
  {
    id: 'diwali-box',
    name: 'Diwali Box',
    description: 'Celebrate the festival of lights with thoughtful surprises.',
    visualDirection: 'Festive gift packaging, warm golden accents, greeting cards, and suitable sweets or keepsakes where available.',
    accentBg: 'from-[#FFFDF5] to-[#FCF4D9]',
    accentBorder: 'border-[#F0DC94]',
    accentText: 'text-[#8C6D1F]',
    badge: 'Festive Lights',
    linkedProductIds: [],
  },
];
