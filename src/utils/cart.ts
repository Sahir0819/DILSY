import { BoxSize, CartItem, Product, ProductCustomisation } from '../types';

export const BOX_SIZE_PRICES: Record<BoxSize, number> = {
  Small: 799,
  Medium: 969,
  Large: 1199,
};

export const BOX_SIZE_DIMENSIONS: Record<BoxSize, string> = {
  Small: '18 × 14 × 6 cm',
  Medium: '24 × 20 × 9 cm',
  Large: '32 × 26 × 12 cm',
};

export const GENERIC_BOX_PRODUCT_IDS = new Set([
  'the-little-affair',
  'loved-box',
  'the-everything-box',
]);

const NAME_TO_COLLECTION_ID: Record<string, string> = {
  'i love you — for him': 'i-love-you-for-him',
  'i love you — for her': 'i-love-you-for-her',
  'anniversary box': 'anniversary',
  'birthday box': 'birthday',
  'periods box': 'periods-box',
  'apology box': 'apology-box',
  'miss you box': 'miss-you-box',
  'valentine box': 'valentine-box',
  'diwali box': 'diwali-box',
  'exam good luck & motivation': 'exam-good-luck',
  'graduation / farewell': 'graduation-farewell',
};

const COLLECTION_IMAGES: Record<string, string> = {
  'i-love-you-for-her': '/assets/images/product-for-her.jpg',
  'i-love-you-for-him': '/assets/images/theme-romance.jpg',
  anniversary: '/assets/images/product-anniversary-box.jpg',
  birthday: '/assets/images/product-birthday-box.jpg',
  'periods-box': '/assets/images/theme-comfort.jpg',
  'apology-box': '/assets/images/theme-comfort.jpg',
  'miss-you-box': '/assets/images/theme-romance.jpg',
  'valentine-box': '/assets/images/product-loved-box.jpg',
  'diwali-box': '/assets/images/theme-festive.jpg',
  'exam-good-luck': '/assets/images/theme-comfort.jpg',
  'graduation-farewell': '/assets/images/theme-birthdays.jpg',
};

export function getOfficialBoxPrice(size: BoxSize): number {
  return BOX_SIZE_PRICES[size] ?? BOX_SIZE_PRICES.Medium;
}

export function getCollectionDefaultImage(collectionId?: string): string | undefined {
  if (!collectionId) return undefined;
  return COLLECTION_IMAGES[collectionId];
}

/**
 * Resolves a canonical product/hamper identifier so different hampers sharing
 * the same box size NEVER collide or merge in the shopping bag.
 */
export function resolveCanonicalProductId(product: Product): string {
  if (product.collectionId) {
    return product.collectionId;
  }

  if (product.id && !GENERIC_BOX_PRODUCT_IDS.has(product.id)) {
    return product.id;
  }

  const normalizedName = (product.name || '').trim().toLowerCase();
  if (NAME_TO_COLLECTION_ID[normalizedName]) {
    return NAME_TO_COLLECTION_ID[normalizedName];
  }

  return product.id || normalizedName.replace(/[^a-z0-9]+/g, '-');
}

export function buildVariantId(productId: string, size: BoxSize): string {
  return `${productId}::${size.toLowerCase()}`;
}

export function getCartCustomisationSignature(customisation?: ProductCustomisation): string {
  const c = customisation || { recipientName: '', personalNote: '' };
  const addOnsSig = (c.selectedAddOns || [])
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((a) => `${a.id}:${a.quantity}`)
    .join(',');

  return JSON.stringify({
    recipientName: (c.recipientName || '').trim(),
    personalNote: (c.personalNote || '').trim(),
    polaroidCaption: (c.polaroidCaption || '').trim(),
    specialInstructions: (c.specialInstructions || '').trim(),
    addOnsSig,
  });
}

export function getAddOnsUnitTotal(customisation?: ProductCustomisation): number {
  return (customisation?.selectedAddOns || []).reduce(
    (sum, addon) => sum + addon.price * addon.quantity,
    0
  );
}

export function getCartItemUnitPrice(item: CartItem): number {
  const base = Number(item.unitPrice ?? item.product.price ?? getOfficialBoxPrice(item.selectedSize));
  return base + getAddOnsUnitTotal(item.customisation);
}

export function getCartItemSubtotal(item: CartItem): number {
  return getCartItemUnitPrice(item) * item.quantity;
}

export function createCartItemFromSelection(
  product: Product,
  customisation: ProductCustomisation,
  quantity = 1
): CartItem {
  const selectedSize: BoxSize = product.size || 'Medium';
  const productId = resolveCanonicalProductId(product);
  const collectionId =
    product.collectionId ||
    (!GENERIC_BOX_PRODUCT_IDS.has(productId) && NAME_TO_COLLECTION_ID[(product.name || '').trim().toLowerCase()]) ||
    undefined;
  const variantId = buildVariantId(productId, selectedSize);

  const unitPrice =
    collectionId || GENERIC_BOX_PRODUCT_IDS.has(product.id)
      ? getOfficialBoxPrice(selectedSize)
      : Number(product.price) || getOfficialBoxPrice(selectedSize);

  const resolvedImage =
    product.customImage || getCollectionDefaultImage(collectionId || productId);

  const normalizedProduct: Product = {
    ...product,
    id: productId,
    collectionId: collectionId || product.collectionId,
    size: selectedSize,
    price: unitPrice,
    customImage: resolvedImage,
  };

  return {
    id: `${variantId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    productId,
    collectionId: normalizedProduct.collectionId,
    variantId,
    selectedSize,
    unitPrice,
    product: normalizedProduct,
    quantity: Math.max(1, quantity),
    customisation: {
      recipientName: (customisation?.recipientName || '').trim(),
      personalNote: (customisation?.personalNote || '').trim(),
      polaroidCaption: customisation?.polaroidCaption?.trim(),
      specialInstructions: customisation?.specialInstructions?.trim(),
      selectedAddOns: customisation?.selectedAddOns?.length
        ? customisation.selectedAddOns
        : undefined,
    },
  };
}

/**
 * Safely migrates persisted localStorage cart items so older saved entries
 * gain explicit productId, variantId, selectedSize, and unitPrice without
 * corrupting or collapsing distinct hampers.
 */
export function migrateCartItems(rawItems: unknown): CartItem[] {
  if (!Array.isArray(rawItems)) return [];

  const migrated: CartItem[] = [];
  for (const raw of rawItems) {
    if (!raw || typeof raw !== 'object') continue;
    const candidate = raw as Partial<CartItem> & { product?: Product };
    if (!candidate.product) continue;

    const selectedSize: BoxSize =
      candidate.selectedSize || candidate.product.size || 'Medium';
    const productId =
      candidate.productId && !GENERIC_BOX_PRODUCT_IDS.has(candidate.productId)
        ? candidate.productId
        : resolveCanonicalProductId(candidate.product);

    const normalizedName = (candidate.product.name || '').trim().toLowerCase();
    const collectionId =
      candidate.collectionId ||
      candidate.product.collectionId ||
      NAME_TO_COLLECTION_ID[normalizedName];

    const variantId = buildVariantId(productId, selectedSize);
    const unitPrice =
      typeof candidate.unitPrice === 'number' && candidate.unitPrice > 0
        ? candidate.unitPrice
        : collectionId || GENERIC_BOX_PRODUCT_IDS.has(candidate.product.id)
        ? getOfficialBoxPrice(selectedSize)
        : Number(candidate.product.price) || getOfficialBoxPrice(selectedSize);

    const customImage =
      candidate.product.customImage || getCollectionDefaultImage(collectionId || productId);

    const quantity = Math.max(1, Number(candidate.quantity) || 1);
    const customisation: ProductCustomisation = candidate.customisation || {
      recipientName: '',
      personalNote: '',
    };

    migrated.push({
      id: candidate.id || `${variantId}-${migrated.length}`,
      productId,
      collectionId,
      variantId,
      selectedSize,
      unitPrice,
      product: {
        ...candidate.product,
        id: productId,
        collectionId,
        size: selectedSize,
        price: unitPrice,
        customImage,
      },
      quantity,
      customisation,
    });
  }

  return migrated;
}
