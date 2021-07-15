import srLong  from './translations/longs/sr.js';
import srShort from './translations/shorts/sr.js';
import enLong  from './translations/longs/en.js';
import enShort from './translations/shorts/en.js';

export default {
    sr: {
        ...srLong,
        ...srShort,
    },
    en: {
        ...enLong,
        ...enShort,
    },
};

export const getLanguages = (selectedLanguage) => {
    let languagesArray = [
        {
            text: 'SRB',
            value: 'sr',
        },
        {
            text: 'ENG',
            value: 'en',
        },
        // {
        //     text: 'RUS',
        //     value: 'ru',
        // },
        // {
        //     text: 'BIH',
        //     value: 'ba',
        // },
    ];

    return languagesArray.sort((a, b) => {
        return a.text === selectedLanguage ? -1 : b.value === selectedLanguage ? 1 : 0;
    });
};
