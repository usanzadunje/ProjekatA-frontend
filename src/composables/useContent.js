export function useContent() {
    /* Component properties */

    /* Methods */
    const scrollToTop = (element, duration = 500) => {
        element.$el.scrollToTop(duration);
    };

    const scrollToBottom = (element, duration = 500) => {
        element.$el.scrollToBottom(duration);
    };

    return {
        /* Component properties */

        /* Methods */
        scrollToTop,
        scrollToBottom,
    };
}