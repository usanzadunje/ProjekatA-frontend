import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n }  from 'vue-i18n';

export function useCurrentUser() {
    /* Global properties */
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */
    const authUser = computed(() => store.getters['auth/authUser']);
    const displayName = computed(() => {
        if(authUser.value.fname || authUser.value.lname) {
            return `${authUser.value.fname || ''}${authUser.value.fname && authUser.value.lname ? ' ' : ''}${authUser.value.lname || ''}`;
        }else if(authUser.value.username) {
            return authUser.value.username;
        }else {
            return t('unknown');
        }
    });
    const isOwner = computed(() => store.getters['auth/isOwner']);
    const isStaff = computed(() => store.getters['auth/isStaff']);
    const isEndUser = computed(() => !isOwner.value && !isStaff.value);


    /* Methods */

    return {
        /* Component properties */
        authUser,
        displayName,
        isOwner,
        isStaff,
        isEndUser,

        /* Methods */
    };
}
