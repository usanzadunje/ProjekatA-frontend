<template>
  <ion-header class="ion-no-border">
    <div class="user-header-bg">
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
            <Avatar
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
import { computed, defineComponent } from 'vue';
import { useStore }                  from 'vuex';
import {
  IonHeader,
  IonIcon,
  IonToolbar,
  IonButton,
}                                    from '@ionic/vue';

import SettingsPopover from '@/components/user/popovers/SettingsPopover';
import Avatar          from '@/components/Avatar';

import {
  settingsOutline,
}                     from 'ionicons/icons';
import { usePopover } from '@/composables/usePopover';

export default defineComponent({
  name: 'UserProfileHeader',
  components: {
    IonIcon,
    IonHeader,
    IonToolbar,
    IonButton,
    Avatar,
  },
  emits: ['searchFilterChanged'],
  setup(props, { emit }) {
    /* Global properties */
    const store = useStore();
    //Authenticated users
    const authUser = computed(() => {
      return store.getters['auth/authUser'];
    });

    /* Component properties */
    const { openPopover } = usePopover();
    /* Component properties */

    /* Event handlers */
    const searchInputChanged = (e) => {
      emit('searchFilterChanged', e.target.value);
    };
    const openSettingsPopover = async(event) => {
      await openPopover(SettingsPopover, event, 'settings-popover');
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

ion-button {
  padding: 0 0 0.625rem 0 !important;
  margin: 0 -1rem 0 0 !important;
}

.user-header-bg {
  background: var(--user-selected-color) url('https://resize.rs/storage/img/users/header-background.png') no-repeat;
  background-blend-mode: multiply;
  border-bottom-left-radius: 15px !important;
  border-bottom-right-radius: 15px !important;;
}
</style>