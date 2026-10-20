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
 */
export function generateSingleProductWhatsAppMessage(
  product: Product,
  customisation?: ProductCustomisation,
  delivery?: Partial<DeliveryDetails>
): string {
  const lines: string[] = [
    `✨ *NEW DILSY ORDER INQUIRY*`,
    `_A Little Box Full of Feelings_`,
    ``,
    `*Selected Hamper:* ${product.name}`,
    `*Price:* ₹${product.price.toLocaleString('en-IN')}`,
    `*Proposed Concept Overview:*`,
    ...product.itemsOverview.map((item) => ` • ${item}`),
    ``,
  ];

  if (customisation) {
    lines.push(`*Personalisation Details:*`);
    if (customisation.recipientName) {
      lines.push(` • For: ${customisation.recipientName}`);
    }
    if (customisation.personalNote) {
      lines.push(` • Greeting Card Note: "${customisation.personalNote}"`);
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
    lines.push(
      `${idx + 1}. *${item.product.name}* (Qty: ${item.quantity}) — ₹${itemTotal.toLocaleString('en-IN')}`
    );
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
 * Generate WhatsApp message for Custom Hamper Builder
 */
export function generateCustomHamperWhatsAppMessage(form: CustomHamperForm): string {
  const isCustomBudget = form.budget === 'Custom Budget';
  const displayBudget = isCustomBudget
    ? `Custom (${form.customBudgetAmount ? `₹${form.customBudgetAmount}` : 'Price to be confirmed'})`
    : form.budget;

  const lines: string[] = [
    `✨ *CUSTOM BESPOKE HAMPER REQUEST*`,
    `_DILSY — A Little Box Full of Feelings_`,
    ``,
    `*Hamper Blueprint:*`,
    `• Recipient: ${form.recipientType || 'Special someone'}`,
    `• Occasion: ${form.occasion || 'Celebration'}`,
    `• Target Budget: ${displayBudget}`,
    `• Packaging Style: ${form.packagingStyle || 'Standard Ivory Box'}`,
    ``,
    `*Selected Goodies & Elements:*`,
    ...(form.giftCategories.length > 0
      ? form.giftCategories.map((cat) => ` • ${cat}`)
      : [' • Surprises curated by DILSY']),
    ``,
    `*Personal Touch:*`,
    `• Recipient Name/Nickname: ${form.recipientName || 'Not provided'}`,
    `• Greeting Card Message: "${form.personalNote || 'To be handwritten by DILSY'}"`,
    ...(form.specialInstructions ? [`• Special Instructions: ${form.specialInstructions}`] : []),
    ``,
    `*Delivery & Contact Details:*`,
    `• Customer Name: ${form.customerName || 'Not specified'}`,
    `• Customer Phone: ${form.customerPhone || 'Not specified'}`,
    `• Service Location: ${form.deliveryArea || 'Chandigarh University / Mohali'}`,
    ...(form.specificLandmark ? [`• PG / Landmark: ${form.specificLandmark}`] : []),
    `• Preferred Date: ${form.deliveryDate || 'To be discussed'}`,
    `• Preferred Time Window: ${form.timeWindow || 'To be coordinated'}`,
    ``,
    `*Pricing Note:*`,
    isCustomBudget
      ? `• Price status: Price to be confirmed with DILSY owner based on custom item selection.`
      : `• Approximate base budget: ${form.budget} (final pricing to be verified by DILSY).`,
    ``,
    `*Delivery Policy:*`,
    `"${EXACT_DELIVERY_POLICY}"`,
    ``,
    `Hi DILSY! I built this custom hamper blueprint on your website. Could you please review the items, confirm item availability and final pricing for delivery to my location? Thank you!`,
  ];

  return lines.join('\n');
}
