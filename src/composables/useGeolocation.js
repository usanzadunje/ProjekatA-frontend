import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n }  from 'vue-i18n';

import LocationService from '@/services/LocationService';

import { useToastNotifications } from '@/composables/useToastNotifications';

import { Geolocation } from '@capacitor/geolocation';

import { Capacitor } from "@capacitor/core";

export function useGeolocation() {
    /* Component properties */
    const store = useStore();
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
    };
    let watchId = null;
    const position = computed(() => store.getters['global/position']);


    /* Lifecycle hooks */

    /* Methods */
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();
    const tryGettingLocation = async() => {
        if(store.getters['permission/location']) {
            await watchPosition();
        }
    };

    const checkForLocationPermission = async() => {
        if(!store.getters['permission/location']) {
            await getPermission();
        }
    };

    const getPermission = async() => {
        const hasPermission = await LocationService.checkGPSPermission();

        if(hasPermission) {
            if(Capacitor.getPlatform() !== 'web') {
                const canUseGPS = await LocationService.askToTurnOnGPS();
                store.commit("permission/SET_LOCATION_PERMISSIONS", canUseGPS);
            }else {
                store.commit("permission/SET_LOCATION_PERMISSIONS", true);
            }
        }else {
            const permission = await LocationService.requestGPSPermission();
            if(permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
                if(Capacitor.getPlatform() !== 'web') {
                    const canUseGPS = await LocationService.askToTurnOnGPS();
                    store.commit("permission/SET_LOCATION_PERMISSIONS", canUseGPS);
                }else {
                    store.commit("permission/SET_LOCATION_PERMISSIONS", true);
                }
            }else {
                store.commit("permission/SET_LOCATION_PERMISSIONS", false);
                showErrorToast(
                    null,
                    {
                        pushNotificationPermission: t('warningNoGeoLocationPermission'),
                    });
            }
        }
    };

    const watchPosition = async() => {
        try {
            watchId = await Geolocation.watchPosition(options, (position, err) => {

                if(err) {
                    store.commit("permission/SET_LOCATION_PERMISSIONS", false);
                    showErrorToast(
                        null,
                        {
                            pushNotificationPermission: t('geoLocationUnexpected'),
                        });
                    return;
                }

                store.commit("global/SET_POSITION", {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                clearWatch();
            });
        }catch(err) {
            store.commit("permission/SET_LOCATION_PERMISSIONS", false);
            showErrorToast(
                null,
                {
                    pushNotificationPermission: t('geoLocationUnexpected'),
                });
        }
    };

    const clearWatch = () => {
        if(watchId != null) {
            Geolocation.clearWatch({ id: watchId });
        }
    };


    return {
        /* Component properties */
        position,

        /* Methods */
        checkForLocationPermission,
        tryGettingLocation,
    };
}
