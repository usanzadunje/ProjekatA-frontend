import { useStore } from 'vuex';

export function useFetchCondition() {
    /* Global properties */
    const store = useStore();

    /* Methods */
    /* General user related */
    const getAuthUser = async() => {
        if(Object.keys(store.getters['auth/authUser'] ?? {}).length === 0) {
            await store.dispatch("auth/getAuthUser");
        }
    };

    /* End-user related */

    /* Owner/Staff related */
    const getPlaceInfo = async() => {
        if(Object.keys(store.getters['owner/place'] ?? {}).length === 0) {
            await store.dispatch('owner/getPlaceInfo');
        }
    };
    const getPlaceTables = async() => {
        if(store.getters['owner/tables']?.length === 0) {
            await store.dispatch('owner/getTables');
        }
    };
    const getPlaceCategories = async() => {
        if(store.getters['owner/categories']?.length === 0) {
            await store.dispatch('owner/getCategories');
        }
    };

    return {
        /* Component properties */

        /* Methods */
        getAuthUser,
        getPlaceInfo,
        getPlaceTables,
        getPlaceCategories,
    };
}