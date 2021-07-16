import { loadLocaleMessages } from '@/utils/helpers';

const locales = require.context(`@/lang/sr`, true, /[A-Za-z0-9-_,\s]+\.js$/i);

export const sr = loadLocaleMessages(locales);
