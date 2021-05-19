import { toastController } from "@ionic/vue";


export function useToastService(errors, errorKeys) {
    /* Methods */
    const getErrors = (key) => {
        return errors.value[key];
    };

    const showToastErrors = async() => {
        let toast = null;
        let i;

        for(i = 0; i < errorKeys.length; i++) {
            toast = await toastController.create({
                duration: 2500,
                message: getErrors(errorKeys.value[i]),
                showCloseButton: true,
                cssClass: 'custom-toast',
            });
            toast.style.top = `-${55 * (errorKeys.value.length - 1 - i)}px`;
            await toast.present();
        }
    }

    showToastErrors();

    return {
        showToastErrors,
    };
}
