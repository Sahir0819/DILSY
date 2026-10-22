import { Product } from '../types';

/**
 * DILSY Launch Products Catalog
 * 
 * NOTE FOR STORE OWNER:
 * You can easily edit prices, descriptions, and included items below.
 * Included items are treated as proposed concepts until confirmed by the owner
 * upon final order review.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'the-little-affair',
    name: 'The Little Affair',
    tagline: 'Delicate, intimate, and wrapped with quiet tenderness.',
    price: 999,
    description: 'A pocket-sized gesture made for moments that speak softer than words. Featuring cozy aromatics, custom keepsakes, and a hand-penned card.',
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
    id: 'the-dilsy-edit',
    name: 'The DILSY Edit',
    tagline: 'Our signature signature curation for the ones who deserve thoughtful elegance.',
    price: 1249,
    description: 'A thoughtfully balanced hamper designed to delight both boys and girls. Practical keepsakes combined with sensory warmth and memorable handwritten notes.',
    categories: ['all', 'for-him', 'for-her', 'besties'],
    themeIds: ['i-love-you-for-him', 'i-love-you-for-her', 'anniversary', 'birthday', 'valentine-box'],
    idealFor: 'Special anniversaries, boyfriend/girlfriend milestones, bestie celebrations, and PG care packages.',
    itemsOverview: [
      'Signature amber glass scented soy jar candle with wooden crackling wick',
      'Custom handcrafted vegan leather keychain with metallic foil initials',
      'Gourmet artisanal Belgian chocolate chip cookies or salted caramel bites',
      'Vintage style mini floral arrangement in kraft sleeve',
      'Folded parchment letter sealed with custom burgundy wax stamp',
      'Custom velvet drawstring keepsake pouch',
    ],
    packaging: 'Crafted warm ecru presentation box with warm espresso band and metallic foil DILSY emblem.',
    accentColor: '#B87A68',
    illustrationType: 'dilsy-edit',
  },
  {
    id: 'the-everything-box',
    name: 'The Everything Box',
    tagline: 'When words fall short, send the full constellation of memories.',
    price: 1499,
    description: 'Our most lavish and heartfelt hamper. Packed with bespoke keepsakes, premium sensory delights, and multiple personalized memory prints for an unforgettable celebration.',
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
