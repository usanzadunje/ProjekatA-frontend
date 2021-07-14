import router            from "@/router";
import { useBackButton } from '@ionic/vue';

import AuthService               from "@/services/AuthService";
import { useToastNotifications } from '@/composables/useToastNotifications';
import { useStorage }            from '@/services/StorageService';

export const namespaced = true;

export const state = {
    user: null,
};

export const mutations = {
    SET_USER(state, user) {
        state.user = user;
    },
};

export const actions = {
    //Logging out user and redirecting to login page
    logout({ commit }) {
        useBackButton(100, () => {
            router.push({ name: 'home' });
        });
        const { showSuccessToast } = useToastNotifications();
        const { set } = useStorage();
        return AuthService.logout()
                          .then(async(response) => {
                              commit("SET_USER", null);
                              await set('projekata_token', null);
                              await router.replace({ name: 'login' });
                              showSuccessToast(response.data.success);
                              document.body.classList.toggle('dark', false);
                          });
    },
    // Getting authenticated user info and saving it to store
    async getAuthUser({ commit, state }) {
        const { get } = useStorage();
        try {
            const response = await AuthService.getAuthUser();
            commit("SET_USER", response.data);
            get(`isDarkModeOn.${state.user.id}`)
                .then((response) => {
                    document.body.classList.toggle('dark', !!response);
                })
                .catch(() => {
                    document.body.classList.toggle('dark', false);
                });
            return true;
        }catch(error) {
            document.body.classList.toggle('dark', false);
            commit("SET_USER", null);
            return false;
        }
    },
};

export const getters = {
    // Auth user info
    authUser: (state) => {
        return state.user ?? {};
    },
    // Property true when something is loading
    loading: (state) => {
        return state.loading;
    },
    // Auth user state logged in or not
    loggedIn: (state) => {
        return !!state.user;
    },
    // Auth user is email verified
    // emailVerified: (state) => {
    //     return !!state.user.email_verified;
    // },
    // Checking if auth user is staff member
    isStaff: (state) => {
        return !!state.user.cafe_id;
    },
};