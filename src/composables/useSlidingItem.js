import { ref } from 'vue';

export function useSlidingItem() {
    /* Component properties */
    const slidingItem = ref();

    /* Methods */
    const closeOpenItems = () => {
        slidingItem.value?.$el?.closeOpened()
    };

    return {
        /* Component properties */
        slidingItem,
        /* Methods */
        closeOpenItems,
    };
}