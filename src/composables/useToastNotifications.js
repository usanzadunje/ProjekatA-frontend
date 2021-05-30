import { computed, ref }   from 'vue';

import { toastController } from '@ionic/vue';

import { getError }        from '@/utils/helpers';


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
    //Generating toast success notifications
    const showSuccessToast = async(message) => {
        const toast = await toastController
            .create({
                duration: 1500,
                position: 'top',
                message: message,
                cssClass: 'success-toast',
            })
        return toast.present();
    }

    //Generating toast error notifications
    const showErrorToast = async(backendErrors) => {
        errors.value = getError(backendErrors);

        for(let i = 0; i < errorKeys.value.length; i++) {
            const toast = await toastController.create({
                duration: 1500,
                position: 'top',
                message: getErrorMessage(errorKeys.value[i]),
                cssClass: 'error-toast',
            });
            toast.style.top = `${55 * i}px`;
            await toast.present();
        }
    };

    return {
        /* Methods */
        showSuccessToast,
        showErrorToast
    };
}
