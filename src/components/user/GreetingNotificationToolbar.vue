<template>
  <div class="px-4 py-3 mt-2">
    <div class="flex justify-between">
      <p class="text-sm main-toolbar-fade-text">Cao, Marija!</p>
      <ion-icon :icon="notificationsOutline" class="text-2xl icon-fade-color "></ion-icon>
    </div>
    <h1 class="main-toolbar-heading text-xl">Pronadji slobodno mesto</h1>
    <div class="mt-5 flex justify-around items-start">
      <ion-searchbar class="main-toolbar-search-text main-toolbar-search-bg align-middle" placeholder="Unesite ime kafica"></ion-searchbar>
      <ion-icon :icon="optionsOutline" class="text-3xl icon-fade-color align-bottom mt-1 md filter-icon"></ion-icon>
    </div>
  </div>
</template>

<script>
import { defineComponent }                      from 'vue';
import { IonIcon, IonSearchbar }                from '@ionic/vue';
import { notificationsOutline, optionsOutline } from '@/assets/icons';

export default defineComponent({
  name: 'GreetingNotificationToolbar',
  components: {
    IonIcon,
    IonSearchbar,
  },
  setup() {

    return {
      notificationsOutline,
      optionsOutline,
    };
  },
});
</script>

<style scoped>

</style>