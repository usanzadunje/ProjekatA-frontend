import { ref } from 'vue';

export function useModal() {
    /* Component properties */
    // Showing/Hiding modal based on this property value
    const isModalOpen = ref(false);
    // Place which information is sent to modal
    const modalData = ref({});


    /* Methods */
    const openModal = (state, data = null) => {
        if(data) {
            modalData.value = data;
        }
        isModalOpen.value = state;
    };
    const hideModal = (selector) => {
        const modal = document.querySelector(`${selector}`);

        modal.style.transition = 'opacity 0.25s ease-in';
        modal.style.opacity = 0;
    };
    const showModal = (selector) => {
        const modal = document.querySelector(`${selector}`);

        modal.style.transition = 'opacity 0.1s ease-out';
        modal.style.opacity = 1;
    };


    return {
        /* Component properties  */
        isModalOpen,
        modalData,

        /* Methods */
        openModal,
        hideModal,
        showModal,
    };
}
