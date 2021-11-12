<template>
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

    <StaffActivityToggle
        v-if="this.$store.getters['auth/isStaff']"
        class="pl-3"
        :icon-classes="'text-lg mr-1'"
        :text-classes="'text-base'"
    />

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
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonButton,
  IonIcon,
  IonChip,
  IonAvatar,
  IonLabel,
}                          from '@ionic/vue';

import SettingsPopover     from '@/components/staff/popovers/SettingsPopover';
import StaffActivityToggle from '@/components/staff/StaffActivityToggle';

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
    StaffActivityToggle,
  },
  props: {},
  setup() {
    /* Global properties */

    /* Component properties */

    /* Composables */
    const { toggleMenu } = useMenu();
    const { openPopover } = usePopover();
    const { authUser } = useCurrentUser();

    /* Event handlers */
    const openSettingsPopover = (event) => {
      openPopover(SettingsPopover, event, 'staff-settings-popover');
    };


    return {
      /* Component properties */
      authUser,

      /* Event handlers */
      toggleMenu,
      openSettingsPopover,

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
