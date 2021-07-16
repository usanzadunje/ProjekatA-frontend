import { createI18n } from 'vue-i18n';
import messages from './lang/index';


export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: process.env.VUE_APP_I18N_LOCALE || 'sr',
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
    messages,
});
