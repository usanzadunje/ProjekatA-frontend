export function useContent() {
    /* Component properties */

    /* Methods */
    const scrollToTop = (element, duration = 500) => {
        element.$el.scrollToTop(duration);
    };
    
    return {
        /* Component properties */

        /* Methods */
        scrollToTop,
    };
}