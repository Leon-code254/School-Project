/**
 * Formats a number into a localized string with specified decimals
 * @param value The number to format
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formats an area value (in hectares) into a human-readable string
 * @param area The area in hectares
 * @returns Formatted area string with units
 */
export const formatArea = (area: number): string => {
  if (area < 0.01) {
    return formatNumber(area * 10000, 0) + ' m²';
  }
  return formatNumber(area, 2) + ' ha';
};

/**
 * Formats a currency value into a localized string with currency symbol
 * @param value The value to format
 * @param currency The currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};