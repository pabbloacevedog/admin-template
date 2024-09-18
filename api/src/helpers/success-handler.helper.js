// src/helpers/success-handler.helper.js
import successTranslations from '../utils/successTranslations.js';
import { asyncLocalStorage } from '../middleware/languageMiddleware.js';

const getCurrentLanguage = () => {
    const store = asyncLocalStorage.getStore();
    let lang = store ? store.get('lang') : 'en';
    // Solo tomar el prefijo del idioma (p. ej., 'es' en lugar de 'es-419')
    lang = lang.split('-')[0];
    return lang;
};

export const getSuccessMessage = (messageKey) => {
    const lang = getCurrentLanguage();
    return successTranslations[lang][messageKey] || successTranslations['en'][messageKey];
};
