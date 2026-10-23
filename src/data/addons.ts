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
    description: 'A fresh single rose stem to add a sweet romantic touch.',
    isAvailable: true,
    illustrationType: 'single-rose',
  },
  {
    id: 'small-rose-bunch',
    name: 'Small Rose Bunch',
    category: 'Flowers',
    price: 149,
    description: 'A small bunch of fresh roses wrapped nicely for gifting.',
    isAvailable: true,
    illustrationType: 'small-rose-bunch',
  },

  // --- CHOCOLATES & TREATS ---
  {
    id: 'chocolate-treat',
    name: 'Chocolate Treat',
    category: 'Chocolates & Treats',
    price: 49,
    description: 'A sweet chocolate treat to brighten their day.',
    isAvailable: true,
    illustrationType: 'chocolate-treat',
  },
  {
    id: 'assorted-chocolate-pack',
    name: 'Assorted Chocolate Pack',
    category: 'Chocolates & Treats',
    price: 99,
    description: 'An assortment of delicious chocolates.',
    isAvailable: true,
    illustrationType: 'assorted-chocolate',
  },
  {
    id: 'gourmet-snack-pack',
    name: 'Gourmet Snack Pack',
    category: 'Chocolates & Treats',
    price: 99,
    description: 'A tasty snack pack to complement your hamper.',
    isAvailable: true,
    illustrationType: 'gourmet-snack',
  },
  {
    id: 'cookies-brownie-treat',
    name: 'Cookies or Brownie Treat',
    category: 'Chocolates & Treats',
    price: 99,
    description: 'A sweet cookie or brownie treat.',
    isAvailable: true,
    illustrationType: 'cookies-brownie',
  },

  // --- CUTE EXTRAS ---
  {
    id: 'extra-photo-print',
    name: 'Extra Personalised Photo Print',
    category: 'Cute Extras',
    price: 49,
    description: 'An additional printed photo memory with your caption.',
    isAvailable: true,
    illustrationType: 'photo-print',
  },
  {
    id: 'cute-keychain',
    name: 'Cute Keychain',
    category: 'Cute Extras',
    price: 99,
    description: 'A cute keepsake keychain to carry every day.',
    isAvailable: true,
    illustrationType: 'cute-keychain',
  },
  {
    id: 'extra-greeting-card',
    name: 'Extra Greeting Card',
    category: 'Cute Extras',
    price: 29,
    description: 'An additional handwritten greeting card with your message.',
    isAvailable: true,
    illustrationType: 'greeting-card',
  },
  {
    id: 'mini-keepsake',
    name: 'Mini Keepsake',
    category: 'Cute Extras',
    price: 99,
    description: 'A thoughtful little keepsake to remember the moment.',
    isAvailable: true,
    illustrationType: 'mini-keepsake',
  },
];

export const ADD_ON_CATEGORIES: AddOnCategory[] = [
  'Flowers',
  'Chocolates & Treats',
  'Cute Extras',
];
