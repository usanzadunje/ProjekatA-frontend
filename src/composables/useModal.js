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
    const hideModal = (cssClass) => {
        const modal = document.querySelector(`.${cssClass} > .modal-wrapper`);

        modal.style.height = 0;
    };


    return {
        /* Component properties  */
        isModalOpen,
        modalData,

        /* Methods */
        openModal,
        hideModal,
    };
}
