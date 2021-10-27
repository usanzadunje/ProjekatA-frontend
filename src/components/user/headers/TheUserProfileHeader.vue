<template>
  <ion-header class="ion-no-border">
    <div class="user-header-bg">
      <ion-toolbar>
        <div class="px-4 py-3 mb-3 relative">
          <div class="flex justify-between items-center mt-2">
            <p class="user-profile-header-heading mt-1">{{ $t('profile') }}</p>
            <ion-button
                fill="clear"
                class="reset-button-size"
                @click="openSettingsPopover($event)"
            >
              <ion-icon
                  slot="icon-only"
                  :icon="settingsOutline"
                  class="text-white flex"
              ></ion-icon>
            </ion-button>
          </div>
          <div class="mt-7 flex justify-start">
            <AppAvatar
                :avatar-path="authUser?.avatar"
                :avatar-img-classes="'profile-avatar'"
                :altText="`Profile picture of user ${authUser?.fname} ${authUser?.lname}`"
            />
            <div class="ml-3 mt-3 user-profile-user-name">
              <div v-if="authUser?.username || authUser?.fname || authUser?.lname">
                <h2 v-if="authUser?.fname || authUser?.lname" class="user-profile-user-name">
                  {{ `${authUser?.fname || ''} ${authUser?.lname || ''}` }}
                </h2>
                <p v-if="authUser?.username" class="user-profile-username">{{ authUser?.username }}</p>
              </div>
              <a v-else @click="$router.push({ name: 'edit' })" class="user-profile-username underline lowercase">
                {{ $t('noSettingsText') }}
              </a>
            </div>
          </div>
        </div>
      </ion-toolbar>
    </div>
  </ion-header>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonHeader,
  IonIcon,
  IonToolbar,
  IonButton,
}                                    from '@ionic/vue';

import UserSettingsPopover from '@/components/user/popovers/UserSettingsPopover';
import AppAvatar           from '@/components/AppAvatar';

import {
  settingsOutline,
}                         from 'ionicons/icons';
import { usePopover }     from '@/composables/usePopover';
import { useCurrentUser } from '@/composables/useCurrentUser';

export default defineComponent({
  name: 'TheUserProfileHeader',
  components: {
    IonIcon,
    IonHeader,
    IonToolbar,
    IonButton,
    AppAvatar,
  },
  emits: ['searchFilterChanged'],
  setup(props, { emit }) {
    /* Global properties */
    /* Composables */
    const { openPopover } = usePopover();
    const { authUser } = useCurrentUser();

    /* Component properties */

    /* Event handlers */
    const searchInputChanged = (e) => {
      emit('searchFilterChanged', e.target.value);
    };
    const openSettingsPopover = async(event) => {
      await openPopover(UserSettingsPopover, event, 'settings-popover');
    };


    return {
      /* Global properties */
      authUser,

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
ion-header {
  --background: transparent;
}

ion-toolbar {
  --background: transparent;
}

.user-header-bg {
  background: var(--user-selected-color) url('https://resize.rs/storage/img/users/header-background.png') no-repeat;
  background-blend-mode: multiply;
  border-bottom-left-radius: 15px !important;
  border-bottom-right-radius: 15px !important;;
}
</style>