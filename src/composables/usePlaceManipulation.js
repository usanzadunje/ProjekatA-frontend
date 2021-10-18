import { ref }      from 'vue';
import { useStore } from 'vuex';
import { useI18n }  from 'vue-i18n';

import StaffService from '@/services/StaffService';

import { useToastNotifications } from '@/composables/useToastNotifications';


export function usePlaceManipulation() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const toggling = ref(false);

    /* Composables */
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();

    /* Methods */
    const randomToggle = async(available) => {
        toggling.value = true;
        try {
            const response = await StaffService.randomToggleAvailability(available);

            store.commit('staff/SET_AVAILABILITY_RATIO', response.data?.availability_ratio);
            store.dispatch('owner/getTables');
        }catch(e) {
            showErrorToast(
                null,
                {
                    toggleAvailabilityError: t('dataFetchingError'),
                });
        }finally {
            toggling.value = false;
        }
    };

    const toggle = async(tableId) => {
        try {
            const response = await StaffService.toggleAvailability(tableId);

            store.commit('owner/TOGGLE_TABLE_AVAILABILITY', {
                tableId,
            });
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
        /* Component properties */
        toggling,

        /* Methods */
        randomToggle,
        toggle,
    };
}
