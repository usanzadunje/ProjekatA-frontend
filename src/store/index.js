import { createStore } from 'vuex';

import * as auth from "@/store/modules/Auth";
import * as permission from "@/store/modules/Permission";
import * as global from "@/store/modules/Global";

import createPersistedState from "vuex-persistedstate";

export default createStore({
    strict: true,

    modules: {
        auth,
        permission,
        global
    },

    plugins: [
        createPersistedState({
            storage: window.sessionStorage,
        })],
});
