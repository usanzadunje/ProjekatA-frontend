import { createStore }      from 'vuex';
import * as auth            from "@/store/modules/Auth";
import createPersistedState from "vuex-persistedstate";

export default createStore({
    strict: true,

    modules: {
        auth,
    },

    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
});
