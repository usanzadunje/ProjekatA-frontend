import { onMounted, ref } from 'vue';

export function useMenu() {
    /* Component properties */
    const isMenuOpen = ref(false);
    const menu = ref();

    /* Lifecycle hooks */
    onMounted(() => {
        menu.value = document.querySelector('#admin-menu');
    });

    /* Methods */
    const openMenu = async(state) => {
        if(state) {
            menu?.value?.open();
        }else {
            menu?.value?.close();
        }
    };
    const toggleMenu = async() => {
        const currentMenuState = await menu?.value?.isOpen();
        if(!currentMenuState) {
            await menu?.value?.open();
        }else {
            await menu?.value?.close();
        }
    };


    return {
        /* Component properties  */
        isMenuOpen,

        /* Methods */
        openMenu,
        toggleMenu,
    };
}
