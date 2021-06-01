<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <div class="px-4 py-3 mt-2">
        <div class="flex justify-between">
          <p class="main-toolbar-fade-text">Cao, {{ authUser.fname ?? 'Guest' }}!</p>
          <ion-button fill="clear" href="/login">
            <ion-icon :icon="notificationIcon" class="text-2xl text-gray-400"></ion-icon>
          </ion-button>
        </div>
        <h1 class="main-toolbar-heading text-xl">{{ mainHeading }}</h1>
        <div class="mt-5 flex justify-around items-start">
          <ion-searchbar
              class="main-toolbar-search-text main-toolbar-search-bg align-middle"
              placeholder="Unesite ime kafica"
              @ionChange="searchInputChanged"
              @keyup.enter="$emit('searchEnterPressed', $event)"
              enterkeyhint="search"
          ></ion-searchbar>
          <ion-icon v-if="hasSearchFilter" :icon="optionsOutline"
                    class="text-3xl text-gray-400 align-bottom mt-1 md filter-icon"></ion-icon>
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
    hasSearchFilter: Boolean,
    mainHeading: String,
    notificationIcon: String,
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
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
</style>
