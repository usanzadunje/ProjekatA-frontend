<template>
  <div class="sticky top-0 z-40">
    <div class="w-full h-12 bg-gray-100 flex items-center justify-between">
      <ion-button
          class="reset-button-size pl-2"
          slot="icon-only"
          fill="clear"
          @click="toggleMenu"
      >
        <ion-icon
            slot="icon-only"
            :icon="menuOutline"
            class="text-2xl text-black"
        ></ion-icon>
      </ion-button>

      <div class="flex items-center">
        <ion-label class="settings-fade-text">{{ isDarkModeOn ? 'Dark' : 'Light' }}</ion-label>
        <ion-toggle
            :checked="isDarkModeOn"
            mode="md"
            class="dark-toggle-checked"
            @ionChange="toggleDarkMode($event)"
        ></ion-toggle>

        <AppLanguagePicker class="ml-3"/>
      </div>

      <ion-chip class="ion-margin-start" @click="openSettingsPopover($event)">
        <ion-avatar class="flex-shrink-0">
          <img
              :src="authUser?.avatar ?? backendStorageURL + '/users/default_avatar.png'"
              alt="Profile picture"
              class="w-full h-full object-cover"
          >
        </ion-avatar>
        <ion-label class="break-all">
          {{ authUser?.username || authUser?.fname }}
        </ion-label>
      </ion-chip>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useStore }                  from 'vuex';
import {
  IonButton,
  IonIcon,
  IonChip,
  IonAvatar,
  IonLabel,
  IonToggle,
}                                    from '@ionic/vue';

import SettingsPopover   from '@/components/staff/popovers/SettingsPopover';
import AppLanguagePicker from '@/components/AppLanguagePicker';

import { useMenu }    from '@/composables/useMenu';
import { usePopover } from '@/composables/usePopover';

import {
  menuOutline,
}                         from 'ionicons/icons';
import { useCurrentUser } from '@/composables/useCurrentUser';


export default defineComponent({
  name: 'TheStaffHeader',
  components: {
    IonButton,
    IonIcon,
    IonChip,
    IonAvatar,
    IonLabel,
    IonToggle,
    AppLanguagePicker,
  },
  props: {},
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const isDarkModeOn = computed(() => store.getters['user/darkMode']);

    /* Composables */
    const { toggleMenu } = useMenu();
    const { openPopover } = usePopover();
    const { authUser } = useCurrentUser();

    /* Event handlers */
    const openSettingsPopover = (event) => {
      openPopover(SettingsPopover, event, 'staff-settings-popover');
    };
    const toggleDarkMode = async(e) => {
      if(!e.target.checked) {
        await store.dispatch('user/setDarkMode', false);
      }else {
        await store.dispatch('user/setDarkMode', true);
      }
    };


    return {
      /* Component properties */
      isDarkModeOn,
      authUser,

      /* Event handlers */
      toggleMenu,
      openSettingsPopover,
      toggleDarkMode,

      /* Icons */
      menuOutline,
    };
  },
});

</script>
<style scoped>
ion-item {
  --background: #F3F4F6 !important;
}
</style>
