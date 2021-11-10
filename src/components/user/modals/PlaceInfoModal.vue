<template>
  <div class="px-4 pt-4 safe-pb">
    <div class="flex justify-between">
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

      <AppFavoriteButton
          :place="place"
          :icon-size="22"
      />
    </div>

    <PlaceInfoBody
        :place="{...place, working_hours: placeAdditionalInfo?.working_hours}"
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
          @click="$emit('dismiss')"
      >
        {{ $t('more') }}
      </ion-button>
      <ion-button
          @click="openModal(true);hideModal('.custom-modal > .modal-wrapper')"
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
      @didDismiss="openModal(false);showModal('.custom-modal > .modal-wrapper')"
  >
    <PlaceSubscriptionModal
        :place="{'id': place.id, 'name': place.name}"
        @dismiss="openModal(false);"
        @user-toggled-subscription="$emit('userToggledSubscription')"
    />
  </AppModal>
</template>

<script>
import { defineComponent, ref, computed, onUnmounted, toRefs } from 'vue';
import { useRoute, useRouter }                                 from 'vue-router';
import { useStore }                                            from 'vuex';
import {
  IonIcon,
  IonButton,
}                                                              from '@ionic/vue';

import AppFavoriteButton         from '@/components/AppFavoriteButton';
import PlaceInfoBody             from '@/components/place/PlaceInfoBody';
import PlaceInfoModalImageSlider from '@/components/user/sliders/PlaceInfoModalImageSlider';
import AppModal                  from '@/components/AppModal';
import PlaceSubscriptionModal    from '@/components/user/modals/PlaceSubscriptionModal';

import { useModal }         from '@/composables/useModal';
import { useCache }         from '@/composables/useCache';
import { useErrorHandling } from '@/composables/useErrorHandling';

import {
  notifications,
  notificationsOutline,
  star,
  starOutline,

} from 'ionicons/icons';

import { Capacitor } from '@capacitor/core';

export default defineComponent({
  name: 'PlaceInfoModal',
  components: {
    IonIcon,
    IonButton,
    AppFavoriteButton,
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
  emits: ['dismiss', 'closed', 'userToggledSubscription'],
  setup(props) {
    /* Global properties and methods */
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    /* Component properties */
    const showSkeleton = ref(true);
    const { place } = toRefs(props);

    const isUserSubscribed = computed(() => store.getters['user/isSubscribedTo'](place.value.id));
    const placeAdditionalInfo = computed(() => store.getters['user/getPlaceAdditionInfo'](place.value.id));
    const isSubButtonDisabled = ref(true);
    const logoPath = computed(() => {
      if(place.value.images?.length > 0) {
        return place.value.images?.find(image => image.is_logo)?.path ??
            place.value.images[0]?.path;
      }else {
        return '/places/default_place_logo.png';
      }
    });

    /* Composables */
    const { isModalOpen, openModal, showModal, hideModal } = useModal();
    const { getCachedOrFetchPlaceAdditionalInfo } = useCache();
    const { tryCatch } = useErrorHandling();

    /* Lifecycle hooks */
    (async() => {
      await tryCatch(
          async() => {
            await getCachedOrFetchPlaceAdditionalInfo(place.value.id);
          },
          null,
          'dataFetchingError',
      );

      setTimeout(() => {
        showSkeleton.value = false;
      }, 50);
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
      showModal,
      hideModal,

      /* Icons from */
      notifications,
      notificationsOutline,
      star,
      starOutline,
    };
  },
});
</script>
<style scoped>

</style>