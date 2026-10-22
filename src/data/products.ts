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
    description: 'A little box, filled with thoughtful details.',
    positioning: 'A smaller, budget-friendly personalised gift hamper.',
  },
  {
    id: 'medium-box',
    name: 'Medium Box',
    size: 'Medium',
    price: 969,
    description: 'Our just-right box for a little extra love.',
    positioning: 'A balanced, thoughtfully curated gift hamper.',
  },
  {
    id: 'large-box',
    name: 'Large Box',
    size: 'Large',
    price: 1199,
    description: 'More little surprises, more reasons to smile.',
    positioning: 'A larger hamper with room for additional gift items.',
  },
];

/**
 * DILSY Products Catalog
 * 
 * NOTE FOR STORE OWNER:
 * You can easily edit prices, descriptions, and included items below.
 * Included items are treated as proposed concepts until confirmed by the owner
 * upon final order review.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'the-little-affair',
    name: 'Small Box',
    size: 'Small',
    price: 799,
    tagline: 'The Little Affair · A little box, filled with thoughtful details.',
    description: '“A little box, filled with thoughtful details.” A smaller, budget-friendly personalised gift hamper with cozy aromatics, custom keepsakes, and a hand-penned card.',
    positioning: 'A smaller, budget-friendly personalised gift hamper.',
    categories: ['all', 'for-her', 'for-him', 'besties'],
    themeIds: ['i-love-you-for-her', 'i-love-you-for-him', 'anniversary', 'miss-you-box'],
    idealFor: 'Birthdays, hostel room surprises, anniversary tokens, or "just because".',
    itemsOverview: [
      'Artisanal hand-poured soy scented votive candle (warm vanilla or amber cedar)',
      'Bespoke Polaroid keepsake print with your choice of photo & handwritten caption',
      'Mini dried botanical sprig tied with natural jute cord',
      'Artisan gourmet chocolate truffles (pack of 4)',
      'Hand-calligraphed personalized envelope card with wax seal',
    ],
    packaging: 'Rigid ivory textured box with dusty blush grosgrain ribbon and botanical sprig.',
    accentColor: '#D4A39A',
    illustrationType: 'little-affair',
  },
  {
    id: 'loved-box',
    name: 'Loved Box',
    size: 'Medium',
    price: 969,
    tagline: 'A little box full of love, thoughtful surprises, and personal touches.',
    description: '“A little box full of love, thoughtful surprises, and personal touches.”',
    positioning: 'Our flagship romantic gift hamper for boyfriends, girlfriends, partners, and anniversaries.',
    badge: '❤️ RECOMMENDED',
    categories: ['all', 'for-him', 'for-her', 'besties'],
    themeIds: ['i-love-you-for-him', 'i-love-you-for-her', 'anniversary', 'birthday', 'valentine-box'],
    idealFor: 'Girlfriend or boyfriend surprises, romantic milestones, anniversaries, birthdays, and saying "I Love You".',
    allowRecipientChoice: true,
    itemsOverview: [
      'Artisanal hand-poured soy scented jar candle (warm vanilla or floral rosewood)',
      'Handcrafted keepsake keychain with bespoke personalized initials',
      'Custom Polaroid memory print with your photo & handwritten caption',
      'Artisan gourmet chocolate truffles / heart-shaped confections',
      'Hand-penned wax-sealed personalized greeting card with wax stamp',
    ],
    packaging: 'Signature warm ivory & blush presentation box tied with luxury grosgrain ribbon.',
    accentColor: '#C73858',
    illustrationType: 'loved-box',
  },
  {
    id: 'the-everything-box',
    name: 'Large Box',
    size: 'Large',
    price: 1199,
    tagline: 'The Everything Box · More little surprises, more reasons to smile.',
    description: '“More little surprises, more reasons to smile.” A larger hamper with room for additional gift items, keepsake memory prints, and premium sensory treats.',
    positioning: 'A larger hamper with room for additional gift items.',
    categories: ['all', 'for-him', 'for-her', 'besties'],
    themeIds: ['i-love-you-for-her', 'anniversary', 'birthday', 'valentine-box'],
    idealFor: 'Big birthday bashes, graduation milestones, long-distance reunions, and luxury festive gifting.',
    itemsOverview: [
      'Premium matte double-wall insulated coffee tumbler (or artisanal ceramic pottery mug)',
      'Signature amber soy candle with rich coffee & toasted hazelnut notes',
      'Handcrafted hot cocoa blend with gourmet mini marshmallows (or premium pour-over coffee drip bag)',
      'Curated memory string with 3 high-grade Polaroid prints & mini wooden craft pegs',
      'Aromatherapy room & linen mist spray (30ml calming lavender or cedarwood)',
      'Wax-sealed personalized heavy-stock greeting card with bespoke golden detailing',
    ],
    packaging: 'Deluxe magnetic closure matte espresso and ivory keepsake box with layered tissue and cotton ribbon.',
    accentColor: '#8C5A4F',
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

export const GIFT_CATEGORY_OPTIONS = [
  { id: 'fragrance', label: 'Artisanal Soy Candles & Aromatics' },
  { id: 'polaroids', label: 'Bespoke Polaroid Keepsakes & Photos' },
  { id: 'gourmet', label: 'Gourmet Treats, Truffles & Hot Cocoa' },
  { id: 'accessories', label: 'Personalized Keychains & Lifestyle Items' },
  { id: 'stationery', label: 'Wax-Sealed Letters & Journal Keepsakes' },
  { id: 'drinkware', label: 'Insulated Tumblers or Ceramic Mugs' },
];

export const PACKAGING_STYLES = [
  { id: 'ivory', name: 'Minimalist Warm Ivory Box', desc: 'Crisp, timeless, tied with dusty rose ribbon.' },
  { id: 'vintage', name: 'Vintage Kraft & Twine', desc: 'Earthy, rustic paper with jute cord and wax stamp.' },
  { id: 'luxe', name: 'Espresso Magnetic Luxe Box', desc: 'Heavyweight magnetic box with golden emblem.' },
];
