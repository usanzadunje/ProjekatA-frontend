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
    const toggle = async(available) => {
        toggling.value = true;
        try {
            const response = await StaffService.toggleAvailability(available);

            store.commit('staff/SET_AVAILABILITY_RATIO', response.data?.availability_ratio);
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

    return {
        /* Component properties */
        toggling,

        /* Methods */
        toggle,
    };
}
