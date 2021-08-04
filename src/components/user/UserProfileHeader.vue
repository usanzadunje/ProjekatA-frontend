<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <div class="px-4 py-3 mt-3 mb-3 relative">
        <div class="flex justify-between">
          <p class="user-profile-header-heading mt-1">{{ $t('profile') }}</p>
          <ion-button fill="clear" @click="openSettingsPopover($event)">
            <ion-icon
                slot="icon-only"
                :icon="settingsOutline"
                class="text-white"
            ></ion-icon>
          </ion-button>
        </div>
        <div class="mt-5 flex justify-start">
          <div>
            <img
                :src="`${authUser.avatar ?? backendStorageURL + '/user/profile-test.png'}`"
                alt="Profile picture of user {{ `${authUser.fname} ${authUser.lname}` }}"
                class="user-profile-picture"
            >
          </div>
          <div class="ml-3 mt-3 user-profile-user-name">
            <div v-if="authUser.username || authUser.fname || authUser.lname">
              <h2 v-if="authUser.fname || authUser.lname" class="user-profile-user-name">
                {{ `${authUser.fname ?? ''} ${authUser.lname ?? ''}` }}</h2>
              <p v-if="authUser.username" class="user-profile-username">{{ authUser.username }}</p>
            </div>
            <a v-else @click="$router.push({ name: 'edit' })" class="user-profile-username underline lowercase">
              {{ $t('noSettingsText') }}
            </a>
          </div>
        </div>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import { defineComponent } from 'vue';
import { mapGetters }      from 'vuex';
import {
  IonHeader,
  IonIcon,
  IonToolbar,
  IonButton,
  popoverController,
}                          from '@ionic/vue';

import SettingsPopover from '@/components/user/popovers/SettingsPopover';

import {
  settingsOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'UserProfileHeader',
  components: {
    IonIcon,
    IonHeader,
    IonToolbar,
    IonButton,
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
  },
  emits: ['searchFilterChanged'],
  setup(props, { emit }) {
    /* Component properties */

    /* Event handlers */
    const searchInputChanged = (e) => {
      emit('searchFilterChanged', e.target.value);
    };
    const openSettingsPopover = async(event) => {
      const popover = await popoverController
          .create({
            component: SettingsPopover,
            cssClass: 'custom-popover',
            event: event,
            translucent: true,
            showBackdrop: false,
            mode: 'ios',
          });
      await popover.present();
    };

    return {
      /* Component properties */

      /* Event handlers */
      searchInputChanged,
      openSettingsPopover,

      /* Icons */
      settingsOutline,
    };
  },
});
</script>
<style scoped>
ion-toolbar {
  --background: url('https://resize.rs/storage/img/user/header-background.png') no-repeat;
  background-color: #207DFF;
}

ion-button {
  padding: 0 0 0.625rem 0 !important;
  margin: 0 -1rem 0 0 !important;
}
</style>