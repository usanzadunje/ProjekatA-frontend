<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <div class="px-4 pt-3 pb-2 mt-2 md header-padding-bottom">
        <div v-show="loggedIn" class="flex justify-between">
          <p class="main-toolbar-fade-text">Cao {{ authUser.full_name }}!</p>
          <ion-button fill="clear" href="/">
            <ion-icon :icon="notificationIcon" class="text-2xl text-gray-400"></ion-icon>
          </ion-button>
        </div>
        <div v-show="!loggedIn" class="flex justify-around">
          <ion-button fill="clear" routerLink="/login">
            <p class="main-toolbar-fade-text uppercase">Login</p>
          </ion-button>
          <ion-button fill="clear" routerLink="/register">
            <p class="main-toolbar-fade-text uppercase">Register</p>
          </ion-button>
        </div>

        <h1 class="main-toolbar-heading text-xl">{{ mainHeading }}</h1>

        <div>
          <ion-searchbar
              :value="searchTerm"
              placeholder="Unesite ime kafica"
              @ionChange="searchInputChanged"
              @keyup.enter="$emit('searchEnterPressed', $event)"
              enterkeyhint="search"
          ></ion-searchbar>
        </div>
        <slot></slot>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import { defineComponent } from 'vue';

import { mapGetters } from 'vuex';

import { IonHeader, IonIcon, IonSearchbar, IonToolbar, IonButton } from '@ionic/vue';

import { optionsOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'UserHeader',
  components: {
    IonIcon,
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonButton,
  },
  props: {
    // hasSearchFilter: Boolean,
    mainHeading: String,
    notificationIcon: String,
    searchTerm: String,
  },
  computed: {
    ...mapGetters('auth', ['authUser', 'loggedIn']),
  },
  emits: ['searchFilterChanged', 'searchEnterPressed'],
  setup(props, { emit }) {
    /* Component properties */

    /* Event handlers */
    const searchInputChanged = (e) => {
      emit('searchFilterChanged', e.target.value);
    };


    return {
      /* Component properties */

      /* Event handlers */
      searchInputChanged,

      /* Icons from */
      optionsOutline,
    };
  },
});
</script>
<style scoped>
ion-button {
  padding: 0 0 0.75rem 0 !important;
  margin: 0 -1rem 0 0 !important;
}

ion-searchbar {
}
</style>
