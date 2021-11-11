<template>
  <div class="h-full flex flex-col justify-between safe-pt safe-pb">
    <div>
      <div
          class="flex pb-0.5"
          :class="[activeMenuItem === 'dashboard' ? 'border-b-2 border-yellow-600 text-yellow-600' : 'text-gray-800']"
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
          :class="[activeMenuItem === 'place' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-800']"
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
          :class="[activeMenuItem === 'staff' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-800']"
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
          :class="[activeMenuItem === 'settings' ? 'border-b-2 border-purple-700 text-purple-700' : 'text-gray-800']"
          @click="menuItemClicked('staff.settings')"
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

      <StaffActivityToggle
          v-if="this.$store.getters['auth/isStaff']"
          class="w-full mt-4"
          :icon-classes="'pb-1 text-2xl mr-2'"
          :text-classes="'pb-1 text-xl'"
      />

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

import StaffActivityToggle from '@/components/staff/StaffActivityToggle';

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
  name: 'TheStaffSideMenu',
  components: {
    IonIcon,
    StaffActivityToggle,
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
      logOutOutline,
    };
  },
});

</script>
<style scoped>

</style>
