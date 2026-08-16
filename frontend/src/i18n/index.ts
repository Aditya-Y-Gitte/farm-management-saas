import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

export const defaultNS = 'common';
export const resources = ['common', 'navigation', 'dashboard', 'animals', 'milk', 'health', 'breeding', 'finance', 'feed'];

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'mr'],
    fallbackLng: 'en',
    ns: resources,
    defaultNS,
    fallbackNS: defaultNS,
    detection: {
      order: ['path', 'cookie', 'htmlTag', 'localStorage', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: false,
    },
    parseMissingKeyHandler: (key: string) => {
      const parts = key.split(':');
      const keyWithoutNs = parts[parts.length - 1];
      const leafNode = keyWithoutNs.split('.').pop() || key;
      const titleCase = leafNode.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      return titleCase;
    },
  });

export default i18n;
