import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languages } from '../Util/Global';
import usJSON from './locales/us/translations.json';
import noJSON from './locales/no/translations.json';

const lang = JSON.parse(window.localStorage.getItem('settings'))

i18n.use(initReactI18next).init({
  fallbackLng: 'us',
  lng: lang ? lang.language : 'us',
  resources: {
    us: {
      translations: usJSON
    },
    no: {
      translations: noJSON
    }
  },
  ns: ['translations'],
  defaultNS: 'translations'
});

i18n.languages = languages;

export default i18n;