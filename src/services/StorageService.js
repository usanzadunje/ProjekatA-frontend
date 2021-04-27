import { Storage } from '@ionic/storage';

export function useStorage() {

    const storage = new Storage();

    storage.create()
           .catch((error) => {
               alert(error)
           });

    const set = (key, value) => {
        storage?.set(key, value);
    };

    const get = async(key) => {
        return storage?.get(key);
    };


    return {
        set,
        get,
    };
}
