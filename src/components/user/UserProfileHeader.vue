<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <div class="px-4 py-3 mt-3 mb-3">
        <div class="flex justify-between">
          <p class="user-profile-header-heading">Profil</p>
          <ion-button fill="clear" @click="$router.push({ name: 'settings' })">
            <ion-icon
                slot="icon-only"
                :icon="settingsOutlineWhite"
                class="text-2xl"
            ></ion-icon>
          </ion-button>
        </div>
        <div class="mt-5 flex justify-start">
          <div>
            <img
                src="../../assets/img/user/profile-test.png"
                alt="Profile picture of user {{ authUser.full_name }}"
                class="user-profile-picture"
            >
          </div>
          <div class="ml-3 mt-3">
            <h2 class="user-profile-user-name">{{ authUser.full_name }}</h2>
            <p class="user-profile-user-location">Srbija, Nis</p>
          </div>
        </div>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import { defineComponent }                      from 'vue';
import { mapGetters }                           from 'vuex';
import {
  IonHeader,
  IonIcon,
  IonToolbar,
  IonButton,
}                                               from '@ionic/vue';
import { settingsOutlineWhite, optionsOutline } from '@/assets/icons';

export default defineComponent({
  name: 'GreetingNotificationToolbar',
  components: {
    IonIcon,
    IonHeader,
    IonToolbar,
    IonButton,
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
  },
  setup(props, { emit }) {
    /* Event handlers */
    const searchInputChanged = (e) => {
      emit('searchFilterChanged', e.target.value);
    };

    return {
      /* Event handlers */
      searchInputChanged,

      /* Icons */
      settingsOutlineWhite,
      optionsOutline,
    };
  },
});
</script>
<style scoped>
ion-toolbar {
  --background: url('../../assets/img/user/header-background.png') no-repeat;
  background-color: #207DFF;
  border-bottom-left-radius: 33px !important;
  border-bottom-right-radius: 33px !important;
}

ion-button {
  padding: 0 0 0.625rem 0 !important;
  margin: 0 -1rem 0 0 !important;
}
</style>