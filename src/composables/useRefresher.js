export function useRefresher() {

    /* Global properties */
    /* Methods */
    const forceStopRefresherAfter = (event, milliseconds = 5000) => {
        setTimeout(() => {
            event?.target?.complete();
        }, milliseconds);
    };

    return {
        /* Methods */
        forceStopRefresherAfter,
    };
}
