<template>
  <div class="my-6 px-8">
    <ion-segment :value="route.name" class="bg-gray-100" mode="ios">
      <ion-segment-button
          v-for="(segment, index) in segments"
          :key="index"
          :value="segment.value"
          mode="ios"
          @click="changePage($event)"
      >
        <ion-label>{{ $t(segment.text) }}</ion-label>
      </ion-segment-button>
    </ion-segment>
  </div>
</template>

<script>
import { defineComponent }     from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,

}                              from '@ionic/vue';

export default defineComponent({
  name: 'TheSegmentNavigation',
  components: {
    IonSegment,
    IonSegmentButton,
    IonLabel,

  },
  props: {
    segments: {
      type: Array,
      default: null,
      required: true,
    },
  },
  setup() {
    /* Global properties */
    const route = useRoute();
    const router = useRouter();

    /* Component properties */

    /* Composables */


    /* Event handlers */
    const changePage = (event) => {
      if(route.name !== event.target.value) {
        router.push({ name: event.target.value });
      }
    };

    return {
      /* Global properties */
      route,

      /* Component properties */

      /* Event handlers */
      changePage,

      /* Icons */
    };
  },
});

</script>
<style scoped>
div {
  background: var(--show-paint);
}
</style>
