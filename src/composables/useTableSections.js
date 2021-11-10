import { ref } from 'vue';

export function useTableSections() {
    /* Component properties */
    const activeSection = ref(1);

    /* Methods */
    const changeSection = async(section) => {
        activeSection.value = section;
    };

    return {
        /* Component properties */
        activeSection,

        /* Methods */
        changeSection
    };
}