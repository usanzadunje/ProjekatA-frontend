<template>
  <div class="ion-padding">
    <div class="text-center">
      <h1 class="main-toolbar-heading text-xl">{{ place.name }}</h1>
    </div>

    <div ref="map" id="map" class="mx-4 my-2">
    </div>

    <div class="mt-6 text-center">
      <h1 class="main-toolbar-heading text-xl">Distance : {{ distance }}</h1>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
import { useStore }                                         from 'vuex';
import { useI18n }                                          from 'vue-i18n';
import { loadingController }                                from '@ionic/vue';

import CafeService from '@/services/CafeService';

import { useGeolocation }        from '@/composables/useGeolocation';
import { useToastNotifications } from '@/composables/useToastNotifications';

import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';

import { sleep } from '@/utils/helpers';

export default defineComponent({
  name: "GoogleMap",
  props: {
    place: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    let mapContainerBoundingRect = null;
    const distance = ref('N/A');
    const map = ref(null);
    const content = ref(null);

    /* Composables */
    const { tryGettingLocation } = useGeolocation();
    const { showErrorToast } = useToastNotifications();

    /* Methods */
    const { t } = useI18n({ useScope: 'global' });

    /* Lifecycle hooks */
    onMounted(async() => {
      await tryGettingLocation();

      const loading = await loadingController
          .create({
            cssClass: 'custom-loading',
            message: t('loading'),
            spinner: 'crescent',
            mode: 'ios',
          });
      await loading.present();
      await sleep(400);

      mapContainerBoundingRect = map.value?.getBoundingClientRect();

      try {
        await CapacitorGoogleMaps.create({
          width: mapContainerBoundingRect.width - 4,
          height: mapContainerBoundingRect.height - 4,
          x: mapContainerBoundingRect.x + 2,
          y: mapContainerBoundingRect.y + 2,
          latitude: Number(props.place.latitude) || 43.317862492567,
          longitude: Number(props.place.longitude) || 21.895785976058143,
          zoom: 16,
          liteMode: true,
        });
      }catch(e) {
        showErrorToast(
            null,
            {
              pushNotificationPermission: t('warningGoogleMapsError'),
            });
        await loading.dismiss();
      }

      CapacitorGoogleMaps.addListener("onMapReady", async function() {
        distance.value = `${Math.round(CafeService.getDistance(props.place.latitude, props.place.longitude))}m`;

        await CapacitorGoogleMaps.addMarker({
          latitude: Number(props.place.latitude) || 43.317862492567,
          longitude: Number(props.place.longitude) || 21.895785976058143,
          title: props.place.name,
          snippet: props.place.address + " ," + props.place.city,
        });

        await CapacitorGoogleMaps.addMarker({
          latitude: store.getters['global/position'].latitude,
          longitude: store.getters['global/position'].longitude,
          title: t('me'),
          snippet: t('currentPosition'),
          opacity: 2.5,
        });

        await CapacitorGoogleMaps.setMapType({
          "type": "normal",
        });
      });

      await loading.dismiss();
    });
    onBeforeUnmount(() => {
      CapacitorGoogleMaps.close();
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
  border: 1px solid black;
}
</style>