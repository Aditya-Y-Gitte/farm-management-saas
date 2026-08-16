import 'i18next';
import common from '../../public/locales/en/common.json';
import navigation from '../../public/locales/en/navigation.json';
import dashboard from '../../public/locales/en/dashboard.json';
import animals from '../../public/locales/en/animals.json';
import milk from '../../public/locales/en/milk.json';
import health from '../../public/locales/en/health.json';
import breeding from '../../public/locales/en/breeding.json';
import finance from '../../public/locales/en/finance.json';
import feed from '../../public/locales/en/feed.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      navigation: typeof navigation;
      dashboard: typeof dashboard;
      animals: typeof animals;
      milk: typeof milk;
      health: typeof health;
      breeding: typeof breeding;
      finance: typeof finance;
      feed: typeof feed;
    };
  }
}
