<template>
  <div>
    <div id="map"></div>
  </div>
</template>
l
<script>
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';

export default {
  name: "GoogleMap",
  mounted() {
    CapacitorGoogleMaps.create({
      width: 325,
      height: 248,
      x: 17,
      y: 210,
      latitude: 43.317862492567,
      longitude: 21.895785976058143,
      zoom: 20,
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
  height: 250px;
  border: 1px solid black;
}
</style>