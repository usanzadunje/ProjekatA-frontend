import { computed, ref }   from 'vue';
import { i18n }            from '@/i18n';
import { toastController } from '@ionic/vue';

import { getError } from '@/utils/helpers';


export function useToastNotifications() {
    /* Component properties */
    let errors = ref({});

    /* Computed properties */
    //Returns error key name from backend
    const errorKeys = computed(() => {
        if(!errors.value) {
            return null;
        }
        return Object.keys(errors.value);
    });

    /* Methods */
    //Shows error message for specific key
    const getErrorMessage = (key) => {
        return errors.value[key];
    };
    //Generating classic notification toast
    const showUndoToast = async(message, callback) => {
        const toast = await toastController.create({
            duration: 300000,
            message: message,
            cssClass: 'undo-toast',
            mode: 'ios',
            buttons: [
                {
                    side: 'end',
                    text: i18n.global.t('undo').toUpperCase(),
                    cssClass: 'undo-toast-button',
                    handler: callback,
                },
            ],
        });

        toast.style.top = '-50px';
        await toast.present();
    };
    //Generating toast success notifications
    const showSuccessToast = async(message) => {
        const toast = await toastController
            .create({
                duration: 1500,
                position: 'top',
                message: message,
                cssClass: 'success-toast',
                mode: 'ios',
            });
        await toast.present();
    };

    //Generating toast error notifications
    const showErrorToast = async(backendErrors, errorMessage = null) => {
        errors.value = errorMessage ?? getError(backendErrors);

        for(let i = 0; i < errorKeys.value.length; i++) {
            const toast = await toastController.create({
                duration: 1500,
                position: 'top',
                message: getErrorMessage(errorKeys.value[i]),
                cssClass: 'error-toast',
                mode: 'ios',
            });
            toast.style.top = `${55 * i}px`;
            await toast.present();
        }
    };

    return {
        /* Methods */
        showUndoToast,
        showSuccessToast,
        showErrorToast,
    };
}
