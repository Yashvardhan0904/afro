/**
 * Format price from paise to rupees
 * Backend stores prices in paise (smallest unit), frontend displays in rupees
 * @param priceInPaise - Price in paise (e.g., 249900)
 * @returns Formatted price string (e.g., "₹2,499.00")
 */
export function formatPrice(priceInPaise: number): string {
  const priceInRupees = priceInPaise / 100;
  return `₹${priceInRupees.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Convert paise to rupees (number only, no formatting)
 * @param priceInPaise - Price in paise
 * @returns Price in rupees as number
 */
export function paiseToRupees(priceInPaise: number): number {
  return priceInPaise / 100;
}

/**
 * Convert rupees to paise (for sending to backend)
 * @param priceInRupees - Price in rupees
 * @returns Price in paise as number
 */
export function rupeesToPaise(priceInRupees: number): number {
  return Math.round(priceInRupees * 100);
}
