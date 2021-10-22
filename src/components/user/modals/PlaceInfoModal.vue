<template>
  <div class="px-4 pt-4">
    <div class="ion-item-no-padding-x flex items-center">
      <img
          :src="`${backendStorageURL + logoPath}`"
          :alt="`Logo`"
          class="modal-thumbnail radius-11px"
      >
      <div class="ml-4">
        <h1 class="modal-cafe-name-text">{{ place.name }}</h1>
        <p class="modal-cafe-offers">Kafic, hrana, basta...</p>
      </div>
    </div>

    <PlaceInfoBody
        :place="{...place, working_hours: placeAdditionalInfo?.working_hours}"
        :show-skeleton="showSkeleton"
    />
    <div
        class="mt-6 ion-no-padding"
    >
      <PlaceInfoModalImageSlider
          :images="placeAdditionalInfo?.images?.filter(img => !img.is_logo)"
          :show-skeleton="showSkeleton"
      />
    </div>

    <div class="mt-5 mb-3 flex justify-around">
      <ion-button
          :routerLink="`/places/${place.id}?redirect=${$route.path + '?openModal=true'}`"
          class="flex-shrink mr-2.5 uppercase button-see-more modal-button-border"
          @click="$emit('dismissPlaceInfoModal')"
      >
        {{ $t('more') }}
      </ion-button>
      <ion-button
          @click="openModal(true);$emit('subModalOpened');"
          class="flex-shrink uppercase button-subscribe modal-button-border"
          :disabled="isSubButtonDisabled"
      >
        <ion-icon slot="start"
                  :icon="isUserSubscribed ? notifications : notificationsOutline"
        >

        </ion-icon>
        {{ isUserSubscribed ? $t('subscribed') : $t('subscribe') }}
      </ion-button>
    </div>
  </div>
  <AppModal
      :is-open="isModalOpen"
      css-class="custom-map-modal"
      @didDismiss="openModal(false);$emit('dismissPlaceInfoModal')"
  >
    <PlaceSubscriptionModal
        :place="{'id': place.id, 'name': place.name}"
        @dismiss-subscription-modal="openModal(false);"
        @user-toggled-subscription="$emit('userToggledSubscription')"
    />
  </AppModal>
</template>

<script>
import { defineComponent, ref, computed, onUnmounted } from 'vue';
import { useRoute, useRouter }                         from 'vue-router';
import { useStore }                                    from 'vuex';
import { Capacitor }                                   from '@capacitor/core';
import {
  IonIcon,
  IonButton,
}                                                      from '@ionic/vue';

import PlaceInfoBody             from '@/components/place/PlaceInfoBody';
import PlaceInfoModalImageSlider from '@/components/user/sliders/PlaceInfoModalImageSlider';
import AppModal                  from '@/components/AppModal';
import PlaceSubscriptionModal    from '@/components/user/modals/PlaceSubscriptionModal';

import PlaceService from '@/services/PlaceService';

import { useModal } from '@/composables/useModal';

import {
  notifications,
  notificationsOutline,

}                   from 'ionicons/icons';
import { useCache } from '@/composables/useCache';

export default defineComponent({
  name: 'PlaceInfoModal',
  components: {
    IonIcon,
    IonButton,
    PlaceInfoBody,
    PlaceInfoModalImageSlider,
    AppModal,
    PlaceSubscriptionModal,
  },
  props: {
    place: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismissPlaceInfoModal', 'subModalOpened', 'userToggledSubscription'],
  setup(props) {
    /* Global properties and methods */
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    /* Component properties */

    const isUserSubscribed = ref(false);
    const placeAdditionalInfo = computed(() => store.getters['user/getPlaceAdditionInfo'](props.place.id));
    const isSubButtonDisabled = ref(true);
    const logoPath = computed(() => {
      if(props.place.images?.length > 0) {
        return props.place.images[0]?.path;
      }else {
        return '/places/default_place_logo.png';
      }
    });
    const showSkeleton = ref(true);

    /* Composables */
    const { isModalOpen, openModal } = useModal();
    const { getCachedOrFetchPlaceAdditionalInfo } = useCache();

    /* Lifecycle hooks */
    (async() => {
      await getCachedOrFetchPlaceAdditionalInfo(props.place.id);
      if(store.getters['auth/loggedIn']) {
        try {
          const response = await PlaceService.isUserSubscribed(props.place.id);
          isUserSubscribed.value = !!response.data.subscribed;
        }catch(e) {
          isUserSubscribed.value = false;
        }
        showSkeleton.value = false;
      }else {
        // Without some delay whether from API response above or this timeout, swiper is mounted
        // but doesn't apply styles, there is problem with async loading which is resolved with this "hack"
        setTimeout(() => {
          showSkeleton.value = false;
        }, 50);
      }
    })();
    isSubButtonDisabled.value = Capacitor.getPlatform() === 'web' || !store.getters['auth/loggedIn'];

    onUnmounted(() => {
      if(route.query.openModal) {
        router.replace();
      }
    });

    /* Event handlers */


    return {
      /* Component properties */
      placeAdditionalInfo,
      isSubButtonDisabled,
      isModalOpen,
      isUserSubscribed,
      logoPath,
      showSkeleton,

      /* Computed properties */

      /* Event handlers */
      openModal,

      /* Icons from */
      notifications,
      notificationsOutline,
    };
  },
});
</script>
<style scoped>

</style>