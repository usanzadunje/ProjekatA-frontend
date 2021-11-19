<template>
  <div class="px-2 safe-pb">
    <div class="text-center mt-2">
      <h1 class="main-toolbar-heading text-xl">{{ place.name }}</h1>
    </div>

    <div ref="map" id="map" class="mt-4 w-full">
    </div>

    <div class="mt-4 mb-2 text-center">
      <h1 class="main-toolbar-heading text-xl"> {{ `${$t('distance')}: ` + distance }}</h1>
    </div>
  </div>
</template>

<script>
import { defineComponent, onBeforeUnmount, onMounted, ref, toRefs } from 'vue';
import { useI18n }                                                  from 'vue-i18n';
import { loadingController }                                        from '@ionic/vue';

import PlaceService from '@/services/PlaceService';

import { useGeolocation }   from '@/composables/useGeolocation';
import { useErrorHandling } from '@/composables/useErrorHandling';

import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';

export default defineComponent({
  name: "MapModal",
  props: {
    place: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    /* Global properties */
    /* Component properties */
    let mapContainerBoundingRect = null;
    const distance = ref('N/A');
    const map = ref(null);
    const content = ref(null);
    const { place } = toRefs(props);

    /* Composables */
    const { position, tryGettingLocation } = useGeolocation();
    const { t } = useI18n({ useScope: 'global' });
    const { tryCatch } = useErrorHandling();

    /* Methods */
    const createMap = async() => {
      mapContainerBoundingRect = map.value?.getBoundingClientRect();
      await tryCatch(
          async() => {
            let mapReadyEventCount = 0;
            await CapacitorGoogleMaps.create({
              width: Math.round(mapContainerBoundingRect.width),
              height: Math.round(mapContainerBoundingRect.height),
              x: Math.round(mapContainerBoundingRect.x),
              y: Math.round(mapContainerBoundingRect.y),
              latitude: Number(place.value.latitude) || 43.317862492567,
              longitude: Number(place.value.longitude) || 21.895785976058143,
              zoom: 16,
            });

            CapacitorGoogleMaps.addListener("onMapReady", async() => {
              //For some reason this event is called multiple times if map is opened multiple times
              //this is resulting in creation of multiple markers for user position which are visible on the map
              //this is avoided with this condition
              if(++mapReadyEventCount === 1) {
                await CapacitorGoogleMaps.settings({
                  indoorPicker: true,
                  zoomGestures: true,
                });

                await CapacitorGoogleMaps.addMarker({
                  latitude: Number(place.value.latitude) || 43.317862492567,
                  longitude: Number(place.value.longitude) || 21.895785976058143,
                  title: place.value.name,
                  snippet: place.value.address,
                });

                await CapacitorGoogleMaps.addMarker({
                  latitude: position.value.latitude,
                  longitude: position.value.longitude,
                  title: t('me'),
                  snippet: t('currentPosition'),
                  opacity: 2.5,
                });

                await CapacitorGoogleMaps.setMapType({
                  "type": "normal",
                });
              }


            });
          },
          null,
          'warningGoogleMapsError',
      );

    };
    const initializeiOS = async() => {
      await CapacitorGoogleMaps.initialize({
        key: process.env.VUE_APP_IOS_GOOGLEMAPS_KEY,
      });
    };

    /* Lifecycle hooks */
    onMounted(async() => {
      await tryGettingLocation();

      const loading = await loadingController
          .create({
            cssClass: 'custom-loading',
            message: t('loading'),
            spinner: 'crescent',
          });

      await loading.present();

      distance.value = `${Math.round(PlaceService.getDistance(place.value.latitude, place.value.longitude))}m`;

      await initializeiOS();
      await createMap();

      await loading.dismiss();
    });
    onBeforeUnmount(async() => {
      await CapacitorGoogleMaps.close();
    });

    return {
      /* Component properties */
      map,
      content,
      distance,
    };
  },
});
</script>

<style scoped>
#map {
  height: 300px;
}

</style>