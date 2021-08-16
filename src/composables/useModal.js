import { ref } from 'vue';

export function useModal() {
    /* Component properties */
    // Showing/Hiding modal based on this property value
    const isModalOpen = ref(false);
    // Cafe which information is sent to modal
    const modalCafe = ref({});


    /* Methods */
    const openModal = (state, cafe = null) => {
        if(cafe) {
            modalCafe.value = cafe;
        }
        isModalOpen.value = state;
    };
    const hideModal = () => {
        const modal = document.querySelector('.custom-modal > .modal-wrapper');

        modal.style.height = 0;
    };


    return {
        /* Component properties  */
        isModalOpen,
        modalCafe,

        /* Methods */
        openModal,
        hideModal,
    };
}
