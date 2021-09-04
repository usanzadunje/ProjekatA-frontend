import {
    popoverController,
} from '@ionic/vue';

export function usePopover() {
    /* Component properties */

    /* Lifecycle hooks */


    /* Methods */
    const openPopover = async(component, event, cssClass = '') => {
        const popover = await popoverController
            .create({
                component: component,
                cssClass: cssClass,
                event: event,
                translucent: true,
                showBackdrop: false,
                mode: 'ios',
            });
        await popover.present();
    };


    return {
        /* Component properties  */

        /* Methods */
        openPopover,
    };
}
