<template>
  <div class="sticky top-0 z-40">
    <div class="w-full h-12 bg-gray-100 flex items-center justify-between">
      <ion-button fill="clear" @click="toggleMenu">
        <ion-icon :icon="filterOutline" class="text-2xl text-black"></ion-icon>
      </ion-button>

      <div class="flex items-center">
        <ion-label class="settings-fade-text">{{ isDarkModeOn ? 'Dark' : 'Light' }}</ion-label>
        <ion-toggle
            class="dark-toggle-checked"
            :checked="isDarkModeOn"
            @ionChange="toggleDarkMode($event)"
            mode="md"
        ></ion-toggle>

        <LanguagePicker class="ml-3"/>
      </div>

      <ion-chip class="ion-margin-start" @click="openSettingsPopover($event)">
        <ion-avatar>
          <img
              :src="this.$store.getters['auth/authUser']?.avatar"
              alt="Profile picture"
          >
        </ion-avatar>
        <ion-label>{{ this.$store.getters['auth/displayName'] }}</ion-label>
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

import SettingsPopover from '@/components/staff/popovers/SettingsPopover';
import LanguagePicker  from '@/components/LanguagePicker';

import { useMenu }    from '@/composables/useMenu';
import { usePopover } from '@/composables/usePopover';

import { Keyboard, KeyboardStyle } from '@capacitor/keyboard';

import {
  filterOutline,
} from 'ionicons/icons';


export default defineComponent({
  name: 'StaffHeader',
  components: {
    IonButton,
    IonIcon,
    IonChip,
    IonAvatar,
    IonLabel,
    IonToggle,
    LanguagePicker,
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

    /* Event handlers */
    const openSettingsPopover = (event) => {
      openPopover(SettingsPopover, event);
    };
    const toggleDarkMode = async(e) => {
      if(!e.target.checked) {
        await store.dispatch('user/setDarkMode', false);

        Keyboard?.setStyle({
          style: KeyboardStyle.Light,
        });

      }else {
        await store.dispatch('user/setDarkMode', true);

        Keyboard?.setStyle({
          style: KeyboardStyle.Dark,
        });
      }
    };


    return {
      /* Component properties */
      isDarkModeOn,

      /* Event handlers */
      toggleMenu,
      openSettingsPopover,
      toggleDarkMode,

      /* Icons */
      filterOutline,
    };
  },
});

</script>
<style scoped>
ion-item {
  --background: #F3F4F6 !important;
}
</style>
