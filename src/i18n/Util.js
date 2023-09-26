export function changeLanguage(translation, e) {//en knapp kan kalle på denne verdien. da vil e.target.value bli satt til hva nå enn value til knappen er
    translation.changeLanguage(e.target.value);
  }