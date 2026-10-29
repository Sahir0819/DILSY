import { Product } from '../types';

/**
 * OFFICIAL DILSY BOX SIZES AND BASE PRICES
 * 
 * Central editable configuration for official box sizes, base prices,
 * descriptions, and positioning.
 * 
 * Note: These are the official base selling prices.
 * The exact contents of each box are proposed concepts until confirmed by the owner.
 */
export interface OfficialBoxSizeInfo {
  id: string;
  name: string;
  size: 'Small' | 'Medium' | 'Large';
  price: number;
  description: string;
  positioning: string;
}

export const OFFICIAL_BOX_SIZES: OfficialBoxSizeInfo[] = [
  {
    id: 'small-box',
    name: 'Small Box',
    size: 'Small',
    price: 799,
    description: 'A little box, filled with thoughtful details. A sweet way to make someone feel special.',
    positioning: 'A smaller, budget-friendly personalised gift hamper.',
  },
  {
    id: 'medium-box',
    name: 'Loved Box (Medium)',
    size: 'Medium',
    price: 969,
    description: 'A little box full of love, thoughtful surprises, and personal touches. Make it theirs with a personalised message.',
    positioning: 'A balanced, thoughtfully curated gift hamper.',
  },
  {
    id: 'large-box',
    name: 'Large Box',
    size: 'Large',
    price: 1199,
    description: 'More room for thoughtful surprises, personalised touches, and a memorable gifting experience.',
    positioning: 'A larger hamper with room for additional gift items.',
  },
];

/**
 * DILSY Products Catalog
 * 
 * Base gift hampers with official pricing and honest descriptions.
 * Exact hamper contents and personal touches are confirmed with the customer on WhatsApp.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'the-little-affair',
    name: 'Small Box',
    size: 'Small',
    price: 799,
    tagline: 'A little box, filled with thoughtful details.',
    description: 'A little box, filled with thoughtful details. A sweet way to make someone feel special.',
    positioning: 'A smaller, budget-friendly personalised gift hamper.',
    categories: ['all', 'for-her', 'for-him', 'besties'],
    themeIds: ['i-love-you-for-her', 'i-love-you-for-him', 'anniversary', 'miss-you-box'],
    idealFor: 'Birthdays, hostel room surprises, anniversary tokens, or a sweet everyday gesture.',
    packaging: 'Neatly styled blush gift box with satin ribbon and personal handwritten card.',
    accentColor: '#E88AA4',
    illustrationType: 'little-affair',
  },
  {
    id: 'loved-box',
    name: 'Loved Box',
    size: 'Medium',
    price: 969,
    tagline: 'A little box full of love, thoughtful surprises, and personal touches.',
    description: 'A little box full of love, thoughtful surprises, and personal touches. Make it theirs with a personalised message.',
    positioning: 'A balanced, thoughtfully curated gift hamper.',
    badge: 'RECOMMENDED',
    categories: ['all', 'for-him', 'for-her', 'besties'],
    themeIds: ['i-love-you-for-him', 'i-love-you-for-her', 'anniversary', 'birthday', 'valentine-box'],
    idealFor: 'Girlfriend or boyfriend surprises, romantic milestones, anniversaries, birthdays, and saying "I Love You".',
    allowRecipientChoice: true,
    packaging: 'Thoughtfully styled romantic gift presentation with burgundy ribbon and personal touches.',
    accentColor: '#9F2343',
    illustrationType: 'loved-box',
  },
  {
    id: 'the-everything-box',
    name: 'Large Box',
    size: 'Large',
    price: 1199,
    tagline: 'More room for thoughtful surprises, personalised touches, and a memorable gifting experience.',
    description: 'More room for thoughtful surprises, personalised touches, and a memorable gifting experience.',
    positioning: 'A larger hamper with room for additional gift items.',
    categories: ['all', 'for-him', 'for-her', 'besties'],
    themeIds: ['i-love-you-for-her', 'anniversary', 'birthday', 'valentine-box'],
    idealFor: 'Milestone celebrations, birthdays, reunions, and festive occasions.',
    packaging: 'Generously sized gift presentation box styled for the occasion with luxury ribbon.',
    accentColor: '#72172F',
    illustrationType: 'everything-box',
  },
];

export const SERVICE_AREAS = [
  'Chandigarh University (North & South Gate)',
  'Gharuan Village & Student PGs',
  'Kharar (Sunny Enclave, Chajju Majra & PGs)',
  'Landran & CEC College Hub',
  'Mohali Phase 1 to 5',
  'Mohali Phase 6 to 11 / Sector 70–82',
  'Other nearby Mohali / CU Landmark (specify in notes)',
];

export const TIME_WINDOWS = [
  'Morning (9:00 AM – 12:00 PM)',
  'Afternoon (12:00 PM – 4:00 PM)',
  'Evening (4:00 PM – 8:00 PM)',
  'Night / Midnight Celebration Request (subject to advance confirmation)',
];
