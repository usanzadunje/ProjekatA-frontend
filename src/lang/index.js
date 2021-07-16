import { en } from "@/lang/en";
import { sr } from "@/lang/sr";

export default {
    sr,
    en,
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
