<template>
  <div>
    <div
        class="mb-6 mt-0 mx-auto px-5 pb-4 pt-5 w-5/6 main relative"
    >
      <div class="absolute top-1.5 right-3 z-40">
        <ion-skeleton-text animated class="w-4 h-4 rounded-full"></ion-skeleton-text>
      </div>

      <div>
        <div class="flex items-center justify-center">
          <ion-thumbnail class="profile-avatar flex-shrink-0">
            <ion-skeleton-text animated></ion-skeleton-text>
          </ion-thumbnail>

          <div class="ml-8 w-4/5">
            <h3 class="main-heading-smaller">
              <ion-skeleton-text animated class="w-1/3"></ion-skeleton-text>
            </h3>
            <h3 class="main-heading-smaller">
              <ion-skeleton-text animated class="h-3 w-2/3"></ion-skeleton-text>
            </h3>
            <h2 class="secondary-heading">
              <ion-skeleton-text animated class="h-3 w-2/3"></ion-skeleton-text>
            </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent }               from 'vue';
import { IonSkeletonText, IonThumbnail } from '@ionic/vue';

export default defineComponent({
  name: "StaffCardSkeleton",
  components: {
    IonSkeletonText,
    IonThumbnail,
  },
  setup() {

    return {};
  },
});
</script>

<style scoped>
.main {
  background: var(--user-selected-color);
  --background-rgb: 0, 0, 0;
  border-radius: 20px !important;
}
</style>