import { useStore } from 'vuex';

import PlaceService from '@/services/PlaceService';

import { useCurrentUser } from '@/composables/useCurrentUser';

import { didCacheExpire, getExpirationDate } from '@/utils/helpers';

export function useCache() {
    /* Global properties */
    const store = useStore();
    const { authUser } = useCurrentUser();

    /* Methods */
    /* General user related */
    const getCachedOrFetchAuthUser = async(forceFetch = false) => {
        if(Object.keys(authUser.value ?? {}).length === 0 || forceFetch) {
            await store.dispatch("auth/getAuthUser");
        }
    };

    /* End-user related */
    const getCachedOrFetchPlaceAdditionalInfo = async(id, forceFetch = false) => {
        if(didCacheExpire('placeInfoCacheExpirationDate')) {
            store.commit('user/PURGE_PLACE_ADDITIONAL_INFO');

            store.commit(
                'global/SET_PLACE_INFO_CACHE_EXPIRATION_DATE',
                getExpirationDate('d', 1),
            );
        }

        if(!store.getters['user/getPlaceAdditionInfo'](id) || forceFetch) {
            try {
                if(store.getters['user/hasMoreThanPlacesInfo'](100)) {
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
    const getCachedOrFetchPlaceInfo = async(forceFetch = false) => {
        if(Object.keys(store.getters['owner/place'] ?? {}).length === 0 || forceFetch) {
            await store.dispatch('owner/getPlaceInfo');
        }
    };
    const getCachedOrFetchPlaceTables = async(forceFetch = false) => {
        if(store.getters['owner/tables']?.length === 0 || forceFetch) {
            await store.dispatch('owner/getTables');
        }
    };
    const getCachedOrFetchPlaceCategories = async(forceFetch = false) => {
        if(store.getters['owner/categories']?.length === 0 || forceFetch) {
            await store.dispatch('owner/getCategories');
        }
    };
    const getCachedOrFetchStaff = async(forceFetch = false) => {
        if(store.getters['owner/staff']?.length === 0 || forceFetch) {
            await store.dispatch('owner/getStaffInfo', {
                offset: 0,
                limit: 1000,
            });
        }
    };
    const getCachedOrFetchSchedules = async(forceFetch = false) => {
        if(!store.getters['owner/hasSchedules'] || forceFetch) {
            await store.dispatch('owner/getSchedules');
        }
    };

    return {
        /* Component properties */

        /* Methods */
        //General
        getCachedOrFetchAuthUser,
        //Staff
        getCachedOrFetchPlaceInfo,
        getCachedOrFetchPlaceTables,
        getCachedOrFetchPlaceCategories,
        getCachedOrFetchStaff,
        getCachedOrFetchSchedules,

        //End user
        getCachedOrFetchPlaceAdditionalInfo,
    };
}