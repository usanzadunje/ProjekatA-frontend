import { onMounted, ref } from 'vue';
import { useStore }       from 'vuex';

import { StorageService } from '@/services/StorageService';

export function useGlobalSettings() {
    /* Global properties */
    const store = useStore();

    /* Composables */
    const { get } = StorageService();

    /* Component properties */
    const userColor = ref('#1b6de0');

    onMounted(async() => {
        userColor.value = await get(`color.${store.getters['auth/authUser']?.id}`) ?? '#1b6de0';
    });

    store.subscribeAction((action) => {
        if(action.type === 'user/setGlobalColor') {
            userColor.value = action.payload;
        }
    });


    /* Methods */


    return {
        /* Component properties  */
        userColor,

        /* Methods */
    };
}
