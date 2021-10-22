import { i18n } from '@/i18n';

import { Storage, Drivers } from '@ionic/storage';

import * as SQLiteDriver from 'localforage-cordovasqlitedriver';

const storage = new Storage({
    name: 'projekata',
    storeName: 'projekataDB',
    driverOrder: [
        SQLiteDriver._driver,
        Drivers.IndexedDB,
        Drivers.LocalStorage,
    ],
});

(async() => {
    try {
        await storage.defineDriver(SQLiteDriver);
        await storage.create();
    }catch(e) {
        alert(`${i18n.global.t('generalAlertError')}`);
    }
})();

export function StorageService() {
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
