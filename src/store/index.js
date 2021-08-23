import { createStore } from 'vuex';

import * as auth       from "@/store/modules/Auth";
import * as user       from "@/store/modules/User";
import * as permission from "@/store/modules/Permission";
import * as global     from "@/store/modules/Global";
import * as staff      from "@/store/modules/Staff";

import createPersistedState from "vuex-persistedstate";

export default createStore({
    strict: true,

    modules: {
        auth,
        user,
        permission,
        global,
        staff,
    },

    plugins: [
        createPersistedState({
            storage: window.localStorage,
            paths: [
                'auth.user',
                'user',
                'global',
                'permission',
            ],
        }),
    ],
});
