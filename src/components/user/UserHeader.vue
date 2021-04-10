<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <div class="px-4 py-3 mt-2">
        <div class="flex justify-between">
          <p class="main-toolbar-fade-text">Cao, Marija!</p>
          <ion-icon :icon="notificationIcon" class="text-2xl icon-fade-color "></ion-icon>
        </div>
        <h1 class="main-toolbar-heading text-xl">{{ mainHeading }}</h1>
        <div class="mt-5 flex justify-around items-start">
          <ion-searchbar class="main-toolbar-search-text main-toolbar-search-bg align-middle"
                         placeholder="Unesite ime kafica"
                         @ionChange="searchInputChanged"
          ></ion-searchbar>
          <ion-icon v-if="hasSearchFilter" :icon="optionsOutline"
                    class="text-3xl icon-fade-color align-bottom mt-1 md filter-icon"></ion-icon>
        </div>

        <slot></slot>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import { defineComponent }                              from 'vue';
import { IonHeader, IonIcon, IonSearchbar, IonToolbar } from '@ionic/vue';
import { notificationsOutline, optionsOutline }         from '@/assets/icons';

export default defineComponent({
  name: 'GreetingNotificationToolbar',
  components: {
    IonIcon,
    IonSearchbar,
    IonHeader,
    IonToolbar,
  },
  props: {
    hasSearchFilter: Boolean,
    mainHeading: String,
    notificationIcon: String
  },
  setup(props, { emit }) {
    /* Event handlers */
    const searchInputChanged = (e) => {
      emit('searchFilterChanged', e.target.value)
    }

    return {
      /* Event handlers */
      searchInputChanged,

      /* Icons */
      notificationsOutline,
      optionsOutline,
    };
  },
});
</script>
