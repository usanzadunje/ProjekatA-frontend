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

    <CafeInfoBody
        :place="place"
        :show-skeleton="showSkeleton"
    />
    <div
        v-if="place.images?.length !== 0"
        class="mt-6 ion-no-padding"
    >
      <PlaceImageModalSlider
          :images="place.images?.filter(img => !img.is_logo)"
          :show-skeleton="showSkeleton"
      />
    </div>

    <div class="mt-5 mb-3 flex justify-around">
      <ion-button
          class="flex-shrink mr-2.5 uppercase button-see-more modal-button-border"
          :routerLink="`/cafes/${place.id}?redirect=${$route.path + '?openModal=true'}`"
          @click="$emit('dismissShortCafeModal')"
      >
        {{ $t('more') }}
      </ion-button>
      <ion-button
          class="flex-shrink uppercase button-subscribe modal-button-border"
          @click="openModal(true);$emit('subModalOpened');"
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
  <Modal
      :is-open="isModalOpen"
      css-class="custom-map-modal"
      @didDismiss="openModal(false);$emit('dismissShortCafeModal')"
  >
    <CafeSubscriptionModal
        :place="{'id': place.id, 'name': place.name}"
        @dismiss-subscription-modal="openModal(false);"
        @user-toggled-subscription="$emit('userToggledSubscription')"
    />
  </Modal>
</template>

<script>
import { defineComponent, ref, computed, toRef, onUnmounted } from 'vue';
import { useRoute, useRouter }                                from 'vue-router';
import { useStore }                                           from 'vuex';
import { Capacitor }                                          from '@capacitor/core';
import {
  IonIcon,
  IonButton,
}                                                             from '@ionic/vue';

import CafeInfoBody          from '@/components/place/CafeInfoBody';
import PlaceImageModalSlider from '@/components/user/sliders/PlaceImageModalSlider';
import Modal                 from '@/components/Modal';
import CafeSubscriptionModal from '@/components/user/modals/CafeSubscriptionModal';

import CafeService from '@/services/CafeService';

import { useModal } from '@/composables/useModal';

import {
  notifications,
  notificationsOutline,

} from 'ionicons/icons';

export default defineComponent({
  name: 'ShortCafeModal',
  components: {
    IonIcon,
    IonButton,
    CafeInfoBody,
    PlaceImageModalSlider,
    Modal,
    CafeSubscriptionModal,
  },
  props: {
    place: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismissShortCafeModal', 'subModalOpened', 'userToggledSubscription'],
  setup(props) {
    /* Global properties and methods */
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    /* Component properties */

    const isUserSubscribed = ref(false);
    const place = toRef(props, 'place');
    const isSubButtonDisabled = ref(true);
    const logoPath = computed(() => {
      if(place.value.images?.length > 0) {
        return place.value.images?.find(image => image.is_logo)?.path ??
            place.value.images[0]?.path;
      }else {
        return '/places/default_place_logo.png';
      }
    });
    const showSkeleton = ref(true);

    /* Composables */
    const { isModalOpen, openModal } = useModal();

    /* Lifecycle hooks */
    Promise.all([
      CafeService.images(place.value.id),
      CafeService.workingHours(place.value.id),
    ]).then((response) => {
      place.value.images = response[0].data;
      place.value.working_hours = response[1].data;

      showSkeleton.value = false;
    }).catch(() => {
      place.value.images = null;
      place.value.working_hours = null;
    });
    isSubButtonDisabled.value = Capacitor.getPlatform() === 'web' || !store.getters['auth/loggedIn'];
    /* Checking if users is subscribed to this place */
    if(store.getters['auth/loggedIn']) {
      CafeService.isUserSubscribed(place.value.id)
                 .then((response) => {
                   isUserSubscribed.value = !!response.data.subscribed;
                 })
                 .catch(() => {
                   isUserSubscribed.value = false;
                 });
    }

    onUnmounted(() => {
      if(route.query.openModal) {
        router.replace();
      }
    });

    /* Event handlers */


    return {
      /* Component properties */
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