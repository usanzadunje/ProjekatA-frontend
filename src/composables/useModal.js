import { ref }     from 'vue';
import CafeService from '@/services/CafeService';

export function useModal() {
    /* Component properties */
    // Showing/Hiding modal based on this property value
    const isModalOpen = ref(false);
    // Cafe which information is sent to modal
    const modalData = ref({});


    /* Methods */
    const openModal = async(state, data = null, dataType = '') => {
        if(data) {
            modalData.value = data;
            if(dataType === 'place') {
                const response = await CafeService.images(data.id);
                const responseHours = await CafeService.workingHours(data.id);

                modalData.value.images = response.data;
                modalData.value.working_hours = responseHours.data;
            }
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
