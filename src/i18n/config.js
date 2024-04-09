import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languages } from '../Util/Global';

const lang = JSON.parse(window.localStorage.getItem('settings'))
console.log(lang)

i18n.use(initReactI18next).init({
  fallbackLng: 'us',
  lng: lang.language,
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

i18n.languages = languages;

export default i18n;