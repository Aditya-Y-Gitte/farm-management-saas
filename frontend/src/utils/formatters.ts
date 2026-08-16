const LOCALE_MAP: Record<string, string> = {
  en: 'en-IN',
  mr: 'mr-IN',
};

/**
 * Returns the proper Intl locale given an i18n language code.
 * Falls back to 'en-IN' if the language is unknown.
 */
export const getIntlLocale = (i18nLanguage: string): string => {
  return LOCALE_MAP[i18nLanguage] || 'en-IN';
};

/**
 * Formats a calendar date string (e.g. "2026-08-16") without applying local timezone offsets.
 * This prevents the "timezone shift" bug where a date could render as the day before.
 */
export const formatCalendarDate = (
  dateStr: string | Date | null | undefined,
  language: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const locale = getIntlLocale(language);
  
  // By formatting in UTC, we ensure "2026-08-16" remains "16 Aug" regardless of user timezone
  return d.toLocaleDateString(locale, { timeZone: 'UTC', ...options });
};

/**
 * Formats a timestamp (e.g. "2026-08-16T14:30:00Z") according to the user's local timezone.
 */
export const formatTimestamp = (
  timestamp: string | Date | null | undefined,
  language: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!timestamp) return '';
  const d = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const locale = getIntlLocale(language);
  
  return d.toLocaleDateString(locale, options);
};

/**
 * Formats a number according to the locale's numbering system.
 * Accepts Intl.NumberFormatOptions to control precision and grouping.
 */
export const formatNumber = (
  value: number | null | undefined,
  language: string,
  options?: Intl.NumberFormatOptions
): string => {
  if (value === null || value === undefined) return '';
  return value.toLocaleString(getIntlLocale(language), options);
};

/**
 * Formats an amount as Indian Rupees (₹) according to the locale.
 */
export const formatCurrency = (
  amount: number | null | undefined,
  language: string,
  options?: Intl.NumberFormatOptions
): string => {
  if (amount === null || amount === undefined) return '';
  return formatNumber(amount, language, {
    style: 'currency',
    currency: 'INR',
    ...options,
  });
};
