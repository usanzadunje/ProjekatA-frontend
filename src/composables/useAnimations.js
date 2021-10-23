import { ref }      from 'vue';
import { useStore } from 'vuex';

export function slideUp(elementId) {
    /* Global properties */
    const store = useStore();

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
            (event.detail.currentY <= Math.round(store.getters['global/height'] * 1.2) && currentScrollDirectionDown) ||
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


//
// export function useCache() {
//     /* Global properties */
//     /* Methods */
//     return {
//         /* Component properties */
//         /* Methods */
//     };
// }