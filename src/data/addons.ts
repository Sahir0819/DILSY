import { AddOnCategory, AddOnItem } from '../types';

/**
 * DILSY OFFICIAL ADD-ON CATALOGUE
 * 
 * Proposed launch add-ons with editable prices, categories, and availability.
 * Note: Add-ons are optional extras added to the selected hamper,
 * not items automatically included in the base box price.
 * Final availability and pricing are verified directly on WhatsApp.
 */
export const ADD_ONS: AddOnItem[] = [
  // --- FLOWERS ---
  {
    id: 'single-rose',
    name: 'Single Rose',
    category: 'Flowers',
    price: 49,
    description: 'Fresh crimson stem with romantic satin ribbon wrap.',
    isAvailable: true,
    illustrationType: 'single-rose',
  },
  {
    id: 'small-rose-bunch',
    name: 'Small Rose Bunch',
    category: 'Flowers',
    price: 149,
    description: 'Hand-tied bouquet of sweet blush & red roses in kraft paper.',
    isAvailable: true,
    illustrationType: 'small-rose-bunch',
  },

  // --- CHOCOLATES & TREATS ---
  {
    id: 'chocolate-treat',
    name: 'Chocolate Treat',
    category: 'Chocolates & Treats',
    price: 49,
    description: 'Heart-shaped artisanal gourmet chocolate confection.',
    isAvailable: true,
    illustrationType: 'chocolate-treat',
  },
  {
    id: 'assorted-chocolate-pack',
    name: 'Assorted Chocolate Pack',
    category: 'Chocolates & Treats',
    price: 99,
    description: 'Box of assorted gourmet truffles & chocolate bites.',
    isAvailable: true,
    illustrationType: 'assorted-chocolate',
  },
  {
    id: 'gourmet-snack-pack',
    name: 'Gourmet Snack Pack',
    category: 'Chocolates & Treats',
    price: 99,
    description: 'Curated savory crunch mix or artisan nut treats.',
    isAvailable: true,
    illustrationType: 'gourmet-snack',
  },
  {
    id: 'cookies-brownie-treat',
    name: 'Cookies or Brownie Treat',
    category: 'Chocolates & Treats',
    price: 99,
    description: 'Freshly baked rich chocolate fudge brownie or cookie pair.',
    isAvailable: true,
    illustrationType: 'cookies-brownie',
  },

  // --- CUTE EXTRAS ---
  {
    id: 'extra-photo-print',
    name: 'Extra Personalised Photo Print',
    category: 'Cute Extras',
    price: 49,
    description: 'Additional high-gloss mini Polaroid memory print with caption.',
    isAvailable: true,
    illustrationType: 'photo-print',
  },
  {
    id: 'cute-keychain',
    name: 'Cute Keychain',
    category: 'Cute Extras',
    price: 99,
    description: 'Handcrafted vegan leather or charm keepsake with initial.',
    isAvailable: true,
    illustrationType: 'cute-keychain',
  },
  {
    id: 'extra-greeting-card',
    name: 'Extra Greeting Card',
    category: 'Cute Extras',
    price: 29,
    description: 'Hand-penned wax-sealed mini parchment note on textured stock.',
    isAvailable: true,
    illustrationType: 'greeting-card',
  },
  {
    id: 'mini-keepsake',
    name: 'Mini Keepsake',
    category: 'Cute Extras',
    price: 99,
    description: 'Velvet drawstring pouch with bespoke studio keepsake charm.',
    isAvailable: true,
    illustrationType: 'mini-keepsake',
  },
];

export const ADD_ON_CATEGORIES: AddOnCategory[] = [
  'Flowers',
  'Chocolates & Treats',
  'Cute Extras',
];
