<template>
  <div>
    <div class="background-white cafe-card-border-radius">
      <div class="p-4 flex">
        <ion-thumbnail slot="start">
          <ion-skeleton-text animated></ion-skeleton-text>
        </ion-thumbnail>
        <div class="ml-3.5 w-2/3">
          <h2>
            <ion-skeleton-text animated style="width: 70%"></ion-skeleton-text>
          </h2>
          <p>
            <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
          </p>
        </div>
      </div>
      <hr class="card-horizontal-ruler">
      <div class="px-3 pt-3 pb-2.5 flex justify-between">
        <div class="flex w-20 ml-1">
          <ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
        </div>
        <div class="flex w-10">
          <ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent }               from 'vue';
import { IonSkeletonText, IonThumbnail } from '@ionic/vue';

export default defineComponent({
  name: "SkeletonPlaceCard",
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
</style>