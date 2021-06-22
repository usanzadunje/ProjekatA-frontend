<template>
  <div class="relative w-full">
    <div ref="map" class="absolute w-full modal-positioning" id="map"></div>
  </div>
</template>
l
<script>
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';

export default {
  name: "GoogleMap",
  props: {
    cafe: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    CapacitorGoogleMaps.create({
      width: 325,
      height: 318,
      x: this.$refs.map.getBoundingClientRect().x ?? 17,
      y: this.$refs.map.getBoundingClientRect().y ?? 210,
      latitude: 43.317862492567,
      longitude: 21.895785976058143,
      zoom: 20,
    });

    let name = this.cafe.name;
    let address = this.cafe.address + " ," + this.cafe.city;

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
  },
  unmounted() {
    CapacitorGoogleMaps.close();
  },
};
</script>

<style lang="css" scoped>
#map {
  margin: 2em 1em;
  height: 320px;
  border: 1px solid black;
}
</style>