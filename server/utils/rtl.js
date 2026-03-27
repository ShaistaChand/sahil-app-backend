export const isRTL = (lang) => ['ar', 'he', 'ur'].includes(lang);
export const getTextDirection = (lang) => isRTL(lang) ? 'rtl' : 'ltr';