import { useStore } from 'vuex';
import PlaceService from '@/services/PlaceService';

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
    const getPlaceAdditionalInfo = async(id) => {
        if(!store.getters['user/getPlaceAdditionInfo'](id)) {
            try {
                if(store.getters['user/hasMoreThanPlaces'](100)) {
                    store.commit('user/PURGE_PLACE_ADDITIONAL_INFO');
                }

                const response = await Promise.all([
                    PlaceService.images(id),
                    PlaceService.workingHours(id),
                ]);

                store.commit('user/SET_PLACE_ADDITIONAL_INFO', {
                    id: id,
                    images: response[0].data,
                    working_hours: response[1].data,
                });
            }catch(e) {
                store.commit('user/SET_PLACE_ADDITIONAL_INFO', {
                    id: id,
                    images: null,
                    working_hours: null,
                });
            }
        }
    };

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
        //General
        getAuthUser,
        //Staff
        getPlaceInfo,
        getPlaceTables,
        getPlaceCategories,
        //End user
        getPlaceAdditionalInfo,
    };
}