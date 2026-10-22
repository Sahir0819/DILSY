import { CartItem, CustomHamperForm, DeliveryDetails, Product, ProductCustomisation } from '../types';

export const WHATSAPP_PHONE_RAW = '8360958844';
export const WHATSAPP_PHONE_INTERNATIONAL = '+91 8360958844';
export const WHATSAPP_BASE_URL = 'https://wa.me/918360958844';

export const EXACT_DELIVERY_POLICY =
  'Same-day and next-morning delivery requests depend on item availability, order cut-off times, preparation time, and delivery location. Orders are confirmed only after DILSY verifies availability, final pricing, delivery charges, and timing with the customer.';

/**
 * Builds the URL-encoded WhatsApp link
 */
export function buildWhatsAppLink(message: string): string {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * Generate WhatsApp message for a direct single product inquiry / order
 * Consistently displays: "[Name] — [Size] — ₹[Price]" (e.g. "Loved Box — Medium — ₹969")
 */
export function generateSingleProductWhatsAppMessage(
  product: Product,
  customisation?: ProductCustomisation,
  delivery?: Partial<DeliveryDetails>
): string {
  const displayTitle = `${product.name} — ${product.size} — ₹${product.price.toLocaleString('en-IN')}`;

  const lines: string[] = [
    `✨ *NEW DILSY ORDER INQUIRY*`,
    `_A Little Box Full of Feelings_`,
    ``,
    `*Selected Hamper:* ${displayTitle}`,
    `*Size:* ${product.size}`,
    `*Base Selling Price:* ₹${product.price.toLocaleString('en-IN')}`,
    `*Proposed Concept Overview (Subject to owner confirmation):*`,
    ...product.itemsOverview.map((item) => ` • ${item}`),
    ``,
  ];

  if (customisation) {
    lines.push(`*Personalisation Details:*`);
    if (customisation.recipientChoice) {
      lines.push(` • Recipient Selection: ${customisation.recipientChoice}`);
    }
    if (customisation.recipientName) {
      lines.push(` • For: ${customisation.recipientName}`);
    }
    if (customisation.personalNote) {
      lines.push(` • Greeting Card / Love Note: "${customisation.personalNote}"`);
    }
    if (customisation.polaroidCaption) {
      lines.push(` • Polaroid Caption / Photo Note: ${customisation.polaroidCaption}`);
    }
    if (customisation.specialInstructions) {
      lines.push(` • Special Request: ${customisation.specialInstructions}`);
    }
    lines.push(``);
  }

  if (delivery && (delivery.customerName || delivery.deliveryArea)) {
    lines.push(`*Customer & Delivery Preferences:*`);
    if (delivery.customerName) lines.push(` • Customer Name: ${delivery.customerName}`);
    if (delivery.customerPhone) lines.push(` • Contact Phone: ${delivery.customerPhone}`);
    if (delivery.deliveryArea) lines.push(` • Service Area / Landmark: ${delivery.deliveryArea} ${delivery.specificLandmark ? `(${delivery.specificLandmark})` : ''}`);
    if (delivery.deliveryDate) lines.push(` • Preferred Date: ${delivery.deliveryDate}`);
    if (delivery.timeWindow) lines.push(` • Preferred Time: ${delivery.timeWindow}`);
    lines.push(``);
  }

  lines.push(`*Store Policy Note:*`);
  lines.push(EXACT_DELIVERY_POLICY);
  lines.push(``);
  lines.push(`Hi DILSY team! I would love to verify availability, final customization, and proceed with this hamper. Please let me know the next steps!`);

  return lines.join('\n');
}

/**
 * Generate WhatsApp message for full Cart order
 * Consistently displays: "Loved Box — Medium — ₹969"
 */
export function generateCartWhatsAppMessage(
  items: CartItem[],
  subtotal: number,
  delivery: DeliveryDetails
): string {
  const lines: string[] = [
    `🎁 *DILSY CART ORDER INQUIRY*`,
    `_A Little Box Full of Feelings_`,
    ``,
    `*ORDER ITEMS (${items.reduce((acc, i) => acc + i.quantity, 0)} total):*`,
  ];

  items.forEach((item, idx) => {
    const itemTotal = item.product.price * item.quantity;
    const itemTitle = `${item.product.name} — ${item.product.size} — ₹${item.product.price.toLocaleString('en-IN')}`;
    lines.push(
      `${idx + 1}. *${itemTitle}* (Qty: ${item.quantity}) — ₹${itemTotal.toLocaleString('en-IN')}`
    );
    if (item.customisation.recipientChoice) {
      lines.push(`   • Recipient Selection: ${item.customisation.recipientChoice}`);
    }
    if (item.customisation.recipientName) {
      lines.push(`   • For: ${item.customisation.recipientName}`);
    }
    if (item.customisation.personalNote) {
      lines.push(`   • Card Note: "${item.customisation.personalNote}"`);
    }
    if (item.customisation.polaroidCaption) {
      lines.push(`   • Polaroid / Photo Details: ${item.customisation.polaroidCaption}`);
    }
    if (item.customisation.specialInstructions) {
      lines.push(`   • Note: ${item.customisation.specialInstructions}`);
    }
  });

  lines.push(``);
  lines.push(`*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}`);
  lines.push(`*(Delivery charges to be calculated based on specific PG/Campus point)*`);
  lines.push(``);

  lines.push(`*DELIVERY & CUSTOMER DETAILS:*`);
  lines.push(`• Customer Name: ${delivery.customerName || 'Not specified'}`);
  lines.push(`• Contact Phone: ${delivery.customerPhone || 'Not specified'}`);
  lines.push(`• Service Area: ${delivery.deliveryArea || 'Chandigarh University / Mohali Area'}`);
  if (delivery.specificLandmark) {
    lines.push(`• Specific PG / Hostel / Landmark: ${delivery.specificLandmark}`);
  }
  lines.push(`• Preferred Delivery Date: ${delivery.deliveryDate || 'Earliest available'}`);
  lines.push(`• Preferred Time Window: ${delivery.timeWindow || 'Flexible'}`);
  if (delivery.additionalNotes) {
    lines.push(`• Additional Instructions: ${delivery.additionalNotes}`);
  }

  lines.push(``);
  lines.push(`*DELIVERY POLICY ACKNOWLEDGMENT:*`);
  lines.push(`"${EXACT_DELIVERY_POLICY}"`);
  lines.push(``);
  lines.push(`Hello DILSY! I am ready to confirm this order. Please review my cart items, let me know the final amount including delivery, and guide me on how to proceed.`);

  return lines.join('\n');
}

/**
 * Automatic Theme-Matched Packaging Guidance
 * Maps customer chosen occasion and recipient to DILSY studio packaging styling direction.
 * (Note: Styling guidelines, not guaranteed physical materials or inclusions.
 * Actual packaging depends on confirmed availability.)
 */
export function getThemePackagingGuidance(occasion?: string, recipientType?: string): string {
  const occ = (occasion || '').toLowerCase();
  const rec = (recipientType || '').toLowerCase();

  if (occ.includes('valentine') || occ.includes('i love you') || occ.includes('romance')) {
    return 'Romantic packaging with suitable ribbons and thoughtful details';
  }
  if (occ.includes('anniversary')) {
    return 'Elegant, premium-looking packaging';
  }
  if (occ.includes('birthday')) {
    return 'Celebratory packaging';
  }
  if (occ.includes('period')) {
    return 'Comforting, thoughtful presentation';
  }
  if (occ.includes('apology')) {
    return 'Simple, heartfelt presentation';
  }
  if (occ.includes('miss you')) {
    return 'Personal, memory-inspired presentation';
  }
  if (occ.includes('diwali')) {
    return 'Festive packaging';
  }
  if (occ.includes('for him') || rec.includes('boyfriend') || rec.includes('for him')) {
    return 'Packaging appropriate to the selected gift and theme';
  }
  if (occ.includes('for her') || rec.includes('girlfriend') || rec.includes('for her')) {
    return 'Packaging appropriate to the selected gift and theme';
  }
  return 'Packaging appropriate to the selected gift and theme';
}

/**
 * Helper to get numeric base price of selected box size
 */
export function getBaseHamperPrice(budget: string, customAmount?: string): number | null {
  if (budget.includes('799') || budget.toLowerCase().includes('small')) return 799;
  if (budget.includes('969') || budget.toLowerCase().includes('medium')) return 969;
  if (budget.includes('1,199') || budget.includes('1199') || budget.toLowerCase().includes('large')) return 1199;
  if (budget === 'Custom Budget' && customAmount && !isNaN(Number(customAmount)) && Number(customAmount) > 0) {
    return Number(customAmount);
  }
  return null;
}

/**
 * Generate WhatsApp message for Custom Hamper Builder
 * Uses official box sizes: Small Box (₹799), Medium Box (₹969), Large Box (₹1,199), or Custom Budget.
 * Includes optional add-ons with quantities, individual prices, add-on subtotal, and combined estimated total.
 */
export function generateCustomHamperWhatsAppMessage(form: CustomHamperForm): string {
  const isCustomBudget = form.budget === 'Custom Budget';
  const displayBudget = isCustomBudget
    ? `Custom (${form.customBudgetAmount ? `₹${form.customBudgetAmount}` : 'Price to be confirmed'})`
    : form.budget;

  const packagingGuidance = getThemePackagingGuidance(form.occasion, form.recipientType);
  const selectedAddOns = form.selectedAddOns || [];
  const addOnsSubtotal = selectedAddOns.reduce((acc, a) => acc + a.price * a.quantity, 0);
  const basePrice = getBaseHamperPrice(form.budget, form.customBudgetAmount);
  const estimatedTotal = basePrice !== null ? basePrice + addOnsSubtotal : null;
  const totalAddOnQuantity = selectedAddOns.reduce((acc, a) => acc + a.quantity, 0);

  const lines: string[] = [
    `✨ *CUSTOM BESPOKE HAMPER REQUEST*`,
    `_DILSY — A Little Box Full of Feelings_`,
    ``,
    `*Hamper Blueprint:*`,
    `• Recipient: ${form.recipientType || 'Special someone'}`,
    `• Selected Gift Theme & Occasion: ${form.occasion || 'Celebration'}`,
    `• Target Box Size & Base Budget: ${displayBudget}`,
    `• Automatic Theme-Matched Packaging: ${packagingGuidance}`,
    `  _(DILSY studio styling guidance; actual packaging depends on confirmed availability)_`,
    ``,
    `*Selected Add-ons (${totalAddOnQuantity} item${totalAddOnQuantity === 1 ? '' : 's'}):*`,
    ...(selectedAddOns.length > 0
      ? selectedAddOns.map(
          (addon) =>
            ` • ${addon.name} (Qty: ${addon.quantity}) — ₹${(addon.price * addon.quantity).toLocaleString('en-IN')} [₹${addon.price} each]`
        )
      : [' • No optional add-ons selected (Base hamper only)']),
    ``,
    `*Pricing Breakdown:*`,
    `• Base Box Price: ${basePrice !== null ? `₹${basePrice.toLocaleString('en-IN')}` : displayBudget}`,
    `• Add-ons Subtotal: ₹${addOnsSubtotal.toLocaleString('en-IN')}`,
    `• Combined Estimated Total: ${
      estimatedTotal !== null
        ? `₹${estimatedTotal.toLocaleString('en-IN')}*`
        : 'Custom target (To be confirmed with DILSY)'
    }`,
    `  _(*Estimated total; subject to confirmed availability and delivery location)_`,
    ``,
    `*Personal Touch:*`,
    `• Recipient Name/Nickname: ${form.recipientName || 'Not provided'}`,
    `• Greeting Card Message: "${form.personalNote || 'To be handwritten by DILSY'}"`,
    ...(form.specialInstructions ? [`• Special Instructions / Dietary / Preferences: ${form.specialInstructions}`] : []),
    ``,
    `*Delivery & Contact Details:*`,
    `• Customer Name: ${form.customerName || 'Not specified'}`,
    `• Customer Phone: ${form.customerPhone || 'Not specified'}`,
    `• Service Location: ${form.deliveryArea || 'Chandigarh University / Mohali'}`,
    ...(form.specificLandmark ? [`• PG / Landmark: ${form.specificLandmark}`] : []),
    `• Preferred Date: ${form.deliveryDate || 'To be discussed'}`,
    `• Preferred Time Window: ${form.timeWindow || 'To be coordinated'}`,
    ``,
    `*Delivery Policy:*`,
    `"${EXACT_DELIVERY_POLICY}"`,
    ``,
    `Hi DILSY! I built this custom hamper blueprint on your website for the "${form.occasion || 'Celebration'}" theme. Could you please review the items, confirm item availability and final pricing for delivery to my location? Thank you!`,
  ];

  return lines.join('\n');
}
