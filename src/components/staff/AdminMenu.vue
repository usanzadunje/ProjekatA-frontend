<template>
  <ion-menu
      id="admin-menu"
      content-id="admin-outlet"
      swipe-gesture="true"
  >
    <div class="pb-2 pl-2 pr-4 h-full flex flex-col justify-between">
      <div>
        <div
            class="flex flex-row flex-1 items-center mt-4"
            :class="[activeMenuItem === 'dashboard' ? 'border-b-2 border-yellow-600 text-yellow-600' : 'text-gray-800']"
            @click="menuItemClicked('staff.dashboard')"
        >
          <ion-icon
              slot="icon-only"
              :icon="statsChartOutline"
              class="text-2xl mr-2"
          ></ion-icon>
          <span class="pb-1 text-xl">
              {{ $t('staff.dashboard') }}
            </span>
        </div>
        <div
            v-if="isOwner"
            class="flex flex-row flex-1 items-center mt-4"
            :class="[activeMenuItem === 'place' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-800']"
            @click="menuItemClicked('owner.place.info')"
        >
          <ion-icon
              slot="icon-only"
              :icon="homeOutline"
              class="text-2xl mr-2"
          ></ion-icon>
          <span class="pb-1 text-xl">
              {{ $t('owner.place') }}
            </span>
        </div>
        <div
            v-if="isOwner"
            class="flex flex-row flex-1 items-center mt-4"
            :class="[activeMenuItem === 'staff' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-800']"
            @click="menuItemClicked('owner.staff')"
        >
          <ion-icon
              slot="icon-only"
              :icon="peopleOutline"
              class="text-2xl mr-2"
          ></ion-icon>
          <span class="pb-1 text-xl">
              {{ $t('owner.staff') }}
            </span>
        </div>
        <div
            class="flex flex-row flex-1 items-center mt-4"
            :class="[activeMenuItem === 'settings' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-800']"
            @click="menuItemClicked('staff.settings')"
        >
          <ion-icon
              slot="icon-only"
              :icon="personOutline"
              class="text-2xl mr-2"
          ></ion-icon>
          <span class="pb-1 text-xl">
              {{ $t('profile') }}
            </span>
        </div>
      </div>
      <div class="">
        <div
            class="flex flex-row flex-1 items-center mt-4"
            @click="this.$store.dispatch('auth/logout')"
        >
          <ion-icon
              slot="icon-only"
              :icon="logOutOutline"
              class="text-2xl mr-2"
          ></ion-icon>
          <span class="pb-1 text-xl">
              {{ $t('logout') }}
            </span>
        </div>
      </div>
    </div>
  </ion-menu>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useRouter, useRoute }       from 'vue-router';
import { useStore }                  from 'vuex';
import {
  IonMenu,
  IonIcon,

}                                    from '@ionic/vue';


import {
  statsChartOutline,
  toggleOutline,
  personOutline,
  settingsOutline,
  homeOutline,
  peopleOutline,
  logOutOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'AdminMenu',
  components: {
    IonMenu,
    IonIcon,
  },
  props: {},
  setup() {
    /* Global properties */
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    /* Component properties */
    const activeMenuItem = computed(() => {
      return route.name.split('.')[1];
    });
    const isOwner = computed(() => store.getters['auth/isOwner']);

    /* Composables */

    /* Event handlers */
    const menuItemClicked = async(menuItemName) => {
      await router.push({ name: menuItemName });
    };

    return {
      /* Component properties */
      activeMenuItem,
      isOwner,

      /* Event handlers */
      menuItemClicked,

      /* Icons */
      statsChartOutline,
      toggleOutline,
      personOutline,
      settingsOutline,
      homeOutline,
      peopleOutline,
      logOutOutline,
    };
  },
});

</script>
<style scoped>
ion-menu::part(container) {
  width: 13rem !important;
  margin-top: 3rem;
  height: calc(100% - 3rem);
  background: #F3F4F6 !important;
  /*border-bottom-right-radius: 35px !important;*/
  /*border-top-right-radius: 35px !important;*/
  box-shadow: none;
}

ion-menu::part(backdrop) {
  background: transparent !important;
}
</style>
