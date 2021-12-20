import { ref } from 'vue';

export function useModal() {
    /* Component properties */
    // Showing/Hiding modal based on this property value
    const isModalOpen = ref(false);
    // Place which information is sent to modal
    const modalData = ref(null);
    const visibleModal = ref();


    /* Methods */
    const openModal = (state, data = null) => {
        if(data) {
            modalData.value = data;
        }
        isModalOpen.value = state;
    };
    const hideModal = (selector) => {
        const modal = document.querySelector(`${selector}`);

        modal.style.setProperty('transition', 'opacity 0.35s ease-in', 'important');
        modal.style.setProperty('opacity', '0', 'important');
    };
    const showModal = (selector) => {
        const modal = document.querySelector(`${selector}`);

        modal.style.setProperty('transition', 'opacity 0.1s ease-out', 'important');
        modal.style.setProperty('opacity', '1', 'important');
    };


    return {
        /* Component properties  */
        isModalOpen,
        modalData,
        visibleModal,

        /* Methods */
        openModal,
        hideModal,
        showModal,
    };
}
