import { ref } from 'vue';

import { deviceHeight } from '@/composables/useDevice';

export function slideUp(elementId) {
    /* Global properties */

    /* Component properties */
    const showElement = ref(true);
    const scrollTopOffset = ref(0);
    const prevScrollDirectionDown = ref(false);
    const elementHeight = ref();

    /* Methods */
    const pullAnimation = async(event) => {
        if(!elementHeight.value) {
            elementHeight.value = Math.round(document.getElementById(elementId).getClientRects().item(0).height);
        }

        let currentScrollDirectionDown = event.detail.currentY > scrollTopOffset.value;

        if(
            event.detail.currentY <= 0 ||
            (event.detail.currentY <= Math.round(deviceHeight.value * 1.2) && currentScrollDirectionDown) ||
            event.detail.currentY === scrollTopOffset.value ||
            event.detail.currentY - scrollTopOffset.value === elementHeight.value ||
            scrollTopOffset.value - event.detail.currentY === elementHeight.value ||
            currentScrollDirectionDown === prevScrollDirectionDown.value
        ) {
            scrollTopOffset.value = event.detail.currentY;

            return;
        }

        showElement.value = event.detail.currentY <= scrollTopOffset.value;

        scrollTopOffset.value = event.detail.currentY;
        prevScrollDirectionDown.value = currentScrollDirectionDown;
    };

    return {
        /* Component properties */
        showElement,

        /* Methods */
        pullAnimation,
    };
}

export function swipe() {
    /* Global properties */

    /* Component properties */

    /* Methods */
    const fullSwipeLeft = (element) => {
        if(element?.style) {
            element.style.transition = 'transform 0.45s ease-out';
            element.style.transform = 'translate3d(-100%, 0px, 0px)';
        }
    };


    return {
        /* Component properties */

        /* Methods */
        fullSwipeLeft,
    };
}

export function shrink() {
    /* Global properties */

    /* Component properties */

    /* Methods */
    const shrinkToMiddle = (element) => {
        if(element?.style) {
            element.style.transition = 'transform 0.25s ease-in';
            element.style.transform = 'scaleY(0)';
        }
    };


    return {
        /* Component properties */

        /* Methods */
        shrinkToMiddle,
    };
}


//
// export function useCache() {
//     /* Global properties */
//     /* Methods */
//     return {
//         /* Component properties */
//         /* Methods */
//     };
// }