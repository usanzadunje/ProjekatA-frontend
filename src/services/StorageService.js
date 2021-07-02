import { Storage } from '@ionic/storage';

export function useStorage() {

    const storage = new Storage();

    storage.create()
           .catch((error) => {
               alert(error);
           });

    const set = async(key, value) => {
        await storage?.set(key, value);
    };

    const get = (key) => {
        return storage?.get(key);
    };


    return {
        set,
        get,
    };
}
