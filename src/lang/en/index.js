import { loadLocaleMessages } from '@/utils/helpers';

const locales = require.context(`@/lang/en`, true, /[A-Za-z0-9-_,\s]+\.js$/i);

export const en = loadLocaleMessages(locales);