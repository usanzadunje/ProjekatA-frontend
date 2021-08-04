<template>
  <div ref="content" class="absolute bottom-0 w-full ion-padding">
    <div class="ml-4 mt-8 text-center">
      <h1 class="main-toolbar-heading text-xl">{{ cafe.name }}</h1>
    </div>

    <div ref="map" id="map" class="mx-4 my-2">
    </div>

    <div class="ml-4 mt-6 text-center">
      <h1 class="main-toolbar-heading text-xl">Distance : {{ distance }}m</h1>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { useStore }              from 'vuex';
import { useI18n }               from 'vue-i18n';
import { loadingController }                            from '@ionic/vue';

import CafeService               from '@/services/CafeService';

import { useGeolocation }        from '@/composables/useGeolocation';
import { useToastNotifications } from '@/composables/useToastNotifications';

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
    /* Global properties */
    const store = useStore();

    /* Component properties */
    let mapContainerBoundingRect = null;
    let distance = ref(0);
    let map = ref(null);
    let content = ref(null);

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
          latitude: Number(props.cafe.latitude) ?? 43.317862492567,
          longitude: Number(props.cafe.longitude) ?? 21.895785976058143,
          zoom: 16,
          liteMode: true,
        });
      }catch(e) {
        showErrorToast(
            null,
            {
              pushNotificationPermission: t('warningGoogleMapsError'),
            });
        loading.dismiss();
      }

      const height = content.value?.getBoundingClientRect().height ?? 460;
      document.documentElement.style.setProperty('--map-modal-height', height + 'px');

      CapacitorGoogleMaps.addListener("onMapReady", async function() {
        distance.value = Math.round(CafeService.getDistance(props.cafe.latitude, props.cafe.longitude));

        await CapacitorGoogleMaps.addMarker({
          latitude: Number(props.cafe.latitude) ?? 43.317862492567,
          longitude: Number(props.cafe.longitude) ?? 21.895785976058143,
          title: props.cafe.name,
          snippet: props.cafe.address + " ," + props.cafe.city,
        });

        await CapacitorGoogleMaps.addMarker({
          latitude: store.getters['global/position'].latitude,
          longitude: store.getters['global/position'].longitude,
          title: 'Your postion',
          snippet: 'This is your current position',
          opacity: 2.5,
        });

        await CapacitorGoogleMaps.setMapType({
          "type": "normal",
        });
      });

      loading.dismiss();
    });
    onUnmounted(() => {
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