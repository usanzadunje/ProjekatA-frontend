import { createApp } from 'vue';

import App from './App.vue';

import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Taliwindcss import*/
import "tailwindcss/tailwind.css";

/* Custom css */
import "@/assets/css/style.css";

/* Vuex */
import store        from './store';

/* Translations */
import { i18n }     from '@/./i18n';


const app = createApp(App)
    .use(i18n)
    .use(store)
    .use(IonicVue)
    .use(router);
/* Custom directives */
app.directive('capitalize', {
    updated(el) {
        el.value = el.value.charAt(0).toUpperCase() + el.value.slice(1);
    },
});
app.directive('update-swiper', {
    mounted(el) {
        el.update();
    },
});

app.mixin({
    data() {
        return {
            backendStorageURL: process.env.VUE_APP_STORED_IMAGES_URL,
        };
    },
});

router.isReady().then(() => {
    app.mount('#app');
});