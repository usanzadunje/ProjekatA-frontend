<template>
  <div>
    <div class="ml-4 mt-8 text-center">
      <h1 class="main-toolbar-heading text-xl">{{ cafe.name }}</h1>
    </div>

    <div id="map" class="mx-4 my-2">
    </div>

    <div class="ml-4 mt-6 text-center">
      <h1 class="main-toolbar-heading text-xl">{{ cafe.address + ', ' + cafe.city }}</h1>
    </div>
  </div>
</template>
l
<script>
import { defineComponent, onMounted } from 'vue';
import { loadingController }          from '@ionic/vue';

import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';

import { sleep } from '@/utils/helpers';

export default defineComponent({
  name: "GoogleMap",
  props: {
    cafe: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    /* Component properties */
    let mapContainerBoundingRect = null;

    /* Lifecycle hooks */
    onMounted(async() => {
      const loading = await loadingController
          .create({
            cssClass: 'custom-loading',
            message: 'Ucitava se...',
            duration: 400,
          });
      loading.present();
      await sleep(350);

      mapContainerBoundingRect = document.getElementById('map').getBoundingClientRect();
      await CapacitorGoogleMaps.create({
        width: mapContainerBoundingRect.width - 4,
        height: mapContainerBoundingRect.height - 4,
        x: mapContainerBoundingRect.x + 2,
        y: mapContainerBoundingRect.y + 2,
        latitude: 43.317862492567,
        longitude: 21.895785976058143,
        zoom: 20,
      });

      let name = props.cafe.name;
      let address = props.cafe.address + " ," + props.cafe.city;

      CapacitorGoogleMaps.addListener("onMapReady", async function() {
        await CapacitorGoogleMaps.addMarker({
          latitude: 43.317862492567,
          longitude: 21.895785976058143,
          title: "" + name,
          snippet: "" + address,
        });

        await CapacitorGoogleMaps.setMapType({
          "type": "normal",
        });
      });
    });
  },
  unmounted() {
    CapacitorGoogleMaps.close();
  },
});
</script>

<style lang="css" scoped>
#map {
  height: 300px;
  border: 1px solid black;
}
</style>