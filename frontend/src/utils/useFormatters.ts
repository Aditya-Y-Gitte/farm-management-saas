import { useTranslation } from 'react-i18next';
import {
  formatCalendarDate,
  formatTimestamp,
  formatNumber,
  formatCurrency,
} from './formatters';

export const useFormatters = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return {
    formatDate: (dateStr: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions) =>
      formatCalendarDate(dateStr, lang, options),
    formatTimestamp: (timestamp: string | Date | null | undefined, options?: Intl.DateTimeFormatOptions) =>
      formatTimestamp(timestamp, lang, options),
    formatNumber: (value: number | null | undefined, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, lang, options),
    formatCurrency: (amount: number | null | undefined, options?: Intl.NumberFormatOptions) =>
      formatCurrency(amount, lang, options),
  };
};
