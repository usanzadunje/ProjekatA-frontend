import { i18n } from '@/i18n';

import { Storage } from '@ionic/storage';

export function StorageService() {

    const storage = new Storage();

    /* Composables */
    storage.create()
           .catch(() => {
               alert(`${i18n.global.t('generalAlertError')}`);
           });

    const set = async(key, value) => {
        await storage?.set(key, value);
    };

    const get = (key) => {
        return storage?.get(key);
    };

    const remove = async(key) => {
        await storage?.remove(key);
    };


    return {
        set,
        get,
        remove,
    };
}
