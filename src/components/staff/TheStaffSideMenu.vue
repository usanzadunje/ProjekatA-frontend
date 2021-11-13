<template>
  <div class="h-full flex flex-col justify-between safe-pt safe-pb">
    <div>
      <div
          class="flex pb-0.5"
          :class="[activeMenuItem === 'dashboard' ? 'border-b-2 border-user-selected-color user-selected-color' : 'text-gray-800']"
          @click="menuItemClicked('staff.dashboard')"
      >
        <ion-icon
            slot="icon-only"
            :icon="statsChartOutline"
            class="text-2xl mr-2"
        ></ion-icon>
        <span class="text-xl">
              {{ $t('staff.dashboard') }}
          </span>
      </div>
      <div
          v-if="isOwner"
          class="flex items-center pb-0.5 mt-4"
          :class="[activeMenuItem === 'place' ? 'border-b-2 border-user-selected-color user-selected-color' : 'text-gray-800']"
          @click="menuItemClicked('owner.place.info')"
      >
        <ion-icon
            slot="icon-only"
            :icon="homeOutline"
            class="text-2xl mr-2"
        ></ion-icon>
        <span class="text-xl">
              {{ $t('owner.place') }}
            </span>
      </div>
      <div
          v-if="isOwner"
          class="flex items-center pb-0.5 mt-4"
          :class="[activeMenuItem === 'staff' ? 'border-b-2 border-user-selected-color user-selected-color' : 'text-gray-800']"
          @click="menuItemClicked('owner.staff')"
      >
        <ion-icon
            slot="icon-only"
            :icon="peopleOutline"
            class="text-2xl mr-2"
        ></ion-icon>
        <span class="text-xl">
              {{ $t('owner.staff') }}
            </span>
      </div>
      <div
          class="flex items-center pb-0.5 mt-4"
          :class="[activeMenuItem === 'profile' ? 'border-b-2 border-user-selected-color user-selected-color' : 'text-gray-800']"
          @click="menuItemClicked('staff.profile')"
      >
        <ion-icon
            slot="icon-only"
            :icon="personOutline"
            class="text-2xl mr-2"
        ></ion-icon>
        <span class="text-xl">
              {{ $t('profile') }}
        </span>
      </div>
      <div
          class="flex items-center pb-0.5 mt-4"
          :class="[activeMenuItem === 'schedule' ? 'border-b-2 border-user-selected-color user-selected-color' : 'text-gray-800']"
          @click="menuItemClicked('staff.schedule')"
      >
        <ion-icon
            slot="icon-only"
            :icon="calendarOutline"
            class="text-2xl mr-2"
        ></ion-icon>
        <span class="text-xl">
              {{ $t('schedule') }}
        </span>
      </div>
      <div
          class="flex items-center pb-0.5 mt-4"
          :class="[activeMenuItem === 'settings' ? 'border-b-2 border-user-selected-color user-selected-color' : 'text-gray-800']"
          @click="menuItemClicked('staff.settings')"
      >
        <ion-icon
            slot="icon-only"
            :icon="settingsOutline"
            class="text-2xl mr-2"
        ></ion-icon>
        <span class="text-xl">
              {{ $t('settings') }}
        </span>
      </div>
    </div>
    <div>
      <div
          class="flex items-center"
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
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useRouter, useRoute }       from 'vue-router';
import { useStore }                  from 'vuex';
import {
  IonIcon,
  menuController,
}                                    from '@ionic/vue';

import {
  statsChartOutline,
  toggleOutline,
  personOutline,
  settingsOutline,
  homeOutline,
  peopleOutline,
  calendarOutline,
  logOutOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'TheStaffSideMenu',
  components: {
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

      await menuController.close();
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
      calendarOutline,
      logOutOutline,
    };
  },
});

</script>
<style scoped>
ion-item {
  --background: #F3F4F6;
}

#colorPickerResetText {
  color: red !important;
}
</style>
