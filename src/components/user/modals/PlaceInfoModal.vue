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
          :disabled="false"
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
import { defineComponent, ref, computed, onUnmounted } from 'vue';
import { useRoute, useRouter }                         from 'vue-router';
import { useStore }                                    from 'vuex';
import { useI18n }                                     from 'vue-i18n';
import {
  IonIcon,
  IonButton,
}                                                      from '@ionic/vue';

import PlaceInfoBody             from '@/components/place/PlaceInfoBody';
import PlaceInfoModalImageSlider from '@/components/user/sliders/PlaceInfoModalImageSlider';
import AppModal                  from '@/components/AppModal';
import PlaceSubscriptionModal    from '@/components/user/modals/PlaceSubscriptionModal';

import { useModal }              from '@/composables/useModal';
import { useCache }              from '@/composables/useCache';
import { useToastNotifications } from '@/composables/useToastNotifications';

import {
  notifications,
  notificationsOutline,

} from 'ionicons/icons';

import { Capacitor } from '@capacitor/core';

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
  emits: ['dismiss', 'closed', 'userToggledSubscription'],
  setup(props) {
    /* Global properties and methods */
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    /* Component properties */
    const showSkeleton = ref(true);

    const isUserSubscribed = computed(() => store.getters['user/isSubscribedTo'](props.place.id));
    const placeAdditionalInfo = computed(() => store.getters['user/getPlaceAdditionInfo'](props.place.id));
    const isSubButtonDisabled = ref(true);
    const logoPath = computed(() => {
      if(props.place.images?.length > 0) {
        return props.place.images[0]?.path;
      }else {
        return '/places/default_place_logo.png';
      }
    });

    /* Composables */
    const { isModalOpen, openModal, showModal, hideModal } = useModal();
    const { getCachedOrFetchPlaceAdditionalInfo } = useCache();
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();

    /* Lifecycle hooks */
    (async() => {
      try {
        await getCachedOrFetchPlaceAdditionalInfo(props.place.id);
      }catch(e) {
        showErrorToast(
            null,
            {
              dataFetchingError: t('dataFetchingError'),
            });
      }

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
    };
  },
});
</script>
<style scoped>

</style>