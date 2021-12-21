import {
    popoverController,
} from '@ionic/vue';

export function usePopover() {
    /* Component properties */

    /* Lifecycle hooks */


    /* Methods */
    const openPopover = async(component, event, cssClass = '', componentProps = null, size = null) => {
        const popover = await popoverController
            .create({
                component: component,
                componentProps,
                cssClass: cssClass,
                event: event,
                translucent: true,
                showBackdrop: false,
                mode: 'ios',
                size
            });

        await popover.present();

        return popover;
    };


    return {
        /* Component properties  */

        /* Methods */
        openPopover,
    };
}
