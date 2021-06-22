<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <div class="px-4 py-3 mt-3 mb-3">
        <div class="flex justify-between">
          <p class="user-profile-header-heading mt-1">Profil</p>
          <ion-button fill="clear" @click="$router.push({ name: 'settings' })">
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
                :src="`${backendStorageURL}/user/profile-test.png`"
                alt="Profile picture of user {{ authUser.full_name }}"
                class="user-profile-picture"
            >
          </div>
          <div class="ml-3 mt-3 user-profile-user-name">
            <h2 class="user-profile-user-name">{{ authUser.full_name }}</h2>
            <p v-if="authUser.username" class="user-profile-username">{{ authUser.username }}</p>
            <a v-if="!authUser.username" @click="$router.push({ name: 'settings' })" class="user-profile-username underline">set username</a>
          </div>
        </div>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import { defineComponent } from 'vue';

import { mapGetters } from 'vuex';
import {
  IonHeader,
  IonIcon,
  IonToolbar,
  IonButton,
}                     from '@ionic/vue';

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
    /* Event handlers */
    const searchInputChanged = (e) => {
      emit('searchFilterChanged', e.target.value);
    };

    return {
      /* Event handlers */
      searchInputChanged,

      /* Icons */
      settingsOutline,
    };
  },
});
</script>
<style scoped>
ion-toolbar {
  --background: url('http://192.168.1.203:8200/storage/img/user/header-background.png') no-repeat;
  background-color: #207DFF;
  border-bottom-left-radius: 33px !important;
  border-bottom-right-radius: 33px !important;
}

ion-button {
  padding: 0 0 0.625rem 0 !important;
  margin: 0 -1rem 0 0 !important;
}
</style>