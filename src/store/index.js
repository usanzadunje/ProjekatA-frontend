import { createStore } from 'vuex';
import * as auth                     from "@/store/modules/Auth";

export default createStore({
    strict: true,

    modules: {
        auth,
    }
});
