import { ref } from 'vue';

export function useContent() {
    /* Component properties */
    const content = ref(null);

    /* Methods */
    const scrollToTop = () => {
        content.value?.$el?.scrollToTop(500);
    };
    return {
        /* Component properties */
        content,

        /* Methods */
        scrollToTop,
    };
}