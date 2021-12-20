import { ref }     from 'vue';
import { useI18n } from 'vue-i18n';

import { useToastNotifications } from '@/composables/useToastNotifications';

import { getError, sleep } from '@/utils/helpers';

export function useErrorHandling() {
    /* Component properties */
    const errorNames = ref({});

    /* Composables */
    const { t } = useI18n();
    const { showSuccessToast, showErrorToast } = useToastNotifications();

    /* Lifecycle hooks */

    /* Methods */
    const tryCatch = async(
        tryCallback,
        opts = {},
    ) => {
        try {
            await tryCallback();
            if(opts.successMessageKey) {
                showSuccessToast(t(opts.successMessageKey, opts.successMessageParams));
            }
        }catch(errors) {
            if(opts.catchCallback) {
                await opts.catchCallback(errors);
            }

            if(!opts.failSilently) {
                displayErrorMessage(opts.errorMessageKey, errors);
            }
        }
    };

    const displayErrorMessage = async(errorMessageKey, errors) => {
        if(!errorMessageKey) {
            errorNames.value = getError(errors);
            await showErrorToast(errors);
            await sleep(Object.keys(errorNames.value).length * 900);
            errorNames.value = {};
        }else {
            showErrorToast(
                null,
                { error: t(errorMessageKey) });
        }
    };


    return {
        /* Component properties  */
        errorNames,

        /* Methods */
        tryCatch,
    };
}
