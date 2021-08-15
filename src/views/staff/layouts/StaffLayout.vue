<template>
  <ion-page>
    <ion-split-pane content-id="main">
      <ion-menu
          ref="menu"
          content-id="main"
          @ionDidClose="menuClosed"
      >
        <div class="flex flex-col">
          <div class="bg-red-600 w-full p-2">
            ADMIN PANEL
          </div>
          <div class="flex flex-col py-0 pl-2 pr-4 text-center">
            <div
                class="flex flex-row flex-1 items-center"
                :class="[activeMenuItem === 'dashboard' ? 'border-b-2 border-yellow-600 text-yellow-600' : 'text-gray-800']"
                @click="menuItemClicked('dashboard')"
            >
              <ion-icon
                  slot="icon-only"
                  :icon="settingsOutline"
                  class="text-2xl mr-2"
              ></ion-icon>
              <span
                  class="pb-1 text-xl"
              >
                  Dashboard
                </span>
            </div>
            <div
                class="flex flex-row flex-1 items-center"
                :class="[activeMenuItem === 'tables' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-800']"
                @click="menuItemClicked('tables')"
            >
              <ion-icon
                  slot="icon-only"
                  :icon="settingsOutline"
                  class="text-2xl mr-2"
              ></ion-icon>
              <span
                  class="pb-1 text-xl"
              >
                  Tables
                </span>
            </div>
            <div
                class="flex flex-row flex-1 items-center"
                :class="[activeMenuItem === 'profile' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-800']"
                @click="menuItemClicked('profile')"
            >
              <ion-icon
                  slot="icon-only"
                  :icon="settingsOutline"
                  class="text-2xl mr-2"
              ></ion-icon>
              <span
                  class="pb-1 text-xl md:text-base">
                  Profile
                </span>
            </div>
            <div
                class="flex flex-row flex-1 items-center"
                :class="[activeMenuItem === 'settings' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-800']"
                @click="menuItemClicked('settings')"
            >
              <ion-icon
                  slot="icon-only"
                  :icon="settingsOutline"
                  class="text-2xl mr-2"
              ></ion-icon>
              <span
                  class="pb-1 text-xl md:text-base">
                  Settings
                </span>
            </div>
            <div
                class="flex flex-row flex-1 items-center"
                @click="logout"
            >
              <ion-icon
                  slot="icon-only"
                  :icon="settingsOutline"
                  class="text-2xl mr-2"
              ></ion-icon>
              <span
                  class="pb-1 text-xl md:text-base">
                  LOGOUT
                </span>
            </div>
          </div>
        </div>
      </ion-menu>

      <ion-router-outlet id="main"></ion-router-outlet>

    </ion-split-pane>
  </ion-page>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { useStore }                                         from 'vuex';
import { useRouter }                                        from 'vue-router';
import { useI18n }                                          from 'vue-i18n';
import {
  IonPage,
  IonIcon,
  IonRouterOutlet,
  IonSplitPane,
  IonMenu, loadingController,
}                                                           from '@ionic/vue';

import { useToastNotifications } from '@/composables/useToastNotifications';

import { carSportOutline, homeOutline, personOutline, searchOutline, settingsOutline } from 'ionicons/icons';


export default defineComponent({
  name: 'StaffLayout',
  components: {
    IonPage,
    IonIcon,
    IonRouterOutlet,
    IonSplitPane,
    IonMenu,
  },
  setup() {
    /* Global properties */
    const router = useRouter();
    const store = useStore();

    /* Component properties */
    const menu = ref(null);
    const activeMenuItem = ref('dashboard');


    /* Composables */
    const { t } = useI18n();
    const { showErrorToast } = useToastNotifications();

    /* Lifecycle hooks */
    onMounted(() => {
      store.commit('staff/SET_MENU_VISIBILITY', false);
    });
    onBeforeUnmount(() => {
      unwatch();
    });

    /* Event handlers */
    const menuItemClicked = async(menuItemName) => {
      activeMenuItem.value = menuItemName;
      store.commit('staff/SET_MENU_VISIBILITY', false);
      await router.push({ name: `staff.${menuItemName}` });
    };
    const menuClosed = async() => {
      store.commit('staff/SET_MENU_VISIBILITY', false);
    };
    const logout = async() => {
      let loading = null;
      try {
        loading = await loadingController
            .create({
              spinner: 'crescent',
              cssClass: 'custom-loading',
              message: t('loggingOut'),
              mode: 'ios',
            });
        await loading.present();
        await store.dispatch("auth/logout");
      }catch(error) {
        showErrorToast(
            null,
            {
              generalError: t('generalAlertError'),
            });
      }finally {
        loading?.dismiss();
      }
    };

    /* Watchers */
    const unwatch = store.watch(
        (state, getters) => getters['staff/isMenuVisible'],
        async(newValue) => {
          if(newValue) {
            await menu.value?.$el.open();
          }else {
            await menu.value?.$el.close();
          }
        },
    );

    return {
      /* Component properties */
      menu,
      activeMenuItem,

      /* Event handlers */
      menuItemClicked,
      menuClosed,
      logout,

      /* Icons from */
      homeOutline,
      searchOutline,
      personOutline,
      settingsOutline,
      carSportOutline,
    };
  },
});
</script>
<style scoped>
ion-menu {
  min-width: 170px !important;
  max-width: 170px !important;
  width: 170px !important;
}

ion-menu::part(backdrop) {
  background: red !important;
}
</style>