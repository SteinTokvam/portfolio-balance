import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'us',
  resources: {
    us: {
      translations: require('./locales/us/translations.json')
    },
    no: {
      translations: require('./locales/no/translations.json')
    }
  },
  ns: ['translations'],
  defaultNS: 'translations'
});

i18n.languages = ['us', 'no'];

export default i18n;