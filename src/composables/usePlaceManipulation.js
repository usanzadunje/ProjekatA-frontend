import { useStore } from 'vuex';
import { useI18n }  from 'vue-i18n';

import StaffService from '@/services/StaffService';

import { useToastNotifications } from '@/composables/useToastNotifications';


export function usePlaceManipulation() {
    /* Global properties */
    const store = useStore();

    /* Composables */
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();

    /* Methods */
    const getPlaceAvailability = async() => {
        try {
            const response = await StaffService.tableAvailability();

            store.commit('staff/SET_AVAILABILITY_RATIO', response.data?.availability_ratio);
        }catch(e) {
            showErrorToast(
                null,
                {
                    toggleAvailabilityError: t('dataFetchingError'),
                });
        }
    };
    const toggle = async(available) => {
        try {
            const response = await StaffService.toggleAvailability(available);

            store.commit('staff/SET_AVAILABILITY_RATIO', response.data?.availability_ratio);
        }catch(e) {
            showErrorToast(
                null,
                {
                    toggleAvailabilityError: t('dataFetchingError'),
                });
        }
    };

    return {
        /* Methods */
        getPlaceAvailability,
        toggle,
    };
}
