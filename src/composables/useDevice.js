import { ref } from 'vue';

import { Capacitor }               from '@capacitor/core';
import { Keyboard, KeyboardStyle } from '@capacitor/keyboard';
import { Device }                  from '@capacitor/device';

export const deviceInfo = ref();
export const deviceWidth = ref(window.innerWidth);
export const deviceHeight = ref(window.innerHeight);

(async() => {
    deviceInfo.value = await Device.getInfo();
})();

export function useDevice() {
    /* Global properties */

    /* Component properties */

    /* Lifecycle hooks */


    /* Methods */


    return {
        /* Component properties  */
        /* Methods */
    };
}

export async function setKeyboardStyle(dark = false) {
    try {
        if(Capacitor.isNativePlatform()) {
            if(dark) {
                await Keyboard?.setStyle({
                    style: KeyboardStyle.Dark,
                });
            }else {
                await Keyboard?.setStyle({
                    style: KeyboardStyle.Light,
                });
            }
        }
    }catch(e) {
        return;
    }
}

export async function hideNativeKeyboard() {
    if(Capacitor.isNativePlatform()) {
        try {
            await Keyboard?.hide();
        }catch(e) {
            return;
        }
    }
}
