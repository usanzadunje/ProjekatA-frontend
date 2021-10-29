import { ref } from 'vue';

export function useAccordion() {
    /* Global properties */
    const currentlyOpenPanel = ref('');

    /* Component properties */

    /* Lifecycle hooks */


    /* Methods */
    const changeCurrentlyOpenPanel = (panel) => {
        currentlyOpenPanel.value = panel;
    };
    const checkIfPanelIsOpen = (panel, inverse = false) => {
        return inverse ? currentlyOpenPanel.value !== panel : currentlyOpenPanel.value === panel;
    };

    return {
        /* Component properties  */
        currentlyOpenPanel,
        /* Methods */
        changeCurrentlyOpenPanel,
        checkIfPanelIsOpen,
    };
}
